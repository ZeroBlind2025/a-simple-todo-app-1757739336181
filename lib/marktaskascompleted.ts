```typescript
import { NextApiRequest, NextApiResponse } from 'next';
import { MongoClient, ObjectId } from 'mongodb';
import { Logger } from './logger'; // Assume there's a logger module

const uri = process.env.MONGODB_URI || '';
const client = new MongoClient(uri);
const dbName = 'todoApp';
const collectionName = 'tasks';

const markTaskAsCompleted = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'PATCH') {
    res.setHeader('Allow', ['PATCH']);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }

  const { id } = req.body;

  if (!id || typeof id !== 'string') {
    Logger.error('Invalid task ID provided');
    return res.status(400).json({ error: 'Invalid task ID' });
  }

  try {
    await client.connect();
    const database = client.db(dbName);
    const tasks = database.collection(collectionName);

    const result = await tasks.updateOne(
      { _id: new ObjectId(id) },
      { $set: { completed: true } }
    );

    if (result.matchedCount === 0) {
      Logger.warn(`Task with ID ${id} not found`);
      return res.status(404).json({ error: 'Task not found' });
    }

    Logger.info(`Task with ID ${id} marked as completed`);
    return res.status(200).json({ message: 'Task marked as completed' });
  } catch (error) {
    Logger.error('Error marking task as completed', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  } finally {
    await client.close();
  }
};

export default markTaskAsCompleted;
```