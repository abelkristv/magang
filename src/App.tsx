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

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute> <Dashboard /></PrivateRoute>} />
          <Route path="/student/:id" element={<PrivateRoute><StudentDetail /></PrivateRoute>} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
     </Router>
    </AuthProvider>
  );
}

export default App;
