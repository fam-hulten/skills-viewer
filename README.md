# Lilly Skills Viewer

A simple web app that displays OpenClaw skills installed for the Lilly agent.

## What it shows

- **Global Skills**: Skills from shared-agent-skills directory
- **Workspace Skills**: Skills from workspace/skills directory  
- **Config Entries**: Skills configured in OpenClaw config

## Running locally

```bash
npm install
npm start
# Open http://localhost:3000
```

## API

```
GET /api/skills
```

Returns JSON with:
- `agent`: Agent name
- `timestamp`: When data was collected
- `global`: Array of global skills
- `workspace`: Array of workspace skills
- `config`: Config entries

## Docker

```bash
docker build -t lilly-skills-viewer .
docker run -p 3000:3000 lilly-skills-viewer
```

## Skill structure

Each skill directory should contain:
- `SKILL.md` - Contains `description:` field
- `README.md` (optional)

The scanner extracts:
- Skill name (directory name)
- Description (from SKILL.md)
- File list
- Whether README exists
