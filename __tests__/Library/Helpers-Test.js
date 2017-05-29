import _ from 'underscore';
import '../../Library/Helpers';

test('_.chunks splits [1,2,3,4] into [[1,2],[3,4]]', () => {
  const chunkedArr = _.chunk([1,2,3,4], 2);
  expect(chunkedArr[0][0]).toBe(1);
  expect(chunkedArr[0][1]).toBe(2);
  expect(chunkedArr[1][0]).toBe(3);
  expect(chunkedArr[1][1]).toBe(4);
});

test('_.nRandom takes n elements from an array', () => {
  const nRandomArr = _.nRandom([1,2,3,4], 2);
  expect(nRandomArr.length).toBe(2);
});
