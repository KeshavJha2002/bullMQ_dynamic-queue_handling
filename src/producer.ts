import { basic_queue_one, basic_queue_two, basic_queue_three } from './queue'

class Producer {
  private id: Number;
  constructor(id: Number) {
    this.id = id
  }

  async manage_job() {
    const num = Math.floor(Math.random()*3); // [0, 1, 2]
    console.log(`job added to : ${num+1}`)
    switch(num) {
      case 0: {
        await basic_queue_one.add('new_job_one', {
          data: "new job in one"
        });
        break;
      };
      case 1: {
        await basic_queue_two.add('new_job_two', {          
          data: "new job in two"
      });
        break;
      }
      case 2: {
        await basic_queue_three.add('new_job_three', {
          data: "new job in three" 
        });
        break;
      }
    }
  }
};

const producer_one = new Producer(1);

setInterval(async() => {
  await producer_one.manage_job();
},6000);