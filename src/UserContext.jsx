import { useState, createContext, useContext, useEffect } from "react";
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
          setUser({
            uid: uid,
            ...(snap.exists() ? snap.data() : {}),
            email: firebaseUser.email ?? "",
          });
        });
        return () => {
          unsubscribeUser();
        };
      } catch (error) {
        console.error("UserContext error:", error);
        setUser({ uid, email: firebaseUser.email ?? "" });
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
