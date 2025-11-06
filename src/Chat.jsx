import { signOut } from "firebase/auth";
import { auth } from "./firebaseConfig";
import { useNavigate } from "react-router-dom";

export const Chat = () => {
  const navigate = useNavigate();
  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log("ログアウト失敗", error);
    }
  };
  return (
    <div>
      <h1>チャットページ</h1>
      <button onClick={logOut}>ログアウト</button>
    </div>
  );
};
