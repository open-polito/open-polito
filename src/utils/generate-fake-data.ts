import faker from 'faker';
import {Cartella, File} from 'open-polito-api/corso';

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
}
