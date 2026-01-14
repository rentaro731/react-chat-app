import { useEffect, useState } from "react";
import Avatar from "react-avatar";
import { FaUserEdit } from "react-icons/fa";
import { useUserContext } from "../UserContext";
import styles from "../css/setting.module.css";

export const Setting = () => {
  const [name, setName] = useState("");
  const { user, loading } = useUserContext();

  useEffect(() => {
    if (user?.name) {
      setName(user.name);
    }
  }, [user]);
  if (loading) return <div>loading...</div>;

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
        <button className={styles.saveButton}>保存</button>
      </div>
    </div>
  );
};
