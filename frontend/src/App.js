import React, { useState } from "react";
import axios from "axios";

const API_URL =
  "https://4hhwkx91me.execute-api.us-east-1.amazonaws.com/ServerlessApp/notes";

const centerStyle = {
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "100vh",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px",
};

const buttonStyle = {
  margin: "10px 0",
};

const HomePage = ({ setChoice }) => (
  <>
    <h1>PINBOARD</h1>
    <div>
      <button onClick={() => setChoice("create")}>Create</button>
      <button onClick={() => setChoice("read")}>Read</button>
      <button onClick={() => setChoice("update")}>Update</button>
      <button onClick={() => setChoice("delete")}>Delete</button>
    </div>
  </>
);

const CreatePage = ({ setChoice }) => {
  const [noteId, setNoteId] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const createNotice = () => {
    const requestBody = {
      body: JSON.stringify({
        noteid: noteId,
        content: content,
        author: author,
      }),
    };

    axios
      .post(API_URL, requestBody)
      .then((response) => {
        console.log("Notice created successfully:", response.data);

        setSuccessMessage("Notice created successfully!");

        setChoice(null);
      })
      .catch((error) => {
        console.error("Error creating notice:", error);
      });
  };

  return (
    <>
      <h2>Create Notice</h2>
      <div style={formStyle}>
        <div>
          <label htmlFor="noteId">Note ID:</label>
          <input
            type="text"
            id="noteId"
            value={noteId}
            onChange={(e) => setNoteId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <input
            type="text"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="author">Author:</label>
          <input
            type="text"
            id="author"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
          />
        </div>
        <button style={buttonStyle} onClick={createNotice}>
          Create Notice
        </button>
        <button style={buttonStyle} onClick={() => setChoice(null)}>
          Back to Home
        </button>
      </div>

      {successMessage && <p>{successMessage}</p>}
    </>
  );
};

const ReadPage = ({ setChoice }) => {
  const [noteId, setNoteId] = useState("");
  const [readData, setReadData] = useState(null);

  const readNotice = () => {
    const requestBody = noteId.trim() ? { noteid: noteId } : {};

    axios
      .get(API_URL, { params: requestBody })
      .then((response) => {
        console.log("Read response:", response.data);
        setReadData(filterNoticeById(response.data, noteId));
      })
      .catch((error) => {
        console.error("Error reading notice:", error);
      });
  };

  const filterNoticeById = (data, noteId) => {
    if (!noteId.trim()) return data;

    const parsedData = JSON.parse(data.body);
    const filteredData = parsedData.filter((item) => item.noteid === noteId);
    return { statusCode: 200, body: JSON.stringify(filteredData) };
  };

  const formatReadData = (data) => {
    if (!data) return "";

    const parsedData = JSON.parse(data.body);

    if (!Array.isArray(parsedData) || parsedData.length === 0)
      return "No data found.";

    const formattedData = parsedData
      .map((item) => {
        const { noteid, content, updatedAt } = item;
        return `Note ID: ${noteid}    Content: ${content}    Updated At: ${updatedAt}`;
      })
      .join("\n");

    return formattedData;
  };

  return (
    <>
      <h2>Read Notice</h2>
      <div style={formStyle}>
        <div>
          <label htmlFor="noteId">Note ID:</label>
          <input
            type="text"
            id="noteId"
            value={noteId}
            onChange={(e) => setNoteId(e.target.value)}
          />
        </div>
        <div>
          <label>Output:</label>
          <textarea readOnly rows="5" value={formatReadData(readData)} />
        </div>
        <button style={buttonStyle} onClick={readNotice}>
          Read Notice
        </button>
        <button style={buttonStyle} onClick={() => setChoice(null)}>
          Back to Home
        </button>
      </div>
    </>
  );
};

const UpdatePage = ({ setChoice }) => {
  const [noteId, setNoteId] = useState("");
  const [content, setContent] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const updateNotice = () => {
    if (!noteId || !content) {
      alert("Please enter both Note ID and Content.");
      return;
    }

    const requestBody = {
      body: JSON.stringify({
        noteid: noteId,
        content: content,
      }),
    };

    axios
      .put(API_URL, requestBody)
      .then((response) => {
        console.log("Update response:", response.data);
        const responseData = JSON.parse(response.data.body);
        if (
          response.data.statusCode === 200 &&
          responseData.message === "Note saved successfully."
        ) {
          setSuccessMessage("Notice Updated Successfully");
        } else {
          alert("Failed to update notice.");
        }
      })
      .catch((error) => {
        console.error("Error updating notice:", error);
        alert("Failed to update notice.");
      });
  };

  return (
    <>
      <h2>Update Notice</h2>
      <div style={formStyle}>
        <div>
          <label htmlFor="noteId">Note ID:</label>
          <input
            type="text"
            id="noteId"
            value={noteId}
            onChange={(e) => setNoteId(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="content">Content:</label>
          <input
            type="text"
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>
        <button style={buttonStyle} onClick={updateNotice}>
          Update Notice
        </button>
        <button style={buttonStyle} onClick={() => setChoice(null)}>
          Back to Home
        </button>
      </div>

      {successMessage && <p>{successMessage}</p>}
    </>
  );
};

const DeletePage = ({ setChoice }) => {
  const [noteId, setNoteId] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const deleteNotice = () => {
    if (!noteId) {
      alert("Please enter the Note ID.");
      return;
    }

    const requestBody = {
      noteid: noteId,
    };

    axios
      .delete(API_URL, { data: requestBody })
      .then((response) => {
        console.log("Delete response:", response.data);
        if (response.data.statusCode === 200) {
          setSuccessMessage("Notice Deleted Successfully");
        } else {
          alert("Failed to delete notice.");
        }
      })
      .catch((error) => {
        console.error("Error deleting notice:", error);
        alert("Failed to delete notice.");
      });
  };

  return (
    <>
      <h2>Delete Notice</h2>
      <div style={formStyle}>
        <div>
          <label htmlFor="noteId">Note ID:</label>
          <input
            type="text"
            id="noteId"
            value={noteId}
            onChange={(e) => setNoteId(e.target.value)}
          />
        </div>
        <button style={buttonStyle} onClick={deleteNotice}>
          Delete Notice
        </button>
        <button style={buttonStyle} onClick={() => setChoice(null)}>
          Back to Home
        </button>
      </div>

      {successMessage && <p>{successMessage}</p>}
    </>
  );
};

const App = () => {
  const [choice, setChoice] = useState(null);

  const renderPage = () => {
    switch (choice) {
      case "create":
        return <CreatePage setChoice={setChoice} />;
      case "read":
        return <ReadPage setChoice={setChoice} />;
      case "update":
        return <UpdatePage setChoice={setChoice} />;
      case "delete":
        return <DeletePage setChoice={setChoice} />;
      default:
        return <HomePage setChoice={setChoice} />;
    }
  };

  return <div style={centerStyle}>{renderPage()}</div>;
};

export default App;
