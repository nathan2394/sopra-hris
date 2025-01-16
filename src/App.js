import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import AuthPage from "./page/AuthPage";
import MasterPayroll from "./page/MasterPayroll";
import Navbar from "./layout/navbar";
import Sidebar from "./layout/sidebar";
import Footer from "./layout/footer";

const Layout = ({children}) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div style={!isLoginPage ? { height: "100vh", display: "flex", flexDirection: "column" } : {}}>
      {!isLoginPage && <Sidebar />}
      <div style={!isLoginPage ? { flex: 1, display: "flex", flexDirection: "column", marginLeft: '12.5rem', zIndex: 999 } : {}}>
        {!isLoginPage && <Navbar />}
        <div style={!isLoginPage ? { padding: "20px", paddingTop: '4rem', flex: 1, overflowY: 'auto' } : {}}>
          {children}
        </div>
        {!isLoginPage && <Footer />}
      </div>
    </div>
  )
}

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<MasterPayroll />} />
          <Route path="/about" element={<MasterPayroll />} />
          <Route path="/contact" element={<MasterPayroll />} />
          <Route path="/login" element={<AuthPage />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
