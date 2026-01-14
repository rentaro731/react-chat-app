import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, orderBy, query, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "../css/talklist.module.css";
import { formatTime } from "../utils/dateFormatter";
import { FaUserCircle } from "react-icons/fa";

export const TalkList = () => {
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  //初回データ取得
  useEffect(() => {
    const fetchTalkRooms = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "talkRoom"),
          orderBy("lastMessageAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const newArr = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          lastMessageAt: doc.data().lastMessageAt?.toDate?.() ?? null,
          createdAt: doc.data().createdAt?.toDate?.() ?? null,
        }));
        setRoom(newArr);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching talk rooms: ", error);
        setLoading(false);
      }
    };
    fetchTalkRooms();
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
            <div className={styles.roomItem}>
              <FaUserCircle size={32} />
              <div className={styles.roomInfo}>
                {talkRoom.room}
                <small>
                  {formatTime(talkRoom.lastMessageAt ?? talkRoom.createdAt)}
                </small>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
