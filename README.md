# README

Follow this [medium blog](https://medium.com/@techsuneel99/message-queue-in-node-js-with-bullmq-and-redis-7fe5b8a21475) for detailed understanding about how bullMQ works.

This is a simple backend implementation of message queue and it's powerful features. I am using [bullMQ](https://docs.bullmq.io), which is a nodejs library built on top of redis.

The application will have

- 3+2 queues
- 3 producers
- 3+2 workers

Each producer will generate a new task and add it in one of the queues every 3 seconds, the workers will pick a task from the queues, take a random time between 5-10s, which will be an estimated time taken.

Each worker can listen to one queue only.

If the random number is greater than 8, we will assume that it is some kind of error, and it will be pushed into a `error_recovery` queue. One worker will work on the `error_recovery` queue, and following the same random number generation logic, it will perform the task, this queue will have a 20% chance of success, and the rest 80% will be stashed into a `dead_queue`.

## Installation

```bash
    # basic setup
    npm init
    tsc --init
    npm i bullmq ioredis
```

- Running redis and redis-cli on docker

```bash
    docker run --name redis_container -p 6379:6379 redis
    docker exec -it <redis_container_id> redis-cli
```

## Facts

I found out that,

```text
    You can reuse a processor that goes into the worker across different queues but not the worker itself.
```

- Whenever a worker picks a job, it locks it to prevent any other worker from accessing it and till now there is no way to bypass it.

So, I will be utilizing the concept of processor and allotting them to workers depending on `job.queueName`.

## Workers

A worker is instantiated with the Worker class, and the work itself will be performed in the `process function`. Process functions are meant to be `asynchronous`, using either the async keyword or returning a promise.

```code
    const worker = new Worker('queue_name', processor, connection);
```

## Job Lifecycle

Jobs in BullMQ go through various states in their lifecycle:

- **_waiting_**: Added to queue, waiting to be processed
- **_delayed_**: Job is scheduled for a later time
- **_active_**: Being processed by worker
- **_completed_**: Successfully processed
- **_failed_**: Failed processing due to error
- **_delayedRetry_**: Failed job is waiting for retry after delay
- **_paused_**: Queue/job paused and not active

## Job Options

While adding jobs, we can pass job options to control lifecycle behavior:

```code
    await queue.add(jobName, data, options)
```

Some common options are:

- **_delay_**: Delay job by x ms before processing
- **_attempts_**: Number of times to retry a failed job (3 is default)
- **_backoff_**: Backoff strategy on job failure
- **_lifo_**: Use LIFO order instead of FIFO
- **_priority_**: Numeric priority value. Higher is processed sooner
- **_repeat_**: Repeat job on a cron schedule

## Job Events

Each job emits events during its lifecycle that we can listen to:

Common job events:

- **_waiting_**
- **_active_**
- **_stalled_** (job touched but not done)
- **_progress_** (progress updated)
- **_completed_**
- **_failed_**
- **_paused_**
- **_resumed_**
- **_removed_**

```code
    job.on('completed', () => {
        // Job completed
    })

    job.on('failed', (err) => {
        // Job failed with error
    })
```
