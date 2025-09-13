```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, Db } from 'mongodb';
import { z } from 'zod';

const uri = process.env.MONGODB_URI || '';
const dbName = process.env.MONGODB_DB || 'todoapp';

let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }
  const client = new MongoClient(uri);
  await client.connect();
  cachedDb = client.db(dbName);
  return cachedDb;
}

const filterTasksSchema = z.object({
  completed: z.boolean().optional(),
  dueDate: z.string().optional(),
});

async function filterTasks(req: NextApiRequest, res: NextApiResponse) {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', ['GET']);
      return res.status(405).end(`Method ${req.method} Not Allowed`);
    }

    const query = filterTasksSchema.safeParse(req.query);
    if (!query.success) {
      return res.status(400).json({ error: 'Invalid query parameters' });
    }

    const { completed, dueDate } = query.data;
    const db = await connectToDatabase();
    const collection = db.collection('tasks');

    const filter: any = {};
    if (completed !== undefined) {
      filter.completed = completed;
    }
    if (dueDate) {
      filter.dueDate = { $lte: new Date(dueDate) };
    }

    const tasks = await collection.find(filter).toArray();
    res.status(200).json(tasks);
  } catch (error) {
    console.error('Error filtering tasks:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export default filterTasks;
```