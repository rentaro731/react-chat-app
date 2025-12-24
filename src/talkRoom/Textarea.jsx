import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import styles from "../css/room.module.css";
import { useState } from "react";
import { useUserContext } from "../UserContext";
import { db } from "../firebaseConfig";

export const Textarea = ({ roomId }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const { user } = useUserContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const trimedText = text.trim();
    if (!trimedText) return;
    if (!roomId) return;
    // Firestoreにメッセージを追加するロジックをここに実装

    if (!navigator.onLine) {
      alert("オフラインのため、メッセージを送信できません。");
      return;
    }
    try {
      await addDoc(collection(db, "talkRoom", roomId, "messages"), {
        text: trimedText,
        createdAt: serverTimestamp(),
        senderId: user?.uid ?? "guest",
        icon: user?.icon ?? "photoURL", // 仮のアイコンURL
      });
      console.log("メッセージ送信成功");
      setText("");
    } catch (error) {
      console.error("Error sending message: ", error);
      setError("メッセージの送信に失敗しました。");
    }
  };

  return (
    <div className={styles.inputArea}>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <form className={styles.inputArea} onSubmit={handleSubmit}>
        <input
          type="text"
          className={styles.messageInput}
          placeholder="メッセージを入力"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button className={styles.sendBtn} type="submit">
          送信
        </button>
      </form>
    </div>
  );
};
