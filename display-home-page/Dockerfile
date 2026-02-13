#setup react app
FROM node:lts-alpine3.18 as buider-display-home-page
WORKDIR /app
COPY package.json .
COPY package-lock.json .
RUN npm install
COPY . .
RUN npm run build

# setup nginx
FROM nginx:1.24.0
WORKDIR /usr/share/nginx/html
RUN rm -rf ./*
COPY --from=buider-display-home-page /app/build .

# fix refresh issue on page with following file
COPY ./nginx-server.conf /etc/nginx/conf.d/default.conf

ENTRYPOINT [ "nginx","-g", "daemon off;" ]