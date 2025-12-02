import r from "./../.css/room.module.css";
import { useState } from "react";

export const Textarea = () => {
  // const [textValue, setTextValue] = useState([]);

  return (
    <div className={r.inputArea}>
      <form className={r.inputArea}>
        <input
          type="text"
          className={r.messageInput}
          placeholder="メッセージを入力"
        />
        <button className={r.sendBtn} type="submit">
          送信
        </button>
      </form>
    </div>
  );
};
