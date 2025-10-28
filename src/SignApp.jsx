import { useState } from "react";
import { db, auth } from "./firebaseConfig";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import {
  SIGNUP_INITIAL_VALUES,
  SIGNUP_MESSAGE,
  VALIDATE_SIGN_APP,
} from "../constants";
import { useNavigate } from "react-router-dom";

export const SignApp = () => {
  const [formValues, setFormValues] = useState(SIGNUP_INITIAL_VALUES);
  const [formErrors, setFormErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };
  //Firebase Authenticationでユーザー登録
  const onSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = VALIDATE_SIGN_APP(formValues);
    if (Object.keys(validationErrors).length > 0) {
      setFormErrors(validationErrors);
      setMessage("");
      return;
    }
    setFormErrors({});
    setSending(true);

    try {
      const authRes = await createUserWithEmailAndPassword(
        auth,
        formValues.email,
        formValues.password
      );

      const uid = authRes.user.uid;

      //Firestoreにユーザー情報を保存
      await setDoc(doc(db, "users", uid), {
        name: formValues.username,
        email: formValues.email,
        createdAt: serverTimestamp(),
      });
      setFormValues(SIGNUP_INITIAL_VALUES);
      setMessage("登録が完了しました。");
      navigate("/login");
    } catch (error) {
      const errorMsg = SIGNUP_MESSAGE;
      setMessage(
        errorMsg[error.code] ?? "登録に失敗しました。再度お試しください。"
      );
    } finally {
      setSending(false);
    }
  };
  const togglePassword = () => {
    setShowPassword((display) => !display);
  };

  return (
    <div>
      <h1>登録フォーム</h1>
      <hr />
      <form onSubmit={onSubmit} noValidate>
        <label htmlFor="username">ユーザー名</label>
        <input
          type="text"
          name="username"
          placeholder="ユーザー名"
          value={formValues.username}
          onChange={handleChange}
        />
        <p>{formErrors.username}</p>
        <br />
        <label htmlFor="email">メールアドレス</label>
        <input
          type="email"
          name="email"
          placeholder="@gmail.com"
          value={formValues.email}
          onChange={handleChange}
        />
        <p>{formErrors.email}</p>
        <br />
        <label htmlFor="password">パスワード</label>
        <input
          type={showPassword ? "text" : "password"}
          name="password"
          placeholder="パスワード"
          value={formValues.password}
          onChange={handleChange}
        />
        <button type="button" onClick={togglePassword}>
          {showPassword ? "非表示" : "表示"}
        </button>
        <p>{formErrors.password}</p>
        <br />
        <button type="submit" disabled={sending}>
          登録
        </button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};
