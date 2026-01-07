import { useState, createContext, useContext, useEffect } from "react";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

const UserContext = createContext({ user: null, loading: true });

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // ユーザーデータの取得ロジックをここに実装
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }
      // ユーザーがログインしている場合、追加のユーザーデータをFirestoreから取得
      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      setUser({
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        ...userDoc.data(),
      });
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUserContext = () => useContext(UserContext);
