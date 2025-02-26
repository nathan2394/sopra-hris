import { useLocation } from "react-router-dom";
// import FullLoading from "./FullLoading";
import Navbar from "./navbar";
import FullLoading from "../component/fullLoading";
import Footer from "./footer";

const Layout = ({ children, setAuth, contentFootet = null, isLoading = false }) => {
  const location = useLocation();
  const userData = JSON.parse(localStorage.getItem('userdata'));

  // Define routes that should NOT use the full layout
  const excludedPaths = ["/login"];

  // Define known valid paths
  const validPaths = ["/", "/report/detail", "/report", "/employee", "/employee/detail", "/employee/salaryreport", "/salaryreport", "/attendance", "/attendance/detail", "/shift", "/calculator"];

  // Get the actual path considering HashRouter (if applicable)
  const currentPath = location.pathname + (location.hash ? location.hash.replace("#", "") : "");

  // Check if the current path should exclude the full layout
  const isExcludedPath = excludedPaths.includes(currentPath);

  // Check if it's a 404 (not in validPaths and not in excludedPaths)
  const is404Page = !validPaths.includes(currentPath) && !isExcludedPath;

  if (isExcludedPath || is404Page) {
    // Render children without layout for excluded paths or 404 pages
    return <>{children}</>;
  }

  return (
    <>
      <div style={{ maxWidth: "2000px", margin: "0 auto" }}>
        <div className="bg-[#F5F5F5]" style={{ display: "flex", height: "100vh", flexDirection: "column" }}>
          <Navbar setAuth={setAuth} userData={userData} />
          <div style={{ zIndex: 99 }}>
            <div style={{ padding: "20px", paddingTop: "5rem" }}>
              <div className="px-5 max-w-full relative">{children}</div>
            </div>
          </div>
          {contentFootet && 
            <Footer content={contentFootet}/>
          }
        </div>
      </div>
      {isLoading && <FullLoading />}
    </>
  );
};

export default Layout;