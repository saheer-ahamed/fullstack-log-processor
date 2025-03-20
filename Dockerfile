# 1️⃣ Use official Node.js image
FROM node:20-alpine AS builder

# 2️⃣ Set working directory
WORKDIR /app

# 3️⃣ Accept environment variables from docker-compose
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG REDIS_HOST
ARG REDIS_PORT

# 4️⃣ Copy package.json and package-lock.json
COPY package.json package-lock.json ./

# 5️⃣ Install ALL dependencies (including devDependencies)
RUN npm install

# 6️⃣ Copy all project files
COPY . .

# 7️⃣ Build the Next.js app
RUN npm run build

# 8️⃣ Start a lightweight runtime environment
FROM node:20-alpine AS runner

# 9️⃣ Set working directory
WORKDIR /app

# 🔟 Accept environment variables again for runtime
ARG NEXT_PUBLIC_SUPABASE_URL
ARG NEXT_PUBLIC_SUPABASE_ANON_KEY
ARG SUPABASE_SERVICE_ROLE_KEY
ARG REDIS_HOST
ARG REDIS_PORT

# 1️⃣1️⃣ Convert build-time args to runtime ENV variables
ENV NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
ENV NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
ENV SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
ENV REDIS_HOST=${REDIS_HOST}
ENV REDIS_PORT=${REDIS_PORT}

# 1️⃣2️⃣ Copy built files from builder stage
COPY --from=builder /app ./

# 1️⃣3️⃣ Expose the port
EXPOSE 3000

# 1️⃣4️⃣ Start Next.js
CMD ["npm", "run", "start"]
