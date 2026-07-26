FROM node:22-bookworm-slim

WORKDIR /app

# Install deps first so this layer is cached unless package.json changes
COPY package.json package-lock.json ./
RUN npm ci

# Generate the Prisma client (gitignored, must be built into the image)
COPY prisma ./prisma
RUN npx prisma generate

# Now copy the rest of the source
COPY . .

RUN chown -R node:node /app
USER node

ENV NODE_ENV=production
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s \
  CMD node -e "fetch('http://localhost:3000/api/health').then(r=>process.exit(r.ok?0:1)).catch(()=>process.exit(1))"

CMD ["npm", "start"]
