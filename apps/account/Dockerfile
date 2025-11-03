FROM node:24-alpine AS builder

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci

COPY . .

RUN npm run build account

FROM node:24-alpine AS production

# NodeJS is not designed to run as PID 1
# Because of that, we need dumb-init
RUN apk add --no-cache dumb-init

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm ci --only-production

COPY --from=builder /usr/src/app/dist ./dist

EXPOSE 3001

CMD [ "dumb-init", "node", "dist/apps/account/main.js" ]