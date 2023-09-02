/*global dynamoDB*/

const AWS = require("aws-sdk");
const dynamoDB = new AWS.DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const noteid = event && event.noteid;

    if (!noteid) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "noteid is required in the request body.",
        }),
      };
    }

    const getParams = {
      TableName: "Notes",
      Key: {
        noteid: noteid,
      },
    };
    const existingNote = await dynamoDB.get(getParams).promise();

    if (!existingNote.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Note not found." }),
      };
    }

    const deleteParams = {
      TableName: "Notes",
      Key: {
        noteid: noteid,
      },
      ReturnValues: "ALL_OLD",
    };
    const deletedItem = await dynamoDB.delete(deleteParams).promise();

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Note deleted successfully.",
        deletedItem,
      }),
    };
  } catch (error) {
    console.error("Error deleting note:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "An error occurred while deleting the note.",
      }),
    };
  }
};
