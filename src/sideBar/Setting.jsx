import Avatar from "react-avatar";
import { FaUserEdit } from "react-icons/fa";
import { useState, useEffect } from "react";
import { useUserContext } from "../UserContext";
import { setDoc, serverTimestamp, doc } from "firebase/firestore";
import { db } from "../firebaseConfig";
import styles from "../css/setting.module.css";

export const Setting = () => {
  const [name, setName] = useState("");
  const [isSave, setIsSave] = useState(false);
  const { user, loading } = useUserContext();

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
    </div>
  );
};
