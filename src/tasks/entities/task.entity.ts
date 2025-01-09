import { User } from 'src/users/entities/user.entity';

export class Task {
  name: string;
  title: string;
  description: string;
  deadline: Date;
  user_id?: number;
  user?: User;
  status: 'TO_DO' | 'IN_PROGRESS' | 'DONE';
  createdAt: Date;
  updatedAt: Date;
}
