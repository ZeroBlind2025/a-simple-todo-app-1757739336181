```tsx
import React from 'react';
import { GetServerSideProps } from 'next';
import { Task } from '../types';
import { format } from 'date-fns';

type TaskDetailProps = {
  task: Task;
};

const TaskDetail: React.FC<TaskDetailProps> = ({ task }) => {
  if (!task) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-red-500">Error: Task not found.</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{task.title}</h1>
      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Description:</span> {task.description || 'No description provided.'}
      </p>
      <p className="text-gray-700 mb-2">
        <span className="font-semibold">Due Date:</span> {task.dueDate ? format(new Date(task.dueDate), 'PPP') : 'No due date.'}
      </p>
      <p className={`mb-4 ${task.completed ? 'text-green-600' : 'text-red-600'}`}>
        <span className="font-semibold">Status:</span> {task.completed ? 'Completed' : 'Pending'}
      </p>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params as { id: string };

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/tasks/${id}`);
    if (!res.ok) {
      throw new Error('Failed to fetch task');
    }
    const task: Task = await res.json();
    return { props: { task } };
  } catch (error) {
    console.error(error);
    return { props: { task: null } };
  }
};

export default TaskDetail;
```

```tsx
// types.ts
export type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: string;
  completed: boolean;
};
```