import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { convertDate, filterUniqueList, formatText, getCurrentDate } from "../../config/helper";
import Modal from "../../component/modal";
import Input from "../../component/input";
import Button from "../../component/button";
import { baseColor } from "../../config/setting";
import TitlePage from "../../component/titlePage";
import { add_g, approve, arrow_left_g, arrow_right_g, employee, filter, filter_w, filterData, kehadiran, list, pending, reject, reload, search } from "../../config/icon";
import IconImage from "../../component/icon_img";
import Table from "../../component/table";
import LoadingIndicator from "../../component/loading_indicator";
import CollapseMenu from "../../component/collapse_menu";
import AlertPopUp from "../../component/popupAlert";
import SearchableSelect from "../../component/select2";
import InputContent from "../../component/sections/inputContent";
import { useAPI } from "../../config/fetchApi";
import DataTable from "../../component/dataTable";
import FormOvertime from "../../component/sections/formOvertime";
import MyDatePicker from "../../component/date_picker";
import FilterContent from "../../component/filterContent";
import FormShift from "../../component/sections/formShift";
import FormUnattendance from "../../component/sections/formUnattendance";

const Approval = ({setIsLoading}) => {
    const { loadData } = useAPI();

    const userData = JSON.parse(localStorage.getItem('userdata'));
    
    const [listEmployee, setListEmployee] = useState([]);
    const [listShift, setListShift] = useState([]);
    const [typeUnattendance, setTypeUnattendance] = useState([]);
    const [typeOvt, setTypeOvt] = useState([]);
    const [listDepartEmpl, setListDepartEmpl] = useState([]);
    const [listDivEmpl, setListDivEmpl] = useState([]);

    const [btnApprove, setBtnApprove] = useState(false);

    const currentDate = new Date();
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 24);

    const [endDateVal, setEndDateVal] = useState(convertDate(currentDate, 'input'));
    const [startDateVal, setStartDateVal] = useState(convertDate(prevMonthDate, 'input'));

    const [isFilter, setIsFilter] = useState(false);
    const [listFilter, setListFilter] = useState([]);
    const [isModalFilterOpen, setModalFilterOpen] = useState(false);

    const [targetSearch, setTargetSearch] = useState('name');
    const [searchInput, setSearchInput] = useState({
        name    : '',
        nik     : '',
        ktp     : '',
    });
    const [listSearch, setListSearch] = useState([]);

    const [modalContent, setModalContent] = useState('');
    const openModalFilter = () => setModalFilterOpen(true);
    const closeModalFilter = () => setModalFilterOpen(false);

    const [checkedValue, setCheckValue] = useState({});
    const [selectedValues, setSelectedValues] = useState({});

    const [isLoadData, setIsLoadData] = useState(true);
    const [formData, setFormData] = useState({});
    const [listData, setListData] = useState([]);
    const [rowActive, setRowActive] = useState(0);
    const [activeMenu, setActiveMenu] = useState('Lembur');
    const [tableColumn, setTableColumn] = useState([]);

    const [showForm, setShowForm] = useState(false);
    const [isAdd, setIsAdd] = useState(false);
    const [isEdit, setIsEdit] = useState(false);

    const [searchForm, setSearchForm] = useState({
        name    : '',
        group   :  0,
        department : 0,
        division : 0,
        type: 0
    });

    useEffect(() => {
        setIsLoading(true);
        loadData({url: 'Employees'}).then((res) => {
            setListEmployee(res?.data?.map((obj) => ({
                label: obj?.employeeName,
                value: obj?.employeeID
            })))
            setListSearch(res?.data?.map((obj) => ({
                label: obj?.employeeName,
                value: obj?.employeeName
            })))
        });

        loadData({url: 'Reasons'}).then((res) => {
            setTypeOvt(res?.data?.map((obj) => ({
                value: obj?.reasonID,
                label: obj?.name
            })))
        });

        loadData({url: 'UnattendanceTypes'}).then((res) => {
            setTypeUnattendance(res?.data?.map((obj) => ({
                value: obj?.unattendanceTypeID,
                label: obj?.name
            })))
        })

        loadData({url: 'Departments'}).then((res) => {
            setListDepartEmpl(res?.data?.map((data) => (
                {
                    id: data?.departmentID,
                    value: data?.name
                }
            )));
        })

        loadData({url: 'Divisions'}).then((res) => {
            setListDivEmpl(res?.data?.map((data) => (
                {
                    id: data?.divisionID,
                    value: data?.name
                }
            )));
        })

        loadData({url: 'Shifts'})?.then((res) => {
            if(res?.data?.length > 0){
                const updatedShifts = res?.data?.map((data) => (
                    {
                        value: data?.shiftID,
                        label: data?.code,
                        clockIn: data?.startTime || null,
                        clockOut: data?.endTime || null,
                        clockInWeekend: data?.weekendStartTime ?? null,
                        clockOutWeekend: data?.weekendEndTime ?? null,
                    }
                ));
                setListShift([{ value: 0, label: 'OFF', clockIn: "00:00:00", clockOut: "00:00:00" }, ...updatedShifts]);
            }
        })
    }, [])

    useEffect(() => {
        if(startDateVal && endDateVal){
            if(activeMenu === 'Lembur') fetchOvertime();
            if(activeMenu === 'Ketidakhadiran') fetchUnattendance();
            if(activeMenu === 'Tukar Shift') fetchTransferShift();
        }
    }, [endDateVal, activeMenu])

    useEffect(() => {
        if(isFilter){
            setCheckValue(selectedValues);
            setIsFilter(JSON.stringify(selectedValues) !== "{}");
        }
        
    }, [selectedValues])

    useEffect(() => {
        if(checkedValue){
            setSearchForm({
                ...searchForm,
                group: checkedValue?.group?.map(item => item?.id)?.join(),
                department : checkedValue?.department?.map(item => item?.id)?.join(),
                division : checkedValue?.division?.map(item => item?.id)?.join(),
                type: checkedValue?.type?.map(item => item?.id)?.join()
            })
        }
    }, [checkedValue])

    useEffect(() => {
        if(!isLoadData){
            if(activeMenu === 'Lembur') fetchOvertime();
            if(activeMenu === 'Ketidakhadiran') fetchUnattendance();
            if(activeMenu === 'Tukar Shift') fetchTransferShift();
        }
    }, [searchForm?.group, searchForm?.department, searchForm?.division, searchForm?.name, searchForm?.type])

    const triggerChange = (target) => {
        const currentDate = new Date();
        const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 24);
        setRowActive(0);
        setActiveMenu(target);
        setShowForm(false);
    
        setEndDateVal(convertDate(currentDate, 'input'));
        setStartDateVal(convertDate(prevMonthDate, 'input'));
    }

    const handleAfterExecute = () => {
        setShowForm(false);
        if(activeMenu === 'Lembur') fetchOvertime();
        if(activeMenu === 'Ketidakhadiran') fetchUnattendance();
        if(activeMenu === 'Tukar Shift') fetchTransferShift();
    }

    const fetchOvertime = () => {
        setIsLoading(true);
        const params = [
            {
                title: 'filter',
                value: `${searchForm?.name ? 'name:' + searchForm?.name +'|' : ''} ${searchForm?.nik ? 'nik:' + searchForm?.nik +'|' : ''} ${searchForm?.ktp ? 'ktp:' + searchForm?.ktp +'|' : ''} ${searchForm?.group ? 'group:' + searchForm?.group +'|' : ''} ${searchForm?.department ? 'department:' + searchForm?.department +'|' : ''} ${searchForm?.division ? 'division:' + searchForm?.division +'|' : ''} ${searchForm?.type ? 'employeeType:' + searchForm?.type +'|' : ''}`
            },
            {
                title: 'date', 
                value: `${convertDate(startDateVal)}|${convertDate(endDateVal)}`
            }
        ];
        loadData({url: 'Overtimes/ListApproval', params: params}).then((res) => {  
            if(res?.data){
                const filteredData = res?.data.map(obj => {
                    const filteredObj = Object.fromEntries(
                        Object.entries(obj).filter(([key]) => 
                            !key.includes('dateIn') &&  
                            !key.includes('dateUp') &&  
                            !key.includes('userIn') &&  
                            !key.includes('userUp') &&  
                            !key.includes('isDeleted')
                        )
                    );
                
                    return {
                        id: obj?.overtimeID,
                        ...filteredObj,
                    };
                }); 
                setListData(filteredData);
                setIsLoading(false);
                setIsLoadData(false);
    
                localStorage?.setItem('employeeList', JSON.stringify(filterUniqueList(filteredData, 'employeeID', (obj, idx) => ({
                    id: obj?.employeeID,
                    name: obj?.employeeName,
                    nik: obj?.nik,
                    ktp: obj?.ktp,
                    index: idx
                }))));
    
                const setColumns = [
                    { field: "employeeName", header: "Nama Karyawan", alignment: "left", render: (_, row) => 
                        userData?.roleID !== 4 ?
                        <Link to={`/employee/detail?id=${row?.employeeID}`} className="text-[#369D00] underline" onClick={(e) => e.stopPropagation()}> {row?.employeeName} </Link> 
                        :
                        <> {row?.employeeName} </> 
                    },
                    { field: "transDate", header: "Tanggal Pengajuan", alignment: "center", render: (value) => convertDate(value) },
                    { field: "tanggal", header: "Tanggal Lembur", alignment: "center", render: (_, row) => `${convertDate(row.startDate)}` },
                    { field: "dateRange", header: "Jam Lembur", alignment: "center", render: (_, row) => `${convertDate(row.startDate, 'time')} - ${convertDate(row.endDate, 'time')}` },
                    { field: "voucherNo", header: "No. SPL", alignment: "left"},
                    { field: "reasonCode", header: "Keterangan", alignment: 'center' },
                    { field: "status", header: "Status", alignment: 'center', render: (_, row) => 
                        <div className="flex justify-center"> 
                            {row?.isApproved1 && row?.isApproved2 ? 
                                <IconImage size="small" source={approve} /> 
                                : (row?.approvedBy1 === false && row?.isApproved2 === false) && (row?.approvedBy1 || row?.approvedBy2) 
                                ? <IconImage size="h-4" source={reject} /> 
                                : <IconImage size="h-4" source={pending} />} 
                        </div> 
                    }
                ];
    
                setTableColumn(setColumns);
            }else{
                setListData([]);
                setIsLoading(false); 
                setIsLoadData(false);
            }
        });
    };

    const fetchUnattendance = () => {
        setIsLoading(true);
        const params = [
            {
                title: 'filter',
                value: `${searchForm?.name ? 'name:' + searchForm?.name +'|' : ''} ${searchForm?.nik ? 'nik:' + searchForm?.nik +'|' : ''} ${searchForm?.ktp ? 'ktp:' + searchForm?.ktp +'|' : ''} ${searchForm?.group ? 'group:' + searchForm?.group +'|' : ''} ${searchForm?.department ? 'department:' + searchForm?.department +'|' : ''} ${searchForm?.division ? 'division:' + searchForm?.division +'|' : ''} ${searchForm?.type ? 'employeeType:' + searchForm?.type +'|' : ''}`
            },
            {
                title: 'date', 
                value: `${convertDate(startDateVal)}|${convertDate(endDateVal)}`
            }
        ];
        console.log(params)
        loadData({url: 'Unattendances/ListApproval', params: params}).then((res) => {  
            if(res?.data){
                const filteredData = res?.data.map(obj => {
                    const filteredObj = Object.fromEntries(
                        Object.entries(obj).filter(([key]) => 
                            !key.includes('dateIn') &&  
                            !key.includes('dateUp') &&  
                            !key.includes('userIn') &&  
                            !key.includes('userUp') &&  
                            !key.includes('isDeleted')
                        )
                    );
                
                    return {
                        id: obj?.unattendanceID,
                        ...filteredObj,
                    };
                }); 
                setListData(filteredData);
    
                localStorage?.setItem('employeeList', JSON.stringify(filterUniqueList(filteredData, 'employeeID', (obj, idx) => ({
                    id: obj?.employeeID,
                    name: obj?.employeeName,
                    nik: obj?.nik,
                    ktp: obj?.ktp,
                    index: idx
                }))));
                setIsLoading(false);
                setIsLoadData(false);
    
                const setColumns = [
                    { field: "employeeName", header: "Nama Karyawan", alignment: "left", render: (_, row) => 
                        userData?.roleID !== 4 ?
                        <Link to={`/employee/detail?id=${row?.employeeID}`} className="text-[#369D00] underline" onClick={(e) => e.stopPropagation()}> {row?.employeeName} </Link> 
                        :
                        <> {row?.employeeName} </> 
                    },
                    { field: "dateRange", header: "Tanggal Tidak Hadir", alignment: "center", render: (_, row) => `${convertDate(row.startDate)} - ${convertDate(row.endDate)}` },
                    { field: "duration", header: "Durasi", alignment: "left", render: (value) => `${value ? value : 0} Hari` },
                    { field: "voucherNo", header: "No. SKT", alignment: "left"},
                    { field: "unattendanceTypeName", header: "Tipe", alignment: 'left' },
                    { field: "status", header: "Status", alignment: 'center', render: (_, row) => 
                        <div className="flex justify-center"> 
                            {row?.isApproved1 && row?.isApproved2 ? 
                                <IconImage size="w-3" source={approve} /> 
                                : (row?.approvedBy1 === false && row?.isApproved2 === false) && (row?.approvedBy1 || row?.approvedBy2) 
                                ? <IconImage size="w-3" source={reject} /> 
                                : <IconImage size="h-4" source={pending} />} 
                        </div> 
                    }
                ]
    
                setTableColumn(setColumns);
            }else{
                setListData([]);
                setIsLoading(false);
                setIsLoadData(false);
            }
        });
    }

    const fetchTransferShift = () => {
        setIsLoading(true);
        const params = [
            {
                title: 'filter',
                value: `${searchForm?.name ? 'name:' + searchForm?.name +'|' : ''} ${searchForm?.nik ? 'nik:' + searchForm?.nik +'|' : ''} ${searchForm?.ktp ? 'ktp:' + searchForm?.ktp +'|' : ''} ${searchForm?.group ? 'group:' + searchForm?.group +'|' : ''} ${searchForm?.department ? 'department:' + searchForm?.department +'|' : ''} ${searchForm?.division ? 'division:' + searchForm?.division +'|' : ''} ${searchForm?.type ? 'employeeType:' + searchForm?.type +'|' : ''}`
            },
            {
                title: 'date', 
                value: `${convertDate(startDateVal)}|${convertDate(endDateVal)}`
            }
        ];
        loadData({url: 'EmployeeTransferShifts/ListApproval', params: params}).then((res) => {  
            if(res?.data){
                const filteredData = res?.data.map(obj => {
                    const filteredObj = Object.fromEntries(
                        Object.entries(obj).filter(([key]) => 
                            !key.includes('dateIn') &&  
                            !key.includes('dateUp') &&  
                            !key.includes('userIn') &&  
                            !key.includes('userUp') &&  
                            !key.includes('isDeleted')
                        )
                    );
                
                    return {
                        id: obj?.employeeTransferShiftID,
                        ...filteredObj,
                    };
                }); 
                setListData(filteredData);
    
                localStorage?.setItem('employeeList', JSON.stringify(filterUniqueList(filteredData, 'employeeID', (obj, idx) => ({
                    id: obj?.employeeID,
                    name: obj?.employeeName,
                    nik: obj?.nik,
                    ktp: obj?.ktp,
                    index: idx
                }))));
                setIsLoading(false);
                setIsLoadData(false);
    
                const setColumns = [
                    { field: "employeeName", header: "Nama Karyawan", alignment: "left", render: (_, row) => 
                        userData?.roleID !== 4 ?
                        <Link to={`/employee/detail?id=${row?.employeeID}`} className="text-[#369D00] underline" onClick={(e) => e.stopPropagation()}> {row?.employeeName} </Link> 
                        :
                        <> {row?.employeeName} </> 
                    },
                    { field: "transDate", header: "Tanggal Pengajuan", alignment: "center", render: (_, row) => `${convertDate(row.transDate)}` },
                    { field: "shiftFromID", header: "Shift Awal", alignment: "center", render: (value) => listShift?.find(obj => obj?.value === value)?.label || '-' },
                    { field: "shiftToID", header: "Shift Tujuan", alignment: "center", render: (value) => listShift?.find(obj => obj?.value === value)?.label || '-' },
                    { field: "hourDiff", header: "Pergeseran Waktu", alignment: "center", render: (value) => `${value} jam` },
                    // { field: "remarks", header: "Remark", alignment: 'left' },
                    { field: "status", header: "Status", alignment: 'center', render: (_, row) => 
                        <div className="flex justify-center"> 
                            {row?.isApproved1 && row?.isApproved2 ? 
                                <IconImage size="w-3" source={approve} /> 
                                : (row?.approvedBy1 === false && row?.isApproved2 === false) && (row?.approvedBy1 || row?.approvedBy2) 
                                ? <IconImage size="w-3" source={reject} /> 
                                : <IconImage size="h-4" source={pending} />} 
                        </div> 
                    }
                ]
    
                setTableColumn(setColumns);
            }else{
                setListData([]);
                setIsLoading(false); 
                setIsLoadData(false);
            }
        });
    }

    useEffect(() => {
        console.log(searchInput);
    }, [searchInput])

    const handleSearchChange = (event) => {
        setSearchInput((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
    };

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    };

    const handleCheckbox = (item, label) => {
        setSelectedValues((prev) => {
            const newValues = { ...prev };

            if (!newValues[label]) {
              newValues[label] = [];
            }
      
            if (newValues[label].some((v) => v?.id === item?.id)) {
              newValues[label] = newValues[label].filter((v) => v?.id !== item?.id);
            } else {
              newValues[label] = [...newValues[label], item];
            }
      
            if (newValues[label]?.length === 0) {
              delete newValues[label];
            }
      
            return newValues;
        });
    };

    const submitFilter = () => {
        setIsFilter(true);
        setCheckValue(selectedValues);
        setModalFilterOpen(false);
    };

    const submitSearch = () => {
        let arr = [];
        console.log(searchInput);
        if(searchInput?.name) arr?.push(`name: ${searchInput?.name}`);
        setSearchForm(prev => ({  // Using prev to ensure the reference changes
            ...prev,
            name: searchInput?.name
        }));
        setListFilter([
            ...listFilter?.filter(data => !data?.includes('name')),
            ...arr
        ]);
        setIsFilter(true);
        setModalFilterOpen(false);
    }

    const handleClick = (data) => {
        const targetData = listData?.find((obj) => obj?.id === data?.id);
        
        let shiftData = {};
        let targetShiftData = {};
        if(activeMenu === 'Tukar Shift'){
            shiftData = listShift?.find(obj => obj?.value === targetData?.shiftFromID);
            targetShiftData = listShift?.find(obj => obj?.value === targetData?.shiftToID);
            console.log(targetData?.shiftFromID);
        }

        setFormData({
            id: targetData?.id,
            employeeID: targetData?.employeeID,
            transDate: targetData?.transDate,
            duration: targetData?.duration,
            unattendanceTypeID: targetData?.unattendanceTypeID,
            startDate: activeMenu !== 'Lembur' ? targetData?.startDate : (`${convertDate(targetData?.startDate, 'input')} ${convertDate(targetData?.startDate, 'time')}`),
            endDate: activeMenu !== 'Lembur' ? targetData?.endDate : (`${convertDate(targetData?.endDate, 'input')} ${convertDate(targetData?.endDate, 'time')}`),
            reasonID: targetData?.reasonID,
            description: targetData?.description,
            shiftFromID: targetData?.shiftFromID,
            shiftToID: targetData?.shiftToID,
            hourDiff: targetData?.hourDiff,
            clockIn: shiftData?.clockIn || null,
            clockOut: shiftData?.clockOut || null,
        })
        setBtnApprove(targetData?.isApproved1 && targetData?.isApproved2 ? false : true);
        setRowActive(targetData?.id);
        setShowForm(true);
        setIsAdd(false);
        setIsEdit(true);
    }

    const renderFilter = useMemo(() => {
        const listFilterData = [
            {
                title: 'Department',
                target: 'department',
                data: listDepartEmpl
            },
            {
                title: 'Division',
                target: 'division',
                data: listDivEmpl
            }
        ];

        let arrFilter = selectedValues;

        return (
            <Modal isOpen={isModalFilterOpen} onClose={closeModalFilter} position={modalContent === 'filter' ? "right" : "center"}>
                <div className="relative bg-white rounded-lg shadow-sm">
                    <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-200">
                        <div className="flex flex-row items-center">
                            <IconImage source={filter} size="small"/>
                            <h3 className="text-base font-semibold text-gray-900 pl-2">
                            {modalContent === 'filter' ? 'Pilih Filter' : 'Cari Data Karyawan'}
                            </h3>
                        </div>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={() => setModalFilterOpen(false)}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
                    </div>
                    {modalContent === 'filter' ? 
                    <>
                        <div className="pt-4 min-h-[400px] max-h-[450px] overflow-y-auto">
                            {listFilterData?.map((value, idx) => (
                                <CollapseMenu key={idx} title={value.title} isSetOpen={idx === 0 ? true : false}>
                                    {value?.data?.map((val, index) => (
                                        <div key={index}>
                                            <div className="flex flex-row py-2 px-4 cursor-pointer">
                                                <input type="checkbox" id={`check${value?.target}${val?.id}`} value={val?.id} checked={arrFilter[value?.target]?.some((v) => v?.id === val?.id) || false} onChange={() => handleCheckbox(val, value?.target)} />
                                                <label htmlFor={`check${value?.target}${val?.id}`} className="text-xs pl-2 cursor-pointer">{val?.value}</label>
                                            </div>
                                        </div>
                                    ))}
                                </CollapseMenu>
                            ))}
                        </div>

                        <div className="p-4 flex flex-row items-center w-full">
                            <Button setWidth={'auto'} bgcolor={'white'} handleAction={() => {
                                setSelectedValues({});
                            }} icon={reload} />
                            <div className="mx-1" />
                            <Button text={'Terapkan Filter'} setWidth={'auto'} icon={filter_w} bgcolor={baseColor} color={'white'} handleAction={() => submitFilter()} />
                        </div>
                    </>
                    :
                    <>
                        <div className="flex flex-row items-center w-full px-4 pt-4 pb-4">
                            <div className="mx-2" />
                            <SearchableSelect  handleAction={handleSearchChange} isFocus={true} name={'name'} value={searchInput?.name} options={listSearch} useSearchIcon={true} placeHolder={`Search Employee ${targetSearch ?? ''}...`} setPosition="bottom" />
                            <div className="mx-2" />
                        </div>
                        <div className="border-t px-6 py-3 rounded-t border-gray-200">
                            <Button text="Cari Karyawan" showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={() => submitSearch()} />
                        </div>
                    </>
                    }
                 </div>
            </Modal>
        )
    }, [isModalFilterOpen, selectedValues, searchInput, modalContent]);

    const subMenu = [
        {
            title: 'Ketidakhadiran',
            navRoute: null,
            handleAction: () => triggerChange('Ketidakhadiran')
        },
        {
            title: 'Lembur',
            navRoute: null,
            handleAction: () => triggerChange('Lembur')
        },
        {
            title: 'Tukar Shift',
            navRoute: null,
            handleAction: () => triggerChange('Tukar Shift')
        }
    ];

    return (
        <>
            <TitlePage label={`Approval ${activeMenu}`} subLabel={activeMenu} source={list} isAction={true} subMenu={subMenu}/>
            <div>
                {!isLoadData ? 
                    <div className="flex flex-row justify-between">
                        <div style={{width: '85%'}}>
                            <div className="mb-3 flex flex-row justify-between">
                                <div className="flex flex-row items-center justify-start w-full">
                                    <MyDatePicker placeholder="Pilih Periode" isRange={true} setWidth="250px" startDateVal={startDateVal} setStartDateVal={setStartDateVal} endDateVal={endDateVal} setEndDateVal={setEndDateVal} />
                                    <div className="mx-2" />
                                    <Button setWidth="auto" bgcolor={'white'} icon={search} handleAction={() => {
                                        setModalContent('search')
                                        openModalFilter();
                                    }} />
                                    <div className="mx-2" />
                                    <Button setWidth="auto" bgcolor={'white'} icon={filterData} handleAction={() => {
                                        setModalContent('filter')
                                        openModalFilter();
                                    }} />
                                </div>
                                <div className="flex flex-row items-center justify-end w-full">
                                    <Button setWidth="auto" bgcolor={'white'} isGray={true} icon={arrow_left_g} />
                                    <div className="mx-[6px]" />
                                    <p className="w-[40px] text-center text-sm">{`1/1`}</p>
                                    <div className="mx-[6px]" />
                                    <Button setWidth="auto" bgcolor={'white'} isGray={true} icon={arrow_right_g} />
                                </div>
                            </div>
                            <FilterContent isActive={isFilter} listFilter={listFilter} checkedValue={selectedValues} setCheckValue={setSelectedValues} />
                            <DataTable dataTable={listData} showCheck={true} columns={tableColumn} actionClick={handleClick} rowActive={rowActive} />
                        </div>
                        <div className="mx-2" />
                        {activeMenu === 'Ketidakhadiran' && <FormUnattendance userData={userData} showForm={showForm} dataObj={formData} setWidth={'50%'} listType={typeUnattendance}  listEmployee={listEmployee} handleChange={handleChange} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} btnApprove={btnApprove} btnAction={false} handleAfterExecute={handleAfterExecute} inputLock={true} />}
                        {activeMenu === 'Lembur' && <FormOvertime userData={userData} showForm={showForm} dataObj={formData} setWidth={'50%'} listType={typeOvt} listEmployee={listEmployee} handleChange={handleChange} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} btnApprove={btnApprove} btnAction={false} handleAfterExecute={handleAfterExecute} inputLock={true} /> }
                        {activeMenu === 'Tukar Shift' && <FormShift userData={userData} showForm={showForm} setWidth={'50%'} dataObj={formData} listEmployee={listEmployee} handleChange={handleChange} isAdd={isAdd} isEdit={isEdit} setIsAdd={setIsAdd} setIsEdit={setIsEdit} inputLock={true} showLogs={false} listShift={listShift} btnApprove={btnApprove} btnAction={false} handleAfterExecute={handleAfterExecute}/> }
                    </div>
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
            </div>
            {renderFilter}
        </>
    );
}

export default Approval;