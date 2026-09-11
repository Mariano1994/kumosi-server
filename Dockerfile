# ---- Stage 1: install deps ----
FROM node:26-alpine3.23 AS deps

WORKDIR /app

COPY package.json pnpm-lock.yaml ./

RUN npm install -g pnpm
RUN pnpm install --prod --frozen-lockfile

# ---- Stage 2: production image ----
FROM node:26-alpine3.23 AS production

WORKDIR /app

ENV NODE_ENV=production

# bring in only the prod node_modules from the deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
COPY src ./src

CMD ["pnpm", "dev","start"]