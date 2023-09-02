const AWS = require("aws-sdk");
const sns = new AWS.SNS();
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  const tableName = "Notes";
  const topicArn = "arn:aws:sns:us-east-1:421202316297:MyNotes";

  try {
    const eventType = event.Records[0].eventName;
    const newNote = event.Records[0].dynamodb.NewImage;
    const newNoteID = eventType !== "REMOVE" ? newNote.noteid : null;
    const newNoteContent = eventType !== "REMOVE" ? newNote.content : null;
    const newNoteUpdatedAt = eventType !== "REMOVE" ? newNote.updatedAt : null;

    const data = await dynamoDB.scan({ TableName: tableName }).promise();
    const existingNotes = data.Items;

    const emailContentArray = [];

    for (const note of existingNotes) {
      const noteID = note.noteid;
      const noteContent = note.content;
      const noteUpdatedAt = note.updatedAt;

      if (newNoteID === noteID) {
        emailContentArray.push(
          `NoteID: ${noteID}\tContent: ${newNoteContent}\tupdatedAt: ${newNoteUpdatedAt}`
        );
      } else {
        emailContentArray.push(
          `NoteID: ${noteID}\tContent: ${noteContent}\tupdatedAt: ${noteUpdatedAt}`
        );
      }
    }

    const emailContent = emailContentArray.join("\n");

    const subscriptions = await sns
      .listSubscriptionsByTopic({ TopicArn: topicArn })
      .promise();
    const subscribedEndpoints = subscriptions.Subscriptions.map(
      (sub) => sub.Endpoint
    );

    for (const item of data.Items) {
      const authorEmail = item.author;

      if (!subscribedEndpoints.includes(authorEmail)) {
        const subscribeParams = {
          Protocol: "email",
          TopicArn: topicArn,
          Endpoint: authorEmail,
        };
        try {
          await sns.subscribe(subscribeParams).promise();
        } catch (error) {
          if (error.code !== "SubscriptionAlreadyExists") {
            throw error;
          }
        }
      }
    }

    const publishParams = {
      Message: emailContent,
      Subject: "Current Notices",
      TopicArn: topicArn,
    };
    await sns.publish(publishParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify("Emails sent to authors successfully."),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify("Error sending emails: " + error.message),
    };
  }
};
