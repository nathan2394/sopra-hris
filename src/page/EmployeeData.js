import React, { useEffect, useRef, useState } from "react";
import { employee, search } from "../config/icon";
import TitlePage from "../component/titlePage";
import { loadData } from "../config/api";
import Table from "../component/table";
import Button from "../component/button";
import Modal from "../component/modal";
import Input from "../component/input";
import { baseColor } from "../config/setting";
import Select from "../component/select";
import LoadingIndicator from "../component/loading_indicator";

const EmployeeData = () => {
    const [data, listData] = useState([]);
    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [isModalOpen, setModalOpen] = useState(false);
    const [isLoadData, setIsLoadData] = useState(true);

    const [filterGroup, setFilterGroup] = useState('');
    const [filterType, setFilterType] = useState('');

    const [valueGroup, setValueGroup] = useState('');
    const [valueType, setValueType] = useState('');

    const [searchForm, setSearchForm] = useState({
        name    : '',
        nik     : '',
        ktp     : '',
        group   : 0
    })

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    useEffect(() => {
        setSearchForm({
            ...searchForm,
            group: filterGroup
        })
    }, [filterGroup, filterType])

    useEffect(() => {
        loadData({url: 'EmployeeType'}).then((res) => {
            setListType(res?.data?.map((data) => (
                {
                    id: data?.groupID,
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

        loadData({url: 'Employees'}).then((res) => {
            if(res?.data?.length > 0){
                const filteredData = res.data.map(obj =>
                    Object.fromEntries(
                      Object.entries(obj).filter(([key]) => (!key.includes('ID') || key.includes('employeeID')) && !key.includes('dateIn')  && !key.includes('dateUp')  && !key.includes('userIn') && !key.includes('userUp') && !key.includes('isDeleted'))
                    )
                );
                listData(filteredData);
                setIsLoadData(false);
            }
        })
    }, []);

    const fetchEmployeeData = () => {
        const params = [
            {
                title: 'filter',
                value: `${searchForm?.name ? 'name:' + searchForm?.name +'|' : ''} ${searchForm?.nik ? 'nik:' + searchForm?.nik +'|' : ''} ${searchForm?.ktp ? 'ktp:' + searchForm?.ktp +'|' : ''}`
            }
        ];

        loadData({url: 'Employees', params: params}).then((res) => {
            listData(res?.data);
            setIsLoadData(false);
        })
    }

    const submitSearch = () => {
        fetchEmployeeData();
        setModalOpen(false);
    }

    const handleChange = (event) => {
        setSearchForm({
          ...searchForm,
          [event.target.name]: event.target.value,
        });
    };

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
                        <Input label={'Name'} setName='name' value={searchForm.name} type={'text'} placeholder={"Search Employee Name..."} handleAction={handleChange} />
                        <div className="mx-2" />
                        <Input label={'NIK'} setName='nik' value={searchForm.nik} type={'text'} placeholder={"Search Employee NIK..."} handleAction={handleChange} />
                        <div className="mx-2" />
                        <Input label={'No. KTP'} setName='ktp' value={searchForm.ktp} type={'text'} placeholder={"Search Employee No. KTP..."} handleAction={handleChange} />
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

    return (
        <>
            <TitlePage label={'Employee Data'} source={employee} />
            <div>
                <div className="flex flex-row justify-between items-center">
                    <Button text="Search" setWidth="auto" bgcolor={'white'} icon={search} handleAction={() => openModal()} />
                    <div className="flex flex-row">
                        <Select data={listGroup} defaultLabel="Group" value={valueGroup} setValue={setValueGroup} filterVal={filterGroup} setFilter={setFilterGroup} />
                        <Select data={listType} defaultLabel="Employee Type" value={valueType} setValue={setValueType} filterVal={filterType} setFilter={setFilterType} />
                    </div>
                </div>
                {!isLoadData ? 
                    <Table dataTable={data} isAction={true} />
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