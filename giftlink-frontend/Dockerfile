# ---- Stage 1: build the React app ----
FROM node:20-alpine AS build
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

# Backend URL is baked into the bundle at build time
ARG REACT_APP_BACKEND_URL=http://localhost:3060
ENV REACT_APP_BACKEND_URL=$REACT_APP_BACKEND_URL
RUN npm run build

# ---- Stage 2: small image that only serves the build ----
FROM node:20-alpine
WORKDIR /app

RUN npm install express@4

COPY --from=build /app/build ./build
COPY server.js ./

EXPOSE 9000

CMD ["node", "server.js"]
