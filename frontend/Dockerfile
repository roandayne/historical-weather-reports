FROM node:20-alpine AS base
WORKDIR /app
COPY package.json ./
RUN npm install --package-lock-only

FROM base AS development
RUN rm -rf node_modules && npm ci --legacy-peer-deps
COPY . .
EXPOSE 8080
CMD ["npm", "run", "dev"]

FROM base AS production
RUN rm -rf node_modules && npm ci --legacy-peer-deps
COPY . .
RUN npm run build
FROM nginx:alpine
COPY --from=production /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"] 