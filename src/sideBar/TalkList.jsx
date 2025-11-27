import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "./../.css/talkList.module.css";
import { formatTime } from "../../Time";

export const TalkList = () => {
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // トークルームのリアルタイム取得
  useEffect(() => {
    setLoading(true);
    const q = query(
      collection(db, "talkRoom"),
      orderBy("createdAt", "desc"),
      limit(500)
    );
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const newArr = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() ?? null,
        }));
        setRoom(newArr);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching talk rooms: ", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);
  // ロード中およびトークルームがない場合の表示
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!room.length) {
    return <div>トークルームがありません</div>;
  }
  return (
    // トークルームリストの表示
    <div className={styles.container}>
      <div className={styles.searchBox}>
        <input
          className={styles.searchInput}
          type="text"
          placeholder="トークルームとメッセージ検索"
        />
      </div>
      <ul>
        {room.map((talkRoom) => (
          <li
            className={styles.li}
            key={talkRoom.id}
            onClick={() => navigate(`/chat/room/${talkRoom.id}`)}
          >
            <div>{talkRoom.room}</div>
            <small>{formatTime(talkRoom.createdAt)}</small>
          </li>
        ))}
      </ul>
    </div>
  );
};
