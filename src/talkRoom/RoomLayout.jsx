import styles from "../css/room.module.css";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  updateDoc,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  getDocs,
  arrayRemove,
  where,
  documentId,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Messages } from "./Messages";
import { Textarea } from "./Textarea";
import { useParams, useNavigate } from "react-router-dom";
import { CHAT_ERROR_MESSAGES } from "../../constants.jsx";
import { useUserContext } from "../UserContext";

export const RoomLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { user } = useUserContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomUsersInfo, setRoomUsersInfo] = useState([]);

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

  const exitRoom = async () => {
    try {
      if (!user?.uid) return;
      const roomRef = doc(db, "talkRoom", roomId);

      await updateDoc(roomRef, {
        roomUsers: arrayRemove(user.uid),
      });
      console.log("ルームから退出しました");

      navigate(-1);
    } catch (err) {
      console.error("ルーム退出エラー ", err);
    }
  };

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

        // ルームユーザーを取得
        const usersQuery = query(
          collection(db, "users"),
          where(documentId(), "in", roomSnap.data()?.roomUsers || [])
        );
        const usersSnap = await getDocs(usersQuery);
        const usersDoc = usersSnap.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setRoomUsersInfo(usersDoc);
        console.log("ルームユーザー情報:", usersDoc);

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
        <button className={styles.returnBtn} onClick={() => exitRoom()}>
          戻る
        </button>
        <h2 className={styles.roomTitle}>ルーム名</h2>
      </header>
      <main className={styles.main}>
        {error && <div className={styles.errorMsg}>{error}</div>}
        <Messages
          messages={messages}
          loading={loading}
          roomUsersInfo={roomUsersInfo}
        />
        <Textarea roomId={roomId} />
      </main>
    </div>
  );
};
