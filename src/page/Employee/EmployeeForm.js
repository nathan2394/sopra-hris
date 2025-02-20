import React, { useCallback, useEffect, useState } from "react";
import TitlePage from "../../component/titlePage";
import Input from "../../component/input";
import { calculator_w, employee, empty } from "../../config/icon";
import { loadData, postData, updateData } from "../../config/api";
import { currYear, formatText, getQueryParam } from "../../config/helper";
import { baseColor } from "../../config/setting";
import { useNavigate } from "react-router-dom";
import SearchableSelect from "../../component/select2";
import Button from "../../component/button";
// import MyDatePicker from "../../component/date_picker";

const EmployeeForm = ({setIsLoading}) => {
    const navigate = useNavigate();
    const getId = getQueryParam("id");
    const [isAdd] = useState(getQueryParam("action") === 'add' ? true : false);

    const [formData, setFormData] = useState({
        name: '',
        nickName: '',
        nik: '',
        ktp: '',
        gender: '',
        religion: '',
        email: '',
        phoneNumber: '',
        placeOfBirth: '',
        dateOfBirth: '',
        startWorkingDate: '',
        startJointDate: '',
        endWorkingDate: '',
        motherMaidenName: '',
        education: '',
        functionID: '',
        departmentID: '',
        groupID: '',
        accountNo: '',
        bank: '',
        payrollType: '',
        bpjstk: '0',
        bpjskes: '0',
        tkStatus: '',
        taxStatus: '',
        divisionID: '',
        basicSalary: 0,
        employeeTypeID: '',
        employeeJobTitleName: '',
        employeeJobTitleID: '',
    });

    const [masterPayroll, setMasterPayroll] = useState([]);
    const [allowanceDeduction, setAllowanceDeduction] = useState([]);

    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [listFunc, setListFunc] = useState([]);
    const [listDepart, setListDepart] = useState([]);
    const [listDiv, setListDiv] = useState([]);
    const [listJobTitle, setListJobTitle] = useState([]);

    const [isEdit, setIsEdit] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);

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

    const fetchEmployeeDetail = useCallback(() => {
        setIsLoading(true);
        if (getId) {
            Promise.all([
                loadData({url: `Employees/${getId}`}),
                loadData({url: `Salary/MasterSalaryByEmpID/${getId}`}),
                loadData({url: `EmployeeDetails`, params: [{title: 'filter', value: `employee:${getId}`}]}),
            ]).then(([employeeRes, masterSalaryRes, allowanceDeductionRes]) => {
                // Process employee data
                if (employeeRes?.data) {
                    setFormData({
                        ...formData,
                        name: employeeRes?.data?.employeeName || null,
                        nickName: employeeRes?.data?.nickName || '',
                        nik: employeeRes?.data?.nik || null,
                        ktp: employeeRes?.data?.ktp || null,
                        gender: employeeRes?.data?.gender || null,
                        religion: employeeRes?.data?.religion || null,
                        email: employeeRes?.data?.email || null,
                        phoneNumber: employeeRes?.data?.phoneNumber || null,
                        placeOfBirth: employeeRes?.data?.placeOfBirth || null,
                        dateOfBirth: employeeRes?.data?.dateOfBirth || null,
                        startWorkingDate: employeeRes?.data?.startWorkingDate || null,
                        startJointDate: employeeRes?.data?.startJointDate || null,
                        endWorkingDate: employeeRes?.data?.endWorkingDate || null,
                        motherMaidenName: employeeRes?.data?.motherMaidenName || null,
                        education: employeeRes?.data?.education || null,
                        groupID: employeeRes?.data?.groupID,
                        functionID: employeeRes?.data?.functionID || null,
                        departmentID: employeeRes?.data?.departmentID || null,
                        accountNo: employeeRes?.data?.accountNo || null,
                        bank: employeeRes?.data?.bank || null,
                        payrollType: employeeRes?.data?.payrollType || null,
                        bpjstk: employeeRes?.data?.bpjstk || '0',
                        bpjskes: employeeRes?.data?.bpjskes || '0',
                        taxStatus: employeeRes?.data?.taxStatus || '',
                        tkStatus: employeeRes?.data?.bpjskes || '',
                        divisionID: employeeRes?.data?.divisionID || null,
                        basicSalary: employeeRes?.data?.basicSalary || null,
                        employeeTypeID: employeeRes?.data?.employeeTypeID,
                        employeeJobTitleName: employeeRes?.data?.employeeJobTitleName || '-',
                        employeeJobTitleID: employeeRes?.data?.jobTitleID,
                    });

                }
                
                // Set master payroll
                if (masterSalaryRes?.data?.length > 0) {
                    setMasterPayroll(masterSalaryRes?.data);
                }
                
                // Set allowance and deduction
                if (allowanceDeductionRes?.data?.length > 0) {
                    setAllowanceDeduction(allowanceDeductionRes?.data);
                }

                setIsLoading(false);
            });
        }
    }, [getId])

    useEffect(() => {
        Promise.all([
            loadData({url: 'Departments'}),
            loadData({url: 'Groups'}),
            loadData({url: 'Divisions'}),
            loadData({url: 'Functions'}),
            loadData({url: 'EmployeeType'}),
            loadData({url: 'EmployeeJobTitles'}),
        ]).then(([departmentsRes, groupsRes, divisionsRes, functionsRes, employeeTypesRes, employeeJobTitlesRes]) => {
            // Set departments list
            setListDepart(departmentsRes?.data?.map((data) => ({
                value: data?.departmentID,
                label: data?.name
            })));
            
            // Set groups list
            setListGroup(groupsRes?.data?.map((data) => ({
                value: data?.groupID,
                label: `${data?.type}` + `${data?.name ? ` - ${data?.name}` : ''}`
            })));
            
            // Set divisions list
            setListDiv(divisionsRes?.data?.map((data) => ({
                value: data?.divisionID,
                label: data?.name
            })));
            
            // Set functions list
            setListFunc(functionsRes?.data?.map((data) => ({
                value: data?.functionID,
                label: data?.name
            })));
            
            // Set employee types list
            setListType(employeeTypesRes?.data?.map((data) => ({
                value: data?.employeeTypeID,
                label: data?.name
            })));

            setListJobTitle(employeeJobTitlesRes?.data?.map((data) => ({
                value: data?.employeeJobTitleID,
                label: data?.name
            })));
            
            // Now fetch employee data if getId exists
            if (getId) {
                fetchEmployeeDetail();
            }
        });
    }, [getId, fetchEmployeeDetail]);
  

    const TitleContent = ({text}) => {
        return (
            <div className="bg-[#333333c3] p-2 my-2 w-full rounded-lg">
                <p className="font-semibold text-white text-sm text-center">{text}</p>
            </div>
        );
    }

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    };

    const handleChangeSelect = (target, value) => {
        setFormData({
            ...formData,
            [target]: value,
          });
    }

    const handleSubmit = () => {
        setIsLoading(true);
        setIsReadOnly(!isReadOnly);
        setIsEdit(!isEdit);

        const formBody = {
            "employeeID": getId || 0,
            "nik": formData?.nik,
            "employeeName": formData?.name,
            "nickName": formData?.nickName,
            "placeOfBirth": formData?.placeOfBirth,
            "dateOfBirth": formData?.dateOfBirth,
            "gender": formData?.gender,
            "email": formData?.email,
            "phoneNumber": formData?.phoneNumber,
            "ktp": formData?.ktp,
            "startWorkingDate": formData?.startWorkingDate,
            "startJointDate": formData?.startJointDate,
            "endWorkingDate": formData?.endWorkingDate,
            "employeeTypeID": formData?.employeeTypeID,
            "groupID": formData?.groupID,
            "departmentID": formData?.departmentID,
            "divisionID": formData?.divisionID,
            "functionID": formData?.functionID,
            "jobTitleID": formData?.jobTitleID,
            "religion": formData?.religion,
            "bpjstk": formData?.bpjstk,
            "bpjskes": formData?.bpjskes,
            "education": formData?.education,
            "taxStatus": formData?.taxStatus,
            "motherMaidenName": formData?.motherMaidenName,
            "tkStatus": formData?.tkStatus,
            "companyID": formData?.companyID,
            "addressKTP": formData?.addressKTP,
            "addressDomisili": formData?.addressDomisili,
            "basicSalary": formData?.basicSalary,
            "accountNo": formData?.accountNo,
            "bank": formData?.bank,
            "payrollType": formData?.payrollType
        }

        if(formBody?.employeeID){
            if(isAdd && !getId){
                postData({url: 'Employees', formData: formBody})?.then((res) => {
                    navigate('/employee');
                })
            }else{
                updateData({url: 'Employees', formData: formBody})?.then((res) => {
                    fetchEmployeeDetail();
                })
            }
        }
    }

    const PaidStatus = ({status = 'bulanan'}) => {
        return (
            <div className={status === 'bulanan' ? "h-[10px] w-[10px] bg-[#5AADFF]" : "h-[10px] w-[10px] bg-[#FFD600]"} style={{borderRadius: '1px'}} />
        )
    }

    return (
        <>
            <TitlePage label={'Data Karyawan'} subLabel={'Data Personal'} isAction={true} subMenu={isAdd ? [] : subMenu} source={employee} type={'detail'} setNavigateBack={`/employee`} />
            <div className="flex flex-row justify-between">
                <div className="bg-white rounded-lg w-full mr-2">
                    <div className="flex flex-row justify-between px-4 pt-2">
                        <p className="font-bold text-sm">{isAdd ? 'Data Karyawan' : 'Detil Data Karyawan'}</p>
                        <div className="flex flex-row">
                            {isEdit ?                             
                                <>
                                    <p className="text-[#D22F27] text-sm pr-2 font-semibold cursor-pointer" onClick={() => {
                                        setIsReadOnly(!isReadOnly);
                                        setIsEdit(!isEdit)
                                    }}>Cancel</p>
                                    <p className="text-[#369D00] text-sm pl-1 font-semibold cursor-pointer" onClick={() => handleSubmit()}>Submit</p>
                                </>
                                :
                                <>
                                {isAdd ? 
                                    <p className="text-[#369D00] text-sm cursor-pointer" onClick={() => handleSubmit()}>Add Data</p>
                                    :
                                    <>
                                        <p className="text-[#369D00] text-sm font-semibold cursor-pointer underline" onClick={() => {
                                            setIsReadOnly(!isReadOnly);
                                            setIsEdit(!isEdit)
                                        }}>Edit Data</p>
                                    </>
                                }
                                </>
                            }
                        </div>
                    </div>
                    <div className="bg-[#ddd] my-3 h-[1.5px]" />
                    <div className="max-h-[600px] overflow-y-auto">
                        <div className="px-4">
                            <TitleContent text={`Data Diri Karyawan`} />
                            <div className="flex flex-row w-full mt-5">
                                <Input handleAction={handleChange} setName={`name`} readOnly={isAdd ? false : isReadOnly}  label={'Name'} type={'text'} value={formData?.name} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`nik`} readOnly={isAdd ? false : isReadOnly}  label={'NIK'}  type={'text'} value={formData?.nik} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`ktp`} readOnly={isAdd ? false : isReadOnly}  label={'No. KTP'} type={'text'} value={formData?.ktp} />
                            </div>
                            <div className="flex flex-row w-full">
                                <Input handleAction={handleChange} setName={`gender`} readOnly={isAdd ? false : isReadOnly}  label={'Gender'} type={'text'} value={formData?.gender} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`email`} readOnly={isAdd ? false : isReadOnly}  label={'E-mail'}  type={'email'} value={formData?.email} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`phoneNumber`} readOnly={isAdd ? false : isReadOnly}  label={'No. Telp'} type={'text'} value={formData?.phoneNumber} />
                            </div>
                            <div className="flex flex-row w-full">
                                <Input handleAction={handleChange} setName={`placeOfBirth`} readOnly={isAdd ? false : isReadOnly}  label={'Tempat Lahir'} type={'text'} value={formData?.placeOfBirth} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`dateOfBirth`} readOnly={isAdd ? false : isReadOnly}  label={'Tanggal Lahir'}  type={'date'} value={formData?.dateOfBirth} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`religion`} readOnly={isAdd ? false : isReadOnly}  label={'Agama'} type={'text'} value={formData?.religion} />
                            </div>
                        </div>
                        <div className="px-4">
                            <TitleContent text={`Data Pekerjaan`} />
                            <div className="flex flex-row w-full mt-5">
                                <Input handleAction={handleChange} setName={`startWorkingDate`} readOnly={isAdd ? false : isReadOnly}  label={'Tanggal Mulai Bekerja'} type={'date'} value={formData?.startWorkingDate} />
                                <div className="mx-2" />
                                <SearchableSelect handleAction={handleChangeSelect}  name={`groupID`} label={'Grade'} placeHolder={'Select Grade'} options={listGroup} value={formData?.groupID} isDisabled={isAdd ? false : isReadOnly} />
                                <div className="mx-2" />
                                <SearchableSelect handleAction={handleChangeSelect}  name={`functionID`} label={'Fungsi'} placeHolder={'Select Function'} options={listFunc} value={formData?.functionID} isDisabled={isAdd ? false : isReadOnly} />
                            </div>
                            <div className="flex flex-row w-full">
                                <SearchableSelect handleAction={handleChangeSelect}  name={`departmentID`} label={'Departemen'} placeHolder={'Select Departmen'} options={listDepart} value={formData?.departmentID} isDisabled={isAdd ? false : isReadOnly} />
                                <div className="mx-2" />
                                <SearchableSelect handleAction={handleChangeSelect}  name={`divisionID`} label={'Divisi'} placeHolder={'Select Division'} options={listDiv} value={formData?.divisionID} isDisabled={isAdd ? false : isReadOnly} />
                                <div className="mx-2" />
                                {/* <Input handleAction={handleChange} setName={`employeeJobTitleName`} readOnly={isAdd ? false : isReadOnly}  label={'Job Title'} type={'text'} value={formData?.employeeJobTitleName} /> */}
                                <SearchableSelect handleAction={handleChangeSelect}  name={`employeeJobTitleID`} label={'Job Title'} placeHolder={'Select Job Title'} options={listJobTitle} value={formData?.employeeJobTitleID} isDisabled={isAdd ? false : isReadOnly} />
                            </div>
                            <div className="flex flex-row w-full">
                                <SearchableSelect handleAction={handleChangeSelect}  name={`employeeTypeID`} label={'Type'} placeHolder={'Select Type'} options={listType} value={formData?.employeeTypeID} isDisabled={isAdd ? false : isReadOnly} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`accountNo`} readOnly={isAdd ? false : isReadOnly} label={'Account No.'} type={'text'} value={formatText(formData?.accountNo)} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`bank`} readOnly={isAdd ? false : isReadOnly} label={'Bank'} type={'text'} value={formatText(formData?.bank)} />
                            </div>
                            <div className="flex flex-row w-full">
                                <Input handleAction={handleChange} setName={`bpjstk`} readOnly={isAdd ? false : isReadOnly} label={'BPJSTK'} type={'text'} value={formatText(formData?.bpjstk)} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`bpjskes`} readOnly={isAdd ? false : isReadOnly} label={'BPJSKES'} type={'text'} value={formatText(formData?.bpjskes)} />
                                <div className="mx-2" />
                                <Input handleAction={handleChange} setName={`basicSalary`} readOnly={isAdd ? false : isReadOnly} label={'Basic Salary'} type={'text'} value={formatText(formData?.basicSalary)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={`ml-2 ${masterPayroll?.length > 1 ? 'w-[35%]' : 'w-[45%]'}`}>
                    <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="font-bold text-sm">{'Rincian Tunjangan & Potongan'}</p>
                        <div className="bg-[#ddd] my-3 h-[1.5px]" />
                        <div className="min-h-[120px] max-h-[160px] overflow-y-auto">
                            {allowanceDeduction?.filter(obj => obj?.amount > 0)?.length > 0 ?
                                allowanceDeduction?.filter(obj => obj?.amount > 0)?.map((data, idx) => (
                                    <div className="px-1 border border-[#ddd] rounded-lg mb-2" key={idx}>
                                        <div className="flex flex-col w-full p-2">
                                            <p className="font-semibold text-xs pb-1">{data?.allowanceDeductionName}</p>
                                            <p className={`font-normal text-xs ${data?.allowanceDeductionType === 'Allowance' ? `text-[${baseColor}]` : 'text-[#D22F27]'}`}>{data?.allowanceDeductionName?.toLowerCase()?.includes('lembur') ? 'Eligible' : (data?.allowanceDeductionType === 'Allowance' ? '+' : '-') + formatText(data?.amount)}</p>
                                        </div>
                                    </div>
                                ))
                                :
                                <div className="flex flex-col items-center justify-center p-6">
                                    <img className="w-[28%] mx-auto" alt="logo" src={empty} />
                                    <p className="font-bold text-sm">Opps, Nothing to See Here!</p>
                                </div>
                            }
                        </div>
                    </div>

                    <div className="flex flex-row justify-between items-center mb-2">
                        <div className="flex flex-row">
                            <div className="flex flex-row items-center p-2 rounded-lg w-[120px] bg-white" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                                <PaidStatus status="bulanan" />
                                <p className="text-xs ml-2">Bulanan</p>
                            </div>
                            <div className="flex flex-row items-center p-2 ml-4 rounded-lg w-[120px] bg-white" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                                <PaidStatus status="harian" />
                                <p className="text-xs ml-2">Harian</p>
                            </div>
                        </div>
                        <Button setWidth="auto" bgcolor={baseColor} icon={calculator_w} handleAction={() => {
                            localStorage.setItem('calc', JSON.stringify({
                                hks: 23,
                                hka: 23,
                                att: 23,
                                meal: 23,
                                ovt: 0,
                                groupID: formData?.groupID,
                                basicSalary: formData?.basicSalary,
                                payrollType: formData?.payrollType,
                                bpjs: masterPayroll?.length > 0 ? masterPayroll?.find(obj => obj?.year === currYear)?.bpjs : 0,
                                employeeId: getId
                            }))
                            navigate('/calculator');
                        }} />
                    </div>

                    <div className="flex flex-row justify-end">
                        <div className="flex flex-col bg-[#333333c3] min-w-[200px] rounded-l-lg">
                            <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs text-center font-semibold text-white">Year</p></div>
                            <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs text-start font-semibold text-white">THP</p></div>
                            <div className="flex flex-row items-center justify-between w-full p-2 border border-[#ffffff11]">
                                <p className="text-xs text-start font-semibold text-white">
                                {`Basic Salary`}
                                </p>
                                <PaidStatus status={formData?.payrollType.toLowerCase()} />
                            </div>
                            <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs text-start font-semibold text-white">Tunjangan</p></div>
                            <div className="flex flex-row items-center justify-between w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] pl-5">
                                <p className="text-xs text-start font-semibold text-white">{`Makan`}</p>
                                <PaidStatus status={'harian'} />
                            </div>
                            <div className="flex flex-row items-center justify-between w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] pl-5">
                                <p className="text-xs text-start font-semibold text-white">{`Transport`}</p>
                                <PaidStatus status={'harian'} />
                            </div>
                            <div className="flex flex-row items-center justify-between w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] pl-5">
                                <p className="text-xs text-start font-semibold text-white">{`Jabatan`}</p>
                                <PaidStatus status={'bulanan'} />
                            </div>
                            <div className="flex flex-row items-center justify-between w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] pl-5">
                                <p className="text-xs text-start font-semibold text-white">{`Functional`}</p>
                                <PaidStatus status={'bulanan'} />
                            </div>
                            <div className="flex flex-row items-center justify-between w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] pl-5">
                                <p className="text-xs text-start font-semibold text-white">{`Khusus`}</p>
                                <PaidStatus status={'harian'} />
                            </div>
                            <div className="flex flex-row items-center justify-between w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] pl-5">
                                <p className="text-xs text-start font-semibold text-white">{`Operasional`}</p>
                                <PaidStatus status={'harian'} />
                            </div>
                            <div className="flex flex-row items-center justify-between w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] pl-5">
                                <p className="text-xs text-start font-semibold text-white">{`TMK`}</p>
                                <PaidStatus status={'bulanan'} />
                            </div>
                            <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs text-start font-semibold text-white">BPJS</p></div>
                        </div>
                        {masterPayroll?.length > 0 ? 
                            <div className={`flex flex-row ${masterPayroll?.length > 1 ? 'max-w-[300px]' : 'w-full'} overflow-x-auto`}>
                                {masterPayroll?.sort((a,b) => a.year - b.year)?.map((val, idx) => (<>
                                    <div className={`flex flex-col bg-[#333333c3] ${masterPayroll?.length > 1 ? 'min-w-[128px]' : 'w-full' } ${masterPayroll?.length === idx+1 ? 'rounded-r-lg' : ''}`} key={idx}>
                                        <div className="w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] px-6"><p className="text-xs text-center font-semibold text-white">{val?.year}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.thp)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.basicSalary)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd] h-[35px]"></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uMakan)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uTransport)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uJabatan)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uFunctional)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.utKhusus)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.utOperational)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-end">{formatText(val?.uMasaKerja)}</p></div>
                                        <div className={`w-full p-2 bg-[#ffffff] border border-[#ddd] ${masterPayroll?.length === idx+1 ? 'rounded-br-lg' : ''}`}><p className="text-xs text-end">{formatText(val?.bpjs)}</p></div>
                                    </div>
                                </>))}
                            </div>
                        : 
                            <div className="flex flex-row w-full overflow-x-auto">
                                    <div className={`flex flex-col bg-[#333333c3] w-full rounded-r-lg`}>
                                        <div className="w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] px-6"><p className="text-xs text-center font-semibold text-white">{0}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-center">{formatText(0)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-center">{formatText(0)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd] h-[35px]"></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-center">{formatText(0)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-center">{formatText(0)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-center">{formatText(0)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-center">{formatText(0)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-center">{formatText(0)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-center">{formatText(0)}</p></div>
                                        <div className="w-full p-2 bg-[#ffffff] border border-[#ddd]"><p className="text-xs text-center">{formatText(0)}</p></div>
                                        <div className={`w-full p-2 bg-[#ffffff] border border-[#ddd] rounded-br-lg`}><p className="text-xs text-center">{formatText(0)}</p></div>
                                    </div>
                            </div>
                        }
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeeForm;