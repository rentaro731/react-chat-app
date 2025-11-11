import { auth, provider } from "./firebaseConfig";
import { signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { GOOGLE_LOGIN_ERROR_MESSAGE } from "../constants";

export const GoogleLogin = () => {
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const LoginWithGoogle = async () => {
    setSending(true);
    try {
      await signInWithPopup(auth, provider);
      navigate("/chat");
    } catch (error) {
      switch (error.code) {
        case "auth/popup-closed-by-user":
          setMessage(GOOGLE_LOGIN_ERROR_MESSAGE.POP_UP_CLOSED);
          break;
        case "auth/internal-error":
          setMessage(GOOGLE_LOGIN_ERROR_MESSAGE.NETWORK_REQUEST_FAILED);
          break;
        default:
          setMessage(GOOGLE_LOGIN_ERROR_MESSAGE.GOOGLE_LOGIN_FAILED);
      }
    }
    setSending(false);
  };
  return (
    <div>
      <button onClick={LoginWithGoogle} disabled={sending}>
        googleでログイン
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};
