FROM node:20-alpine AS development

WORKDIR /app

COPY . .

RUN npm ci

CMD ["npm", "run", "start:docker"]
