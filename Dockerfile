# FROM node:20

# WORKDIR /app

# COPY package* .

# RUN npm install

# COPY . .

# RUN npm run build

# EXPOSE 3000


# CMD ["node", "dist/index.js"]


FROM node:20
WORKDIR /app
COPY package* .
RUN npm install
COPY . .
EXPOSE 5000
CMD ["node", "run", "dev"]