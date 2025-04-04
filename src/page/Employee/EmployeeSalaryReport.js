import React, { useEffect, useRef, useState } from "react";
// import { loadData } from "../../config/api";
import { exportToExcel, getCurrentDate, getMonthName, getQueryParam } from "../../config/helper";
import TitlePage from "../../component/titlePage";
import Table from "../../component/table";
import LoadingIndicator from "../../component/loading_indicator";
import { arrow_left_g, arrow_right_g, d_arrow_left_g, d_arrow_right_g, list } from "../../config/icon";
import { useAPI } from "../../config/fetchApi";
import SearchableSelect from "../../component/select2";
import Button from "../../component/button";
import { useNavigate } from "react-router-dom";


const EmployeeReport = ({setIsLoading}) => {
    const navigate = useNavigate();
    const getId = getQueryParam("id");
    const [changesId, setChangesID] = useState(getQueryParam("id") ?? 0);
    const { loadData } = useAPI();
    const [data, listData] = useState([]);
    const [isLoadData, setIsLoadData] = useState(true);

    const listSearch = [
        {
            value: 'name',
            label: 'Nama',
        },
        {
            value: 'nik',
            label: 'NIK',
        },
        {
            value: 'ktp',
            label: 'KTP'
        }
    ];
    const [targetSearch, setTargetSearch] = useState('name');
    const listDatas = JSON.parse(localStorage?.getItem('employeeList'));
    const listFilterEmpl = JSON.parse(localStorage?.getItem('filterEmpl')) ?? {};
    const currentIndex = listDatas?.findIndex(obj => obj?.id === parseInt(getId))
    const prevId = listDatas[currentIndex-1]?.id ?? 0;
    const nextId = listDatas[currentIndex+1]?.id ?? 0;
    const prevDataId = listDatas[0]?.id;
    const lastDataId = listDatas[listDatas?.length-1]?.id;
    const [isHovered, setIsHovered] = useState({});

    const handleAfterExecute = (targetId) => {
        if(targetId){
            setIsLoading(true);
            navigate(`/employee/salaryreport?id=${targetId}`);
        }
    }

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

    useEffect(() => {
        if(changesId !== getId){
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
        }
    }, [changesId]);

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
            <div className="fixed bottom-0 left-0 w-full bg-white px-10 pb-2" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                {/* <div className="bg-[#ddd] mt-6 mb-3 h-[1.5px]" /> */}
                <div className="flex flex-row items-center justify-between mt-2">
                    <div className="flex flex-row items-center w-full">
                        <SearchableSelect setWidth="30%" options={listSearch} value={targetSearch} setValue={setTargetSearch} />
                        <div className="mx-1" />
                        <SearchableSelect setWidth="54%" placeHolder={'Cari Karwayan...'} options={listDatas?.map((obj) => ({value: obj?.id, label: obj?.[targetSearch]}))} isDisabled={targetSearch === '' ? true : false} useSearchIcon={true} setValue={setChangesID} value={changesId} handleAfterExecute={handleAfterExecute} />
                    </div>
                    <div className="flex flex-row items-center justify-end w-full">
                        <Button setWidth="auto" bgcolor={'white'} isGray={parseInt(getId) === prevDataId} icon={d_arrow_left_g} handleAction={() => {
                            navigate(`/employee/salaryreport?id=${prevDataId}`);
                            setChangesID(prevDataId);
                        }} />
                        <div className="mx-2" />
                        <Button setWidth="auto" bgcolor={'white'} isGray={prevId === 0} icon={arrow_left_g} handleAction={prevId > 0 ? () => {
                            navigate(`/employee/salaryreport?id=${prevId}`);
                            setChangesID(prevId);
                        } : null} />
                        <div className="mx-[6px]" />
                        <Button setWidth="80px" bgcolor={'white'} position="center" text={`${currentIndex+1}/${listDatas?.length}`} />
                        <div className="mx-[6px]" />
                        <Button setWidth="auto" bgcolor={'white'} isGray={nextId === 0} icon={arrow_right_g} handleAction={nextId > 0 ? () => {
                            navigate(`/employee/salaryreport?id=${nextId}`)
                            setChangesID(nextId);
                        } : null} />
                        <div className="mx-2" />
                        <Button setWidth="auto" bgcolor={'white'} isGray={parseInt(getId) === lastDataId} icon={d_arrow_right_g} handleAction={() => {
                            navigate(`/employee/salaryreport?id=${lastDataId}`);
                            setChangesID(lastDataId);
                        }} />
                    </div>
                    <div className="w-full flex flex-row items-end justify-end">
                        {listFilterEmpl?.checkedValue &&
                        Object.entries(listFilterEmpl?.checkedValue)?.map(([label, items]) => 
                        items?.length > 0 && (
                            <>
                            <div className={`py-1 w-auto pl-3 relative`}>
                                {isHovered[label] &&                                 
                                    <div className="bg-white p-2 min-w-[130px] rounded-md absolute bottom-12 right-0" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                                        {items?.map((data, idx) => (
                                            <p className="text-xs">{`${idx+1}. ${data?.value}`}</p>
                                        ))}
                                    </div>
                                }
                                <button className={`rounded-md w-auto p-2 bg-white`} style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}
                                    onMouseEnter={() => {
                                        const init = {...isHovered}
                                        init[label] = true;
                                        setIsHovered(init);
                                    }}
                                    onMouseLeave={() => {
                                        const init = {...isHovered}
                                        init[label] = false;
                                        setIsHovered(init);
                                    }}
                                >
                                    <div className={`flex flex-row items-center font-normal text-sm`}>
                                        {`${items?.length} ${label === 'group' ? 'grade' : label}`}
                                    </div>
                                </button>
                            </div>
                            </>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeeReport;