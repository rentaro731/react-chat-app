import styles from "../css/room.module.css";
import { useEffect, useRef, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  doc,
  getDoc,
  serverTimestamp,
  Timestamp,
  runTransaction,
  where,
  documentId,
  getDocs,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import { Messages } from "./Messages";
import { Textarea } from "./Textarea";
import { useParams, Link } from "react-router-dom";
import { CHAT_ERROR_MESSAGES } from "../../constants.jsx";
import { useUserContext } from "../UserContext";

export const RoomLayout = () => {
  const { roomId } = useParams();
  const { user } = useUserContext();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [roomUserList, setRoomUserList] = useState([]);

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

        // ルームユーザーを取得
        const usersQuery = query(
          collection(db, "users"),
          where(
            documentId(),
            "in",
            roomSnap.data()?.roomUsers?.map((u) => u.userId) || []
          )
        );
        const usersSnap = await getDocs(usersQuery);
        const usersDoc = usersSnap.docs.map((doc) => ({
          uid: doc.id,
          ...doc.data(),
        }));
        setRoomUserList(usersDoc);

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

  const exitRoom = async () => {
    try {
      if (!user?.uid) return;
      const roomRef = doc(db, "talkRoom", roomId);

      await runTransaction(db, async (transaction) => {
        const roomDoc = await transaction.get(roomRef);
        if (!roomDoc.exists()) {
          throw "ルームが存在しません";
        }
        const roomData = roomDoc.data();
        const roomUsers = Array.isArray(roomData.roomUsers)
          ? roomData.roomUsers
          : [];
        const updatedRoomUsers = roomUsers.map((roomUser) => {
          if (roomUser.userId === user.uid) {
            return {
              ...roomUser,
              isEntry: false,
              exitedAt: Timestamp.now(),
            };
          }
          return roomUser;
        });

        transaction.update(roomRef, {
          roomUsers: updatedRoomUsers,
          updatedAt: serverTimestamp(),
        });
      });
    } catch (error) {
      console.error("ルーム退出エラー ", error);
    }
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <Link
          to="/chat/talklist"
          className={styles.returnBtn}
          onClick={() => exitRoom()}
        >
          戻る
        </Link>
        <h2 className={styles.roomTitle}>{roomTitle}</h2>
      </header>
      <main className={styles.main}>
        {error && <div className={styles.errorMsg}>{error}</div>}
        <Messages
          messages={messages}
          loading={loading}
          roomUserList={roomUserList}
        />
        <Textarea roomId={roomId} />
      </main>
    </div>
  );
};
