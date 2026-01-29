import Avatar from "react-avatar";
import { FaUserEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useUserContext } from "../UserContext";
import { setDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "../css/setting.module.css";
import { auth } from "../firebaseConfig";
import {
  sendPasswordResetEmail,
  verifyBeforeUpdateEmail,
  EmailAuthProvider,
  reauthenticateWithCredential,
  signOut,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

export const Setting = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [isSave, setIsSave] = useState(false);
  const { user, loading } = useUserContext();
  const [isShowingUserInfo, setIsShowingUserInfo] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [isShowingEmail, setIsShowingEmail] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);

  const handleSave = async () => {
    if (!user?.uid) return;
    if (!name.trim()) return;
    // 保存処理をここに実装
    setIsSave(true);
    await setDoc(
      doc(db, "users", user.uid),
      {
        name: name.trim(),
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
    setIsSave(false);
    alert("プロフィールが保存されました");
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  // メールアドレス変更ボタン
  const inputEmail = () => {
    setIsShowingEmail((prev) => !prev);
    setNewEmail("");
  };

  // 再認証・メールアドレス変更処理
  const changeEmail = async () => {
    const currentUser = auth.currentUser;
    if (!currentUser) {
      alert("ユーザーが認証されていません。");
      return;
    }
    if (!currentUser.email) {
      alert("メールアドレスが取得できません。");
      return;
    }
    if (!newEmail || !currentPassword) {
      alert("新しいメールアドレスと現在のパスワードを入力してください。");
      return;
    }

    try {
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      await verifyBeforeUpdateEmail(currentUser, newEmail);
      alert(
        "メールアドレス変更リンクを送信しました。リンクをクリックして変更を完了後、再度ログインしてください。"
      );

      await signOut(auth);
      navigate("/");

      setIsShowingEmail(false);
      setNewEmail("");
      setCurrentPassword("");
    } catch (error) {
      console.error("メールアドレス変更リンクの送信に失敗しました:", error);
      alert(
        "メールアドレスの変更に失敗しました。パスワードが正しいか確認してください。"
      );
    }
  };
  // パスワード変更ボタン
  const userInformation = () => {
    setIsShowingUserInfo(true);
  };
  //✖️ボタンの処理
  const closeBtn = () => {
    setIsShowingUserInfo(false);
    setIsShowingEmail(false);
    setNewEmail("");
    setCurrentPassword("");
  };

  // パスワード変更処理
  const changePassword = async () => {
    const email = user?.email;

    console.log("reset target email:", email);

    if (!email) {
      alert("メールアドレスが取得できません（user.email が空）");
      return;
    }
    // パスワード変更のロジックをここに追加
    try {
      await sendPasswordResetEmail(auth, email);
      alert(
        "パスワードリセットメールを送信しました。パスワード変更後に再度ログインしてください。"
      );

      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.error("パスワードリセットメールの送信に失敗しました:", error);
    }
  };

  // ログアウト処理
  const logOut = async () => {
    try {
      await signOut(auth);
      navigate("/");
    } catch (error) {
      console.log("ログアウト失敗", error);
    }
  };
  return (
    <div className={styles.main}>
      <h2 className={styles.title}>プロフィール設定画面</h2>
      <div className={styles.avatarContainer}>
        <div className={styles.avatarWrapper}>
          <Avatar name={name || "User"} size="80" round={true} />
          <FaUserEdit size={24} className={styles.faUserEdit} />
        </div>
      </div>
      <div className={styles.inputContainer}>
        <label>表示名</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="ニックネームを入力"
          className={styles.inputName}
        />
      </div>
      <div className={styles.buttonContainer}>
        <button
          onClick={handleSave}
          disabled={isSave}
          className={styles.saveButton}
        >
          {isSave ? "保存中..." : "保存"}
        </button>
      </div>
      <div className={styles.userInfoContainer}>
        <button onClick={userInformation}>ユーザー情報</button>
        {isShowingUserInfo && (
          <div className={styles.Overlay} onClick={closeBtn}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalHeader}>
                <div className={styles.modalHeaderLeft} />
                <h3>ユーザー情報</h3>
                <button className={styles.closeButton} onClick={closeBtn}>
                  ✖️
                </button>
              </div>
              <div className={styles.userInfo}>
                <div>ユーザー名: {user?.name}</div>
                <div>
                  メールアドレス: {user?.email}
                  <button onClick={inputEmail}>メールアドレスの変更</button>
                </div>
                {isShowingEmail && (
                  <div>
                    <input
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      type="email"
                      placeholder="新しいメールアドレスを入力"
                      className={styles.inputEmail}
                    />
                    <input
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      type="password"
                      placeholder="現在のパスワードを入力"
                      className={styles.inputPassword}
                    />
                    <button onClick={changeEmail}>変更</button>
                  </div>
                )}
                <div className={styles.Password}>
                  パスワードの変更:
                  <button onClick={changePassword}>変更</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <div className={styles.logoutBtn}>
        <button onClick={logOut}>ログアウト</button>
      </div>
    </div>
  );
};
