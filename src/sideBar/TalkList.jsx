import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  orderBy,
  query,
  getDocs,
  serverTimestamp,
  Timestamp,
  addDoc,
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
  const [isOpenCreateRoomForm, setIsOpenCreateRoomForm] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const { user } = useUserContext();

  const toggleCreateRoomForm = async () => {
    setIsOpenCreateRoomForm((prev) => !prev);
  };

  const handleCreateRoom = async (e) => {
    e.preventDefault();
    const roomName = name.trim();
    if (!roomName) {
      setError("ルーム名を入力してください。");
      return;
    }
    try {
      const newRoomDoc = await addDoc(collection(db, "talkRoom"), {
        room: roomName,
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        roomUsers: [
          {
            userId: user.uid,
            isEntry: true,
            joinedAt: Timestamp.now(),
          },
        ],
        updatedAt: serverTimestamp(),
      });
      setName("");
      setIsOpenCreateRoomForm(false);
      alert(`${roomName}でトークルームを作成しました`);
      navigate(`/chat/room/${newRoomDoc.id}`);
    } catch (error) {
      console.error("トークルーム作成エラー:", error);
      setError("トークルームの作成に失敗しました。");
      setIsOpenCreateRoomForm(false);
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
      <div>
        <button onClick={toggleCreateRoomForm}>新規作成</button>
        {isOpenCreateRoomForm && (
          <form onSubmit={handleCreateRoom}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="ルーム名"
            />
            <button type="submit">作成！</button>
          </form>
        )}
        {error && <div className={styles.errorMsg}>{error}</div>}
      </div>
    </div>
  );
};
