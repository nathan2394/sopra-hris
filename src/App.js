import React, { useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import AuthPage from "./page/AuthPage";
import MasterPayroll from "./page/MasterPayroll";
import ProtectedRoute from "./protectedRoute";
import NotFound from "./page/NotFound";
import EmployeeData from "./page/Employee/EmployeeData";
import EmployeeForm from "./page/Employee/EmployeeForm";
import Report from "./page/Report";
import ReportDetail from "./page/ReportDetail";
import Layout from "./layout/layout";
import PrivacyPolicy from "./page/PrivacyPolicy";
import EmployeeReport from "./page/Employee/EmployeeSalaryReport";
import EmployeePaySlip from "./page/Employee/EmployeePaySlip";
import AttendanceData from "./page/Attendance/AttendanceData";
import Calculator from "./page/Calculator/calculator";
import ShiftEmployee from "./page/Attendance/ShiftEmployee";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [contentFootet, setContentFootet] = useState(null);

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
              <EmployeeForm setIsLoading={setIsLoading} setContentFootet={setContentFootet} />
            </ProtectedRoute>
          } />
          <Route path="/employee/salaryreport" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EmployeeReport setIsLoading={setIsLoading} />
            </ProtectedRoute>
          } />
          <Route path="/salaryreport" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <EmployeePaySlip setIsLoading={setIsLoading} />
            </ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <AttendanceData setIsLoading={setIsLoading} />
            </ProtectedRoute>
          } />
          <Route path="/shift" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <ShiftEmployee setIsLoading={setIsLoading} />
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
          <Route path="/calculator" element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Calculator setIsLoading={setIsLoading} />
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
