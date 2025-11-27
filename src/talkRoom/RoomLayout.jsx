import styles from "./../.css/room.module.css";
export const RoomLayout = () => {
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
        <div className={styles.inputArea}>
          {/* メッセージ入力エリア */}
          <input
            type="text"
            className={styles.messageInput}
            placeholder="メッセージを入力"
          />
          <button className={styles.sendBtn}>送信</button>
        </div>
      </main>
    </div>
  );
};
