import r from "./../.css/room.module.css";
import { Messages } from "./Messages";
import { Textarea } from "./Textarea";
import { useParams, useNavigate } from "react-router-dom";

export const RoomLayout = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  return (
    <div className={r.container}>
      <header className={r.header}>
        <button className={r.returnBtn} onClick={() => navigate(-1)}>
          戻る
        </button>
        <h2 className={r.roomTitle}>ルーム名</h2>
      </header>
      <main className={r.main}>
        <Messages />
        <Textarea />
      </main>
    </div>
  );
};
