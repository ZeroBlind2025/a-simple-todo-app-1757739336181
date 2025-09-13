```tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

interface Task {
  id: string;
  title: string;
  description?: string;
  dueDate?: Date;
  completed: boolean;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get<Task[]>('/api/tasks');
        setTasks(response.data);
      } catch (err) {
        setError('Failed to load tasks');
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Task List</h1>
      {error && <p className="text-red-500">{error}</p>}
      <ul className="space-y-4">
        {tasks.map((task) => (
          <li
            key={task.id}
            className={`p-4 border rounded-lg shadow-sm ${
              task.completed ? 'bg-green-100' : 'bg-white'
            }`}
          >
            <h2 className="text-xl font-semibold text-gray-900">{task.title}</h2>
            {task.description && (
              <p className="text-gray-700">{task.description}</p>
            )}
            {task.dueDate && (
              <p className="text-gray-500">
                Due: {format(new Date(task.dueDate), 'MMMM dd, yyyy')}
              </p>
            )}
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm font-medium rounded-full ${
                task.completed ? 'bg-green-600 text-white' : 'bg-yellow-600 text-white'
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

export default TaskList;
```