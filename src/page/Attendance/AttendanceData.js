import React, { useCallback, useEffect, useRef, useState } from "react";
import { data, Link, useNavigate } from 'react-router-dom';
// import { deleteData, loadData } from "../../config/api";
import { useAPI } from "../../config/fetchApi";
import { convertDate, exportToExcel, getCurrentDate } from "../../config/helper";
import Modal from "../../component/modal";
import Input from "../../component/input";
import Button from "../../component/button";
import { baseColor } from "../../config/setting";
import TitlePage from "../../component/titlePage";
import { employee, filter, kehadiran, reload } from "../../config/icon";
import IconImage from "../../component/icon_img";
import Table from "../../component/table";
import LoadingIndicator from "../../component/loading_indicator";
import CollapseMenu from "../../component/collapse_menu";
import AlertPopUp from "../../component/popupAlert";
import DataTable from "../../component/dataTable";
import SearchableSelect from "../../component/select2";

const AttendanceData = ({setIsLoading}) => {
    const { deleteData, loadData } = useAPI();
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('userdata'));
    const localSetPeriod = JSON.parse(localStorage?.getItem('setPeriod'));
    const localFilter = JSON.parse(localStorage?.getItem('filterEmpl'));

    const [isSubmit, setIsSubmit] = useState(false);
    const [listData, setListData] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoadData, setIsLoadData] = useState(true);

    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [listDepart, setListDepart] = useState([]);
    const [listDiv, setListDiv] = useState([]);

    const [checkedValue, setCheckValue] = useState({});
    const [selectedValues, setSelectedValues] = useState({});

    const [listSearch, setlistSearch] = useState({
        name: [],
    })
    const [firstLoad, setFirstLoad] = useState(false);
    // const [endDate, setEndDate] = useState(localSetPeriod?.endDate || convertDate(currentDate, 'input'));
    // const [startDate, setStartDate] = useState(localSetPeriod?.startDate || convertDate(currentDate.setDate(currentDate.getDate() - 30), 'input'));

    const currentDate = new Date();
    const prevMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 24);

    const [endDate, setEndDate] = useState(localSetPeriod?.endDate || convertDate(currentDate, 'input'));
    const [startDate, setStartDate] = useState(localSetPeriod?.startDate || convertDate(prevMonthDate, 'input'));

    const [searchForm, setSearchForm] = useState({
        name    : localFilter?.name ?? '',
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
        });

        if(JSON?.stringify(localSetPeriod) !== '{}'){
            fetchAttendanceData();
        }
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
    

    const fetchAttendanceData = () => {
        setIsLoadData(true);
        setIsLoading(true);

        const params = [
            {
                title: 'filter',
                value: `${searchInput?.name ? 'name:' + searchInput?.name +'|' : ''}`
            }
        ];

        loadData({url: `Attendances/${convertDate(startDate, 'input')}|${convertDate(endDate, 'input')}`, params: params}).then((res) => {
            if(res?.data?.length > 0){
                const filteredData = res?.data?.map((obj, idx) => {
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
                        id: idx+1,
                        ...filteredObj,
                    };
                });

                setListData(filteredData);
                setIsLoadData(false);
                setIsLoading(false);
                localStorage?.setItem('setPeriod', JSON.stringify({startDate: startDate, endDate: endDate}));
                localStorage?.setItem('employeeList', JSON.stringify( filteredData?.map((obj, idx) => (
                    {
                        id: obj?.id,
                        name: obj?.employeeName,
                        nik: obj?.nik,
                        ktp: obj?.ktp,
                        index: idx
                    }
                ))));

                if(!firstLoad){
                    setlistSearch({
                        name: res.data.map((obj) => ({label: obj?.employeeName, value: obj?.employeeName})),
                    })
                    setFirstLoad(true);
                }
            }else{
                setListData([]);
                setIsLoadData(false);
                setIsLoading(false);
            }
        })
    }

    useEffect(() => {
        if(!isLoadData){
            fetchAttendanceData();
        }
    }, [searchForm?.group, searchForm?.department, searchForm?.division, searchForm?.name, searchForm?.nik, searchForm?.ktp, searchForm?.type])

    useEffect(() => {
        setIsFilter((listFilter?.length > 0) ? true : false);
    }, [listFilter]);

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
        fetchAttendanceData();
        localStorage?.setItem('filterEmpl', JSON.stringify({
            name    : searchForm?.name,
        }))
        
        let arr = [];
        if(searchInput?.name) arr?.push(`name: ${searchInput?.name}`);
        setSearchForm({
            ...searchForm,
            name: searchInput?.name,
        })
        setListFilter([
            ...listFilter?.filter(data => !data?.includes('name') && !data?.includes('nik') && !data?.includes('no.ktp')),
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

    const renderModal = () => (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
            <div className="relative bg-white rounded-lg shadow-sm ">
                {/* <!-- Modal header --> */}
                <div className="flex items-center justify-between p-4 border-b rounded-t border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 ">
                        Cari Nama Karyawan
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
                    <div className="flex flex-row items-center w-full pb-4">
                        <SearchableSelect handleAction={handleChange} isFocus={true} name={'name'} value={searchInput['name']} options={listSearch['name']} useSearchIcon={true} placeHolder={`Search Employee name...`} setPosition="bottom" />
                    </div>
                    <div className="flex flex-row w-full">
                        <Button text="Tutup" showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={() => closeModal()} />
                        <div className="mx-1" />
                        <Button text="Terapkan" showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={() => submitSearch()} />
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

    const handleSubmitPeriod = () => {
        setIsSubmit(true);
        fetchAttendanceData();
    }

    const handleClick = (data) => {
        navigate(`/attendance/detail?employeeId=${data?.employeeID}`);
    }

    const setColumns = [
        { field: "employeeName", header: "Nama Karyawan", alignment: "left", render: (_, row) => 
            userData?.roleID !== 4 ?
            <Link to={`/employee/detail?id=${row?.employeeID}`} className="text-[#369D00] underline" onClick={(e) => e.stopPropagation()}> {row?.employeeName} </Link> 
            :
            <> {row?.employeeName} </> 
        },
        { field: "nik", header: "NIK", alignment: "left"},
        { field: "groupType", header: "Grade", alignment: "center" },
        { field: "employeeTypeName", header: "Tipe Karyawan", alignment: "left" },
        { field: "departmentName", header: "Departemen", alignment: 'left' },
        { field: "divisionName", header: "Divisi", alignment: 'left' },
        { field: "groupShiftName", header: "Grup Shift", alignment: 'left' },
        { field: "hks", header: "HKS", alignment: 'center' },
        { field: "hka", header: "HKA", alignment: 'center' },
        { field: "att", header: "ATT", alignment: 'center' },
        { field: "late", header: "LATE", alignment: 'center' },
        { field: "ovt", header: "OVT", alignment: 'center' },
        { field: "absent", header: "ABSENT", alignment: 'center' }
    ]

    return (
        <>
            <TitlePage label={'Kehadiran'} source={kehadiran} handleSubmit={handleSubmitPeriod} startDateVal={startDate} setStartDateVal={setStartDate} endDateVal={endDate} setEndDateVal={setEndDate} isAction={true} handleSearch={() => openModal()} />
            {/* handleSearch={() => {openModal(); }} handleFilter={() => openModalFilter()} /> */}
            <div>
            {isFilter &&                
                    <div className="mt-2 flex flex-row items-center justify-between mb-3">
                        <div className="flex flex-row items-center">
                            <IconImage size="small" source={filter} />
                            <p className="font-bold text-sm px-2">Filter By:</p>
                            <div className="flex flex-wrap gap-1">
                                {listFilter?.map((val, idx) => (
                                    <div className="flex flex-row pl-1 text-xs" key={idx}>
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

                <DataTable dataTable={listData} columns={setColumns} isAction={true} actionClick={handleClick}  />
            </div>
            {/* <AlertPopUp isOpen={isAlert} /> */}
            {renderModal()}
        </>
    );
}

export default AttendanceData;