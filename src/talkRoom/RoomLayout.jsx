import styles from "../css/room.module.css";
export const RoomLayout = () => {
  const { roomId } = useParams();
  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <button className={styles.returnBtn}>戻る</button>
        <h2 className={styles.roomTitle}>ルーム名</h2>
      </header>
      <main className={styles.main}>
        <div className={styles.messages}>
          {/* メッセージ表示エリア */}
          <div className={styles.message}>メッセージ1</div>
        </div>
        <Textarea roomId={roomId} />
      </main>
    </div>
  );
};
