import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import AuthPage from "./page/AuthPage";
import MasterPayroll from "./page/MasterPayroll";
import Navbar from "./layout/navbar";
import Sidebar from "./layout/sidebar";
import Footer from "./layout/footer";
import ProtectedRoute from "./protectedRoute";
import NotFound from "./page/NotFound";

const Layout = ({ children, setAuth }) => {
  const location = useLocation();

  // Define routes that should NOT use the full layout
  const excludedPaths = ['/login']; // Add other routes like '/register' if needed

  // Check if the current path matches excluded paths or is a 404
  const isExcludedPath = excludedPaths.includes(location.pathname);
  const is404Page = location.pathname !== '/' && !excludedPaths.includes(location.pathname);

  if (isExcludedPath || is404Page) {
    // Render children without layout for excluded paths or 404
    return <>{children}</>;
  }

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Sidebar />
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          marginLeft: '12.5rem',
          zIndex: 999,
        }}
      >
        <Navbar setAuth={setAuth} />
        <div
          style={{
            padding: '20px',
            paddingTop: '4rem',
            flex: 1,
            overflowY: 'auto',
          }}
        >
          {children}
        </div>
        <Footer />
      </div>
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  return (
    <Router>
      <Layout setAuth={setIsAuthenticated} >
        <Routes>
          <Route path="/login" element={<AuthPage setAuth={setIsAuthenticated} />} />
          <Route path="/" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MasterPayroll />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
