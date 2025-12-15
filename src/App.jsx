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
import { UserProvider } from "./UserContext";

function App() {
  return (
    <div>
      <BrowserRouter>
        <UserProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/sign" element={<SignApp />} />
            <Route path="/" element={<Home />} />
            <Route path="/chat" element={<ChatLayout />}>
              <Route index element={<TalkList />} />
              <Route path="/chat/talklist" element={<TalkList />} />
              <Route path="/chat/friend" element={<Friend />} />
              <Route path="/chat/setting" element={<Setting />} />
              <Route path="/chat/room/:roomId" element={<RoomLayout />} />
            </Route>
          </Routes>
        </UserProvider>
      </BrowserRouter>
    </div>
  );
}

export default App;
