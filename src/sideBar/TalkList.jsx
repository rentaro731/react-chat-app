import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  orderBy,
  query,
  getDocs,
  Timestamp,
  runTransaction,
  doc,
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
    if (!navigator.onLine) {
      alert("オフラインのため、トークルームに参加できません。");
      return;
    }

    try {
      await runTransaction(db, async (transaction) => {
        const roomRef = doc(db, "talkRoom", clickedRoomId);
        const roomDoc = await transaction.get(roomRef);
        if (!roomDoc.exists()) {
          throw new Error("ルームが存在しません");
        }
        const roomData = roomDoc.data();
        const roomUsers = Array.isArray(roomData.roomUsers)
          ? roomData.roomUsers
          : [];
        const exists = roomUsers.find((u) => u.userId === user.uid);

        const entryRoomUsers = exists
          ? roomUsers.map((u) =>
              u.userId === user.uid
                ? { ...u, isEntry: true, joinedAt: Timestamp.now() }
                : u
            )
          : [
              ...roomUsers,
              { userId: user.uid, isEntry: true, joinedAt: Timestamp.now() },
            ];

        transaction.update(roomRef, {
          roomUsers: entryRoomUsers,
          updatedAt: serverTimestamp(),
        });
        console.log(
          roomRef,
          {
            roomUsers: entryRoomUsers,
            updatedAt: serverTimestamp(),
          },
          "ユーザーをルームに追加しました"
        );
      });
      navigate(`/chat/room/${clickedRoomId}`);
    } catch (error) {
      console.error("ユーザー追加エラー: ", error);
      setError("ユーザーの追加に失敗しました。");
    }
  };

  const createRoom = async () => {
    setIsCreating((prev) => !prev);
  };

  const handleCreateRoom = async () => {
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
      setIsCreating(false);
      alert(`${roomName}でトークルームを作成しました`);
      navigate(`/chat/room/${newRoomDoc.id}`);
    } catch (error) {
      console.error("トークルーム作成エラー:", error);
      setError("トークルームの作成に失敗しました。");
      setIsCreating(false);
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
