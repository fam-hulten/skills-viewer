FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# The app reads from host paths, so we need to mount them at runtime
# or use environment variables for paths

EXPOSE 3000

CMD ["node", "server.js"]
