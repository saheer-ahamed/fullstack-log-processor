# Fullstack Log Processor

A **Next.js** full-stack application that processes logs in real-time using **BullMQ (Redis)** for job queues and **Socket.io** for real-time updates.

## 🚀 Features
- **User Authentication** (Supabase Authentication - Login/Signup/GitHub OAuth)
- **Log Upload & Processing** (Queue-based with BullMQ & Redis)
- **Real-time Dashboard** (Socket.io for live log stats updates)
- **Background Workers** (Processing jobs asynchronously)
- **API Routes for Data Fetching**
- **Dockerized Deployment**

## 🏗️ Tech Stack
- **Frontend**: Next.js, React, TypeScript
- **Backend**: Next.js API Routes, Node.js, Express
- **Database**: Supabase (PostgreSQL)
- **Queues & Workers**: BullMQ (Redis)
- **Real-time Communication**: Socket.io
- **Containerization**: Docker & Docker Compose

---

## 📦 Installation & Setup

### 1️⃣ Prerequisites
Ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v20+)
- [Yarn](https://yarnpkg.com/) or npm
- [Redis](https://redis.io/)
- [Docker](https://www.docker.com/) (for containerized deployment)

### 2️⃣ Clone the Repository
```sh
git clone https://github.com/saheer-ahamed/fullstack-log-processor.git
cd fullstack-log-processor
```

### 3️⃣ Install Dependencies
```sh
yarn install  # or npm install
```

### 4️⃣ Setup Environment Variables
Create a `.env` file based on `.env.example` and configure:
```
SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_URL=
SUPABASE_ANON_KEY=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

REDIS_HOST=
REDIS_PORT=

MAX_RETRY_ATTEMPTS=
MAX_CONCURRENT_JOBS=

MAX_FILE_SIZE=

NEXT_PUBLIC_APP_URL=
NODE_ENV=

KEYWORDS=
```

### 5️⃣ Start Redis Server (if not using Docker)
```sh
redis-server
```

### 6️⃣ Run the Development Server
```sh
yarn dev  # or npm run dev
```
App will be available at `http://localhost:3000`

---

## 🔥 Architecture & Directory Structure

```
fullstack-log-processor/
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/              # Authentication pages
│   │   ├── (protectedPages)/    # Dashboard & secured routes
│   │   ├── api/v1/              # API routes for auth, logs, stats
│   │   ├── globals.css          # Global CSS
│   │   ├── icon.ico             # Favicon
│   │   ├── layout.tsx           # Root Layout
│   │   ├── not-found.tsx        # Error (Not found) Page
│   ├── components/           # Reusable UI components
│   ├── types/                # Typescript types management
│   ├── utils/                # Helper functions & services
│   │   ├── serverActions        # Server actions for next js app (auth)
│   │   ├── supabase             # Supabase client management
│   │   ├── workers              # BullMQ Workers for job processing
│   │   ├── apiInterceptor.ts    # Error (Not found) Page
│   │   ├── helper.ts            # Helper functions
│   │   ├── queue.ts             # BullMQ queues for job handling
│   │   ├── socket.ts            # Managing socket
│   ├── middleware.ts         # Root middleware
├── Dockerfile                # Docker container setup
├── docker-compose.yml        # Docker services configuration
├── package.json              # Dependencies & scripts
├── README.md                 # Project documentation
```

---

## 🛠️ BullMQ Queues & Workers

### **Queue Setup**
- `queue-stats`: Return BullMQ queue status.
- `upload-logs`: Upload file, enqueue job, return jobId.

### **Worker Files** (Located in `src/workers/`)
- **`queue.ts`** → Handles job processing logic.
- **`logWorker.ts`** → Processes log uploads.
- **`socket.ts`** → Handles real-time updates via Socket.io.

---

## 📡 Real-time Updates with Socket.io

- **Events**:
  - `job-progress`: Updates when job queue processing status changes, emits real-time log changes to the dashboard.

---

## 🚢 Running with Docker

```sh
docker-compose up --build
```
This will start:
- **Next.js App** on `http://localhost:3000`
- **Redis Server**
- **Workers & Queues**

---

## **log_stats Table Schema**  

```sql
CREATE TABLE public.log_stats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    jobId TEXT NOT NULL,
    filename TEXT NOT NULL,
    errorCount BIGINT DEFAULT 0,
    uniqueIPs TEXT[],
    processingStatus TEXT NOT NULL,
    processedAt TIMESTAMPTZ DEFAULT now(),
    keywordCounts JSONB DEFAULT '{}',
    userId UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE
);
```

### **Column Descriptions**

| Column Name       | Data Type   | Constraints |
|------------------|-----------|-------------|
| **id**           | `UUID`    | Primary key, auto-generated |
| **jobId**        | `TEXT`    | Required, Job identifier |
| **filename**     | `TEXT`    | Required, Log file name |
| **errorCount**   | `BIGINT`  | Defaults to 0, Error count in logs |
| **uniqueIPs**    | `TEXT[]`  | Array of unique IP addresses |
| **processingStatus** | `TEXT` | Required, Status of processing |
| **processedAt**  | `TIMESTAMPTZ` | Defaults to current timestamp |
| **keywordCounts** | `JSONB`  | Stores keyword frequency as JSON |
| **userId**       | `UUID`    | Foreign key referencing `users(id)`, cascades on delete |

---

## 📜 API Endpoints

### **Auth API**
| Method | Endpoint               | Description         |
|--------|------------------------|---------------------|
| `GET`  | `/api/v1/auth/github`  | GitHub OAuth login |

### **Log Processing API**
| Method | Endpoint                  | Description         |
|--------|---------------------------|---------------------|
| `POST` | `/api/v1/upload-logs`     | Upload logs        |
| `GET`  | `/api/v1/queue-stats`     | Get queue stats    |
| `GET`  | `/api/v1/stats/:jobId`    | Get job details    |

---

## Provided Sample Log file (10 MB around)
- sample_log_file_10MB.log

---

## 🧪 Running Tests
```sh
yarn test  # or npm run test
```

---

## 🤝 Contributing
Contributions are welcome! Open an issue or submit a pull request.

---

## 📬 Contact
- **GitHub**: [saheer-ahamed](https://github.com/saheer-ahamed)
- **Email**: saheer.ahamed570@gmail.com

