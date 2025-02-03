import { Link } from "react-router-dom";
import IconImage from "../component/icon_img";
import { arrow_green, employee_green, list_green, logout, menu, notif, payroll_green, sopra_full, sopra_logo, user } from "../config/icon";
import React, { useState } from "react";
import Button from "../component/button";

const Navbar = ({setAuth, userData}) => {
  const [open, setOpen] = useState(false);
  const [openSideBar, setOpenSideBar] = useState(false);
  const listMenu = [
    {
        title: 'Master Payroll',
        navRoute: '/',
        icon: payroll_green
    },
    {
        title: 'Employee Data',
        navRoute: '/employee',
        icon: employee_green
    },
    {
        title: 'Report Salary',
        navRoute: '/report',
        icon: list_green
    }
  ];

    return (
      <div className="relative">
        <nav className="bg-white border-gray-200 w-full fixed" style={{zIndex: 999, boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
          <div className="relative">
            <div className="w-full flex flex-wrap items-center justify-between mx-auto py-4 px-10">
              <div className="flex flex-row items-center">
                <Button bgcolor={'white'} setWidth="auto" icon={menu} handleAction={() => {
                  setOpenSideBar(!openSideBar)
                }} />
                <div className="bg-[#33333328] h-[30px] w-[1px] mx-4" />
                <a href="#" className="flex items-center space-x-3 rtl:space-x-reverse">
                    <img src={sopra_logo} className="h-8" alt="Sopra Logo" />
                </a>
              </div>
              <div className="w-auto flex flex-row items-center">
                <div className="border rounded-md cursor-pointer p-2" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                  <IconImage size="small" source={notif} />
                </div>
                <div className="relative w-[180px] ml-2">
                  <div className="border bg-[#ffffff] rounded-md cursor-pointer flex flex-row items-center justify-between" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)', userSelect: 'none'}} onClick={() => setOpen(!open)}>
                    <div className="flex flex-row">
                      <div className="bg-slate-600 w-[35px] h-auto rounded-s-md"></div>
                      <div className="ml-2">
                        <p className="text-xs">{userData?.email ? userData?.email?.length > 15 ? `${userData?.email?.slice(0, 15)}...` : userData?.email : 'User'}</p>
                        <p className="text-[10px]">SOPRA</p>
                      </div>
                    </div>
                    <div className="p-2">
                      <IconImage size="small" source={arrow_green} />
                    </div>
                  </div>
                  {open && 
                    <div className="absolute top-10 border border-[#ea24273f] bg-[#ffffff] rounded-lg w-[180px]">
                      {/* <div className="cursor-pointer p-1 border-b border-[#ea24273f] hover:bg-[#ddd]" style={{transition: '.1s'}} >
                        <p className="text-xs">Profile</p>
                      </div> */}
                      <div className="cursor-pointer p-1 hover:bg-[#ddd]" style={{transition: '.1s'}} onClick={() => { 
                        setAuth(false);
                        localStorage.removeItem('statusAuth');
                      }}>
                        <p className="text-xs">Log Out</p>
                      </div>
                    </div>
                  }
                </div>
              </div>
            </div>
            {openSideBar &&           
              <div className="absolute bg-white w-[400px]" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)', zIndex: 999}}>
                {listMenu?.map((data, idx) => (
                  <Link key={idx} to={data?.navRoute} onClick={() => setOpenSideBar(false)}>
                    <div className={`bg-white hover:bg-[#379d0067] py-3 px-10 border-b border-[#ddd] flex flex-row items-center`}>
                      <IconImage size="small" source={data?.icon} />
                      <p className="ml-3 text-sm">{data?.title}</p>
                    </div>
                  </Link>
                ))}
              </div>
            }
          </div>
        </nav>
        {openSideBar &&        
          <div className={`bg-[#0000003e] mx-auto w-full h-full fixed flex items-center justify-center overflow-hidden mt-[82px]`} style={{zIndex: 995}}>
          </div>
        }
      </div>
    );
};
  
export default Navbar;
  