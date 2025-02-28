import React, { useEffect, useRef, useState } from "react";
import { loadData } from "../../config/api";
import { exportToExcel, getCurrentDate, getMonthName, getQueryParam } from "../../config/helper";
import TitlePage from "../../component/titlePage";
import Table from "../../component/table";
import LoadingIndicator from "../../component/loading_indicator";
import { list } from "../../config/icon";


const EmployeeReport = ({setIsLoading}) => {
    const getId = getQueryParam("id");
    const [data, listData] = useState([]);
    const [isLoadData, setIsLoadData] = useState(true);
    const [isLoadExport, setIsLoadExport] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        loadData({url: `Salary/EmployeeSalaryHistory/${getId}`}).then((res) => {
            if(res?.data?.length > 0){
                const sortData = res.data?.sort((a, b) => new Date(b?.year, b?.month - 1) - new Date(a?.year, a?.month - 1))
                const filteredData = sortData.map((obj, idx) => ({
                    no: idx+1,
                    id: obj?.salaryID,
                    periode: getMonthName(obj?.month) + ` ${obj.year}`,
                    nik: obj?.nik,
                    namaKaryawan: obj?.employeeName,
                    pendapatan: obj?.thp,
                    potongan: obj?.deductionTotal,
                    gajiBersih: obj?.netto,
                    account: obj?.accountNo,
                    bank: 'BCA'
                }))        
                listData(filteredData);
                localStorage?.setItem('listReport', JSON.stringify(filteredData));
                setIsLoadData(false);
                setIsLoading(false);
            }else{
                setIsLoadData(false);
                setIsLoading(false);
            }
        })
    }, []);

    const subMenu = [
        {
            title: 'Data Personal',
            navRoute: `/employee/detail?id=`+getId,
        },
        {
            title: 'Data Gaji Bulanan',
            navRoute: '/employee/salaryreport?id='+getId,
        }
    ];


    return (
        <>
            <TitlePage label={'Data Karyawan'} subLabel={'Data Gaji Bulanan'} subMenu={subMenu} source={list} type={'detail'} isAction={true} setNavigateBack={`/employee`} />
            <div>

                {!isLoadData ? 
                    <Table dataTable={data} isAction={true} detailPath={`/salaryreport?employeeId=${getId}&id=`} />
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
            </div>
        </>
    );
}

export default EmployeeReport;