import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  limit,
  orderBy,
  query,
  getDocs,
  startAfter,
} from "firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "../css/talkList.module.css";
import { formatTime } from "../utils/dateFormatter";

export const TalkList = () => {
  const [room, setRoom] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastRoomDoc, setLastRoomDoc] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const navigate = useNavigate();

  // TODO: 無限スクロールorページネーションの実装,getDocsに変更
  //初回データ取得
  useEffect(() => {
    const fetchTalkRooms = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "talkRoom"),
          orderBy("createdAt", "desc"),
          limit(25)
        );
        const querySnapshot = await getDocs(q);
        const newArr = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate?.() ?? null,
        }));
        setRoom(newArr);
        //最後のドキュメントをセット
        const lastRoom =
          querySnapshot.docs[querySnapshot.docs.length - 1] || null;
        setLastRoomDoc(lastRoom);
        if (querySnapshot.docs.length < 25) {
          setHasMore(false);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching talk rooms: ", error);
        setLoading(false);
      }
    };
    fetchTalkRooms();
  }, []);
  //次のデータを取得
  const loadMoreRooms = async () => {
    if (!hasMore || !lastRoomDoc) return;
    setLoading(true);
    try {
      const q = query(
        collection(db, "talkRoom"),
        orderBy("createdAt", "desc"),
        startAfter(lastRoomDoc),
        limit(25)
      );
      const querySnapshot = await getDocs(q);
      const newArr = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate?.() ?? null,
      }));
      //既存の配列に追加
      setRoom((prevRooms) => [...prevRooms, ...newArr]);

      //最後のドキュメントを更新
      const lastRoom =
        querySnapshot.docs[querySnapshot.docs.length - 1] || null;
      setLastRoomDoc(lastRoom);
      if (querySnapshot.docs.length < 25) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more talk rooms: ", error);
    } finally {
      setLoading(false);
    }
  };
  // スクロールイベントハンドラ
  const handleScroll = (e) => {
    const { scrollTop, scrollHeight, clientHeight } = e.target;
    if (scrollTop + clientHeight >= scrollHeight - 10) {
      loadMoreRooms();
    }
  };

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
      <div onScroll={handleScroll}>{loading && <div>Loading more...</div>}</div>
    </div>
  );
};
