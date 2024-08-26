import { useState } from 'react'
import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './helper/AuthProvider';
import WorkSpace from './pages/WorkSpace';

function App() {
  const [count, setCount] = useState(0);

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/workspaces/*" element={<PrivateRoute> <WorkSpace /></PrivateRoute>} />
          {/* <Route path="/about" element={<About />} /> */}
        </Routes>
     </Router>
    </AuthProvider>
  );
}

export default App;
