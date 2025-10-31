import { useState } from "react";
import { auth } from "./firebaseConfig";
import { LOGIN_INITIAL_VALUES, VALIDATE_MESSAGE } from "../constants";
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
    const regex =
      /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
    if (!values.email) {
      errors.email = VALIDATE_MESSAGE.EMAIL_REQUIRED;
    } else if (!values.email.includes("@")) {
      errors.email = VALIDATE_MESSAGE.EMAIL_MESSAGE_AT;
    } else if (!regex.test(values.email)) {
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
        setMessage(VALIDATE_MESSAGE.WRONG_PASSWORD);
      } else if (error.code === "auth/invalid-email") {
        setMessage(VALIDATE_MESSAGE.EMAIL_MESSAGE_INVALID);
      } else if (error.code === "auth/invalid-credential") {
        setMessage(VALIDATE_MESSAGE.WRONG_PASSWORD);
      } else {
        setMessage(VALIDATE_MESSAGE.LOGIN_FAILED);
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
