import { Queue, Worker } from 'bullmq';
const connection = { url: process.env.REDIS_URL ?? 'redis://localhost:6379' };
export const gameQueue = new Queue('game', { connection });
new Worker('game', async (job) => { console.info(`Processing ${job.name} (${job.id})`); }, { connection });
console.info('GameDev Idle worker is ready.');
