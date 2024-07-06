const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Replace this connection string with your actual MongoDB Atlas URI from Render environment variables
const MONGODB_URI = 'mongodb+srv://nivinprasad2004:uhHJhs8EXuWHAa0k@cluster0.zvjplnk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('MongoDB connected'))
.catch((err) => console.error('MongoDB connection error:', err));

const TodoSchema = new mongoose.Schema({
  task: String,
  completed: Boolean,
  isEditing: Boolean,
});

const Todo = mongoose.model('Todo', TodoSchema);

app.get('/todos', async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

app.post('/todos', async (req, res) => {
  try {
    const { task, completed, isEditing } = req.body;
    const newTodo = new Todo({
      task,
      completed,
      isEditing,
    });
    const savedTodo = await newTodo.save();
    res.json(savedTodo);
  } catch (error) {
    console.error('Error adding todo:', error);
    res.status(500).json({ error: 'Failed to add todo' });
  }
});

app.put('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { task, completed, isEditing } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      id,
      { task, completed, isEditing },
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

app.delete('/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await Todo.findByIdAndDelete(id);
    if (!deletedTodo) {
      return res.status(404).send({ message: 'Todo not found' });
    }
    res.status(200).json(deletedTodo);
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
