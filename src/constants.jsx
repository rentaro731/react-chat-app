export const LOGIN_INITIAL_VALUES = {
  email: "",
  password: "",
};

export const SIGNUP_INITIAL_VALUES = {
  name: "",
  email: "",
  password: "",
};

export const LOGIN_MESSAGE = {
  "auth/invalid-email": "無効なメールアドレスです。",
  "auth/user-not-found": "ユーザーが見つかりません。",
  "auth/wrong-password": "パスワードが間違っています。",
};

export const SIGNUP_MESSAGE = {
  "auth/email-already-in-use": "このメールアドレスは既に使用されています。",
  "auth/invalid-email": "無効なメールアドレスです。",
  "auth/weak-password": "パスワードは6文字以上で設定してください。",
};
