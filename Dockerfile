FROM node:16 AS build
WORKDIR /app

COPY ./frontend/package.json ./frontend/package-lock.json ./
RUN npm install

COPY ./frontend ./

RUN npm run build

RUN ls -al /app/dist

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html

# Copy the custom nginx.conf
COPY ./nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
