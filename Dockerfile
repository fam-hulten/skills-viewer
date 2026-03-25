FROM node:20-alpine

WORKDIR /app

# Install deps only, then copy source
COPY package*.json ./
RUN npm ci --only=production && npm cache clean

COPY . .

EXPOSE 3000

# Environment variables:
# - OPENCLAW_CONFIG: Path to OpenClaw config (default: /home/node/.openclaw/openclaw.json)
# - SKILLS_WORKSPACE: Path to workspace skills (default: /home/node/.openclaw/workspace/skills)
# - AGENT_NAME: Name displayed in UI (default: Lilly)
# - PORT: HTTP port (default: 3000)

CMD ["node", "server.js"]
