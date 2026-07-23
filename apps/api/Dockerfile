FROM node:22-alpine AS build

WORKDIR /app

RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml tsconfig.base.json ./

COPY packages ./packages
COPY apps ./apps

RUN pnpm install --frozen-lockfile

RUN pnpm --filter @gamedev-idle/api build

RUN pnpm --filter @gamedev-idle/api deploy --legacy --prod /prod/api

FROM node:22-alpine

WORKDIR /app

ENV NODE_ENV=production

COPY --from=build /prod/api ./

EXPOSE 3001

CMD ["node", "dist/main.js"]
