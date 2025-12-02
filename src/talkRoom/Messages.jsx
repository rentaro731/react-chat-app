import r from "./../.css/room.module.css";
import { useTalkRoomContext } from "../context/TalkRoomContext";

export const Messages = () => {
  const { messages, loading } = useTalkRoomContext();

  if (loading) {
    return <div>Loading messages...</div>;
  }
  return (
    <div className={r.messages}>
      {messages.map((msg) => (
        <div key={msg.id} className={r.message}>
          <p>{msg.text}</p>
        </div>
      ))}
    </div>
  );
};
