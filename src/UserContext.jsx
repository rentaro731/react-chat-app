import { useState, createContext, useContext, useEffect, useRef } from "react";
import { auth, db } from "./firebaseConfig";
import { onAuthStateChanged } from "firebase/auth";
import { doc, onSnapshot } from "firebase/firestore";

const UserContext = createContext({ user: null, loading: true });

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const unsubscribeUserDocRef = useRef(null);
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      //前のユーザーの登録を解除
      if (unsubscribeUserDocRef.current) {
        unsubscribeUserDocRef.current();
        unsubscribeUserDocRef.current = null;
      }

      if (!firebaseUser) {
        setUser(null);
        setLoading(false);
        return;
      }

      const userRef = doc(db, "users", firebaseUser.uid);
      const unsubscribeUser = onSnapshot(
        userRef,
        (snap) => {
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            ...(snap.data() || {}),
          });
          setLoading(false);
        },
        (error) => {
          console.error("User doc subscribe error:", error);
          // 失敗しても auth 情報だけは入れておく（保険）
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
          });
          setLoading(false);
        }
      );
      unsubscribeUserDocRef.current = unsubscribeUser;
    });
    return () => {
      if (unsubscribeUserDocRef.current) {
        unsubscribeUserDocRef.current();
        unsubscribeUserDocRef.current = null;
      }
      unsubscribeAuth();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading }}>
      {children}
    </UserContext.Provider>
  );
};
export const useUserContext = () => useContext(UserContext);
