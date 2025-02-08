import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './helper/AuthProvider';
import WorkSpace from './pages/WorkSpace';
import NotFoundPage from './pages/NotFoundPage';
import ForbiddenPage from './pages/ForbiddenPage';
import './App.css'


function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/enrichment-documentation" element={<Login />} />
          <Route path="/enrichment-documentation/.jpeg" element={<Navigate to="/403" />} />
          <Route path="/enrichment-documentation/login" element={<Login />} />
          <Route path="/403" element={<ForbiddenPage />} />
          <Route path="/enrichment-documentation/workspaces/*" element={<PrivateRoute><WorkSpace /></PrivateRoute>} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
