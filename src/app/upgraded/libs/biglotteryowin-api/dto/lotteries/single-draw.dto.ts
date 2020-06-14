import { DrawDto } from './draw.dto';

export interface SingleDrawDto extends DrawDto {
  next: {
    id: number;
    status_id: string;
    date: string;
    date_local: string;
  };
  prev: {
    id: number;
    status_id: string;
    date: string;
    date_local: string;
  };
}
