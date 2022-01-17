import FakeData from '../FakeData';

describe('FakeData.dirTree', () => {
  const dirTree = FakeData.dirTree(10, 10, 3);

  it('puts directories before files', () => {
    expect(dirTree[0].tipo).toBe('cartella');
  });
});
