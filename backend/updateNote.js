/*global dynamoDB*/

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const requestBody = JSON.parse(event.body);

    if (!requestBody.noteid || !requestBody.content) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Missing required fields in the request.",
        }),
      };
    }

    const currentDate = new Date();
    const year = currentDate.getUTCFullYear();
    const month = String(currentDate.getUTCMonth() + 1).padStart(2, "0");
    const day = String(currentDate.getUTCDate()).padStart(2, "0");
    const hoursUTC = currentDate.getUTCHours();
    const minutes = String(currentDate.getUTCMinutes()).padStart(2, "0");
    const seconds = String(currentDate.getUTCSeconds()).padStart(2, "0");

    const isDST = true;
    const timezoneOffset = isDST ? -3 : -4;
    const hoursNS = (hoursUTC + timezoneOffset + 24) % 24;

    const updatedAt = `${year}${month}${day} ${String(hoursNS).padStart(
      2,
      "0"
    )}:${minutes}:${seconds}`;

    const params = {
      TableName: "Notes",
      Key: {
        noteid: requestBody.noteid,
      },
      UpdateExpression: "SET content = :content, updatedAt = :updatedAt",
      ExpressionAttributeValues: {
        ":content": requestBody.content,
        ":updatedAt": updatedAt,
      },
      ReturnValues: "UPDATED_NEW",
    };

    await dynamoDB.update(params).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Note saved successfully." }),
    };
  } catch (error) {
    console.error("Error updating note:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while updating the note.",
      }),
    };
  }
};
