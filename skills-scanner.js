const fs = require('fs');
const path = require('path');

/**
 * Scan OpenClaw skills directories and extract skill information
 */
async function scanSkills() {
  // Allow path overrides via environment variables
  const configPath = process.env.OPENCLAW_CONFIG || '/home/node/.openclaw/openclaw.json';
  const workspaceSkillsDir = process.env.SKILLS_WORKSPACE || '/home/node/.openclaw/workspace/skills';
  
  const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
  
  const extraDirs = config.skills?.load?.extraDirs || [];
  
  const skills = {
    global: [],      // From shared-agent-skills (extraDirs)
    workspace: [],   // From workspace/skills/
    config: {}       // Skills entries from config
  };
  
  // Scan global/extraDirs
  for (const dir of extraDirs) {
    if (fs.existsSync(dir)) {
      const skillDirs = fs.readdirSync(dir).filter(f => {
        const fullPath = path.join(dir, f);
        return fs.statSync(fullPath).isDirectory() && !f.startsWith('.') && f !== 'node_modules';
      });
      
      for (const skillName of skillDirs) {
        const skillPath = path.join(dir, skillName);
        const skillInfo = await parseSkill(skillName, skillPath);
        skills.global.push(skillInfo);
      }
    }
  }
  
  // Scan workspace skills
  if (fs.existsSync(workspaceSkillsDir)) {
    const skillDirs = fs.readdirSync(workspaceSkillsDir).filter(f => {
      return fs.statSync(path.join(workspaceSkillsDir, f)).isDirectory() && !f.startsWith('.') && f !== 'node_modules' && f !== 'shared-agent-skills';
    });
    
    for (const skillName of skillDirs) {
      const skillPath = path.join(workspaceSkillsDir, skillName);
      // Skip the shared-agent-skills symlink subdirectory
      if (skillName === 'shared-agent-skills') continue;
      const skillInfo = await parseSkill(skillName, skillPath);
      skills.workspace.push(skillInfo);
    }
  }
  
  // Config entries (like gog with env vars)
  skills.config = config.skills?.entries || {};
  
  return skills;
}

async function parseSkill(name, skillPath) {
  const skillFile = path.join(skillPath, 'SKILL.md');
  const info = {
    name: name,
    path: skillPath,
    description: null,
    hasReadme: false,
    files: []
  };
  
  try {
    if (fs.existsSync(skillFile) && fs.statSync(skillFile).isFile()) {
      const content = fs.readFileSync(skillFile, 'utf8');
      // Extract description from description: frontmatter field
      const lines = content.split('\n');
      for (const line of lines) {
        if (line.startsWith('description:')) {
          info.description = line.replace(/^description:\s*/, '').trim().replace(/^["']|["']$/g, '');
          break;
        }
      }
      // Fallback: first non-empty, non-heading line
      if (!info.description) {
        const firstLine = lines.find(l => l.trim().length > 0 && !l.startsWith('#') && !l.startsWith('---'));
        if (firstLine) {
          info.description = firstLine.trim().substring(0, 200);
        }
      }
    }
  } catch (e) {
    // Ignore read errors for skill file
  }
  
  // Check for README
  try {
    const readmePath = path.join(skillPath, 'README.md');
    info.hasReadme = fs.existsSync(readmePath) && fs.statSync(readmePath).isFile();
  } catch (e) {
    info.hasReadme = false;
  }
  
  // List all files in skill (not directories)
  try {
    const entries = fs.readdirSync(skillPath, { withFileTypes: true });
    info.files = entries
      .filter(e => e.isFile() && !e.name.startsWith('.'))
      .map(e => e.name);
  } catch (e) {
    info.files = [];
  }
  
  return info;
}

module.exports = { scanSkills };
