export const SIGNUP_INITIAL_VALUES = {
  username: "",
  email: "",
  password: "",
};

export const SIGNUP_MESSAGE = {
  "auth/email-already-in-use": "登録に失敗しました。再度お試しください。",
  "auth/invalid-email": "無効なメールアドレスです。",
};

export const VALIDATE_SIGN_APP = (values) => {
  const errors = {};
  const regex =
    /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;
  if (!values.username) {
    errors.username = "ユーザー名を入力してください";
  }
  if (!values.email) {
    errors.email = "メールアドレスを入力してください";
  } else if (!values.email.includes("@")) {
    errors.email = "@を使用してください";
  } else if (!regex.test(values.email)) {
    errors.email = "正しいメールアドレスを入力してください";
  }
  if (!values.password) {
    errors.password = "パスワードを入力してください";
  } else if (values.password.length < 6) {
    errors.password = "パスワードは6文字以上15文字以下で設定してください";
  } else if (values.password.length > 15) {
    errors.password = "パスワードは15文字以下で設定してください";
  }
  return errors;
};
