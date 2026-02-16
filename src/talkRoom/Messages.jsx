import styles from "../css/room.module.css";
import { useUserContext } from "../UserContext";
import Avatar from "react-avatar";
import { useRef, useEffect } from "react";

export const Messages = ({ messages, loading }) => {
  const scrollRef = useRef(null);
  const { user } = useUserContext();

  useEffect(() => {
    if (!loading) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [messages]);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className={styles.messages}>
      {messages.map((msg) => {
        const isMyMessage = msg.senderId === user?.uid;
        return (
          <div
            key={msg.id}
            className={isMyMessage ? styles.myIcon : styles.receiveIcon}
          >
            {/*相手側のアイコン表示 */}
            {!isMyMessage && (
              <Avatar size="32" round={true} className={styles.avatar} />
            )}

            <div
              className={`${styles.message} ${
                isMyMessage ? styles.myMessage : styles.receiveMessage
              }`}
            >
              <p>{msg.text}</p>
            </div>
          </div>
        );
      })}
      <div ref={scrollRef} />
    </div>
  );
};
