import { ArraysUtil } from './arrays.util';

describe('ArraysUtil', () => {
  describe('difference', () => {
    it('should return correct value 1', () => {
      expect(ArraysUtil.difference([], []))
        .toEqual([]);
    });

    it('should return correct value 2', () => {
      expect(ArraysUtil.difference([1, 2], []))
        .toEqual([1, 2]);
    });

    it('should return correct value 3', () => {
      expect(ArraysUtil.difference([], [1, 2]))
        .toEqual([]);
    });

    it('should return correct value 4', () => {
      expect(ArraysUtil.difference([1, 2], [4, 5]))
        .toEqual([1, 2]);
    });

    it('should return correct value 5', () => {
      expect(ArraysUtil.difference([1, 2, 3, 4], [7, 6, 5, 4, 3]))
        .toEqual([1, 2]);
    });

    it('should return correct value 6', () => {
      expect(ArraysUtil.difference([1, 2], [1, 2, 3, 4, 5]))
        .toEqual([]);
    });
  });
});
