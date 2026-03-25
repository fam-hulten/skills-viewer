const express = require('express');
const path = require('path');
const { scanSkills } = require('./skills-scanner');

const app = express();
const PORT = 3000;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await scanSkills();
    res.json({
      agent: 'Lilly',
      timestamp: new Date().toISOString(),
      ...skills
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Lilly Skills Viewer running at http://localhost:${PORT}`);
});
