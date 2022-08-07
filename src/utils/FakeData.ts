import {faker} from '@faker-js/faker';
import moment from 'moment';
import {Directory, File, MaterialItem} from 'open-polito-api/material';
import {TimetableSlot} from 'open-polito-api/timetable';

export default class FakeData {
  /**
   * Returns a File with random fields
   */
  static file(): File {
    const name = faker.random.words(10);
    return {
      type: 'file',
      code: faker.datatype.number(999999).toString(),
      filename: name,
      name: name,
      mime_type: '',
      size: faker.datatype.number(100000),
      creation_date: faker.date.past().getTime(),
    };
  }

  /**
   * Returns an empty directory (Cartella) with random fields
   */
  static directory(): Directory {
    const name = faker.random.words(10);
    return {
      type: 'dir',
      code: faker.datatype.number(999999).toString(),
      name: name,
      children: [],
    };
  }

  /**
   * Recursively generates a tree of File and Directory
   * @param dirCount - The number of directories per level
   * @param fileCount - The number of files per level
   * @param levelCount - The number of levels in the tree (e.g. 1 gives a list with no nested items)
   * @returns An array of DirectoryItem
   */
  static dirTree(
    dirCount: number,
    fileCount: number,
    levelCount: number,
  ): MaterialItem[] {
    const levelItems: MaterialItem[] = [];

    // If more levels needed, add nested directories by recursion, then add files
    if (levelCount > 1) {
      for (let i = 0; i < dirCount; i++) {
        let dir = this.directory();
        dir.children = this.dirTree(dirCount, fileCount, levelCount - 1);
        levelItems.push(dir);
      }
    }

    // If no more levels, only fill with files and return (base case)
    for (let i = 0; i < fileCount; i++) {
      levelItems.push(this.file());
    }
    return levelItems;
  }

  static timetableSlots(date: Date = new Date()): TimetableSlot[] {
    const weekStartDate: Date = moment(date).startOf('week').toDate();
    const nSlots = Math.ceil(Math.random() * 10);
    const dates: Date[] = faker.date.betweens(
      weekStartDate.toISOString(),
      moment(weekStartDate).add(4, 'd').toISOString(),
      nSlots,
    );
    const slots: TimetableSlot[] = dates.map<TimetableSlot>(date => {
      return {
        start_time: date.getTime(),
        end_time: moment(date).add(1.5, 'h').toDate().getTime(),
        type: 'Fake lesson',
        course_name: faker.random.words(2),
        professor: {
          name: faker.name.firstName(),
          surname: faker.name.lastName(),
        },
        room: faker.word.adjective() + ' room',
        room_url: '',
      };
    });
    return slots;
  }
}
