import { LineInterface } from './line.interface';

export interface BundleInterface {
  id: string;
  draws: number;
  lines: Array<LineInterface>;
  shares: Array<{ template_id: number, num_shares: number }>;
}
