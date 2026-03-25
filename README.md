# Skills Viewer

Web apps that display OpenClaw skills for Lilly and Robert agents.

## Projects

| Agent | Repo | Skills Found |
|-------|------|--------------|
| **Lilly** | [fam-hulten/skills-viewer](https://github.com/fam-hulten/skills-viewer) | 26 (2 global, 24 workspace) |
| **Robert** | [fam-hulten/skills-app](https://github.com/fam-hulten/skills-app) | 65 (53 global, 10 workspace, 2 shared) |

## Architecture

Both apps follow the same pattern:
- Express server reads OpenClaw config (`openclaw.json`)
- Scans skills directories (global + workspace)
- Exposes REST API + web dashboard

## API

```
GET /api/skills
```

Response:
```json
{
  "agent": "Lilly",
  "timestamp": "2026-03-25T21:48:27.973Z",
  "global": [
    {
      "name": "experiment-protocol",
      "description": "Koordineringsprotokoll för experiment...",
      "path": "/path/to/skill",
      "files": ["SKILL.md", "_meta.json"],
      "hasReadme": false
    }
  ],
  "workspace": [...],
  "config": {...}
}
```

## Development

### Lilly's version
```bash
git clone https://github.com/fam-hulten/skills-viewer
cd skills-viewer
npm install
npm start
# → http://localhost:3000
```

### Roberts version
```bash
git clone https://github.com/fam-hulten/skills-app
cd skills-app
npm install
npm start
# → http://localhost:3000
```

## Docker

### Build
```bash
docker build -t skills-viewer .
```

### Run (Lilly)
```bash
docker run -p 3000:3000 \
  -e OPENCLAW_CONFIG=/config/openclaw.json \
  -e SKILLS_WORKSPACE=/skills/workspace \
  -e AGENT_NAME=Lilly \
  -v /home/node/.openclaw:/config \
  skills-viewer
```

### Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENCLAW_CONFIG` | Path to OpenClaw config.json | `/home/node/.openclaw/openclaw.json` |
| `SKILLS_WORKSPACE` | Path to workspace skills | `/home/node/.openclaw/workspace/skills` |
| `AGENT_NAME` | Name shown in UI | `Lilly` |
| `PORT` | HTTP port | `3000` |

## Skills Structure

Skills are loaded from two directories:
1. **Global** - from `skills.load.extraDirs` in OpenClaw config (shared-agent-skills)
2. **Workspace** - from `workspace/skills/` directory

Each skill should contain:
- `SKILL.md` - with `description:` frontmatter field
- `README.md` (optional)

## Playwright Tests

Roberts version includes smoke tests in `tests/` directory.

Run in Docker:
```bash
docker compose -f docker-compose.test.yml up
```

## Experiment Notes (2026-03-25)

- Johanna requested separate skills viewers for Lilly and Robert
- Both agents worked independently following multi-agent collaboration protocol
- Robert verified API functionality and found 65 skills
- Docker hosting to be set up by Robert tomorrow
