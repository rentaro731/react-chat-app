import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignUp } from "./SignUp";
import { Login } from "./Login";
import { PublicRoute } from "./PublicRoute";
import { PrivateRoute } from "./PrivateRoute";
import { Home } from "./Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/SignUp" element={<SignUp />} />

        <Route path="/Login" element={<Login />} />

        <Route path="/PublicRoute" element={<PublicRoute />} />
        <Route path="/PrivateRoute" element={<PrivateRoute />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
