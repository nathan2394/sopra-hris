import { Link, useNavigate } from "react-router-dom";
import IconImage from "../component/icon_img";
import { arrow_g, calculator_g, employee_g, kehadiran_g, list_g, logout, menu, notif, payroll_g, setting, shift, shift_g, sopra_full, sopra_logo, user } from "../config/icon";
import React, { useReducer, useRef, useState } from "react";
import Button from "../component/button";
import { baseColor } from "../config/setting";

const Navbar = ({setAuth}) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const userData = JSON.parse(localStorage.getItem('userdata'));
  const sidebarRef = useRef(null);
  const overlayRef = useRef(null);

  const handleNavigation = (target) => {
    toggleSidebar();
    localStorage?.removeItem('calc');
    localStorage?.removeItem('filterEmpl');
    setTimeout(() => {
      navigate(target);
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
    const listMenu = [
      {
        groupName: 'Payroll',
        list: [
          {
            title: 'Master Payroll',
            navRoute: '/',
            icon: payroll_g
          },
          {
            title: 'Kalkulator',
            navRoute: '/calculator',
            icon: calculator_g
          }
        ]
      },
      {
        groupName: 'Personalia',
        list: [
          {
            title: 'Data Karyawan',
            navRoute: '/employee',
            icon: employee_g
          },
          {
            title: 'Jabatan',
            navRoute: '/#',
            icon: employee_g
          },
          {
            title: 'Grade Karyawan',
            navRoute: '/#',
            icon: employee_g
          }
        ]
      },
      {
        groupName: 'Absensi',
        list: [
          {
            title: 'Grup Shift Karyawan',
            navRoute: '/shift',
            icon: shift_g,
          },
          {
            title: 'Ketidakhadiran',
            navRoute: '/unattendance',
            icon: list_g,
          },
          {
            title: 'Lembur',
            navRoute: '/overtime',
            icon: list_g,
          },
          {
            title: 'Kehadiran',
            navRoute: '/attendance',
            icon: kehadiran_g,
          }
        ]
      },
      {
        groupName: 'Report',
        list: [
          {
            title: 'Report Salary',
            navRoute: '/report',
            icon: list_g
          },
        ]
      },
    ];

    return(
      <div ref={sidebarRef} className="fixed bg-white w-[360px] top-[67.8px] max-h-screen overflow-y-auto shadow-lg transition-transform duration-300 ease-in-out -translate-x-full" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
        {listMenu?.map((obj, index) => (
          <div className="flex flex-col border-b-[26px] border-[#dddddd76]" key={index}>
            <p className="text-sm font-bold px-10 pt-3 pb-2">{obj?.groupName}</p>
            {obj?.list?.map((data, idx) => (
              <div key={idx} onClick={() => { handleNavigation(data?.navRoute); }}>
                <div className={`bg-white hover:bg-[#379d0067] py-3 px-10 border-b border-[#dddddd55] flex flex-row items-center cursor-pointer`}>
                  <IconImage size="small" source={data?.icon} />
                  <p className="ml-3 text-sm">{data?.title}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
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
                        <p className="text-[9px]">SOPRA</p>
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
                        setAuth(false);
                        localStorage.removeItem('statusAuth');
                        localStorage.removeItem('userToken');
                        localStorage.removeItem('userdata');
                        navigate('/login');
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
  