import React, { useEffect, useRef, useState } from "react";
import { employee, filter, search } from "../config/icon";
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

const EmployeeData = () => {
    const [listData, setListData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoadData, setIsLoadData] = useState(true);

    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [listDepart, setListDepart] = useState([]);
    const [listDiv, setListDiv] = useState([]);

    const [filterGroup, setFilterGroup] = useState('');
    const [filterType, setFilterType] = useState('');
    const [filterDepart, setFilterDepart] = useState('');
    const [filterDiv, setFilterDiv] = useState('');

    const [valueGroup, setValueGroup] = useState('');
    const [valueType, setValueType] = useState('');
    const [valueDepart, setValueDepart] = useState('');
    const [valueDiv, setValueDiv] = useState('');

    const [isLoadExport, setIsLoadExport] = useState(false);

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
                    value: data?.name + `(${data?.type})`
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
                        'employeeID' : obj?.employeeID,
                        'nik': obj?.nik,
                        'employeeName': obj?.employeeName,
                        'departmentName': obj?.departmentName,
                        'divisionName' : obj?.divisionName,
                        'group': obj?.groupName + ` (${obj?.groupType})`,
                        'employeeType': obj?.employeeTypeName,
                        'jobTitle': obj?.employeeJobTitleName,
                        'functionName': obj?.functionName,
                        'placeOfBirth': obj?.placeOfBirth,
                        'dateOfBirth': obj?.dateOfBirth,
                        'gender': obj?.gender,
                        'email': obj?.email,
                        'phoneNumber': obj?.phoneNumber,
                        'ktp': obj?.ktp,
                        'startWorkingDate': obj?.startWorkingDate,
                        'startJointDate': obj?.startJointDate,
                        'religion': obj?.religion,
                        'bpjstk': obj?.bpjstk,
                        'bpjskes': obj?.bpjskes,
                        'taxStatus': obj?.taxStatus,
                        'tkStatus': obj?.tkStatus,
                        'accountNo': obj?.accountNo,
                        'bank': obj?.bank,
                        'basicSalary': obj?.basicSalary,
                    }
                ))

                setListData(filteredData);
                setIsLoadData(false);
            }else{
                setListData([]);
                setIsLoadData(false);
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
        setIsFilter(listFilter?.length > 0 ? true : false);
    }, [listFilter])

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

    const removeFilter = (target) => {
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

            if(target?.toLowerCase()?.includes('group')){
                setSearchForm({...searchForm, group: 0}) 
                setFilterGroup('');
            } 
            if(target?.toLowerCase()?.includes('type')){
                setSearchForm({...searchForm, type: 0});
                setFilterType('');
            } 
            if(target?.toLowerCase()?.includes('department')){
                setSearchForm({...searchForm, department: 0});
                setFilterDepart('');
            } 
            if(target?.toLowerCase()?.includes('division')){
                setSearchForm({...searchForm, division: 0});
                setFilterDiv('');
            } 
        }
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
                        'group': obj?.groupName + ` (${obj?.groupType})`,
                        'employeeType': obj?.employeeTypeName,
                        'jobTitle': obj?.employeeJobTitleName,
                        'functionName': obj?.functionName,
                        'placeOfBirth': obj?.placeOfBirth,
                        'dateOfBirth': obj?.dateOfBirth,
                        'gender': obj?.gender,
                        'email': obj?.email,
                        'phoneNumber': obj?.phoneNumber,
                        'ktp': obj?.ktp,
                        'startWorkingDate': obj?.startWorkingDate,
                        'startJointDate': obj?.startJointDate,
                        'religion': obj?.religion,
                        'bpjstk': obj?.bpjstk,
                        'bpjskes': obj?.bpjskes,
                        'taxStatus': obj?.taxStatus,
                        'tkStatus': obj?.tkStatus,
                        'accountNo': obj?.accountNo,
                        'bank': obj?.bank,
                        'basicSalary': obj?.basicSalary,
                    }
                ))

                exportToExcel(filteredData, `Data_Employee_${todayDate}`, `${type === 'bank' ? 'bank' : 'default'}`)
                setIsLoadExport(false);
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

    const changeSelectVal = (target, val) => {
        console.log(target, val)
        if(target){
            setSearchForm({
                ...searchForm,
                [target]: val
            })
        }
    }

    return (
        <>
            <TitlePage label={'Employee Data'} source={employee} />
            <div>
                <div className="flex flex-row justify-between items-center">
                    <div className="flex flex-row">
                        <Button text="Search" setWidth="auto" bgcolor={'white'} icon={search} handleAction={() => openModal()} />
                        <div className="mx-1" />
                        <Button text={'Export Data'} setWidth={'auto'} bgcolor={baseColor} color={'white'} isLoading={isLoadExport} handleAction={(e) => exportFile('default', e)} />
                    </div>
                    <div className="flex flex-row">
                        <Select data={listGroup} defaultLabel="Select Group" name={'group'} handleAction={changeSelectVal} value={valueGroup} setValue={setValueGroup} filterVal={filterGroup} setFilter={setFilterGroup} setIsFilter={setIsFilter} listFilter={listFilter} setListFilter={setListFilter} />
                        <Select data={listType} defaultLabel="Select Employee Type" name={'type'} handleAction={changeSelectVal} value={valueType} setValue={setValueType} filterVal={filterType} setFilter={setFilterType} setIsFilter={setIsFilter} listFilter={listFilter} setListFilter={setListFilter} />
                        <Select data={listDepart} defaultLabel="Select Departmen" name={'department'} handleAction={changeSelectVal} value={valueDepart} setValue={setValueDepart} filterVal={filterDepart} setFilter={setFilterDepart} setIsFilter={setIsFilter} listFilter={listFilter} setListFilter={setListFilter} />
                        <Select data={listDiv} defaultLabel="Select Divison" name={'division'} handleAction={changeSelectVal} value={valueDiv} setValue={setValueDiv} filterVal={filterDiv} setFilter={setFilterDiv} setIsFilter={setIsFilter} listFilter={listFilter} setListFilter={setListFilter} />
                    </div>
                </div>
                {isFilter &&                
                    <div className="mt-4 flex flex-row items-center">
                        <IconImage size="small" source={filter} />
                        <p className="font-bold text-sm pl-2">Filter By:</p>
                        {listFilter?.map((val, idx) => (
                            <div className="flex flex-row" key={idx}>
                                <div className="ml-2" />
                                <Button text={val} setWidth={'full'} showBorder={true} position="center" bgcolor={baseColor} color={'white'} flagFilter={true} handleAction={removeFilter} />
                            </div>
                        ))}
                    </div>
                }
                {!isLoadData ? 
                    <Table dataTable={listData} isAction={true} setIsFilter={setIsFilter} listFilter={listFilter} setListFilter={setListFilter} />
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
            </div>
            {renderModal()}
        </>
    );
}

export default EmployeeData;