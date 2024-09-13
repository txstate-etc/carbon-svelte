FROM node:20-alpine as build
RUN apk update && apk upgrade

WORKDIR /usr/app
COPY package.json ./
COPY package-lock.json ./
COPY svelte.config.js ./
COPY tailwind.config.js ./
COPY postcss.config.js ./
COPY tsconfig.json ./
COPY vite.config.ts ./
RUN npm ci && mv node_modules ..
COPY src src
COPY static static
RUN npm run build

FROM nginx:mainline-alpine
RUN apk update && apk upgrade && apk add grep brotli
COPY --from=build /usr/app/build /usr/share/nginx/html
COPY static/* /usr/share/nginx/html/
COPY nginx.conf /etc/nginx/nginx.conf
