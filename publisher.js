const amqp = require("amqplib");


const message = {
    description: "Test message"
};

const data = require("./api.json");

const queueName = process.argv[2] || "jobsQueue";



connect_rabbitmq();
async function connect_rabbitmq() {
 try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    data.forEach(i=>{
        message.description = i.id
            channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
            console.log("Send Message", i.id);
    })

    //INTERVAL ****************************************************
    // setInterval(() => {
    //     message.description = new Date().getTime();
    //     channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)));
    //     console.log("Send Message", message);
    // }, 1000);   
     //INTERVAL ****************************************************


 } catch (error) {
    console.log("Error" ,error); 
 }
}