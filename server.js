import express from 'express';
import { MongoClient, ObjectId } from 'mongodb';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const url = process.env.MONGO_URL;
const port = process.env.PORT;

const app = express();
app.use(cors());
app.use(express.json());

const client = new MongoClient(url);
client.connect();
const appsCollection = client.db('todo').collection('apps');
const tasksCollection = client.db('todo').collection('tasks');

app.get('/api/apps', async (req, res) => {
  try {
    const apps = await appsCollection.find({}).toArray();
    if (apps) {
      res.json({ success: true, messsage: 'Success fetched apps', data: { apps }, meta: { total: apps.length }, error: null });
    }
  } catch (error) {
    res.json({ success: false, message: 'Error fetch apps', data: null, meta: null, error: error.message });
  }
});

app.post('/api/apps', async (req, res) => {
  try {
    await appsCollection.insertOne({ appName: req.body.appName, appType: req.body.appType });
    res.json({ success: true, message: 'App posted', data: null, meta: null, error: null });
  } catch (error) {
    res.json({ success: false, message: 'Error post app', data: null, meta: null, error: error.message });
  }
});

app.delete('/api/apps/drop', async (req, res) => {
  try {
    await appsCollection.drop();
    res.json({ success: true, message: `Apps Dropped`, data: null, meta: null, error: null });
  } catch (error) {
    res.json({ success: false, message: 'Error drop apps', data: null, meta: null, error: error.message });
  }
});

app.delete('/api/apps/:id', async (req, res) => {
  try {
    const id = req.params.id;
    if (!ObjectId.isValid(id)) {
      return res.json({ error: 'Invalid ObjectId format!' });
    }
    await appsCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true, message: `App with id ${id} deleted`, data: null, meta: null, error: null });
  } catch (error) {
    res.json({ success: false, message: `Error delete app with id ${id}`, data: null, meta: null, error: error.message });
  }
});

// tasks

app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await tasksCollection.find({}).toArray();
    if (tasks) {
      res.json({ success: true, message: 'Success fetched tasks', data: { tasks }, meta: { total: tasks.length }, error: null });
    }
  } catch (error) {
    res.json({ success: false, message: 'Error fetch tasks', data: null, meta: null, error: error.message });
  }
});

app.post('/api/tasks', async (req, res) => {
  try {
    const { taskName, taskCategory, taskPriority, taskStatus } = req.body.task;
    await tasksCollection.insertOne({ taskName, taskCategory, taskStatus, taskPriority });
    res.json({ success: true, message: 'Task created', data: null, meta: null, error: null });
  } catch (error) {
    res.json({ success: false, message: 'Error post task', data: null, meta: null, error: error.message });
  }
});

app.delete('/api/tasks/drop', async (req, res) => {
  try {
    await tasksCollection.drop();
    res.json({ success: true, message: 'Tasks Dropped', data: null, meta: null, error: null });
  } catch (error) {
    res.json({ success: false, message: 'Error prop tasks', data: null, meta: null, error: error.message });
  }
});

app.delete('/api/tasks/:id', async (req, res) => {
  try {
    const id = req.params.id;
    await tasksCollection.deleteOne({ _id: new ObjectId(id) });
    res.json({ success: true, message: `Task with id ${id} deleted`, data: null, meta: null, error: null });
  } catch (error) {
    res.json({ success: false, message: `Error delete task with id ${id}`, data: null, meta: null, error: error.message });
  }
});

app.listen(port, () => {
  console.log('Server listen port', port);
});
