import './App.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './pages/Login';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './helper/AuthProvider';
import WorkSpace from './pages/WorkSpace';

function App() {

  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/enrichment-documentation" element={<Login />} />
          <Route path="/enrichment-documentation/login" element={<Login />} />
          <Route path="/enrichment-documentation/workspaces/*" element={<PrivateRoute> <WorkSpace /></PrivateRoute>} />
        </Routes>
     </Router>
    </AuthProvider>
  );
}

export default App;
