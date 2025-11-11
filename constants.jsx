export const SIGNUP_INITIAL_VALUES = {
  username: "",
  email: "",
  password: "",
};
export const LOGIN_INITIAL_VALUES = {
  email: "",
  password: "",
};

// 入力値のバリデーションチェック及びエラーメッセージ
export const VALIDATE_MESSAGE = {
  USERNAME_REQUIRED: "ユーザー名を入力してください",

  EMAIL_REQUIRED: "メールアドレスを入力してください",

  EMAIL_MESSAGE_AT: "@を使用してください",

  EMAIL_MESSAGE_CORRECT: "正しいメールアドレスを入力してください",

  PASSWORD_REQUIRED: "パスワードを入力してください",

  PASSWORD_NUMBER_LIMIT: "パスワードは6文字以上15文字以下で設定してください",

  EMAIL_MESSAGE_SERVER_ERROR: "登録に失敗しました。再度お試しください。",

  EMAIL_MESSAGE_INVALID: "無効なメールアドレスです。",

  WRONG_PASSWORD: "メールアドレスまたはパスワードが間違っています。",

  LOGIN_FAILED: "ログインに失敗しました。再度お試しください。",
};

export const GOOGLE_LOGIN_ERROR_MESSAGE = {
  POP_UP_CLOSED: "ポップアップを閉じました。",
  NETWORK_REQUEST_FAILED: "ネットワークエラーです。接続を確認してください。",
  GOOGLE_LOGIN_FAILED: "ログインに失敗しました。再度お試しください。",
};
