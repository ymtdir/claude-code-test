export interface TaskSchema {
  id?: string;
  title: string;
  category: string;
  date: Date;
  time?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed' | 'cancelled';
  completedAt?: Date;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

export const taskTableSchema = {
  tasks:
    'id, category, date, status, [date+status], [category+status], [priority+status]',
};
