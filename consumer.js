const amqp = require("amqplib");
const queueName = process.argv[2] || "jobsQueue";
const data = require("./api.json");
const redis = require("redis");
const client = redis.createClient();

connect_rabbitmq();

async function connect_rabbitmq() {
 try {
    const connection = await amqp.connect("amqp://localhost:5672");
    const channel = await connection.createChannel();
    const assertion = await channel.assertQueue(queueName);

    // Get Message
    channel.consume(queueName, message =>{
        const messageInfo = JSON.parse(message.content.toString());
        const userInfo = data.find(u=> u.id == messageInfo.description);
        if (userInfo) {
            console.log("Log", userInfo);
            client.set(`user_${userInfo.id}`, JSON.stringify(userInfo),(err, status)=>{
                if (!err) {
                    console.log("Status", status);
                    channel.ack(message);
                    
                }

            })
        }

        
        //console.log("Message", message.content.toString());
    })

 } catch (error) {
    console.log("Error" ,error); 
 }
}