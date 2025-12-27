import { addDoc, collection, doc, serverTimestamp } from "firebase/firestore";
import styles from "../css/room.module.css";
import { use, useState } from "react";
import { useUserContext } from "../UserContext";
import { db } from "../firebaseConfig";

const DEFAULT_ICON = "default-avatar";

export const Textarea = ({ roomId }) => {
  const [text, setText] = useState("");
  const [error, setError] = useState(null);
  const { user } = useUserContext();

  const handleSubmit = async (e) => {
    if (!user?.uid) {
      alert("ログインしてください");
      return;
    }
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
      const docRef = await addDoc(
        collection(db, "talkRoom", roomId, "messages"),
        {
          text: trimedText,
          createdAt: serverTimestamp(),
          senderId: user?.uid,
          icon: user?.icon ?? DEFAULT_ICON,
        }
      );
      console.log("メッセージ送信成功", {
        FireBaseService: "Firestore",
        collectionPath: `talkRoom/${roomId}/messages`,
        Data: {
          docId: docRef.id,
          text: trimedText,
          senderId: user?.uid,
          icon: user?.icon ?? DEFAULT_ICON,
        },
      });
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
