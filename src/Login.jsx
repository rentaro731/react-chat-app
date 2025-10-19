import { signInWithPopup, signOut } from "firebase/auth";
import { provider, auth } from "./firebaseConfig";

export const Login = () => {
  const logIn = () => {
    signInWithPopup(auth, provider).then((result) => {
      console.log(result.user);
    });
  };
  const logOutUser = () => {
    signOut(auth).then(() => {
      console.log("ログアウトしました");
    });
  };
  return (
    <div>
      <h1>Loginページです</h1>

      <button onClick={logIn}>グーグルでログイン</button>
      <button onClick={logOutUser}>ログアウト</button>
    </div>
  );
};
