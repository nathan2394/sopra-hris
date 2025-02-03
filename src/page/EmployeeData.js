import React, { useEffect, useRef, useState } from "react";
import { employee, filter, reload, search } from "../config/icon";
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
import { coverDate, exportToExcel, getCurrentDate } from "../config/helper";
import { data, Link, useNavigate } from 'react-router-dom';
import Collapse from "../component/collapse";

const EmployeeData = ({setIsLoading}) => {
    const navigate = useNavigate();

    const [listData, setListData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoadData, setIsLoadData] = useState(true);

    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [listDepart, setListDepart] = useState([]);
    const [listDiv, setListDiv] = useState([]);

    const [checkedValue, setCheckValue] = useState({});
    const [selectedValues, setSelectedValues] = useState({});

    const [searchForm, setSearchForm] = useState({
        name    : '',
        nik     : '',
        ktp     : '',
        group   : 0,
        department : 0,
        division : 0,
        type: 0
    });

    const [searchInput, setSearchInput] = useState({
        name    : '',
        nik     : '',
        ktp     : '',
    })

    const [isFilter, setIsFilter] = useState(false);
    const [listFilter, setListFilter] = useState([]);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    const [isModalFilterOpen, setModalFilterOpen] = useState(false);

    const openModalFilter = () => setModalFilterOpen(true);
    const closeModalFilter = () => setModalFilterOpen(false);

    useEffect(() => {
        loadData({url: 'EmployeeType'}).then((res) => {
            setListType(res?.data?.map((data) => (
                {
                    id: data?.employeeTypeID,
                    value: data?.name
                }
            )));
        })

        loadData({url: 'Groups'}).then((res) => {
            setListGroup(res?.data?.map((data) => (
                {
                    id: data?.groupID,
                    value: `${data?.type}` + `${data?.name ? ` - ${data?.name}` : ''}`
                }
            )));
        })

        loadData({url: 'Departments'}).then((res) => {
            setListDepart(res?.data?.map((data) => (
                {
                    id: data?.departmentID,
                    value: data?.name
                }
            )));
        })

        loadData({url: 'Divisions'}).then((res) => {
            setListDiv(res?.data?.map((data) => (
                {
                    id: data?.divisionID,
                    value: data?.name
                }
            )));
        })

        fetchEmployeeData();
    }, []);

    const fetchEmployeeData = () => {
        setIsLoadData(true);
        setIsLoading(true);

        const params = [
            {
                title: 'filter',
                value: `${searchForm?.name ? 'name:' + searchForm?.name +'|' : ''} ${searchForm?.nik ? 'nik:' + searchForm?.nik +'|' : ''} ${searchForm?.ktp ? 'ktp:' + searchForm?.ktp +'|' : ''} ${searchForm?.group ? 'group:' + searchForm?.group +'|' : ''} ${searchForm?.department ? 'department:' + searchForm?.department +'|' : ''} ${searchForm?.division ? 'division:' + searchForm?.division +'|' : ''} ${searchForm?.type ? 'employeeType:' + searchForm?.type +'|' : ''}`
            }
        ];

        loadData({url: 'Employees', params: params}).then((res) => {
            if(res?.data?.length > 0){
                const filteredData = res.data.map((obj) => (
                    {
                        'id' : obj?.employeeID,
                        'nik': obj?.nik,
                        'employeeName': obj?.employeeName,
                        'department': obj?.departmentName,
                        'division' : obj?.divisionName,
                        'grade':  `${obj?.groupType}` + `${obj?.groupName ? ` - ${obj?.groupName}` : ''}`,
                        'employeeType': obj?.employeeTypeName,
                        'jobTitle': obj?.employeeJobTitleName,
                        'function': obj?.functionName,
                        'placeOfBirth': obj?.placeOfBirth,
                        'dateOfBirth': obj?.dateOfBirth,
                        'gender': obj?.gender,
                        'email': obj?.email,
                        'phoneNumber': obj?.phoneNumber,
                        'ktp': obj?.ktp,
                        'startWorkDate': obj?.startWorkingDate,
                        'startJointDate': obj?.startJointDate,
                        'religion': obj?.religion,
                        'bpjstk': obj?.bpjstk,
                        'bpjskes': obj?.bpjskes,
                        'taxStatus': obj?.taxStatus,
                        'tkStatus': obj?.tkStatus,
                        'accountNo': obj?.accountNo,
                        'bank': obj?.bank
                    }
                ))

                setListData(filteredData);
                setIsLoadData(false);
                setIsLoading(false);
            }else{
                setListData([]);
                setIsLoadData(false);
                setIsLoading(false);
            }
        })
    }

    useEffect(() => {
        if(!isLoadData){
            // console.log('trigger', searchForm?.group, searchForm?.department, searchForm?.division)
            fetchEmployeeData();
        }
    }, [searchForm?.group, searchForm?.department, searchForm?.division, searchForm?.name, searchForm?.nik, searchForm?.ktp, searchForm?.type])

    useEffect(() => {
        setIsFilter((listFilter?.length > 0 || JSON.stringify(checkedValue) !== "{}") ? true : false);
    }, [listFilter, checkedValue]);

    useEffect(() => {
        setSearchForm({
            ...searchForm,
            group: checkedValue?.group?.map(item => item?.id)?.join(),
            department : checkedValue?.department?.map(item => item?.id)?.join(),
            division : checkedValue?.division?.map(item => item?.id)?.join(),
            type: checkedValue?.type?.map(item => item?.id)?.join()
        })
    }, [checkedValue])

    const submitSearch = () => {
        // fetchEmployeeData();
        
        let arr = [];
        if(searchInput?.name) arr?.push(`Name: ${searchInput?.name}`);
        if(searchInput?.nik) arr?.push(`NIK: ${searchInput?.nik}`);
        if(searchInput?.ktp) arr?.push(`No.KTP: ${searchInput?.ktp}`);
        setSearchForm({
            ...searchForm,
            name: searchInput?.name,
            nik: searchInput?.nik,
            ktp: searchInput?.ktp
        })
        setListFilter([
            ...listFilter,
            ...arr
        ]);
        setModalOpen(false);
    }

    const handleChange = (event) => {
        setSearchInput({
          ...searchForm,
          [event.target.name]: event.target.value,
        });
    };

    const removeFilters = (target) => {
        if(target){
            const arrFilter = listFilter?.filter(val => !val?.includes(target))
            setListFilter(arrFilter);
            //console.log(target?.toLowerCase()?.includes('name'))
            if(target?.toLowerCase()?.includes('name')) {
                setSearchForm({...searchForm, name: ''}) 
                setSearchInput({...searchInput, name: ''}) 
            }
            if(target?.toLowerCase()?.includes('nik')) { 
                setSearchForm({...searchForm, nik: ''}) 
                setSearchInput({...searchInput, name: ''}) 
            }
            if(target?.toLowerCase()?.includes('ktp')) { 
                setSearchForm({...searchForm, ktp: ''}) 
                setSearchInput({...searchInput, name: ''}) 
            }
        }
    }

    const removeFilter = (label, itemId) => {
        setCheckValue((prev) => {
          const newValues = { ...prev };
          newValues[label] = newValues[label].filter((v) => v.id !== itemId);
    
          if (newValues[label].length === 0) {
            delete newValues[label];
          }
    
          return newValues;
        });
    };

    const exportFile = (type, event) => {
        if (event) {
          event.preventDefault();
        }
    
        if(type === ''){
          alert('Please Select Export Type');
          return;
        }

        loadData({url: 'Employees'}).then((res) => {
            const todayDate = getCurrentDate();
            let filteredData = [];
            if(res?.data?.length > 0){
                filteredData = res.data.map((obj) => (
                    {
                        'employeeID' : obj?.employeeID,
                        'nik': obj?.nik,
                        'employeeName': obj?.employeeName,
                        'departmentName': obj?.departmentName,
                        'divisionName' : obj?.divisionName,
                        'grade': `${obj?.groupType}` + `${obj?.groupName ? ` - ${obj?.groupName}` : ''}`,
                        'employeeType': obj?.employeeTypeName,
                        'jobTitle': obj?.employeeJobTitleName,
                        'functionName': obj?.functionName,
                        'placeOfBirth': obj?.placeOfBirth,
                        'dateOfBirth': coverDate(obj?.dateOfBirth),
                        'gender': obj?.gender,
                        'email': obj?.email,
                        'phoneNumber': obj?.phoneNumber,
                        'ktp': obj?.ktp,
                        'startWorkingDate': coverDate(obj?.startWorkingDate),
                        'startJointDate': coverDate(obj?.startJointDate),
                        'religion': obj?.religion,
                        'bpjstk': obj?.bpjstk,
                        'bpjskes': obj?.bpjskes,
                        'taxStatus': obj?.taxStatus,
                        'tkStatus': obj?.tkStatus,
                        'accountNo': obj?.accountNo,
                        'bank': obj?.bank
                    }
                ))

                exportToExcel(filteredData, `Data_Employee_${todayDate}`, `${type === 'bank' ? 'bank' : 'default'}`)
            }
        })
    }

    const renderModal = () => (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="relative bg-white rounded-lg shadow-sm ">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 ">
                        Search Employee Data
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={() => setModalOpen(false)}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className="p-6">
                    <div className="flex flex-col">
                        <Input label={'Name'} setName='name' value={searchInput.name} type={'text'} placeholder={"Search Employee Name..."} handleAction={handleChange} />
                        <div className="mx-2" />
                        <Input label={'NIK'} setName='nik' value={searchInput.nik} type={'text'} placeholder={"Search Employee NIK..."} handleAction={handleChange} />
                        <div className="mx-2" />
                        <Input label={'No. KTP'} setName='ktp' value={searchInput.ktp} type={'text'} placeholder={"Search Employee No. KTP..."} handleAction={handleChange} />
                    </div>
                    <div className="flex flex-row w-full">
                        <Button text="Close" setWidth={'full'} showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={() => closeModal()} />
                        <div className="mx-1" />
                        <Button text="Submit" setWidth={'full'} showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={() => submitSearch()} />
                    </div>
                </div>
            </div>
        </Modal>
    );

    const handleCheckbox = (item, label) => {
        setSelectedValues((prev) => {
            const newValues = { ...prev };

            if (!newValues[label]) {
              newValues[label] = [];
            }
      
            // Check if the item already exists
            if (newValues[label].some((v) => v?.id === item?.id)) {
              // Remove if it exists
              newValues[label] = newValues[label].filter((v) => v?.id !== item?.id);
            } else {
              // Add new selection with label
              newValues[label] = [...newValues[label], item];
            }
      
            // If empty, remove the key to keep the state clean
            if (newValues[label]?.length === 0) {
              delete newValues[label];
            }
      
            return newValues;
        });
    };

    const submitFilter = () => {
        setModalFilterOpen(false);
        setCheckValue(selectedValues);
        console.log(selectedValues);
    }

    const renderFilter = () => {
        const listFilterData = [
            {
                title: 'Grade',
                target: 'group',
                data: listGroup
            },
            {
                title: 'Type',
                target: 'type',
                data: listType
            },
            {
                title: 'Department',
                target: 'department',
                data: listDepart
            },
            {
                title: 'Division',
                target: 'division',
                data: listDiv
            }
        ];

        let arrFilter = selectedValues;

        return (
            <Modal isOpen={isModalFilterOpen} onClose={closeModalFilter} position="right">
                <div className="relative bg-white rounded-lg shadow-sm">
                    {/* <!-- Modal header --> */}
                    <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-200">
                        <h3 className="text-lg font-semibold text-gray-900 ">
                            Filter
                        </h3>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={() => setModalFilterOpen(false)}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
                    </div>
                    {/* <!-- Modal body --> */}
                    <div className="pt-4 min-h-[400px] max-h-[450px] overflow-y-auto">
                        {listFilterData?.map((value, idx) => (
                            <Collapse key={idx} title={value.title}>
                                {value?.data?.map((val, index) => (
                                    <div key={index}>
                                        <div className="flex flex-row py-2 px-4">
                                            <input type="checkbox" value={val?.id} checked={arrFilter[value?.target]?.some((v) => v?.id === val?.id) || false} onChange={() => handleCheckbox(val, value?.target)} />
                                            <p className="text-xs pl-2">{val?.value}</p>
                                        </div>
                                    </div>
                                ))}
                            </Collapse>
                        ))}
                    </div>

                    <div className="p-4 flex flex-row items-center">
                        <Button setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={() => {
                            setSelectedValues({});
                        }} icon={reload} />
                        <div className="mx-1" />
                        <Button text={'Submit'} setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={() => submitFilter()} />
                    </div>
                 </div>
            </Modal>
        )
    }

    return (
        <>
            <TitlePage label={'Employee Data'} source={employee} isAction={true} handleAdd={() => navigate('/employee/detail?action=add')} handleSearch={() => openModal()} handleExport={(e) => exportFile('default', e)} handleFilter={() => openModalFilter()} />
            <div>
                {isFilter &&                
                    <div className="mt-4 flex flex-row items-center">
                        <IconImage size="small" source={filter} />
                        <p className="font-bold text-sm pl-2">Filter By:</p>
                        <div className="flex flex-wrap gap-2 pl-2">
                            {listFilter?.map((val, idx) => (
                                <div className="flex flex-row pl-2" key={idx}>
                                    {/* <div className="ml-2" />
                                    <Button text={val} setWidth={'full'} showBorder={true} position="center" bgcolor={baseColor} color={'white'} flagFilter={true} handleAction={removeFilters} /> */}
                                    <span className="px-2 py-1 bg-gray-200 rounded-full flex items-center">
                                    {val}
                                        <button
                                            onClick={() => removeFilters(val)}
                                            className={`ml-2 text-[${baseColor}] font-bold`}
                                        >
                                            ✕
                                        </button>
                                    </span>
                                </div>
                            ))}
                            <div className="flex flex-wrap gap-2 pl-2">
                                {Object.entries(checkedValue).map(([label, values]) =>
                                    values.map((item) => (
                                        <span key={`${label}-${item.id}`} className="px-2 py-1 bg-gray-200 rounded-full flex items-center">
                                        {label}: {item.value}
                                            <button
                                                onClick={() => removeFilter(label, item.id)}
                                                className={`ml-2 text-[${baseColor}] font-bold`}
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                }

                {!isLoadData ? 
                    <Table dataTable={listData} isAction={true} detailPath={'/employee/detail?id='} setIsFilter={setIsFilter} listFilter={listFilter} setListFilter={setListFilter} />
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
            </div>
            {renderModal()}
            {renderFilter()}
        </>
    );
}

export default EmployeeData;