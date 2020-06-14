import { LineInterface } from '../../../api/entities/outgoing/common/line.interface';

export const isCleanLine = (line: LineInterface): boolean => {
  return line.main_numbers.length === 0 && line.extra_numbers.length === 0;
};
