FROM node:20-alpine

# Arbeitsverzeichnis im Container
WORKDIR /app

# Nur package-Dateien kopieren und Dependencies installieren
COPY package*.json ./
RUN npm install

# Prisma-Schema und Sourcecode kopieren
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY src ./src

# Prisma Client generieren & Projekt builden
RUN npx prisma generate
RUN npm run build

# Standard-Env
ENV NODE_ENV=production
EXPOSE 3000

# Startbefehl
CMD ["node", "dist/main.js"]
