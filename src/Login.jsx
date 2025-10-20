import {
  signInWithPopup,
  signOut,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { provider, auth } from "./firebaseConfig";
import { useState } from "react";
import { LOGIN_INITIAL_VALUES, LOGIN_MESSAGE } from "./constants";

export const Login = () => {
  const [formValues, setFormValues] = useState(LOGIN_INITIAL_VALUES);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //値の取得
  const inputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValue) => ({ ...prevValue, [name]: value }));
  };
  //メールアドレス・パスワードログイン
  const onLogin = async (e) => {
    e.preventDefault();
    setMessage("");
    setSending(true);
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );
      console.log("Signed in user:", credential.user);
      setFormValues(LOGIN_INITIAL_VALUES);
      setMessage("ログインに成功しました");
    } catch (error) {
      const msg = LOGIN_MESSAGE;
      setMessage(
        msg[error.code] ?? "ログインに失敗しました。もう一度お試しください。"
      );
    } finally {
      setSending(false);
    }
  };
  //パズワード表示・非表示切り替え
  const toggleShowPassword = () => {
    setShowPassword((display) => !display);
  };
  //googleログイン
  const logIn = () => {
    signInWithPopup(auth, provider).then((result) => {
      console.log(result.user);
      setMessage("ログインに成功しました");
    });
  };
  //ログアウト
  const logOutUser = () => {
    signOut(auth).then(() => {
      console.log("ログアウトしました");
      setMessage("ログアウトしました");
    });
  };
  return (
    <div>
      <h1>Loginページです</h1>
      <hr />
      <form onSubmit={onLogin}>
        <div>
          <label>メールアドレス</label>
          <input
            type="email"
            placeholder="google@gmail.com"
            name="email"
            value={formValues.email}
            onChange={inputChange}
            required
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="パスワード"
            name="password"
            value={formValues.password}
            onChange={inputChange}
            required
          />
          <button type="button" onClick={toggleShowPassword}>
            {showPassword ? "非表示" : "表示"}
          </button>
        </div>
        <div>
          <button type="submit" disabled={sending}>
            ログイン
          </button>
        </div>
      </form>
      <div>
        <button onClick={logIn}>グーグルでログイン</button>
        <button onClick={logOutUser}>ログアウト</button>
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};
