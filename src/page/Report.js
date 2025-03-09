import React, { useEffect, useRef, useState } from "react";
import { employee, filter, list, search } from "../config/icon";
import TitlePage from "../component/titlePage";
// import { loadData } from "../config/api";
import { useAPI } from "../config/fetchApi";
import Table from "../component/table";
import Button from "../component/button";
import Modal from "../component/modal";
import Input from "../component/input";
import { baseColor } from "../config/setting";
import Select from "../component/select";
import LoadingIndicator from "../component/loading_indicator";
import IconImage from "../component/icon_img";
import { currentMonth, currYear, exportToExcel, getCurrentDate, months, years } from "../config/helper";
import SearchableSelect from "../component/select2";

const Report = ({setIsLoading}) => {
    const { loadData } = useAPI();
    const [data, listData] = useState([]);
    const [isLoadData, setIsLoadData] = useState(true);
    const [isLoadExport, setIsLoadExport] = useState(false);
    const [currMonth, setCurrMonth] = useState(currentMonth);
    const [currentYear, setCurrentYear] = useState(currYear);
    const [isLoad, setIsLoad] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        fetchReport();
    }, []);

    useEffect(() => {
        if(!isLoad){
            fetchReport();
        }
    }, [currMonth])

    const fetchReport = () => {
        setIsLoading(true);
        setIsLoadData(true);
        loadData({url: 'SalaryDetails', params:[{title: 'filter', value: `month:${currMonth}|year:${currentYear}`}]}).then((res) => {
            if(res?.data?.length > 0){
                const filteredData = res.data.map(obj => {
                    const filteredObj = Object.fromEntries(
                        Object.entries(obj).filter(([key]) => 
                            !key.includes('ID') && 
                            !key.includes('month') && 
                            !key.includes('year') && 
                            !key.includes('dateIn') &&  
                            !key.includes('dateUp') &&  
                            !key.includes('userIn') &&  
                            !key.includes('userUp') &&  
                            !key.includes('isDeleted')
                        )
                    );
                
                    return {
                        id: obj?.salaryID,
                        ...filteredObj,
                    };
                });          
                listData(filteredData);
                setIsLoadData(false);
                setIsLoading(false);
                setIsLoad(false);
            }else{
                listData([]);
                setIsLoadData(false);
                setIsLoading(false);
                setIsLoad(false);
            }
        })
    }

    const exportFile = (type, event) => {
        if (event) {
          event.preventDefault();
        }
    
        if(type === ''){
          alert('Please Select Export Type');
          return;
        }
    
        setIsLoadExport(true);
    
        loadData({url: 'SalaryDetails', params:[{title: 'filter', value: `month:${currMonth}|year:${currentYear}`}]}).then((res) => {
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
            <TitlePage label={'Report Salary'} source={list} isAction={true} handleExport={(e) => exportFile('default', e)} />
            <div className="flex flex-row items-center">
                <SearchableSelect placeHolder = 'Periode' setPosition="bottom" setWidth="160px" options={months} value={currMonth} setValue={setCurrMonth}  />
                <div className="mx-1" />
                <SearchableSelect placeHolder = 'Year' setPosition="bottom" setWidth="100px" options={years} value={currYear} setValue={setCurrentYear}  />
            </div>
            <div>
                {!isLoadData ? 
                    <Table dataTable={data} isAction={true} detailPath={'/report/detail?id='} />
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