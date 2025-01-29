import React, { useEffect, useRef, useState } from "react";
import TitlePage from "../component/titlePage";
import Input from "../component/input";
import { employee, empty, payroll } from "../config/icon";
import { loadData } from "../config/api";
import { coverDate, formatText } from "../config/helper";

const EmployeeForm = () => {
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
    })

    useEffect(()=> {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const getId = url.searchParams.get("id");
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
    }, []);

    // useState(() => {
    //     console.log(formData)
    //     if(formData?.allowancedeductionDetails?.length > 0){
    //         const groupedResult = formData?.allowancedeductionDetails.reduce((acc, item) => {
    //             const existingGroup = acc.find((group) => group.type === item.type);
    //             if (existingGroup) {
    //               existingGroup.data.push(item);
    //             } else {
    //               acc.push({ type: item.type, data: [item] });
    //             }
    //             return acc;
    //         }, []);
    //         console.log();
    //         setListAlD(listAlD);
    //     }

    // }, [formData])

    return (
        <>
            <TitlePage label={'Employee Data'} subLabel={'Employee Detail'} source={employee} type={'detail'} setNavigateBack={`/employee`} />
            <div className="border bg-white p-4 rounded-lg">
                <div className="flex flex-row items-center">
                    <p className="font-bold text-sm pl-2">{'Detail Employee'}</p>
                </div>

                <div className="bg-[#ddd] my-3 h-[1.5px]" />

                <div>
                    <div className="flex flex-row w-full">
                        <Input readOnly={true}  label={'Name'} type={'text'} value={formData?.name} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'NIK'}  type={'text'} value={formData?.nik} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'No. KTP'} type={'text'} value={formData?.ktp} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Gender'} type={'text'} value={formData?.gender} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input readOnly={true}  label={'Email'} type={'text'} value={formData?.gender} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Phone Number'}  type={'text'} value={formData?.phoneNumber} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Place Of Birth'}  type={'text'} value={formData?.placeOfBirth !== "-" ? coverDate(formData?.placeOfBirth) : formData?.placeOfBirth} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Date Of Birth'} type={'text'} value={formData?.dateOfBirth !== "-" ? coverDate(formData?.dateOfBirth) : formData?.dateOfBirth} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input readOnly={true}  label={'Start Working Date'} type={'text'} value={formData?.startWorkingDate !== "-" ? coverDate(formData?.startWorkingDate) : formData?.startWorkingDate} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Group'}  type={'text'} value={formData?.groupType} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Function'} type={'text'} value={formData?.functionName} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Departemen'} type={'text'} value={formData?.departmentName} />
                    </div>

                    {/* <div className="flex flex-row w-full">
                        <Input readOnly={true}  label={'Account No.'} setWidth="24%" type={'text'} value={formData?.accountNo} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Bank'} setWidth="24%" type={'text'} value={formData?.bank} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Division'} setWidth="24%" type={'text'} value={formData?.divisionName} />
                    </div> */}
                    <div className="flex flex-row w-full">
                        <Input readOnly={true}  label={'Account No.'}  type={'text'} value={formData?.accountNo} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Bank'} type={'text'} value={formData?.bank} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Basic Salary'} type={'text'} value={formatText(formData?.basicSalary)} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Division'} type={'text'} value={formData?.divisionName} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input readOnly={true}  label={'Employee Type'} setWidth="24%" type={'text'} value={formData?.employeeTypeName} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Job Title'} setWidth="24%" type={'text'} value={formData?.employeeJobTitleName} />
                        <div className="mx-2" />
                        <Input readOnly={true}  label={'Religion'} setWidth="24%" type={'text'} value={formData?.religion} />
                    </div>
                </div>


                {(formData?.allowancedeductionDetails && formData?.allowancedeductionDetails?.length > 0) && 
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
                                            {/* <Input readOnly={true}  value={val?.name} label={'Name'} setWidth="24%" type={'text'} />
                                            <div className="mx-2" /> */}
                                            {/* <Input readOnly={true}  value={val?.type} label={'Type'} setWidth="24%" type={'text'} />
                                            <div className="mx-2" /> */}
                                            {/* <Input readOnly={true}  value={formatText(val?.amount)} label={'Amount'} setWidth="24%" type={'text'} textAlign="right" /> */}
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
                                <Input readOnly={true}  value={val?.name} label={'Name'} setWidth="24%" type={'text'} />
                                <div className="mx-2" />
                                <Input readOnly={true}  value={val?.type} label={'Type'} setWidth="24%" type={'text'} />
                                <div className="mx-2" />
                                <Input readOnly={true}  value={formatText(val?.amount)} label={'Amount'} setWidth="24%" type={'text'} textAlign="right" />
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