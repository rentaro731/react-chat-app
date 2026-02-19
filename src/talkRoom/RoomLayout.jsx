import styles from "../css/room.module.css";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Messages } from "./Messages";
import { Textarea } from "./Textarea";
import { useParams, useNavigate } from "react-router-dom";
import { CHAT_ERROR_MESSAGES } from "../../constants.jsx";

export const RoomLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomTitle, setRoomTitle] = useState("");

  const errorHandler = (err) => {
    const code = err?.code || "";
    if (code.includes("permission-denied")) {
      return CHAT_ERROR_MESSAGES.PERMISSION_DENIED;
    }
    if (code.includes("unavailable") || code.includes("network")) {
      return CHAT_ERROR_MESSAGES.NETWORK_ERROR;
    }
    if (code.includes("not-found")) {
      return CHAT_ERROR_MESSAGES.NOT_FOUND;
    }
    if (code.includes("unknown")) {
      return CHAT_ERROR_MESSAGES.UNKNOWN_ERROR;
    }
    return CHAT_ERROR_MESSAGES.UNKNOWN_ERROR;
  };

  const unsubscribeRef = useRef(null);
  useEffect(() => {
    if (!roomId) return;

    setLoading(true);
    setMessages([]);
    setError(null);

    const fetchRoom = async () => {
      try {
        if (unsubscribeRef.current) {
          unsubscribeRef.current();
          unsubscribeRef.current = null;
        }
        // ルームドキュメントが存在するかチェック
        const roomRef = doc(db, "talkRoom", roomId);
        const roomSnap = await getDoc(roomRef);

        if (!roomSnap.exists()) {
          setError(CHAT_ERROR_MESSAGES.NOT_FOUND);
          setLoading(false);
          return;
        }

        const roomData = roomSnap.data();
        const roomName = roomData.room;
        setRoomTitle(roomName);

        if (!roomData || !roomData.room) {
          setError(CHAT_ERROR_MESSAGES.NOT_FOUND);
          setLoading(false);
          return;
        }

        const q = query(
          collection(db, "talkRoom", roomId, "messages"),
          orderBy("createdAt", "desc")
        );
        unsubscribeRef.current = onSnapshot(
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
            setError(errorHandler(err));

            setLoading(false);
          }
        );
      } catch (err) {
        console.error("ルーム取得エラー ", err);
        setError(errorHandler(err));
        setLoading(false);
      }
    };
    fetchRoom();
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
        unsubscribeRef.current = null;
      }
    };
  }, [roomId]);

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.returnBtn} onClick={() => navigate(-1)}>
          戻る
        </button>
        <h2 className={styles.roomTitle}>{roomTitle}</h2>
      </header>
      <main className={styles.main}>
        {error && <div className={styles.errorMsg}>{error}</div>}
        <Messages messages={messages} loading={loading} />
        <Textarea roomId={roomId} />
      </main>
    </div>
  );
};
