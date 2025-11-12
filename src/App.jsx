import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./Login";
import { SignApp } from "./SignApp";
import { Home } from "./Home";
import { Chat } from "./Chat";
import { GoogleLogin } from "./GoogleLogin";
import { PrivateRoute } from "./PrivateRoute";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<SignApp />} />
          <Route path="/" element={<Home />} />
          <Route path="googleLogin" element={<GoogleLogin />} />

          <Route
            path="/chat"
            element={
              <PrivateRoute>
                <Chat />
              </PrivateRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
