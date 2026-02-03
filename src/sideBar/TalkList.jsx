import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  orderBy,
  query,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "../css/talklist.module.css";
import { formatTime } from "../utils/dateFormatter";
import { FaUserCircle } from "react-icons/fa";
import { useUserContext } from "../UserContext";

export const TalkList = () => {
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const { user } = useUserContext();

  const addUsers = async (clickedRoomId) => {
    if (!user) {
      return navigate("/login");
    }
    if (!navigator.onLine) {
      alert("オフラインのため、トークルームに参加できません。");
      return;
    }

    try {
      const roomUsersRef = doc(db, "talkRoom", clickedRoomId);
      await updateDoc(roomUsersRef, {
        roomUsers: arrayUnion(user.uid),
        updatedAt: serverTimestamp(),
      });
      console.log(
        roomUsersRef,
        {
          roomUsers: arrayUnion(user.uid),
          updatedAt: serverTimestamp(),
        },
        "ユーザーがトークルームに追加されました"
      );
      navigate(`/chat/room/${clickedRoomId}`);
    } catch (error) {
      console.error("ユーザー追加エラー: ", error);
      setError("ユーザーの追加に失敗しました。");
    }
  };

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
            onClick={() => addUsers(talkRoom.id)}
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
      {error && <div className={styles.errorMsg}>{error}</div>}
    </div>
  );
};
