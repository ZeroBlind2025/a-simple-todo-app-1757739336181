```tsx
import React from 'react';

type Task = {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
};

type TaskSummaryProps = {
  tasks: Task[];
};

const TaskSummary: React.FC<TaskSummaryProps> = ({ tasks }) => {
  if (!tasks || tasks.length === 0) {
    return <p className="text-gray-500">No tasks available.</p>;
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Task Summary</h2>
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-4 border rounded-lg shadow-sm ${
              task.completed ? 'bg-green-100' : 'bg-white'
            }`}
          >
            <h3 className="text-xl font-semibold">{task.title}</h3>
            {task.description && (
              <p className="text-gray-700">{task.description}</p>
            )}
            {task.dueDate && (
              <p className="text-gray-500">
                Due: {new Date(task.dueDate).toLocaleDateString()}
              </p>
            )}
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                task.completed ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
              }`}
            >
              {task.completed ? 'Completed' : 'Pending'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskSummary;
```