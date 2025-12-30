import React from "react";

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
    <div style={{ width: "100%" }}>
      <h2 style={{ textAlign: "center" }}>プロフィール設定画面</h2>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginTop: "8px",
        }}
      >
        <div style={{ position: "relative" }}>
          <Avatar name={name || "User"} size="80" round={true} />
          <FaUserEdit
            size={24}
            style={{ position: "absolute", right: "-24px", top: "10px" }}
          />
        </div>
      </div>
      <div style={{ marginTop: "16px", textAlign: "center" }}>
        <label>表示名</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          type="text"
          placeholder="ニックネームを入力"
          style={{ width: "80%", padding: "8px", marginTop: "8px" }}
        />
      </div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <button
          style={{
            marginTop: "8px",
            padding: "8px 16px",
          }}
        >
          保存
        </button>
      </div>
    </div>
  );
};
