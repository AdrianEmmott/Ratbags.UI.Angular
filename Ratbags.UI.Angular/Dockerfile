# https://wkrzywiec.medium.com/build-and-run-angular-application-in-a-docker-container-b65dbbc50be8 -- lifted from here
# https://dev.to/wingsuitist/comment/2cn29 -- don't ng serve...

# build
FROM node:18 AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npm run build

# nginx
FROM nginx:alpine
COPY --from=build /app/dist/ratbags.ui.angular/browser /usr/share/nginx/html
#EXPOSE 80
