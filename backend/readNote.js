/*global dynamoDB*/

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const noteid = event && event.noteid;

    if (noteid) {
      const params = {
        TableName: "Notes",
        Key: {
          noteid: noteid,
        },
      };

      const data = await dynamoDB.get(params).promise();

      if (!data.Item) {
        return {
          statusCode: 404,
          body: JSON.stringify({ message: "Note not found." }),
        };
      }

      return {
        statusCode: 200,
        body: JSON.stringify(data.Item),
      };
    } else {
      const params = {
        TableName: "Notes",
      };

      const data = await dynamoDB.scan(params).promise();

      return {
        statusCode: 200,
        body: JSON.stringify(data.Items),
      };
    }
  } catch (error) {
    console.error("Error fetching notes:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while fetching notes.",
      }),
    };
  }
};
