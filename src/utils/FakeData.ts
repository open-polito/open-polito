import faker from '@faker-js/faker';
import Corso, {Cartella, File} from 'open-polito-api/corso';

type DirectoryItem = File | Cartella;

export default class FakeData {
  /**
   * Returns a File with random fields
   */
  static file(): File {
    const name = faker.random.words(10);
    return {
      tipo: 'file',
      code: faker.datatype.number(999999).toString(),
      filename: name,
      nome: name,
      mime_type: '',
      size_kb: faker.datatype.number(100000),
      data_inserimento: faker.date.past(),
    };
  }

  /**
   * Returns an empty directory (Cartella) with random fields
   */
  static directory(): Cartella {
    const name = faker.random.words(10);
    return {
      tipo: 'cartella',
      code: faker.datatype.number(999999).toString(),
      nome: name,
      file: [],
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
  ): DirectoryItem[] {
    const levelItems: DirectoryItem[] = [];

    // If more levels needed, add nested directories by recursion, then add files
    if (levelCount > 1) {
      for (let i = 0; i < dirCount; i++) {
        let dir = this.directory();
        dir.file = this.dirTree(dirCount, fileCount, levelCount - 1);
        levelItems.push(dir);
      }
    }

    // If no more levels, only fill with files and return (base case)
    for (let i = 0; i < fileCount; i++) {
      levelItems.push(this.file());
    }
    return levelItems;
  }
}
