import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Login } from "./Login";
import { SignApp } from "./SignApp";
import { Home } from "./Home";
import { ChatLayout } from "./ChatLayout";
import { TalkList } from "./sideBar/TalkList";
import { Friend } from "./sideBar/Friend";
import { Setting } from "./sideBar/Setting";
import { RoomLayout } from "./talkRoom/RoomLayout";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/sign" element={<SignApp />} />
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<ChatLayout />}>
            <Route index element={<TalkList />} />
            <Route path="talklist" element={<TalkList />} />
            <Route path="friend" element={<Friend />} />
            <Route path="setting" element={<Setting />} />
            <Route path="/chat/roomlayout/:roomId" element={<RoomLayout />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
