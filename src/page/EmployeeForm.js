import React, { useEffect, useRef, useState } from "react";
import TitlePage from "../component/titlePage";
import Input from "../component/input";
import { employee, empty, payroll } from "../config/icon";
import { loadData } from "../config/api";
import { coverDate, formatText } from "../config/helper";
import { baseColor } from "../config/setting";

const EmployeeForm = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const [isAdd] = useState(url.searchParams.get("action") === 'add' ? true : false);

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
        divisionName: '',
        basicSalary: 0,
        employeeTypeName: '',
        employeeJobTitleName: '',
        allowancedeductionDetails: []
    });

    const [isEdit, setIsEdit] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);

    useEffect(()=> {
        const getId = url.searchParams.get("id");
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
                        divisionName: res?.data?.divisionName || '-',
                        basicSalary: res?.data?.basicSalary || '-',
                        employeeTypeName: res?.data?.employeeTypeName || '-',
                        employeeJobTitleName: res?.data?.employeeJobTitleName || '-',
                        allowancedeductionDetails: res?.data?.allowancedeductionDetails
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
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Email'} type={'text'} value={formData?.gender} />
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
                                            <p className="font-semibold text-xs">{formatText(val?.amount)}</p>
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

                {/* {(formData?.allowancedeductionDetails && formData?.allowancedeductionDetails?.length > 0) && 
                <>
                    <div className="flex flex-row items-center mt-4">
                        <p className="font-bold text-sm pl-2">{'Allowance Deduction Details'}</p>
                    </div>

                    <div className="bg-[#ddd] my-3 h-[1.5px]" />

                    <div>
                        {formData?.allowancedeductionDetails?.filter(data => data?.amount > 0)?.map((val, idx) => 
                            //const listAllowanceDeduction = groupedResult

                         (
                            <div key={idx} className="flex flex-row w-full">
                                <Input readOnly={isAdd ? false : isReadOnly}  value={val?.name} label={'Name'} setWidth="24%" type={'text'} />
                                <div className="mx-2" />
                                <Input readOnly={isAdd ? false : isReadOnly}  value={val?.type} label={'Type'} setWidth="24%" type={'text'} />
                                <div className="mx-2" />
                                <Input readOnly={isAdd ? false : isReadOnly}  value={formatText(val?.amount)} label={'Amount'} setWidth="24%" type={'text'} textAlign="right" />
                            </div>
                        ))}
                    </div>
                </>
                } */}
            </div>
        </>
    );
}

export default EmployeeForm;