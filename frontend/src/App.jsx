import { useState } from "react";
import LoginPage from "./LoginPage";
import ProfilePage from "./ProfilePage";
import Dashboard from "./Dashboard";

function App() {
  const [user, setUser] = useState(null);
  const [showProfile, setShowProfile] = useState(false);

  if (!user) {
    return <LoginPage onLogin={(biosensorId) => setUser(biosensorId)} />;
  }

  if (user && !showProfile) {
    return <ProfilePage user={user} onContinue={() => setShowProfile(true)} />;
  }

  return <Dashboard user={user} />;
}

export default App;
