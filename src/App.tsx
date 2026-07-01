import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Sessions from './pages/Sessions';
import Progress from './pages/Progress';
import Saved from './pages/Saved';
import { AppLayout } from './components/layout/AppLayout';
import { ThemeProvider } from './lib/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>
        <Routes>
        <Route path="/" element={<Navigate to="/home" replace />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Authenticated routes with Layout */}
        <Route element={<AppLayout />}>
          <Route path="/home" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/saved" element={<Saved />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
