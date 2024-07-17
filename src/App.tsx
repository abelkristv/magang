import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/PrivateRoute';
import StudentDetail from './pages/StudentDetail';
import { AuthProvider } from './helper/AuthProvider';
import Inbox from './pages/Inbox';
import Profile from './pages/Profile';
import StudentList from './pages/StudentList';
import ActivityDocumentation from './pages/ActivityDocumentation';

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute> <Dashboard /></PrivateRoute>} />
          <Route path="/activity-documentation" element={<PrivateRoute> <ActivityDocumentation /></PrivateRoute>} />
          <Route path="/student/:id" element={<PrivateRoute><StudentDetail /></PrivateRoute>} />
          <Route path="/profile/:id" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/company/studentList" element={<PrivateRoute><StudentList /></PrivateRoute>} />
          <Route path="/inbox/:id" element={<PrivateRoute><Inbox /></PrivateRoute>} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
     </Router>
    </AuthProvider>
  );
}

export default App;
