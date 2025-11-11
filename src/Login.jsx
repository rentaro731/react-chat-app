import { useState } from "react";
import { auth } from "./firebaseConfig";
import {
  LOGIN_INITIAL_VALUES,
  VALIDATE_MESSAGE,
  FETCH_AUTH_ERROR,
  REGEX,
} from "../constants";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Login = () => {
  const [inputValues, setInputValues] = useState(LOGIN_INITIAL_VALUES);
  const [sending, setSending] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [inputErrors, setInputErrors] = useState({});
  const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setInputValues((prevValue) => ({
      ...prevValue,
      [name]: value,
    }));
  };
  //バリデーションチェック
  const validateLogin = (values) => {
    const errors = {};
    if (!values.email) {
      errors.email = VALIDATE_MESSAGE.EMAIL_REQUIRED;
    }
    if (!values.email.includes("@")) {
      errors.email = VALIDATE_MESSAGE.EMAIL_MESSAGE_AT;
    }
    if (!REGEX.test(values.email)) {
      errors.email = VALIDATE_MESSAGE.EMAIL_MESSAGE_CORRECT;
    }
    if (!values.password) {
      errors.password = VALIDATE_MESSAGE.PASSWORD_REQUIRED;
    }
    return errors;
  };

  //Firebase Authenticationでログイン
  const onLogin = async (e) => {
    e.preventDefault();
    const validationErrors = validateLogin(inputValues);
    if (Object.keys(validationErrors).length > 0) {
      setInputErrors(validationErrors);
      setMessage("");
      return;
    }
    setSending(true);
    setMessage("");
    try {
      const credential = await signInWithEmailAndPassword(
        auth,
        inputValues.email,
        inputValues.password
      );
      console.log("Signed in user:", credential.user);
      setInputValues(LOGIN_INITIAL_VALUES);
      setInputErrors({});
      setMessage("ログインに成功しました。");
      navigate("/chat");
    } catch (error) {
      if (error.code === "auth/wrong-password") {
        setMessage(FETCH_AUTH_ERROR.WRONG_PASSWORD);
      }
      if (error.code === "auth/invalid-credential") {
        setMessage(FETCH_AUTH_ERROR.WRONG_PASSWORD);
      } else {
        setMessage(FETCH_AUTH_ERROR.LOGIN_FAILED);
      }
    } finally {
      setSending(false);
    }
  };
  const toggleShowPassword = () => {
    setShowPassword((prevShowPassword) => !prevShowPassword);
  };

  return (
    <div>
      <h1>ログイン</h1>
      <form onSubmit={onLogin}>
        <div>
          <label htmlFor="email">メールアドレス</label>
          <input
            type="text"
            placeholder="メールアドレス"
            name="email"
            id="email"
            value={inputValues.email}
            onChange={handleChange}
          />
          <p>{inputErrors.email}</p>
        </div>
        <div>
          <label htmlFor="password">パスワード</label>
          <input
            type={showPassword ? "text" : "password"}
            placeholder="パスワード"
            name="password"
            id="password"
            value={inputValues.password}
            onChange={handleChange}
          />
          <button onClick={toggleShowPassword} type="button">
            {showPassword ? "非表示" : "表示"}
          </button>
          <p>{inputErrors.password}</p>
        </div>
        <button type="submit" disabled={sending}>
          ログイン
        </button>
        {message && <p>{message}</p>}
      </form>
    </div>
  );
};
