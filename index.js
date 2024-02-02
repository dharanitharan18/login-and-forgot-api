const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/user'); 

const app = express();
const PORT = 3001;

mongoose.connect('mongodb://127.0.0.1:27017/dextra', {
  dbName: 'dextra',
  useNewUrlParser: true,
  useUnifiedTopology: true,
});


app.use(express.json());

// register route
app.post('/register', async (req, res) => {
  const { username, password, email } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword, email });

    console.log('New User Object:', newUser);

    await newUser.save();

    console.log('User saved to database');

    return res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Login route
app.post('/login', async (req, res) => {
  const { username, password } = req.body;
  console.log('Received login request with username:', username);

  try {
    const user = await User.findOne({ username: { $regex: new RegExp(username, 'i') } });

    console.log('User from database:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Incorrect password' });
    }

    return res.status(200).json({ message: 'Login successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Forgot password route
app.post('/forgot', async (req, res) => {
  const { username, email } = req.body;

  try {
    const user = await User.findOne({ username, email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    return res.status(200).json({ message: 'Forgot password successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
