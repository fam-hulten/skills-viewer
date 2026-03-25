const express = require('express');
const path = require('path');
const { scanSkills } = require('./skills-scanner');

const app = express();
const PORT = process.env.PORT || 3000;
const AGENT_NAME = process.env.AGENT_NAME || 'Lilly';

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/skills', async (req, res) => {
  try {
    const skills = await scanSkills();
    res.json({
      agent: AGENT_NAME,
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
  console.log(`${AGENT_NAME} Skills Viewer running at http://localhost:${PORT}`);
});
