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
import EmployeeData from "./page/EmployeeData";
import EmployeeForm from "./page/EmployeeForm";
import Report from "./page/Report";
import FullLoading from "./component/fullLoading";
import ReportDetail from "./page/ReportDetail";
import Layout from "./layout/layout";

// const Layout = ({ children, setAuth, userData, isLoading = false }) => {
//   const location = useLocation();

//   // Define routes that should NOT use the full layout
//   const excludedPaths = ['/login'];

//   // Check if the current path matches excluded paths or is a 404
//   const isExcludedPath = excludedPaths.includes(location.pathname);
//   const is404Page = location.pathname !== '/' && location.pathname !== '/report/detail' && location.pathname !== '/report' && location.pathname !== '/employee' && location.pathname !== '/employee/detail'   && !excludedPaths.includes(location.pathname);

//   if (isExcludedPath || is404Page) {
//     // Render children without layout for excluded paths or 404
//     return <>{children}</>;
//   }

//   return (
//     <>
//       <div style={{maxWidth: '2000px', margin: '0 auto'}}>
//         <div className="bg-[#F5F5F5]" style={{ display: 'flex', height: '100vh', flexDirection: 'column' }}>
//           <Navbar setAuth={setAuth} userData={userData} />
//           {/* <Sidebar /> */}
//           <div style={{zIndex: 99}}>
//             <div style={{ padding: '20px', paddingTop: '5.5rem'}}>
//               <div className="px-5 max-w-full">
//                 {children}
//               </div>
//             </div>
            
//           </div>
//         </div>
//         {/* <Footer /> */}
//       </div>
//       {isLoading && <FullLoading /> }
//     </>
//   );
// };

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userData, setUserData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const localData = localStorage.getItem('userdata');
    //const isAuth = localStorage.getItem('statusAuth');

    if(localData) setUserData(JSON.parse(localData));
    //if(isAuth) setIsAuthenticated(isAuth === 'true' ? true : false);
  }, [])

  // useEffect(() => {

  // }. [])

  return (
    <Router>
      <Layout setAuth={setIsAuthenticated} userData={userData} isLoading={isLoading}>
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
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
