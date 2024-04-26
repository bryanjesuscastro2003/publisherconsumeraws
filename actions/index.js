import {
    GetQueueUrlCommand, SQSClient,
    SendMessageCommand,
    paginateListQueues
} from "@aws-sdk/client-sqs";

const { 
  ReceiveMessageCommand,
  DeleteMessageCommand,
  DeleteMessageBatchCommand,
} = require("@aws-sdk/client-sqs")



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

    isMessageAvailable = async () => { 
        const queueUrl = await this.getQueueUrl();
        const command = new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 1,
        });
        const response = await client.send(command);
        return response.Messages && response.Messages.length > 0;
    }

    receiveMessage = async () => {
        const queueUrl = await this.getQueueUrl();
        const command = new ReceiveMessageCommand({
            QueueUrl: queueUrl,
            MaxNumberOfMessages: 10,
        });
        const response = await client.send(command);
        return response;
    }

    deleteMessage = async (receiptHandle) => {
        const queueUrl = await this.getQueueUrl();
        const command = new DeleteMessageCommand({
            QueueUrl: queueUrl,
            ReceiptHandle: receiptHandle,
        });
        const response = await client.send(command);
        return response;
    }

    deleteMessageBatch = async (receiptHandles) => {
        const queueUrl = await this.getQueueUrl();
        const entries = receiptHandles.map((receiptHandle, i) => ({
            Id: `msg${i}`,
            ReceiptHandle: receiptHandle,
        }));
        const command = new DeleteMessageBatchCommand({
            QueueUrl: queueUrl,
            Entries: entries,
        });
        const response = await client.send(command);
        return response;
    }






}