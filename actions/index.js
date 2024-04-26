import {
    GetQueueUrlCommand, SQSClient,
    SendMessageCommand,
    paginateListQueues
} from "@aws-sdk/client-sqs";

const client = new SQSClient({
    region: "us-east-1" 
});
const SQS_QUEUE_NAME = "my_queue";

export class SQS {
   
    getQueueUrl = async () => {
    const command = new GetQueueUrlCommand({
      QueueName: SQS_QUEUE_NAME,
    });
    const response = await client.send(command);
    return response.QueueUrl;
    }

    getListQueues = async () => { 
        const paginatedListQueues = paginateListQueues({ client }, {});
        const urls = [];
        for await (const page of paginatedListQueues) {
            const nextUrls = page.QueueUrls?.filter((qurl) => !!qurl) || [];
            urls.push(...nextUrls);
            urls.forEach((url) => console.log(url));
        }
        return urls;
    }


    sendMessage = async (message) => {
        const queueUrl = await this.getQueueUrl();
        const command = new SendMessageCommand({
            QueueUrl: queueUrl,
            MessageBody: message,
        });
        const response = await client.send(command);
        return response;
    }


}