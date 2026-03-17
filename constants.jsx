// サインアップ・ログイン時のエラー系
export const SIGNUP_INITIAL_VALUES = {
  username: "",
  email: "",
  password: "",
};
export const LOGIN_INITIAL_VALUES = {
  email: "",
  password: "",
};

// 入力値のバリデーションチェックメッセージ
export const VALIDATE_MESSAGE = {
  USERNAME_REQUIRED: "ユーザー名を入力してください",

  EMAIL_REQUIRED: "メールアドレスを入力してください",

  EMAIL_MESSAGE_AT: "@を使用してください",

  EMAIL_MESSAGE_CORRECT: "正しいメールアドレスを入力してください",

  PASSWORD_REQUIRED: "パスワードを入力してください",

  PASSWORD_NUMBER_LIMIT: "パスワードは6文字以上15文字以下で設定してください",
};

export const AUTHENTICATION_ERROR = {
  EMAIL_MESSAGE_SERVER_ERROR: "登録に失敗しました。再度お試しください。",

  WRONG_PASSWORD: "メールアドレスまたはパスワードが間違っています。",

  LOGIN_FAILED: "ログインに失敗しました。再度お試しください。",
};
export const REGEX =
  /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/;

// RoomLayout： ここからチャットメッセージ取得エラー系
export const CHAT_ERROR_MESSAGES = {
  PERMISSION_DENIED:
    "メッセージの取得権限がありません。ログイン状態を確認してください。",

  NETWORK_ERROR:
    "ネットワークエラーが発生しました。通信環境を確認してください。",

  NOT_FOUND: "データが見つかりませんでした。",

  UNKNOWN_ERROR: "エラーが発生しました。もう一度試してね。",
};
