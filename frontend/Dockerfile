# frontend/Dockerfile

# 1. Base image
FROM node:18-alpine

# 2. Set workdir
WORKDIR /app

# 3. Copy package files
COPY package.json package-lock.json ./

# 4. Install dependencies
RUN npm install

# 5. Copy source & build
COPY . .
RUN npm run build

# 6. Expose & start
EXPOSE 3000
CMD ["npm", "start"]
