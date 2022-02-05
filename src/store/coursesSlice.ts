/**
 * @file Manages actions and state related courses and their data
 */

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Device} from 'open-polito-api';
import Corso, {
  Avviso,
  Cartella,
  CourseInfoParagraph,
  File,
  Videolezione,
  VirtualClassroomRecording,
} from 'open-polito-api/corso';
import {
  errorStatus,
  initialStatus,
  pendingStatus,
  Status,
  successStatus,
} from './status';
import {RootState} from './store';

export type LiveClass = {
  taskID: number;
  meetingID: string;
  title: string;
  date: number;
  url?: string;
  running?: boolean;
};

/**
 * Serializable Course type to convert into from non-serializable Corso class
 */
export type CourseData = {
  name: string;
  code: string;
  cfu: number;
  taskID: number | null;
  category?: string;
  overbooking: boolean;

  isMain: boolean; // false for extra courses

  academicYear?: string;
  courseYear?: number;
  semester?: number;
  professor?: {name: string; surname: string};
  alerts?: Avviso[];
  material?: (File | Cartella)[];
  liveClasses?: LiveClass[];
  videos?: Videolezione[];
  recordings?: {
    current: VirtualClassroomRecording[];
    [year: number]: VirtualClassroomRecording[];
  };
  info?: CourseInfoParagraph[];
};

export type CourseState = CourseData & {
  loadCourseStatus: Status;
};

export type CoursesState = {
  courses: CourseState[];
  loadCoursesStatus: Status;

  recentMaterial: File[];
  getRecentMaterialStatus: Status;
};

const initialState: CoursesState = {
  courses: [],
  loadCoursesStatus: initialStatus,

  recentMaterial: [],
  getRecentMaterialStatus: initialStatus,
};

/**
 * Accepts a {@link CourseData}, then loads all its data and returns
 * loaded CourseData.
 */
export const loadCourse = createAsyncThunk<
  CourseData,
  {courseData: CourseData | CourseState; device: Device},
  {state: RootState}
>('courses/loadCourse', async ({courseData, device}, {getState}) => {
  const _course = new Corso(
    device,
    courseData.name,
    courseData.code,
    courseData.cfu,
    courseData.taskID,
    courseData.category,
    courseData.overbooking,
  );
  await _course.populate();
  const returnedCourse: CourseData = {
    name: _course.nome,
    code: _course.codice,
    cfu: _course.cfu,
    taskID: _course.id_incarico,
    category: _course.categoria,
    overbooking: _course.overbooking,
    isMain: courseData.isMain,
    academicYear: _course.anno_accademico,
    courseYear: _course.anno_corso,
    semester: _course.periodo_corso,
    professor: {name: _course.nome_prof, surname: _course.cognome_prof},
    alerts: _course.avvisi,
    material: _course.materiale,
    liveClasses: _course.live_lessons.map(cl => {
      return {
        taskID: cl.id_inc,
        meetingID: cl.meeting_id,
        title: cl.title,
        date: cl.date.getTime(),
        url: cl.url,
        running: cl.running,
      };
    }),
    videos: _course.videolezioni,
    recordings: _course.vc_recordings,
    info: _course.info,
  };
  return returnedCourse;
});

/**
 * Gets 3 most recent items from material.
 */
export const getRecentMaterial = createAsyncThunk<
  File[],
  void,
  {state: RootState}
>('courses/getRecentMaterial', async (_, {getState}) => {
  let res: File[] = [];
  let rootDir: Cartella = {
    tipo: 'cartella',
    code: '',
    nome: '',
    file: [],
  };
  const findFiles = (dir: Cartella) => {
    const res: File[] = [];
    dir.file.forEach(item => {
      if (item.tipo == 'file') {
        res.push(item);
      } else {
        res.push(...findFiles(item));
      }
    });
    return res;
  };
  getState().courses.courses.forEach(course => {
    course.material && rootDir.file.push(...course.material);
  });
  res = findFiles(rootDir)
    .sort((a, b) => b.data_inserimento.getTime() - a.data_inserimento.getTime())
    .slice(0, 3);
  return res;
});

/**
 * Utility function to get index of {@link CourseState} from store
 * @param courseID
 * @param courses
 * @returns index (-1 if not found)
 */
const findCourseIndexByID = (courseID: string, courses: CourseState[]) => {
  return courses.findIndex(course => courseID == course.code + course.name);
};

/**
 * Replaces old {@link CourseState} with new CoursesState,
 * appends new CoursesState if unable to find existing one.
 * Returns new CourseState[].
 * @param state
 * @param param1
 */
const getUpdatedCourseData = (
  courses: CourseState[],
  updatedCourse: CourseState,
) => {
  const courseID = updatedCourse.code + updatedCourse.name;
  const index = findCourseIndexByID(courseID, courses);
  if (index != -1) {
    return courses.map((course, _index) => {
      if (_index != index) {
        return course;
      } else {
        return updatedCourse;
      }
    });
  } else {
    // append if not found
    let _courses = [...courses];
    _courses.push(updatedCourse);
    return _courses;
  }
};

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setCourseData: (state, action: PayloadAction<CourseState>) => {
      state.courses = getUpdatedCourseData(state.courses, action.payload);
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadCourse.pending, (state, action) => {
        state.courses = getUpdatedCourseData(state.courses, {
          ...action.meta.arg.courseData,
          loadCourseStatus: pendingStatus(),
        }); // keep current CourseState, only change status
        // Invalidate recent material. Items may have changed.
        state.getRecentMaterialStatus = initialStatus;
        state.recentMaterial = [];
      })
      .addCase(loadCourse.fulfilled, (state, action) => {
        state.courses = getUpdatedCourseData(state.courses, {
          ...action.payload,
          loadCourseStatus: successStatus(),
        });
      })
      .addCase(loadCourse.rejected, (state, action) => {
        state.courses = getUpdatedCourseData(state.courses, {
          ...action.meta.arg.courseData,
          loadCourseStatus: errorStatus(action.error),
        });
      })

      .addCase(getRecentMaterial.pending, state => {
        state.getRecentMaterialStatus = pendingStatus();
      })
      .addCase(getRecentMaterial.fulfilled, (state, action) => {
        state.recentMaterial = action.payload;
        state.getRecentMaterialStatus = successStatus();
      })
      .addCase(getRecentMaterial.rejected, (state, {error}) => {
        state.getRecentMaterialStatus = errorStatus(error);
      });
  },
});

export const {setCourseData} = coursesSlice.actions;

export default coursesSlice.reducer;
