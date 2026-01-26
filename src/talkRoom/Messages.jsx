import styles from "../css/room.module.css";
import { useUserContext } from "../UserContext";
import Avatar from "react-avatar";
import { useRef, useEffect } from "react";

export const Messages = ({ messages, loading, roomUsersInfo }) => {
  const scrollRef = useRef(null);
  const { user } = useUserContext();

  useEffect(() => {
    if (!loading) {
      scrollRef.current.scrollIntoView({ behavior: "auto" });
    }
  }, [loading, messages]);

  if (loading) {
    return <div>Loading messages...</div>;
  }

  return (
    <div className={styles.messages}>
      {messages.map((msg) => {
        const isMyMessage = msg.senderId === user?.uid;

        const senderUser = roomUsersInfo.find(
          (user) => user.uid === msg.senderId
        );
        const displayName = senderUser?.name ?? msg.senderName ?? "名無し";

        return (
          <div
            key={msg.id}
            className={isMyMessage ? styles.myIcon : styles.receiveIcon}
          >
            {/*相手側のアイコン表示 */}
            {!isMyMessage && (
              <Avatar
                name={displayName}
                size="32"
                round={true}
                className={styles.avatar}
              />
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
