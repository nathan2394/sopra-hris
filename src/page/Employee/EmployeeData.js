import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { convertDate, exportToExcel, getCurrentDate } from "../../config/helper";
import Modal from "../../component/modal";
import Input from "../../component/input";
import Button from "../../component/button";
import { baseColor } from "../../config/setting";
import TitlePage from "../../component/titlePage";
import { employee, filter, filter_w, reload } from "../../config/icon";
import IconImage from "../../component/icon_img";
import Table from "../../component/table";
import LoadingIndicator from "../../component/loading_indicator";
import CollapseMenu from "../../component/collapse_menu";
import AlertPopUp from "../../component/popupAlert";
import { useAPI } from "../../config/fetchApi";
import SearchableSelect from "../../component/select2";

const EmployeeData = ({setIsLoading}) => {
    const navigate = useNavigate();
    const { loadData } = useAPI();
    const localFilter = JSON.parse(localStorage?.getItem('filterEmpl'));

    const [listData, setListData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoadData, setIsLoadData] = useState(true);

    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [listDepart, setListDepart] = useState([]);
    const [listDiv, setListDiv] = useState([]);
    const [firstLoad, setFirstLoad] = useState(false);

    const [checkedValue, setCheckValue] = useState(localFilter?.checkedValue ?? {});
    const [selectedValues, setSelectedValues] = useState(localFilter?.checkedValue ?? {});

    const [searchForm, setSearchForm] = useState({
        name    : localFilter?.name ?? '',
        nik     : localFilter?.nik ?? '',
        ktp     : localFilter?.ktp ?? '',
        group   : localFilter?.group ?? 0,
        department : localFilter?.department ?? 0,
        division : localFilter?.division ?? 0,
        type: localFilter?.type ?? 0
    });

    const [searchInput, setSearchInput] = useState({
        name    : '',
        nik     : '',
        ktp     : '',
    })

    const [listSearch, setlistSearch] = useState({
        name: [],
        nik: [],
        ktp: []
    })

    const [targetSearch, setTargetSearch] = useState('name');

    const listSearchType = [
        { value: 'name', label: 'Nama' },
        { value: 'nik', label: 'NIK' },
        { value: 'ktp', label: 'KTP' }
    ];

    const [isFilter, setIsFilter] = useState(false);
    const [listFilter, setListFilter] = useState(localFilter?.listFilter ?? []);

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

    useEffect(() => {
        const handleKeyDownSubmit = (event) => {
            if (event.key === "Enter") {
                setCheckValue(selectedValues);
                setModalFilterOpen(false);
            }
        };
    
        if (isModalFilterOpen) {
            document.addEventListener("keydown", handleKeyDownSubmit);
        }
    
        return () => {
            document.removeEventListener("keydown", handleKeyDownSubmit);
        };
    }, [isModalFilterOpen, selectedValues]);
    

    const fetchEmployeeData = () => {
        console.log('test')
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
                const filteredData = res.data.map((obj, idx) => (
                    {
                        'no' : idx+1,
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

                if(!firstLoad){
                    setlistSearch({
                        name: res.data.map((obj) => ({label: obj?.employeeName, value: obj?.employeeName})),
                        nik: res.data.map((obj) => ({label: obj?.nik, value: obj?.nik})),
                        ktp: res.data.map((obj) => ({label: obj?.ktp, value: obj?.ktp}))
                    })
                    setFirstLoad(true);
                }

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
            fetchEmployeeData();
            localStorage?.setItem('filterEmpl', JSON.stringify({
                name    : searchForm?.name,
                nik     : searchForm?.nik,
                ktp     : searchForm?.ktp,
                group   : searchForm?.group,
                department : searchForm?.department,
                division : searchForm?.division,
                type: searchForm?.type,
                listFilter: listFilter,
                checkedValue: checkedValue
            }))
        }
    }, [searchForm?.group, searchForm?.department, searchForm?.division, searchForm?.name, searchForm?.nik, searchForm?.ktp, searchForm?.type])

    useEffect(() => {
        setIsFilter((listFilter?.length > 0 || JSON.stringify(checkedValue) !== "{}") ? true : false);
    }, [listFilter, checkedValue]);

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

    const submitSearch = () => {
        console.log('trigger', searchInput);
        // fetchEmployeeData();
        
        let arr = [];
        if(searchInput?.name) arr?.push(`name: ${searchInput?.name}`);
        if(searchInput?.nik) arr?.push(`nik: ${searchInput?.nik}`);
        if(searchInput?.ktp) arr?.push(`no.ktp: ${searchInput?.ktp}`);
        setSearchForm({
            ...searchForm,
            name: searchInput?.name,
            nik: searchInput?.nik,
            ktp: searchInput?.ktp
        })
        setListFilter([
            ...listFilter?.filter(data => !data?.includes('name') && !data?.includes('nik') && !data?.includes('no.ktp')),
            ...arr
        ]);
        setModalOpen(false);
    }

    const handleChange = (event) => {
        setSearchInput((prev) => ({
          ...prev,
          [event.target.name]: event.target.value,
        }));
    };

    const removeFilters = (target) => {
        if(target){
            const arrFilter = listFilter?.filter(val => !val?.includes(target))
            setListFilter(arrFilter);
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
                        'dateOfBirth': convertDate(obj?.dateOfBirth),
                        'gender': obj?.gender,
                        'email': obj?.email,
                        'phoneNumber': obj?.phoneNumber,
                        'ktp': obj?.ktp,
                        'startWorkingDate': convertDate(obj?.startWorkingDate),
                        'startJointDate': convertDate(obj?.startJointDate),
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

    const beforeNavigate = (targetId, index) => {
        localStorage?.setItem('empolyeeList', JSON.stringify( listData?.map((obj, idx) => (
            {
                id: obj?.id,
                name: obj?.employeeName,
                nik: obj?.nik,
                ktp: obj?.ktp,
                index: idx
            }
        ))));
        navigate(`/employee/detail?id=${targetId}`)
    }

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
        setCheckValue(selectedValues);
        setModalFilterOpen(false);
    }

    const renderFilter = useMemo(() => {
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
                        <div className="flex flex-row items-center">
                            <IconImage source={filter} size="small"/>
                            <h3 className="text-base font-semibold text-gray-900 pl-2">
                                Pilih Filter
                            </h3>
                        </div>
                        <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={() => setModalFilterOpen(false)}>
                            <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                            </svg>
                        </button>
                    </div>
                    {/* <!-- Modal body --> */}
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
                 </div>
            </Modal>
        )
    }, [isModalFilterOpen, selectedValues])

    const renderModal = useMemo(() => {
        return(
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="relative bg-white rounded-lg shadow-sm ">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 ">
                        Cari Data Karyawan
                    </h3>
                    <button type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center " data-modal-toggle="crud-modal" onClick={() => setModalOpen(false)}>
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                {/* <!-- Modal body --> */}
                <div className="">
                    <div className="flex flex-row items-center w-full px-4 pt-4 pb-2">
                        {/* <Input label={'Name'} isFocus={true} setName='name' value={searchInput.name} type={'text'} placeholder={"Search Employee Name..."} handleKeyDown={handleKeyDown} handleAction={handleChange} /> */}
                        <SearchableSelect setWidth="28%" options={listSearchType} value={targetSearch} setValue={setTargetSearch} />
                        <div className="mx-1" />
                        <SearchableSelect setWidth="65%" handleAction={handleChange} isFocus={true} name={targetSearch} value={searchInput[targetSearch]} options={listSearch[targetSearch]} useSearchIcon={true} placeHolder={`Search Employee ${targetSearch ?? ''}...`} setPosition="bottom" />
                        <div className="mx-2" />
                        {/* <Input label={'NIK'} setName='nik' value={searchInput.nik} type={'text'} placeholder={"Search Employee NIK..."} handleKeyDown={handleKeyDown} handleAction={handleChange} />
                        <SearchableSelect handleAction={handleChangeSelect} label={'NIK'} name={'nik'} value={searchInput.nik} options={listSearch?.listNIK} useSearchIcon={true} placeHolder={"Search Employee NIK..."} setPosition="bottom" />
                        <div className="mx-2" />
                        <Input label={'No. KTP'} setName='ktp' value={searchInput.ktp} type={'text'} placeholder={"Search Employee No. KTP..."} handleKeyDown={handleKeyDown} handleAction={handleChange} />
                        <SearchableSelect handleAction={handleChangeSelect} label={'No. KTP'} name={'ktp'} value={searchInput.ktp} options={listSearch?.listKTP} useSearchIcon={true} placeHolder={"Search Employee No. KTP..."} setPosition="bottom" /> */}
                    </div>
                    <div className="border-t px-6 py-3 rounded-t border-gray-200">
                        <Button text="Cari Karyawan" showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={() => submitSearch()} />
                    </div>
                </div>
            </div>
        </Modal>
    )}, [isModalOpen, searchInput, listSearch, targetSearch]);

    return (
        <>
            <TitlePage label={'Employee Data'} source={employee} isAction={true} handleAdd={() => navigate('/employee/detail?action=add')} handleSearch={() => {
                openModal();
            }} handleExport={(e) => exportFile('default', e)} handleFilter={() => openModalFilter()} />
            <div>
                {isFilter &&                
                    <div className="mt-2 flex flex-row items-center justify-between">
                        <div className="flex flex-row items-center">
                            <IconImage size="small" source={filter} />
                            <p className="font-bold text-sm px-2">Filter By:</p>
                            <div className="flex flex-wrap gap-1">
                                {listFilter?.map((val, idx) => (
                                    <div className="flex flex-row pl-2 text-xs" key={idx}>
                                        <span className="px-2 py-1 bg-white border border-gray-200 rounded-full flex items-center text-xs" style={{fontSize: '12px'}}>
                                        {val}
                                            <button
                                                onClick={() => removeFilters(val)}
                                                className={`ml-2 text-[${baseColor}] font-bold text-xs`}
                                            >
                                                ✕
                                            </button>
                                        </span>
                                    </div>
                                ))}
                                <div className="flex flex-wrap gap-1">
                                    {Object.entries(checkedValue).map(([label, values]) =>
                                        values.map((item) => (
                                            <span key={`${label}-${item.id}`} className="px-2 py-1 bg-white border border-gray-200 rounded-full flex items-center text-xs" style={{fontSize: '12px'}}>
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
                        <div>
                            <Button text="Reset Filter" bgcolor={baseColor} color={'white'} setWidth="auto" setPadding="5px" handleAction={() => {
                                setSearchForm({
                                    name    : '',
                                    nik     : '',
                                    ktp     : '',
                                    group   : 0,
                                    department : 0,
                                    division : 0,
                                    type: 0
                                });
                                setSelectedValues({});
                                setCheckValue({});
                                setListFilter([]);
                            }} />
                        </div>
                    </div>
                }

                <div className="pt-4 pb-2">
                    <p className="text-xs font-semibold">Total Output: {listData?.length}</p>
                </div>
                {!isLoadData ? 
                    <Table dataTable={listData} isAction={true} beforeNavigate={beforeNavigate} detailPath={'/employee/detail?id='}  />
                    :
                    <div className="mt-20">
                        <LoadingIndicator position="bottom" label="Loading..." showText={true} size="large" />
                    </div>
                }
            </div>
            {renderModal}
            {/* <SearchModal isOpen={isModalOpen} onClose={closeModal} searchInput={searchInput} handleChange={handleChange} handleKeyDown={handleKeyDown} submitSearch={submitSearch} /> */}
            {renderFilter}
        </>
    );
}

export default EmployeeData;