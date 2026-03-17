import {
  addDoc,
  getDoc,
  collection,
  doc,
  serverTimestamp,
  setDoc,
} from "firebase/firestore";
import styles from "../css/room.module.css";
import { useState } from "react";
import { useUserContext } from "../UserContext";
import { db } from "../firebaseConfig";

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
          senderName: user?.name || "名無し",
        }
      );
      await setDoc(
        doc(db, "talkRoom", roomId),
        {
          lastMessageAt: serverTimestamp(),
        },
        { merge: true }
      );

      setText("");
    } catch (error) {
      console.error("Error sending message: ", error);
      setError("メッセージの送信に失敗しました。");
    }
  };

  return (
    <div className={styles.inputArea}>
      {error && <div className={styles.errorMsg}>{error}</div>}
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
