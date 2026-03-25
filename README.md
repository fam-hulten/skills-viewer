# Skills Viewer

A simple web app that displays OpenClaw skills installed for an agent.

## What it shows

- **Global Skills**: Skills from shared-agent-skills directories (configured in OpenClaw)
- **Workspace Skills**: Skills from the workspace/skills directory
- **Config Entries**: Skills configured with entries in OpenClaw config

## Quick Start

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
# Build
docker build -t skills-viewer .

# Run (Lilly's config)
docker run -p 3000:3000 \
  -e OPENCLAW_CONFIG=/config/openclaw.json \
  -e SKILLS_WORKSPACE=/skills/workspace \
  -e AGENT_NAME=Lilly \
  -v /home/node/.openclaw:/config \
  skills-viewer
```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `OPENCLAW_CONFIG` | Path to OpenClaw config.json | `/home/node/.openclaw/openclaw.json` |
| `SKILLS_WORKSPACE` | Path to workspace skills | `/home/node/.openclaw/workspace/skills` |
| `AGENT_NAME` | Name shown in UI | `Lilly` |
| `PORT` | HTTP port | `3000` |

## For Robert

To create Robert's version:

1. Clone this repo
2. Modify `skills-scanner.js` to point to Robert's paths:
   - Robert's OpenClaw config
   - Robert's workspace skills
3. Set `AGENT_NAME=Robert`
4. Build and deploy

## Skill Structure

Each skill directory should contain:
- `SKILL.md` - Contains `description:` field
- `README.md` (optional)

The scanner extracts:
- Skill name (directory name)
- Description (from SKILL.md `description:` field)
- File list (non-hidden files)
- Whether README exists
