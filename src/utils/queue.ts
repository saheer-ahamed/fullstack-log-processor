import { Queue } from 'bullmq';
import { Redis } from 'ioredis';

// Redis connection configuration
const redis = new Redis({
  host: process.env.REDIS_HOST || 'redis',
  port: parseInt(process.env.REDIS_PORT || '6379'),
  maxRetriesPerRequest: null,
});

// Queue configuration
export const logProcessingQueue = new Queue('log-processing', {
  connection: redis,
  defaultJobOptions: {
    attempts: parseInt(process.env.MAX_RETRY_ATTEMPTS || "3"),
    backoff: {
      type: 'exponential',
      delay: 1000,
    },
    removeOnComplete: true,
    removeOnFail: false
  },
});