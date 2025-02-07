import React, { useEffect, useRef, useState } from "react";
import TitlePage from "../../component/titlePage";
import Input from "../../component/input";
import { employee, empty, payroll } from "../../config/icon";
import { loadData } from "../../config/api";
import { coverDate, formatText, getMonthName, getQueryParam } from "../../config/helper";
import { baseColor } from "../../config/setting";
import { Link } from "react-router-dom";
import SearchableSelect from "../../component/select2";
import MyDatePicker from "../../component/date_picker";

const EmployeeForm = () => {

    const [isAdd] = useState(getQueryParam("action") === 'add' ? true : false);

    const [listAlD, setListAlD] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        nik: '',
        ktp: '',
        gender: '',
        religion: '',
        email: '',
        phoneNumber: '',
        placeOfBirth: '',
        dateOfBirth: '',
        startWorkingDate: '',
        functionID: '',
        departmentID: '',
        groupID: '',
        accountNo: '',
        bank: '',
        bpjstk: '0',
        bpjskes: '0',
        tkStatus: '',
        taxStatus: '',
        divisionID: '',
        basicSalary: 0,
        employeeTypeID: '',
        employeeJobTitleName: '',
        allowancedeductionDetails: [],
        masterEmployeePayroll: [],
        salaryHistories: [],
    });

    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [listFunc, setListFunc] = useState([]);
    const [listDepart, setListDepart] = useState([]);
    const [listDiv, setListDiv] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);

    useEffect(()=> {
        const getId = getQueryParam("id");
        if(getId){
            loadData({url: `Employees/${getId}`}).then((res) => {
                if(res?.data){
                    setFormData({
                        name: res?.data?.employeeName || '-',
                        nik: res?.data?.nik || '-',
                        ktp: res?.data?.ktp || '-',
                        gender: res?.data?.gender  || '-',
                        religion: res?.data?.religion  || '-',
                        email: res?.data?.email || '-',
                        phoneNumber: res?.data?.phoneNumber || '-',
                        placeOfBirth: res?.data?.placeOfBirth || '-',
                        dateOfBirth: res?.data?.dateOfBirth || '-',
                        startWorkingDate: res?.data?.startWorkingDate || '-',
                        groupID: res?.data?.groupID,
                        functionID: res?.data?.functionID  || '-',
                        departmentID: res?.data?.departmentID || '-',
                        accountNo: res?.data?.accountNo || '-',
                        bank: res?.data?.bank || '-',
                        bpjstk: res?.data?.bpjstk || '0',
                        bpjskes: res?.data?.bpjskes || '0',
                        taxStatus: res?.data?.taxStatus || '',
                        tkStatus: res?.data?.bpjskes || '',
                        divisionID: res?.data?.divisionID || '-',
                        basicSalary: res?.data?.basicSalary || '-',
                        employeeTypeID: res?.data?.employeeTypeID,
                        employeeJobTitleName: res?.data?.employeeJobTitleName || '-',
                        masterEmployeePayroll: res?.data?.masterEmployeePayroll,
                        salaryHistories: res?.data?.salaryHistories,
                        allowancedeductionDetails: res?.data?.allowanceDeductionDetails
                    })
                }
            })
        }

        loadData({url: 'EmployeeType'}).then((res) => {
            setListType(res?.data?.map((data) => (
                {
                    value: data?.employeeTypeID,
                    label: data?.name
                }
            )));
        })

        loadData({url: 'Functions'}).then((res) => {
            setListFunc(res?.data?.map((data) => (
                {
                    value: data?.functionID,
                    label: data?.name
                }
            )));
        })

        loadData({url: 'Groups'}).then((res) => {
            setListGroup(res?.data?.map((data) => (
                {
                    value: data?.groupID,
                    label: `${data?.type}` + `${data?.name ? ` - ${data?.name}` : ''}`
                }
            )));
        })

        loadData({url: 'Departments'}).then((res) => {
            setListDepart(res?.data?.map((data) => (
                {
                    value: data?.departmentID,
                    label: data?.name
                }
            )));
        })

        loadData({url: 'Divisions'}).then((res) => {
            setListDiv(res?.data?.map((data) => (
                {
                    value: data?.divisionID,
                    label: data?.name
                }
            )));
        })
    }, []);
  

    const TitleContent = ({text}) => {
        return (
            <div className="bg-[#333333c3] p-2 my-2 w-full rounded-lg">
                <p className="font-semibold text-white text-sm text-center">{text}</p>
            </div>
        );
    }

    return (
        <>
            <TitlePage label={'Data Karyawan'} subLabel={'Data Personal'} source={employee} type={'detail'} setNavigateBack={`/employee`} />
            <div className="flex flex-row justify-between">
                <div className="bg-white rounded-lg p-4 w-full mr-1">
                    <div>
                        <TitleContent text={`Data Diri Karyawan`} />
                        <div className="flex flex-row w-full mt-5">
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Name'} type={'text'} value={formData?.name} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'NIK'}  type={'text'} value={formData?.nik} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'No. KTP'} type={'text'} value={formData?.ktp} />
                        </div>
                        <div className="flex flex-row w-full">
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Gender'} type={'text'} value={formData?.gender} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'E-mail'}  type={'email'} value={formData?.email} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'No. Telp'} type={'text'} value={formData?.phoneNumber} />
                        </div>
                        <div className="flex flex-row w-full">
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Tempat Lahir'} type={'text'} value={formData?.placeOfBirth} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Tanggal Lahir'}  type={'date'} value={formData?.dateOfBirth} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Agama'} type={'text'} value={formData?.religion} />
                        </div>
                    </div>
                    <div>
                        <TitleContent text={`Data Pekerjaan`} />
                        <div className="flex flex-row w-full mt-5">
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Tanggal Mulai Bekerja'} type={'date'} value={formData?.startWorkingDate} />
                            <div className="mx-2" />
                            <SearchableSelect label={'Grade'} placeHolder={'Select Grade'} options={listGroup} value={formData?.groupID} isDisabled={isAdd ? false : isReadOnly} />
                            <div className="mx-2" />
                            <SearchableSelect label={'Fungsi'} placeHolder={'Select Function'} options={listFunc} value={formData?.functionID} isDisabled={isAdd ? false : isReadOnly} />
                        </div>
                        <div className="flex flex-row w-full">
                            <SearchableSelect label={'Departemen'} placeHolder={'Select Departmen'} options={listDepart} value={formData?.departmentID} isDisabled={isAdd ? false : isReadOnly} />
                            <div className="mx-2" />
                            <SearchableSelect label={'Divisi'} placeHolder={'Select Division'} options={listDiv} value={formData?.divisionID} isDisabled={isAdd ? false : isReadOnly} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Job Title'} type={'text'} value={formData?.employeeJobTitleName} />
                        </div>
                    </div>
                </div>
                <div className="ml-1 w-[50%]">
                    <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="font-bold text-sm">{'Rincian Tunjangan & Potongan'}</p>
                        <div className="bg-[#ddd] my-3 h-[1.5px]" />
                        <div className="max-h-[160px] overflow-y-auto">
                            {formData?.allowancedeductionDetails?.filter(obj => obj?.amount > 0)?.map((data, idx) => (
                                <div className="px-1 border border-[#ddd] rounded-lg mb-2">
                                    <div key={idx} className="flex flex-col w-full p-2">
                                        <p className="font-semibold text-xs pb-1">{data?.name}</p>
                                        <p className={`font-normal text-xs ${data?.type === 'Allowance' ? `text-[${baseColor}]` : 'text-[#D22F27]'}`}>{data?.name?.toLowerCase()?.includes('lembur') ? 'Eligible' : (data?.type === 'Allowance' ? '+' : '-') + formatText(data?.amount)}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="w-full">
                        <div className="flex flex-row">
                            <div className="flex flex-col bg-[#333333c3] w-[180px]">
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">Year</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">THP</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">Basic Salary</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">Tunjangan Makan</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">Tunjangan Transport</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">Tunjangan Jabatan</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">Tunjangan Functional</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">Tunjangan Khusus</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">Tunjangan Operational</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">Tunjangan Lembur</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold text-white">BPJS</p></div>
                            </div>
                            {formData?.masterEmployeePayroll?.sort((a,b) => a.year - b.year)?.map((val, idx) => (
                                <div className="flex flex-col bg-[#fff] w-[120px]" key={idx}>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{val?.year}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.thp)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.basicSalary)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uMakan)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uTransport)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uJabatan)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uFunctional)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.utKhusus)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.utOperational)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uLembur)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.bpjs)}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            {/* <div className="border bg-white p-4 rounded-lg">
                <div className="flex flex-row justify-between items-center">
                    <p className="font-bold text-sm">{'Detail Employee'}</p>
                    {!isAdd ?
                        isEdit ?
                        <div className="flex flex-row items-center">
                            <p className={`font-bold text-sm text-[#EA2427] underline cursor-pointer`} onClick={() => {
                                setIsEdit(false);
                                setIsReadOnly(true);
                            }}>Cancel</p>
                            <div className="mx-2" />
                            <p className={`font-bold text-sm text-[${baseColor}] underline cursor-pointer`}>Submit</p>
                        </div>
                        :
                        <p className={`font-bold text-sm text-[${baseColor}] underline cursor-pointer`} onClick={() => {
                            setIsEdit(true);
                            setIsReadOnly(false);
                        }}>Edit Data</p>
                        :
                        <p className={`font-bold text-sm text-[${baseColor}] underline cursor-pointer`}>Submit</p>
                    }
                </div>

                <div className="bg-[#ddd] my-3 h-[1.5px]" />

                <div>
                    <div>
                        <p className="font-bold text-sm mb-4 mt-1">- Personal Data -</p>
                        <div className="flex flex-row w-full">
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Name'} type={'text'} value={formData?.name} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'NIK'}  type={'text'} value={formData?.nik} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'No. KTP'} type={'text'} value={formData?.ktp} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Gender'} type={'text'} value={formData?.gender} />
                        </div>

                        <div className="flex flex-row w-full">
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Email'} type={'text'} value={formData?.email} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Phone Number'}  type={'text'} value={formData?.phoneNumber} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Place Of Birth'}  type={'text'} value={formData?.placeOfBirth} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Date Of Birth'}  type={'date'} value={formData?.dateOfBirth} />
                        </div>

                        <div className="flex flex-row w-full">
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Religion'} setWidth="24%" type={'text'} value={formData?.religion} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Account No.'} setWidth="24%" type={'text'} value={formData?.accountNo} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Bank'} setWidth="24%" type={'text'} value={formData?.bank} />
                            <div className="mx-2" />
                        </div>

                        <div className="bg-[#ddd] my-3 h-[1.5px]" />
                    </div>

                    <div>
                        <p className="font-bold text-sm mb-4 mt-1">- Job Detail -</p>
                        <div className="flex flex-row w-full">
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Start Working Date'} type={'date'} value={formData?.startWorkingDate} />
                            <div className="mx-2" />
                            <SearchableSelect label={'Grade'} placeHolder={'Select Grade'} options={listGroup} value={formData?.groupID} isDisabled={isAdd ? false : isReadOnly} />
                            <div className="mx-2" />
                            <SearchableSelect label={'Function'} placeHolder={'Select Function'} options={listFunc} value={formData?.functionID} isDisabled={isAdd ? false : isReadOnly} />
                            <div className="mx-2" />
                            <SearchableSelect label={'Departmen'} placeHolder={'Select Departmen'} options={listDepart} value={formData?.departmentID} isDisabled={isAdd ? false : isReadOnly} />
                        </div>

                        <div className="flex flex-row w-full">
                            <SearchableSelect label={'Division'} placeHolder={'Select Division'} setWidth="24%" options={listDiv} value={formData?.divisionID} isDisabled={isAdd ? false : isReadOnly} />
                            <div className="mx-2" />
                            <SearchableSelect label={'Employee Type'} placeHolder={'Select Type'} setWidth="24%" options={listType} value={formData?.employeeTypeID} isDisabled={isAdd ? false : isReadOnly} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Job Title'} setWidth="24%" type={'text'} value={formData?.employeeJobTitleName} />
                        </div>

                        <div className="bg-[#ddd] my-3 h-[1.5px]" />
                    </div>

                    <div>
                        <p className="font-bold text-sm mb-4 mt-1">- Benefit, Allowance Deduction  -</p>
                        <div className="flex flex-row w-full">
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'Basic Salary'} type={'text'} value={formatText(formData?.basicSalary)} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'bpjstk'}  type={'text'} value={formData?.bpjstk} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly}  label={'bpjskes'} type={'text'} value={formData?.bpjskes} />
                        </div>

                        <div className="flex flex-row w-full">
                            <Input readOnly={isAdd ? false : isReadOnly} setWidth="24%" label={'taxStatus'} type={'text'} value={formData?.taxStatus} />
                            <div className="mx-2" />
                            <Input readOnly={isAdd ? false : isReadOnly} setWidth="24%" label={'tkStatus'} type={'text'} value={formData?.tkStatus} />
                        </div>
                    </div>
                </div>


                {(!isEdit && formData?.allowancedeductionDetails?.length > 0) && 
                    <>
                        <div className="flex flex-row items-center mt-4">
                            <p className="font-bold text-sm">{'Allowance Deduction Details'}</p>
                        </div>
    
                        <div className="bg-[#ddd] my-3 h-[1.5px]" />
    
                        <div>
                            {formData?.allowancedeductionDetails?.map((val) => (
                                <div className="px-1 border border-[#ddd] rounded-lg">
                                    <p className="font-bold text-sm mb-4 mt-1">{val?.type}</p>
                                    {val?.data?.map((data, idx) => (
                                        <div key={idx} className="flex flex-col w-full pb-2">
                                            <p className="font-semibold text-xs py-1">Name: {data?.name}</p>
                                            <p className="font-semibold text-xs py-1">Type: {data?.allowanceDeductiongroupID}</p>
                                            <p className="font-semibold text-xs py-1">{data?.name?.toLowerCase()?.includes('lembur') ? 'Status: Eligible' : 'Amount: ' + formatText(data?.amount)}</p>
                                            <div className="bg-[#ddd] my-3 h-[1.5px] w-[200px]" />
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    </>  
                }

                {(!isEdit && formData?.salaryHistories && formData?.salaryHistories?.length > 0) && 
                    <div className="mb-4 mt-6">
                        <div className="flex flex-row items-center mt-4">
                            <p className="font-bold text-sm mb-4 mt-1">Salary</p>
                        </div>
                        <div className="w-full overflow-x-auto">
                            <div className="flex flex-row bg-[#e9e9e9] w-full">
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs font-semibold">Month</p></div>
                                <div className="w-full p-2 border border-[#ddd]"><p className="text-xs font-semibold">Netto</p></div>
                            </div>
                            {formData?.salaryHistories?.map((val, idx) => (
                                <div className="flex flex-row bg-[#fff] w-full" key={idx}>
                                    <Link to={`/report/detail?id=${val?.salaryID}`} className="w-full p-2 border border-[#ddd] cursor-pointer"><p className="text-xs underline">{getMonthName(val.month) + ' ' + val?.year}</p></Link>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.netto)}</p></div>
                                </div>
                            ))}
                        </div>
                    </div>
                }

                {(!isEdit && formData?.masterEmployeePayroll && formData?.masterEmployeePayroll?.length > 0) &&
                    <div className="mb-4 mt-10">
                        <div className="flex flex-row items-center mt-4">
                            <p className="font-bold text-sm">Master Payroll</p>
                        </div>
    
                        <div className="bg-[#ddd] my-3 h-[1.5px]" />

                        <div className="w-full overflow-x-auto">
                            <div className="flex flex-row">
                                <div className="flex flex-col bg-[#ddd] w-[200px]">
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">Year</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">THP</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">Basic Salary</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">Tunjangan Makan</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">Tunjangan Transport</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">Tunjangan Jabatan</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">Tunjangan Functional</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">Tunjangan Khusus</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">Tunjangan Operational</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">Tunjangan Lembur</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-start font-semibold">BPJS</p></div>
                                </div>
                                {formData?.masterEmployeePayroll?.sort((a,b) => a.year - b.year)?.map((val, idx) => (
                                    <div className="flex flex-col bg-[#fff] w-[200px]" key={idx}>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{val?.year}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.thp)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.basicSalary)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uMakan)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uTransport)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uJabatan)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uFunctional)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.utKhusus)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.utOperational)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uLembur)}</p></div>
                                    <div className="w-full p-2 border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.bpjs)}</p></div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                }
            </div> */}
        </>
    );
}

export default EmployeeForm;