const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database');
const User = require('./models/User');
const Test = require('./models/Test');
const Result = require('./models/Result');

const app = express();
const PORT = process.env.PORT || 3000; // Use Render's port or 3000 locally

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the root directory
app.use(express.static(__dirname));


// === AUTH ROUTES ===
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password, type, name, details } = req.body;
    const existing = await User.findOne({ where: { username } });
    if (existing) return res.status(400).json({ error: 'Username already taken' });

    const user = await User.create({ username, password, type, name, details });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ where: { username, password } });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === TEST ROUTES (STUDENT) ===
app.get('/api/tests/available', async (req, res) => {
  try {
    const tests = await Test.findAll({ where: { status: 'active' } });
    res.json(tests);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/tests/:id', async (req, res) => {
  try {
    const test = await Test.findByPk(req.params.id);
    if (!test) return res.status(404).json({ error: 'Test not found' });
    res.json(test);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/tests/submit', async (req, res) => {
  try {
    const { username, testId, testName, company, score, status, answers } = req.body;
    const result = await Result.create({
      username, testId, testName, company, score, status, answers
    });
    res.json({ success: true, result });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/results/student/:username', async (req, res) => {
  try {
    const results = await Result.findAll({ where: { username: req.params.username } });
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// === STAFF ROUTES ===
app.post('/api/staff/create-test', async (req, res) => {
  try {
    const test = await Test.create(req.body);
    res.json({ success: true, test });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/results/all', async (req, res) => {
    try {
        const results = await Result.findAll();
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});


// Initialization
sequelize.sync().then(() => {
  app.listen(PORT, '0.0.0.0', () => { // Bind to 0.0.0.0 for external access
    console.log(`Server running on port ${PORT}`);
  });
}).catch(err => console.error('Database sync error:', err));
