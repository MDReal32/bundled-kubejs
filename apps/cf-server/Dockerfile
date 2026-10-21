FROM node:22-alpine AS manifests
WORKDIR /app
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn/releases ./.yarn/releases
COPY .yarn/plugins ./.yarn/plugins
COPY apps/cf-server/package.json ./apps/cf-server/package.json

FROM manifests AS build
RUN yarn workspaces focus @kubejs/cf-server
COPY tsconfig.base.json ./
COPY apps/cf-server ./apps/cf-server
RUN yarn workspace @kubejs/cf-server build

FROM manifests AS prod-deps
RUN yarn workspaces focus @kubejs/cf-server --production

FROM node:22-alpine AS runtime
RUN addgroup -S kubejs && adduser -S kubejs -G kubejs
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=manifests /app/package.json ./package.json
COPY --from=build /app/apps/cf-server/package.json ./apps/cf-server/package.json
COPY --from=build /app/apps/cf-server/build ./apps/cf-server/build
WORKDIR /app/apps/cf-server
ENV NODE_ENV=production
EXPOSE 3000
USER kubejs

HEALTHCHECK --interval=10s --timeout=3s --start-period=10s --retries=3 \
  CMD node -e "require('http').get('http://127.0.0.1:'+(process.env.PORT||3000)+'/',r=>process.exit(r.statusCode<500?0:1)).on('error',()=>process.exit(1))"

CMD ["node", "build/main.js"]
