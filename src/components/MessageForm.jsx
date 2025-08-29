import { useState } from "react";
import axios from "axios";

export default function MessageForm({ matchUserId, fromUserId }) {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  const sendMessage = async () => {
    try {
      const res = await axios.post(`/api/messages/send/${matchUserId}`, {
        fromUserId,
        message: text,
      });
      setStatus(res.data.message);
      setText("");
    } catch (err) {
      setStatus(err.response?.data?.message || "Error sending message");
    }
  };

  return (
    <div>
      <textarea
        value={text}
        maxLength={100}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type your message (max 100 chars)"
      />
      <button onClick={sendMessage}>Send</button>
      {status && <p>{status}</p>}
    </div>
  );
}
