### Backend Service

#### API Endpoints
- `POST /api/upload-logs` - Upload and enqueue log files
- `GET /api/stats` - Retrieve aggregated statistics
- `GET /api/stats/[jobId]` - Get job-specific statistics
- `GET /api/queue-status` - View BullMQ queue status
- `WebSocket /api/live-stats` - Real-time updates

#### Queue Configuration
- Redis-backed BullMQ queue (`log-processing-queue`)
- Job metadata tracking (`fileId`, `filePath`)
- Smaller file prioritization
- 3 retry attempts maximum
- 4 concurrent job processing

#### Log Processing
- Stream-based parsing of logs in format:
  ```
  [TIMESTAMP] LEVEL MESSAGE {optional JSON payload}
  Example: [2025-02-20T10:00:00Z] ERROR Database timeout {"userId": 123, "ip": "192.168.1.1"}
  ```
- Error tracking
- Configurable keyword monitoring
- IP address analysis
- Results storage in Supabase