import React, { useEffect, useState } from "react";
import { HashRouter as Router, Routes, Route, useLocation } from "react-router-dom";
import './App.css';
import AuthPage from "./page/AuthPage";
import MasterPayroll from "./page/MasterPayroll";
import Navbar from "./layout/navbar";
import Sidebar from "./layout/sidebar";
import Footer from "./layout/footer";
import ProtectedRoute from "./protectedRoute";
import NotFound from "./page/NotFound";
import EmployeeData from "./page/Employee/EmployeeData";
import EmployeeForm from "./page/Employee/EmployeeForm";
import Report from "./page/Report";
import FullLoading from "./component/fullLoading";
import ReportDetail from "./page/ReportDetail";
import Layout from "./layout/layout";
import PrivacyPolicy from "./page/PrivacyPolicy";
import EmployeeReport from "./page/Employee/EmployeeSalaryReport";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const localData = localStorage.getItem('userdata');
  //   //const isAuth = localStorage.getItem('statusAuth');

  //   if(localData) setUserData(JSON.parse(localData));
  //   //if(isAuth) setIsAuthenticated(isAuth === 'true' ? true : false);
  // }, []);

  return (
    <Router>
      <Layout setAuth={setIsAuthenticated} isLoading={isLoading}>
        <Routes>
          <Route path="/login" element={<AuthPage setAuth={setIsAuthenticated} />} />
          <Route path="/" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <MasterPayroll setIsLoading={setIsLoading} />
            </ProtectedRoute>
          } />
          <Route path="/employee" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EmployeeData setIsLoading={setIsLoading} />
            </ProtectedRoute>
          } />
          <Route path="/employee/detail" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EmployeeForm setIsLoading={setIsLoading} />
            </ProtectedRoute>
          } />
          <Route path="/employee/salaryreport" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EmployeeReport setIsLoading={setIsLoading} />
            </ProtectedRoute>
          } />
          <Route path="/report/detail" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ReportDetail setIsLoading={setIsLoading} />
            </ProtectedRoute>
          } />
          <Route path="/report" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Report setIsLoading={setIsLoading} />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFound />} />
          <Route path="/privacypolicy" element={<PrivacyPolicy />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
