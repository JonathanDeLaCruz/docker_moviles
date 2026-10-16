FROM node:22-alpine AS compilacion
WORKDIR /app
COPY mobile/package.json mobile/package-lock.json ./
RUN npm ci
COPY mobile/ ./
RUN npx ng build --configuration production
FROM nginx:1.28-alpine
COPY --from=compilacion /app/www /usr/share/nginx/html
