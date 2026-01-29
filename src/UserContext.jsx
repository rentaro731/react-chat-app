import { useState, createContext, useContext, useEffect, useRef } from "react";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot, updateDoc } from "firebase/firestore";

const UserContext = createContext({ user: null, loading: true });

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ユーザーデータの取得ロジックをここに実装
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      try {
        if (!firebaseUser) {
          setUser(null);
          setLoading(false);
          return;
        }

        const uid = firebaseUser.uid;
        const userRef = doc(db, "users", uid);

        const unsubscribeUser = onSnapshot(userRef, async (snap) => {
          const dbEmail = snap.exists() ? snap.data()?.email ?? "" : "";
          const authEmail = firebaseUser.email ?? "";

          if (snap.exists() && authEmail && dbEmail !== authEmail) {
            // await updateDoc(userRef, { email: authEmail });//ここで必要？
            console.log("更新されました");
          }
          setUser({
            uid: uid,
            ...(snap.exists() ? snap.data() : {}),
            email: authEmail,
          });
        });
        return () => {
          unsubscribeUser();
        };
      } catch (error) {
        console.error("UserContext error:", error);
        alert(error?.code ?? error?.message ?? "UserContext error");
      } finally {
        setLoading(false);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUserContext = () => useContext(UserContext);
