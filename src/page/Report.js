import React, { useEffect, useRef, useState } from "react";
import { employee, filter, list, search } from "../config/icon";
import TitlePage from "../component/titlePage";
import { loadData } from "../config/api";
import Table from "../component/table";
import Button from "../component/button";
import Modal from "../component/modal";
import Input from "../component/input";
import { baseColor } from "../config/setting";
import Select from "../component/select";
import LoadingIndicator from "../component/loading_indicator";
import IconImage from "../component/icon_img";
import { exportToExcel, getCurrentDate } from "../config/helper";

const Report = () => {
    const [data, listData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoadData, setIsLoadData] = useState(true);

    const [isLoadExport, setIsLoadExport] = useState(false);

    const [searchForm, setSearchForm] = useState({
        name    : '',
        nik     : '',
        ktp     : '',
        group   : 0
    });

    const [isFilter, setIsFilter] = useState(false);
    const [listFilter, setListFilter] = useState([]);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    useEffect(() => {
        loadData({url: 'SalaryDetails'}).then((res) => {
            if(res?.data?.length > 0){
                const filteredData = res.data.map(obj =>
                    Object.fromEntries(
                      Object.entries(obj).filter(([key]) => !key.includes('ID') && !key.includes('dateIn')  && !key.includes('dateUp')  && !key.includes('userIn') && !key.includes('userUp') && !key.includes('isDeleted'))
                    )
                );
                listData(filteredData);
                setIsLoadData(false);
            }else{
                setIsLoadData(false)
            }
        })
    }, []);

    const exportFile = (type, event) => {
        if (event) {
          event.preventDefault();
        }
    
        if(type === ''){
          alert('Please Select Export Type');
          return;
        }
    
        setIsLoadExport(true);
    
        loadData({url: 'SalaryDetails'}).then((res) => {
            const todayDate = getCurrentDate();
            let filteredData = [];
          
            filteredData = res.data.map(obj =>
                Object.fromEntries(
                Object.entries(obj).filter(([key]) => !key.includes('ID')  && !key.includes('dateIn')  && !key.includes('dateUp')  && !key.includes('userIn') && !key.includes('userUp') && !key.includes('isDeleted') )
                )
            );
    
            exportToExcel(filteredData, `Data_Report_Salary_${todayDate}`, `${type === 'bank' ? 'bank' : 'default'}`)
            setIsLoadExport(false);
        });
    }


    return (
        <>
            <TitlePage label={'Report Salary'} source={list} />
            <div>
                {data?.length > 0 &&
                    <div className="flex flex-row justify-between items-center">
                        <div className="flex flex-row">
                            {/* <Button text="Search" setWidth="auto" bgcolor={'white'} icon={search} handleAction={() => openModal()} />
                            <div className="mx-1" /> */}
                            <Button text={'Export Data'} setWidth={'auto'} bgcolor={baseColor} color={'white'} isLoading={isLoadExport} handleAction={(e) => exportFile('default', e)} />
                        </div>
                    </div>
                }

                {!isLoadData ? 
                    <Table dataTable={data} isAction={true} setIsFilter={setIsFilter} listFilter={listFilter} setListFilter={setListFilter} />
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
            </div>
        </>
    );
}

export default Report;