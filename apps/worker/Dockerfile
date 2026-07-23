FROM node:22-alpine AS build
WORKDIR /app
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./
COPY apps ./apps
COPY packages ./packages
RUN pnpm install --frozen-lockfile
RUN pnpm --filter @gamedev-idle/worker build
RUN pnpm --filter @gamedev-idle/worker deploy --legacy --prod /prod/worker
FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /prod/worker ./
CMD ["node", "dist/main.js"]
