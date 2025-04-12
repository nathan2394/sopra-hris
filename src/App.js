import React, { useContext, useState } from "react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
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
import Unattendance from "./page/Attendance/Unattendance";
import AttendanceDetail from "./page/Attendance/AttendanceDetail";
import Overtime from "./page/Attendance/Overtime";
import { AuthProvider, AuthContext } from "./context/authContext"; // ✅ Import AuthContext
import { NavigationProvider } from "./context/navigationContext";
import Approval from "./page/Attendance/Approval";

const App = () => { // ✅ Use Context instead of state
  const [isLoading, setIsLoading] = useState(false);

  return (
    <Router>
      <AuthProvider>
        <Layout isLoading={isLoading}>
          <Routes>
            <Route path="/login" element={<AuthPage />} />
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <MasterPayroll setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee"
              element={
                <ProtectedRoute>
                  <EmployeeData setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/detail"
              element={
                <ProtectedRoute>
                  <EmployeeForm setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employee/salaryreport"
              element={
                <ProtectedRoute>
                  <EmployeeReport setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/salaryreport"
              element={
                <ProtectedRoute>
                  <EmployeePaySlip setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <AttendanceData setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance/detail"
              element={
                <ProtectedRoute>
                  <AttendanceDetail setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/unattendance"
              element={
                <ProtectedRoute>
                  <Unattendance setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/overtime"
              element={
                <ProtectedRoute>
                  <Overtime setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/approval"
              element={
                <ProtectedRoute>
                  <Approval setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/shift"
              element={
                <ProtectedRoute>
                  <ShiftEmployee setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report/detail"
              element={
                <ProtectedRoute>
                  <ReportDetail setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/report"
              element={
                <ProtectedRoute>
                  <Report setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calculator"
              element={
                <ProtectedRoute>
                  <Calculator setIsLoading={setIsLoading} />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<NotFound />} />
            <Route path="/privacypolicy" element={<PrivacyPolicy />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </Router>
  );
};

export default App;
