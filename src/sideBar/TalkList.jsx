import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  orderBy,
  query,
  getDocs,
  updateDoc,
  doc,
  arrayUnion,
  serverTimestamp,
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
  const [isCreating, setIsCreating] = useState(false);
  const [name, setName] = useState("");

  const navigate = useNavigate();

  const { user } = useUserContext();

  const addUsers = async (clickedRoomId) => {
    try {
      // ここでユーザーを追加する処理を実装
      const roomUsersRef = doc(db, "talkRoom", clickedRoomId);
      await updateDoc(roomUsersRef, {
        roomUsers: arrayUnion(user.uid),
        joinedAt: serverTimestamp(),
      });
      console.log(user.uid, "ユーザーをルームに追加しました");
      navigate(`/chat/room/${clickedRoomId}`);
    } catch (err) {
      console.error("ユーザー追加エラー ", err);
      setError("ユーザーの追加に失敗しました。");
    }
  };
  const createRoom = () => {
    setIsCreating(true);
  };

  const handleCreateRoom = async () => {
    try {
      const newRoomDoc = await addDoc(collection(db, "talkRoom"), {
        room: name.trim(),
        createdAt: serverTimestamp(),
        lastMessageAt: serverTimestamp(),
        roomUsers: [user.uid],
      });
      console.log("新しいトークルームを作成しました:", newRoomDoc.id);
      setName("");
      setIsCreating(false);
      navigate(`/chat/room/${newRoomDoc.id}`);
    } catch (error) {
      console.error("トークルーム作成エラー:", error);
      setError("トークルームの作成に失敗しました。");
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
      <div>
        <button onClick={createRoom}>新規作成</button>
        {isCreating && (
          <div>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
              placeholder="ルーム名"
            />
            <button onClick={() => handleCreateRoom()}>作成！</button>
          </div>
        )}
        {error && <div className={styles.errorMsg}>{error}</div>}
      </div>
    </div>
  );
};
