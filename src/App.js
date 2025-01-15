import React from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link, useNavigate } from "react-router-dom";
import logo from './logo.svg';
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
    <div style={!isLoginPage ? { display: "flex", height: "100vh" } : {}}>
      {!isLoginPage && <Sidebar />}
      <div style={!isLoginPage ? { flex: 1, display: "flex", flexDirection: "column" } : {}}>
        {!isLoginPage && <Navbar />}
        <div style={!isLoginPage ? { padding: "20px", flex: 1 } : {}}>
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
