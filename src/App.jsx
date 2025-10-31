import "./App.css";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Login } from "./login";
import { SignApp } from "./SignApp";
import { Home } from "./Home";
import { PublicRoute } from "./PublicRoute";
import PrivateRoute from "./PrivateRoute";
import { Chat } from "./Chat";
function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<SignApp />} />
          <Route path="/" element={<Home />} />

          <Route path="/PublicRoute" element={<PublicRoute />} />
          <Route path="/PrivateRoute" element={<PrivateRoute />} />
          <Route path="/Chat" element={<Chat />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
