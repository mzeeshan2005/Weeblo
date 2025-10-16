# Step 1 — Use an official Node.js image
FROM node:18-alpine

# Step 2 — Set the working directory inside the container
WORKDIR /app

# Step 3 — Copy package.json and package-lock.json (for caching)
COPY package*.json ./

# Step 4 — Install dependencies
RUN npm install

# Step 5 — Copy the rest of the app files
COPY . .

# Step 6 — Build the app (for Next.js)
RUN npm run build

# Step 7 — Expose the port the app runs on
EXPOSE 3000

# Step 8 — Command to start the app
CMD ["npm", "start"]
