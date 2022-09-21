/**
 * @file Manages actions and state related courses and their data
 */

import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Device} from 'open-polito-api/device';
import {
  CourseInfo,
  BasicCourseInfo,
  getExtendedCourseInfo,
} from 'open-polito-api/course';
import {
  errorStatus,
  initialStatus,
  pendingStatus,
  shouldWaitForCooldown,
  Status,
  successStatus,
} from './status';
import {RootState} from './store';
import {MaterialItem} from 'open-polito-api/material';
import {
  getCoursesInfo,
  PermanentMark,
  ProvisionalMark,
} from 'open-polito-api/courses';
import {ExtendedFile} from '../types';

export type CourseState = {
  basicInfo: BasicCourseInfo;
  extendedInfo?: CourseInfo;
  isMain: boolean; // whether course is standard or extra
  status: Status;
};

export type CoursesState = {
  marks: {
    permanent: PermanentMark[];
    provisional: ProvisionalMark[];
  };
  courses: CourseState[];
  loadCoursesStatus: Status;
  loadExtendedCourseInfoStatus: Status;

  recentMaterial: ExtendedFile[];
  getRecentMaterialStatus: Status;
};

const initialState: CoursesState = {
  marks: {permanent: [], provisional: []},
  courses: [],
  loadCoursesStatus: initialStatus,
  loadExtendedCourseInfoStatus: initialStatus,

  recentMaterial: [],
  getRecentMaterialStatus: initialStatus,
};

/**
 * Wrapper of {@link getCoursesInfo}.
 *
 * @remarks
 * Calls {@link getCoursesInfo} and re-arranges data for the store's custom type.
 */
export const loadCoursesData = createAsyncThunk<
  {
    marks: {permanent: PermanentMark[]; provisional: ProvisionalMark[]};
    courses: CourseState[];
  },
  Device,
  {state: RootState}
>(
  'courses/loadCoursesData',
  async device => {
    const data = await getCoursesInfo(device);
    let courses: CourseState[] = [
      ...data.course_plan.standard.map(course => {
        return {basicInfo: course, status: initialStatus, isMain: true};
      }),
      ...data.course_plan.extra.map(course => {
        return {basicInfo: course, status: initialStatus, isMain: false};
      }),
    ];
    return {
      marks: data.marks,
      courses: courses,
    };
  },
  {
    condition: (_, {getState}) =>
      !shouldWaitForCooldown(getState().courses.loadCoursesStatus),
  },
);

/**
 * Wrapper of {@link getExtendedCourseInfo}.
 *
 * @remarks
 * Accepts {@link BasicCourseInfo} and {@link Device}, then loads all its data and returns
 * loaded {@link CourseInfo}.
 */
export const loadCourse = createAsyncThunk<
  CourseInfo,
  {basicCourseInfo: BasicCourseInfo; device: Device},
  {state: RootState}
>(
  'courses/loadCourse',
  async ({basicCourseInfo, device}, _) => {
    return await getExtendedCourseInfo(device, basicCourseInfo);
  },
  {
    condition: ({basicCourseInfo}, {getState}) =>
      !shouldWaitForCooldown(
        getState().courses.courses.find(
          c =>
            c.basicInfo.code + c.basicInfo.name ===
            basicCourseInfo.code + basicCourseInfo.name,
        )?.status,
      ),
  },
);

/**
 * Gets most recent items from material.
 */
export const getRecentMaterial = createAsyncThunk<
  ExtendedFile[],
  void,
  {state: RootState}
>('courses/getRecentMaterial', async (_, {getState}) => {
  let res: ExtendedFile[] = [];
  const findFiles = (
    items: MaterialItem[],
    course_name: string,
    course_code: string,
  ) => {
    const _res: ExtendedFile[] = [];
    items.forEach(item => {
      if (item.type == 'file') {
        _res.push({...item, course_code, course_name});
      } else {
        _res.push(...findFiles(item.children, course_name, course_code));
      }
    });
    return _res;
  };
  getState().courses.courses.forEach(course => {
    res.push(
      ...findFiles(
        course.extendedInfo?.material || [],
        course.basicInfo.name,
        course.basicInfo.code,
      ),
    );
  });
  res.sort((a, b) => b.creation_date - a.creation_date).slice(0, 50);
  return res;
});

/**
 * Utility function to get index of {@link CourseState} from store
 * @param courseID
 * @param courses
 * @returns index (-1 if not found)
 */
export const findCourseIndexByID = (
  courseID: string,
  courses: CourseState[],
): number => {
  return courses.findIndex(
    course => courseID == course.basicInfo.code + course.basicInfo.name,
  );
};

/**
 * Utility function that returns updated course array
 * @param courseState The updated course
 * @param courses All courses
 * @return courses
 */
const getUpdatedCourses = (
  courseState: CourseState,
  courses: CourseState[],
): CourseState[] => {
  const courseID = courseState.basicInfo.code + courseState.basicInfo.name;
  const index = findCourseIndexByID(courseID, courses);

  let mutatedArray = [];
  if (index != -1) {
    mutatedArray = courses.map((course, _index) => {
      if (_index != index) {
        return course;
      } else {
        return courseState;
      }
    });
  } else {
    // append if not found
    mutatedArray = [...courses];
    mutatedArray.push(courseState);
  }
  return mutatedArray;
};

export const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {
    setLoadExtendedCourseInfoStatus: (state, action: PayloadAction<Status>) => {
      state.loadExtendedCourseInfoStatus = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(loadCoursesData.pending, (state, _) => {
        state.loadCoursesStatus = pendingStatus();
      })
      .addCase(loadCoursesData.fulfilled, (state, action) => {
        state.marks = action.payload.marks;
        state.courses = action.payload.courses;
        state.loadCoursesStatus = successStatus();
      })
      .addCase(loadCoursesData.rejected, (state, action) => {
        state.loadCoursesStatus = errorStatus(action.error);
      })

      .addCase(loadCourse.pending, (state, action) => {
        state.courses = getUpdatedCourses(
          {
            ...state.courses[
              findCourseIndexByID(
                action.meta.arg.basicCourseInfo.code +
                  action.meta.arg.basicCourseInfo.name,
                state.courses,
              )
            ],
            status: pendingStatus(),
          },
          state.courses,
        );

        state.getRecentMaterialStatus = initialStatus;
        state.recentMaterial = [];
      })
      .addCase(loadCourse.fulfilled, (state, action) => {
        state.courses = getUpdatedCourses(
          {
            ...state.courses[
              findCourseIndexByID(
                action.meta.arg.basicCourseInfo.code +
                  action.meta.arg.basicCourseInfo.name,
                state.courses,
              )
            ],
            extendedInfo: action.payload,
            status: successStatus(),
          },
          state.courses,
        );
      })
      .addCase(loadCourse.rejected, (state, action) => {
        state.courses = getUpdatedCourses(
          {
            ...state.courses[
              findCourseIndexByID(
                action.meta.arg.basicCourseInfo.code +
                  action.meta.arg.basicCourseInfo.name,
                state.courses,
              )
            ],
            status: errorStatus(action.error),
          },
          state.courses,
        );
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

export const {setLoadExtendedCourseInfoStatus} = coursesSlice.actions;

export default coursesSlice.reducer;
