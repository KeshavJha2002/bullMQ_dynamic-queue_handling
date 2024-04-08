import { Worker, Job } from "bullmq";
import { dead_queue, error_queue, connection } from './queue';

async function execute_basic_queue_job(job: Job) {
  console.log(`${job.queueName} :: ${job.id} -> added`);
  const time = Math.floor(Math.random()*7+4);
  if(time>=7){
    console.log(`${job.queueName} :: ${job.id} -> added to error_queue`);
    error_queue.add(`${job.name}`, job.data, { attempts: 3, backoff: 5000 });
    job.remove();
  } else {
      setTimeout(() => {
        console.log(`${job.queueName} :: ${job.id} -> completed and removed`);
        job.remove();
      }, time * 1000);
    }
}

const basic_queue_one_worker = new Worker('basic_queue_one', async (job: Job)=> {
  await execute_basic_queue_job(job);
}, { connection });

const basic_queue_two_worker = new Worker('basic_queue_two', async (job: Job)=> {
  await execute_basic_queue_job(job);
}, { connection });

const basic_queue_three_worker = new Worker('basic_queue_three', async (job: Job)=> {
  await execute_basic_queue_job(job);
}, { connection });

const error_queue_worker = new Worker('error_queue', async (job: Job)=> {
  const time = Math.floor(Math.random()*5);
  if (time) {
    // failure
    console.log(`${job.queueName} :: ${job.id} -> added to dead_queue`);
    dead_queue.add(`${job.name}`, job.data, { attempts: 3, backoff: 5000 });
    job.remove();
  } else {
    // success
      setTimeout(() => {
        console.log(`${job.queueName} :: ${job.id} -> completed and removed`);
        job.remove();
      }, time * 1000);
    }
}, { connection });

const dead_queue_worker = new Worker('dead_queue', async (job: Job)=> {
}, { connection });
