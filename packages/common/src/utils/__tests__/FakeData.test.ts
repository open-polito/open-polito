import moment from 'moment';
import FakeData from '../FakeData';

describe('FakeData.dirTree', () => {
  const dirTree = FakeData.dirTree(10, 10, 3);

  it('puts directories before files', () => {
    expect(dirTree[0].type).toBe('dir');
  });
});

describe('FakeData.timetableSlots', () => {
  const date = new Date();
  const slots = FakeData.timetableSlots(date);

  it('generates at least one slot', () => {
    expect(slots.length).toBeGreaterThan(0);
  });

  it('generates slots only for the current week', () => {
    slots.map(slot =>
      expect(moment(slot.start_time).startOf('week').toDate()).toEqual(
        moment(date).startOf('week').toDate(),
      ),
    );
  });
});
