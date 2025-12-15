import styles from "../css/room.module.css";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  limit,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Messages } from "./Messages";
import { Textarea } from "./Textarea";
import { useParams, useNavigate } from "react-router-dom";

const MSG_LIMIT = 20;

export const RoomLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    setMessages([]);

    const q = query(
      collection(db, "talkRoom", roomId, "messages"),
      orderBy("createdAt", "desc"),
      limit(MSG_LIMIT)
    );
    const unsub = onSnapshot(q, (snapshot) => {
      console.log(snapshot.docs);
      const msgs = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setMessages(msgs.reverse());
      setLoading(false);
    });
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
        <Messages messages={messages} loading={loading} />
        <Textarea roomId={roomId} />
      </main>
    </div>
  );
};
