import { auth, provider } from "./firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const GoogleLogin = () => {
  const navigate = useNavigate();
  const LoginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, provider);
      navigate("/chat");
    } catch (error) {
      console.log("Googleログイン失敗", error);
    }
  };
  return (
    <div>
      <button onClick={LoginWithGoogle}>googleでログイン</button>
    </div>
  );
};
