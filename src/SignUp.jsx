import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { setDoc, doc, serverTimestamp } from "firebase/firestore";
import { SIGNUP_INITIAL_VALUES, SIGNUP_MESSAGE } from "./constants";

export const SignUp = () => {
  const [formValues, setFormValues] = useState(SIGNUP_INITIAL_VALUES);
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  //　入力欄の値を取得
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValue) => ({ ...prevValue, [name]: value }));
  };
  // authにユーザー登録を行い、Firestoreにユーザー情報を保存
  const onSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setSending(true);
    try {
      const authRes = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );
      const uid = authRes.user.uid;
      await setDoc(doc(db, "users", uid), {
        name: formValues.name,
        email: formValues.email,
        createdAt: serverTimestamp(),
      });
      setFormValues(SIGNUP_INITIAL_VALUES);
      setMessage("登録が完了しました");
    } catch (error) {
      const msg = SIGNUP_MESSAGE;
      setMessage(
        msg[error.code] ?? "登録に失敗しました。もう一度お試しください。"
      );
    } finally {
      setSending(false);
    }
  };
  // パスワードの表示・非表示を切り替える
  const toggleShowPassword = () => {
    setShowPassword((display) => !display);
  };

  return (
    <div className="form-group">
      <form onSubmit={onSubmit}>
        <h1>ユーザー登録</h1>
        <hr />
        <div className="input-group">
          <div className="input-field">
            <label>ユーザー名</label>
            <input
              type="text"
              placeholder="ユーザー名"
              value={formValues.name}
              name="name"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label>メールアドレス</label>
            <input
              type="email"
              placeholder="メールアドレス"
              value={formValues.email}
              name="email"
              onChange={handleChange}
              required
            />
          </div>
          <div className="input-field">
            <label>パスワード</label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="パスワード"
              value={formValues.password}
              name="password"
              onChange={handleChange}
              required
            />
            <button type="button" onClick={toggleShowPassword}>
              {showPassword ? "非表示" : "表示"}
            </button>
          </div>
          <div className="input-field">
            <button type="submit" disabled={sending}>
              登録
            </button>
          </div>
          {message && <p>{message}</p>}
        </div>
      </form>
    </div>
  );
};
