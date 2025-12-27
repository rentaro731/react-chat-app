import styles from "../css/room.module.css";
import { useEffect, useState } from "react";
import { collection, query, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Messages } from "./Messages";
import { Textarea } from "./Textarea";
import { useParams, useNavigate } from "react-router-dom";

export const RoomLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!roomId) return;
    if (!navigator.onLine) {
      setError("オフラインのため、メッセージを取得できません。");
      setLoading(false);
      return;
    }

    setLoading(true);
    setMessages([]);
    setError(null);

    const q = query(
      collection(db, "talkRoom", roomId, "messages"),
      orderBy("createdAt", "desc")
    );
    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const msgs = snapshot.docs.map((doc) => {
          return { id: doc.id, ...doc.data() };
        });
        setMessages(msgs.reverse());
        setLoading(false);
      },
      (err) => {
        console.error("受信エラー ", err);
        setError("メッセージの取得中にエラーが発生しました。");

        setLoading(false);
      }
    );
    return () => unsub();
  }, [roomId]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.returnBtn} onClick={() => navigate(-1)}>
          戻る
        </button>
        <h2 className={styles.roomTitle}>ルーム名</h2>
      </header>
      <main className={styles.main}>
        {error && <div style={{ color: "red" }}>{error}</div>}
        <Messages messages={messages} loading={loading} />
        <Textarea roomId={roomId} />
      </main>
    </div>
  );
};
