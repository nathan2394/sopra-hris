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
  const excludedPaths = ['/login'];

  // Check if the current path matches excluded paths or is a 404
  const isExcludedPath = excludedPaths.includes(location.pathname);
  const is404Page = location.pathname !== '/' && !excludedPaths.includes(location.pathname);

  if (isExcludedPath || is404Page) {
    // Render children without layout for excluded paths or 404
    return <>{children}</>;
  }

  return (
    <div style={{maxWidth: '2000px', margin: '0 auto'}}>
      <div className="bg-[#F5F5F5]" style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
        <Navbar setAuth={setAuth} />
        {/* <Sidebar /> */}
        <div style={{zIndex: 99,}}>
          <div
            style={{
              padding: '20px',
              paddingTop: '5.5rem',
            }}
          >
            {children}
          </div>
          
        </div>
      </div>
      <Footer />
    </div>
  );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem('statusAuth'));

  console.log(isAuthenticated)

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
