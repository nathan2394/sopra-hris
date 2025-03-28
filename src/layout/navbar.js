import { Link, useNavigate } from "react-router-dom";
import IconImage from "../component/icon_img";
import { arrow_g, calculator, calculator_g, employee, employee_g, kehadiran, kehadiran_g, list, list_g, logout, menu, notif, payroll, payroll_g, setting, shift, shift_g, sopra_full, sopra_logo, user } from "../config/icon";
import React, { useContext, useReducer, useRef, useState } from "react";
import Button from "../component/button";
import { baseColor } from "../config/setting";
import { AuthContext } from "../context/authContext";

const Navbar = ({setAuth}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userdata'));
  const listContentMenu = JSON.parse(localStorage.getItem('listContentMenu'));
  const { logout } = useContext(AuthContext);
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  const handleNavigation = (target) => {
    toggleSidebar();
    localStorage?.removeItem('calc');
    localStorage?.removeItem('filterEmpl');
    localStorage?.removeItem('empolyeeList');
    localStorage?.removeItem('setPeriod');
    localStorage?.setItem('breadcrumb', JSON?.stringify(
      {
          label: target?.title,
          navRoute: target?.navRoute,
          icon: target?.icon_b
      }
    ))
    setTimeout(() => {
      navigate(target?.navRoute);
    }, 100);
  }

  const toggleSidebar = () => {
    if (sidebarRef.current && overlayRef.current) {
      const isOpen = sidebarRef.current.classList.contains("translate-x-0");

      if (isOpen) {
        sidebarRef.current.classList.remove("translate-x-0");
        sidebarRef.current.classList.add("-translate-x-full");
        overlayRef.current.classList.add("opacity-0", "invisible");
      } else {
        sidebarRef.current.classList.remove("-translate-x-full");
        sidebarRef.current.classList.add("translate-x-0");
        overlayRef.current.classList.remove("opacity-0", "invisible");
      }
    }
  };

  const Sidebar = () => {
    let arr = listContentMenu?.parent.reduce((acc, item) => {
      let existingGroup = acc.find(obj => obj.groupName === item.group);
    
      if (existingGroup) {
        existingGroup.list.push({ title: item.name, navRoute: item.route });
      } else {
        acc.push({ 
          groupName: item.group, 
          list: [{ title: item.name, navRoute: item.route }] 
        });
      }
    
      return acc;
    }, []);
    
    // console.log(arr);
    // const listMenu = arr;

    const listMenu = [
      {
        groupName: 'Payroll',
        list: [
          {
            title: 'Master Payroll',
            navRoute: '/',
            icon: payroll_g,
            icon_b: payroll
          },
          {
            title: 'Kalkulator',
            navRoute: '/calculator',
            icon: calculator_g,
            icon_b: calculator
          }
        ]
      },
      {
        groupName: 'Personalia',
        list: [
          {
            title: 'Data Karyawan',
            navRoute: '/employee',
            icon: employee_g,
            icon_b: employee
          },
          // {
          //   title: 'Jabatan',
          //   navRoute: '/#',
          //   icon: employee_g
          // },
          // {
          //   title: 'Grade Karyawan',
          //   navRoute: '/#',
          //   icon: employee_g
          // },
        ]
      },
      {
        groupName: 'Absensi',
        list: [
          {
            title: 'Grup Shift Karyawan',
            navRoute: '/shift',
            icon: shift_g,
            icon_b: shift
          },
          {
            title: 'Cuti & Ijin',
            navRoute: '/unattendance',
            icon: list_g,
            icon_b: list
          },
          {
            title: 'Lembur',
            navRoute: '/overtime',
            icon: list_g,
            icon_b: list
          },
          {
            title: 'Kehadiran',
            navRoute: '/attendance',
            icon: kehadiran_g,
            icon_b: kehadiran
          }
        ]
      },
      {
        groupName: 'Report',
        list: [
          {
            title: 'Report Salary',
            navRoute: '/report',
            icon: list_g,
            icon_b: list
          },
        ]
      },
    ];

    return(
      <div ref={sidebarRef} className="fixed bg-[#F5F5F5] w-[340px] top-0 bottom-0 mt-[67.8px] shadow-lg transition-transform duration-300 ease-in-out -translate-x-full flex flex-col" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
        <div className="flex-grow overflow-y-auto">
          {listMenu?.map((obj, index) => (
            <div className="flex flex-col bg-white border-b-[26px] border-[#F5F5F5]" key={index}>
              <p className="text-sm font-bold px-10 pt-3 pb-2">{obj?.groupName}</p>
              {obj?.list?.map((data, idx) => (
                <div key={idx} onClick={() => { handleNavigation(data); }}>
                  <div className={`hover:bg-[#379d0067] py-3 px-10 border-b border-[#dddddd55] flex flex-row items-center cursor-pointer`}>
                    <IconImage size="small" source={data?.icon} />
                    <p className="ml-3 text-sm">{data?.title}</p>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
      <div className="relative">
        <nav className="bg-white border-gray-200 w-full fixed" style={{zIndex: 999, boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
          <div className="relative">
            <div className="w-full flex flex-wrap items-center justify-between mx-auto py-3 px-10">
              <div className="flex flex-row items-center">
                <Button bgcolor={'white'} setWidth="auto" icon={menu} handleAction={() => {
                  toggleSidebar();
                }} />
                <div className="bg-[#33333328] h-[30px] w-[1px] mx-4" />
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={sopra_logo} className="h-8" alt="Sopra Logo" />
                </a>
              </div>

              <div className="w-auto flex flex-row items-center">
                <Button setWidth="auto" icon={notif} bgcolor={'white'} />
                <div className="relative w-[200px] ml-2">
                  <div className="bg-[#ffffff] rounded-md cursor-pointer flex flex-row items-center justify-between" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)', userSelect: 'none'}} onClick={() => setOpen(!open)}>
                    <div className="flex flex-row items-center">
                      <div className="bg-slate-600 w-[36px] h-[35px] rounded-s-md"></div>
                      <div className="ml-2">
                        <p className="text-xs">{userData?.email ? (userData?.email?.length > 15 ? `${userData?.email?.slice(0, 15)}...` : userData?.email) : 'User'}</p>
                        <p className="text-[9px]">{userData?.roleName ?? 'SOPRA'}</p>
                      </div>
                    </div>
                    <div className="flex flex-row items-center">
                      <div className="bg-gray-300 h-[35px] w-[1px]" />
                      <div className="p-2">
                        <IconImage size="normal" source={setting} />
                      </div>
                    </div>
                  </div>
                  {open && 
                    <div className={`absolute top-10 bg-[#ffffff] rounded-lg w-[200px]`} style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                      <div className="cursor-pointer p-1 hover:bg-[#ddd]" style={{transition: '.1s'}} onClick={() => { 
                        logout();  // Call logout from context
                      }}>
                        <p className="text-xs">Log Out</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
            <Sidebar />
          </div>
        </nav>
        <div ref={overlayRef} className={`bg-[#0000003e] opacity-0 invisible hid mx-auto w-full h-full fixed overflow-hidden mt-[65px]`} style={{zIndex: 995 }} onClick={() => toggleSidebar()} />
      </div>
  );
};
  
export default Navbar;
  