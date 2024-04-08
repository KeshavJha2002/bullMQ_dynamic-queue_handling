import { Queue } from 'bullmq';

export const connection = {
  host: "localhost",
  port: 6379
}

export const basic_queue_one = new Queue('basic_queue_one', { connection: connection});
export const basic_queue_two = new Queue('basic_queue_two', { connection: connection});
export const basic_queue_three = new Queue('basic_queue_three', { connection: connection});

export const error_queue = new Queue('error_queue', { connection: connection});

export const dead_queue = new Queue('dead_queue', { connection: connection});