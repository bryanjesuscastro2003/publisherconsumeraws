import { SQSClient } from "@aws-sdk/client-sqs";

export const client = new SQSClient({ region: "us-east-1" });

