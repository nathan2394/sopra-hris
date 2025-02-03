import React, { useEffect, useRef, useState } from "react";
import TitlePage from "../component/titlePage";
import Input from "../component/input";
import { employee, empty, payroll } from "../config/icon";
import { loadData } from "../config/api";
import { coverDate, formatText, getQueryParam } from "../config/helper";
import { baseColor } from "../config/setting";

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
        groupType: '',
        functionName: '',
        departmentName: '',
        groupType: '',
        accountNo: '',
        bank: '',
        bpjstk: '0',
        bpjskes: '0',
        tkStatus: '',
        taxStatus: '',
        divisionName: '',
        basicSalary: 0,
        employeeTypeName: '',
        employeeJobTitleName: '',
        allowancedeductionDetails: [],
        masterEmployeePayroll: [],
    });

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
                        groupType: res?.data?.groupName + ` (${res?.data?.groupType})`,
                        functionName: res?.data?.functionName  || '-',
                        departmentName: res?.data?.departmentName || '-',
                        accountNo: res?.data?.accountNo || '-',
                        bank: res?.data?.bank || '-',
                        bpjstk: res?.data?.bpjstk || '0',
                        bpjskes: res?.data?.bpjskes || '0',
                        taxStatus: res?.data?.taxStatus || '',
                        tkStatus: res?.data?.bpjskes || '',
                        divisionName: res?.data?.divisionName || '-',
                        basicSalary: res?.data?.basicSalary || '-',
                        employeeTypeName: res?.data?.employeeTypeName || '-',
                        employeeJobTitleName: res?.data?.employeeJobTitleName || '-',
                        allowancedeductionDetails: res?.data?.allowancedeductionDetails,
                        masterEmployeePayroll: res?.data?.masterEmployeePayroll
                    })
                    if(res?.data?.allowancedeductionDetails){
                        const groupedResult = res?.data?.allowancedeductionDetails?.filter(data => data?.amount > 0).reduce((acc, item) => {
                            const existingGroup = acc.find((group) => group.type === item.type);
                            if (existingGroup) {
                              existingGroup.data.push(item);
                            } else {
                              acc.push({ type: item.type, data: [item] });
                            }
                            return acc;
                        }, []);
                        console.log(groupedResult);
                        setListAlD(groupedResult);
                    }
                }
            })
        }
    }, []);

    return (
        <>
            <TitlePage label={'Employee Data'} subLabel={'Employee Form'} source={employee} type={'detail'} setNavigateBack={`/employee`} />
            <div className="border bg-white p-4 rounded-lg">
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
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Date Of Birth'} type={'text'} value={formData?.dateOfBirth !== "-" ? coverDate(formData?.dateOfBirth) : formData?.dateOfBirth} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Start Working Date'} type={'text'} value={formData?.startWorkingDate !== "-" ? coverDate(formData?.startWorkingDate) : formData?.startWorkingDate} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Group'}  type={'text'} value={formData?.groupType} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Function'} type={'text'} value={formData?.functionName} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Departemen'} type={'text'} value={formData?.departmentName} />
                    </div>

                    {/* <div className="flex flex-row w-full">
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Account No.'} setWidth="24%" type={'text'} value={formData?.accountNo} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Bank'} setWidth="24%" type={'text'} value={formData?.bank} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Division'} setWidth="24%" type={'text'} value={formData?.divisionName} />
                    </div> */}
                    <div className="flex flex-row w-full">
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Account No.'}  type={'text'} value={formData?.accountNo} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Bank'} type={'text'} value={formData?.bank} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Basic Salary'} type={'text'} value={formatText(formData?.basicSalary)} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Division'} type={'text'} value={formData?.divisionName} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'bpjstk'}  type={'text'} value={formData?.bpjstk} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'bpjskes'} type={'text'} value={formData?.bpjskes} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'taxStatus'} type={'text'} value={formData?.taxStatus} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'tkStatus'} type={'text'} value={formData?.tkStatus} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Employee Type'} setWidth="24%" type={'text'} value={formData?.employeeTypeName} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Job Title'} setWidth="24%" type={'text'} value={formData?.employeeJobTitleName} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Religion'} setWidth="24%" type={'text'} value={formData?.religion} />
                    </div>
                </div>


                {(!isEdit && formData?.allowancedeductionDetails && formData?.allowancedeductionDetails?.length > 0) && 
                    <>
                        <div className="flex flex-row items-center mt-4">
                            <p className="font-bold text-sm pl-2">{'Allowance Deduction Details'}</p>
                        </div>
    
                        <div className="bg-[#ddd] my-3 h-[1.5px]" />
    
                        <div>
                            {listAlD?.map((val1) => {
                                //const listAllowanceDeduction = groupedResul
                                return (
                                <>
                                    <p className="font-bold text-sm mb-2">{val1?.type}</p>
                                    {val1?.data?.map((val, idx) => (
                                        <div key={idx} className="flex flex-row w-full items-center pb-2">
                                            <p className="font-semibold text-xs">{val?.name}</p>
                                            <p className="font-semibold text-xs mx-2">-</p>
                                            <p className="font-semibold text-xs">{val?.amount}</p>
                                            {/* <Input readOnly={isAdd ? false : isReadOnly}  value={val?.name} label={'Name'} setWidth="24%" type={'text'} />
                                            <div className="mx-2" /> */}
                                            {/* <Input readOnly={isAdd ? false : isReadOnly}  value={val?.type} label={'Type'} setWidth="24%" type={'text'} />
                                            <div className="mx-2" /> */}
                                            {/* <Input readOnly={isAdd ? false : isReadOnly}  value={formatText(val?.amount)} label={'Amount'} setWidth="24%" type={'text'} textAlign="right" /> */}
                                        </div>
                                    ))}
                                </>
                                )
                            })}
                        </div>
                    </>  
                }

                {(!isEdit && formData?.masterEmployeePayroll && formData?.masterEmployeePayroll?.length > 0) &&
                    <div className="my-4">
                        <div className="flex flex-row items-center mt-4">
                            <p className="font-bold text-sm pl-2"></p>
                        </div>
    
                        <div className="bg-[#ddd] my-3 h-[1.5px]" />

                        <div className="w-full overflow-x-auto">
                            <div className="flex flex-row bg-[#ddd]">
                                <div className="flex flex-col bg-[#ddd] w-[500px]">
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
                                {formData?.masterEmployeePayroll?.map((val, idx) => (
                                    <div className="flex flex-col bg-[#fff] w-full" key={idx}>
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
            </div>
        </>
    );
}

export default EmployeeForm;