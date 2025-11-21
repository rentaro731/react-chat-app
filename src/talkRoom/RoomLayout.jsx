import r from "./../.css/room.module.css";
export const RoomLayout = () => {
  return (
    <div className={r.container}>
      <header className={r.header}>
        <button className={r.returnBtn}>戻る</button>
        <h2 className={r.roomTitle}>ルーム名</h2>
      </header>
      <main className={r.main}>
        <div className={r.messages}>
          {/* メッセージ表示エリア */}
          <div className={r.message}>メッセージ1</div>
        </div>
        <div className={r.inputArea}>
          {/* メッセージ入力エリア */}
          <input
            type="text"
            className={r.messageInput}
            placeholder="メッセージを入力"
          />
          <button className={r.sendBtn}>送信</button>
        </div>
      </main>
    </div>
  );
};
