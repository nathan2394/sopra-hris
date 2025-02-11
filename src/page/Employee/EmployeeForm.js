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
    const getId = getQueryParam("id");
    const [isAdd] = useState(getQueryParam("action") === 'add' ? true : false);

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
        payrollType: '',
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

    const [masterPayroll, setMasterPayroll] = useState([]);
    const [allowanceDeduction, setAllowanceDeduction] = useState([]);

    const [listGroup, setListGroup] = useState([]);
    const [listType, setListType] = useState([]);
    const [listFunc, setListFunc] = useState([]);
    const [listDepart, setListDepart] = useState([]);
    const [listDiv, setListDiv] = useState([]);

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

    useEffect(() => {
        Promise.all([
            loadData({url: 'Departments'}),
            loadData({url: 'Groups'}),
            loadData({url: 'Divisions'}),
            loadData({url: 'Functions'}),
            loadData({url: 'EmployeeType'})
        ]).then(([departmentsRes, groupsRes, divisionsRes, functionsRes, employeeTypesRes]) => {
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
            
            // Now fetch employee data if getId exists
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
                            name: employeeRes?.data?.employeeName || '-',
                            nik: employeeRes?.data?.nik || '-',
                            ktp: employeeRes?.data?.ktp || '-',
                            gender: employeeRes?.data?.gender || '-',
                            religion: employeeRes?.data?.religion || '-',
                            email: employeeRes?.data?.email || '-',
                            phoneNumber: employeeRes?.data?.phoneNumber || '-',
                            placeOfBirth: employeeRes?.data?.placeOfBirth || '-',
                            dateOfBirth: employeeRes?.data?.dateOfBirth || '-',
                            startWorkingDate: employeeRes?.data?.startWorkingDate || '-',
                            groupID: employeeRes?.data?.groupID,
                            functionID: employeeRes?.data?.functionID || '-',
                            departmentID: employeeRes?.data?.departmentID || '-',
                            accountNo: employeeRes?.data?.accountNo || '-',
                            bank: employeeRes?.data?.bank || '-',
                            payrollType: employeeRes?.data?.payrollType || '-',
                            bpjstk: employeeRes?.data?.bpjstk || '0',
                            bpjskes: employeeRes?.data?.bpjskes || '0',
                            taxStatus: employeeRes?.data?.taxStatus || '',
                            tkStatus: employeeRes?.data?.bpjskes || '',
                            divisionID: employeeRes?.data?.divisionID || '-',
                            basicSalary: employeeRes?.data?.basicSalary || '-',
                            employeeTypeID: employeeRes?.data?.employeeTypeID,
                            employeeJobTitleName: employeeRes?.data?.employeeJobTitleName || '-',
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
                });
            }
        });
    }, [getId]);
  

    const TitleContent = ({text}) => {
        return (
            <div className="bg-[#333333c3] p-2 my-2 w-full rounded-lg">
                <p className="font-semibold text-white text-sm text-center">{text}</p>
            </div>
        );
    }

    return (
        <>
            <TitlePage label={'Data Karyawan'} subLabel={'Data Personal'} isAction={true} subMenu={isAdd ? [] : subMenu} source={employee} type={'detail'} setNavigateBack={`/employee`} />
            <div className="flex flex-row justify-between">
                <div className="bg-white rounded-lg p-4 w-full mr-2">
                    <p className="font-bold text-sm">{'Detil Data Karyawan'}</p>
                    <div className="bg-[#ddd] my-3 h-[1.5px]" />
                    <div className="max-h-[560px] overflow-y-auto">
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
                            <div className="flex flex-row w-full">
                                <SearchableSelect label={'Type'} placeHolder={'Select Type'} options={listType} value={formData?.employeeTypeID} isDisabled={isAdd ? false : isReadOnly} />
                                <div className="mx-2" />
                                <Input readOnly={isAdd ? false : isReadOnly} label={'Account No.'} type={'text'} value={formatText(formData?.accountNo)} />
                                <div className="mx-2" />
                                <Input readOnly={isAdd ? false : isReadOnly} label={'Bank'} type={'text'} value={formatText(formData?.bank)} />
                            </div>
                            <div className="flex flex-row w-full">
                                <Input readOnly={isAdd ? false : isReadOnly} label={'BPJSTK'} type={'text'} value={formatText(formData?.bpjstk)} />
                                <div className="mx-2" />
                                <Input readOnly={isAdd ? false : isReadOnly} label={'BPJSKES'} type={'text'} value={formatText(formData?.bpjskes)} />
                                <div className="mx-2" />
                                <Input readOnly={isAdd ? false : isReadOnly} label={'Basic Salary'} type={'text'} value={formatText(formData?.basicSalary)} />
                            </div>
                        </div>
                    </div>
                </div>

                <div className="ml-2 w-[40%]">
                    <div className="bg-white rounded-lg p-4 mb-4">
                        <p className="font-bold text-sm">{'Rincian Tunjangan & Potongan'}</p>
                        <div className="bg-[#ddd] my-3 h-[1.5px]" />
                        <div className="min-h-[120px] max-h-[160px] overflow-y-auto">
                            {allowanceDeduction?.filter(obj => obj?.amount > 0)?.length > 0 ?
                                allowanceDeduction?.filter(obj => obj?.amount > 0)?.map((data, idx) => (
                                    <div className="px-1 border border-[#ddd] rounded-lg mb-2">
                                        <div key={idx} className="flex flex-col w-full p-2">
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

                    <div className="flex flex-row justify-end">
                        <div className="flex flex-col bg-[#333333c3] min-w-[200px] rounded-l-lg">
                            <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs text-center font-semibold text-white">Year</p></div>
                            <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs text-start font-semibold text-white">THP</p></div>
                            <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs text-start font-semibold text-white">{`Basic Salary ${formData?.payrollType ? '('+ formData?.payrollType.toLowerCase() + ')' : ''}`}</p></div>
                            <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs text-start font-semibold text-white">Tunjangan</p></div>
                            <div className="w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] px-4"><p className="text-xs text-start font-semibold text-white">{`Makan (Rp/hari x 23)`}</p></div>
                            <div className="w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] px-4"><p className="text-xs text-start font-semibold text-white">{`Transport (Rp/hari x 23)`}</p></div>
                            <div className="w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] px-4"><p className="text-xs text-start font-semibold text-white">{`Jabatan (Rp/hari x 23)`}</p></div>
                            <div className="w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] px-4"><p className="text-xs text-start font-semibold text-white">{`Functional (Rp/bln)`}</p></div>
                            <div className="w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] px-4"><p className="text-xs text-start font-semibold text-white">{`Khusus (Rp/hari x 23)`}</p></div>
                            <div className="w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] px-4"><p className="text-xs text-start font-semibold text-white">{`Operasional (Rp/hari x 23)`}</p></div>
                            <div className="w-full p-2 bg-[#ffffff1f] border border-[#ffffff10] px-4"><p className="text-xs text-start font-semibold text-white">{`TMK (Rp/bln)`}</p></div>
                            <div className="w-full p-2 border border-[#ffffff11]"><p className="text-xs text-start font-semibold text-white">BPJS</p></div>
                        </div>
                        {masterPayroll?.length > 0 ? 
                            <div className={`flex flex-row ${masterPayroll?.length > 1 ? 'max-w-[300px]' : 'w-full'} overflow-x-auto`}>
                                {masterPayroll?.sort((a,b) => a.year - b.year)?.map((val, idx) => (<>
                                    <div className={`flex flex-col bg-[#333333c3] ${masterPayroll?.length > 1 ? 'min-w-[150px]' : 'w-full' } ${masterPayroll?.length === idx+1 ? 'rounded-r-lg' : ''}`} key={idx}>
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