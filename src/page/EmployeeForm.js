import React, { useEffect, useRef, useState } from "react";
import TitlePage from "../component/titlePage";
import Input from "../component/input";
import { employee, empty, payroll } from "../config/icon";
import { loadData } from "../config/api";
import { coverDate, formatText } from "../config/helper";

const EmployeeForm = () => {
    const [formData, setFormData] = useState({
        name: '',
        nik: '',
        ktp: '',
        gender: '',
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
        allowancedeductionDetails: []
    })

    useEffect(()=> {
        const currentUrl = window.location.href;
        const url = new URL(currentUrl);
        const getId = url.searchParams.get("id");
        loadData({url: `Employees/${getId}`}).then((res) => {
            if(res?.data){
                setFormData({
                    name: res?.data?.employeeName,
                    nik: res?.data?.nik,
                    ktp: res?.data?.ktp,
                    gender: res?.data?.gender,
                    email: res?.data?.email,
                    phoneNumber: res?.data?.phoneNumber,
                    placeOfBirth: res?.data?.placeOfBirth,
                    dateOfBirth: res?.data?.dateOfBirth,
                    startWorkingDate: res?.data?.startWorkingDate,
                    groupType: res?.data?.groupName + ` (${res?.data?.groupType})`,
                    functionName: res?.data?.functionName,
                    departmentName: res?.data?.departmentName,
                    accountNo: res?.data?.accountNo,
                    bank: res?.data?.bank,
                    divisionName: res?.data?.divisionName,
                    allowancedeductionDetails: res?.data?.allowancedeductionDetails
                })
            }
        })
    }, [])

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
                        <Input label={'Name'} type={'text'} value={formData?.name} />
                        <div className="mx-2" />
                        <Input label={'NIK'}  type={'text'} value={formData?.nik} />
                        <div className="mx-2" />
                        <Input label={'No. KTP'} type={'text'} value={formData?.ktp} />
                        <div className="mx-2" />
                        <Input label={'Gender'} type={'text'} value={formData?.gender} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input label={'Email'} type={'text'} value={formData?.gender} />
                        <div className="mx-2" />
                        <Input label={'Phone Number'}  type={'text'} value={formData?.phoneNumber} />
                        <div className="mx-2" />
                        <Input label={'Place Of Birth'}  type={'text'} value={coverDate(formData?.placeOfBirth)} />
                        <div className="mx-2" />
                        <Input label={'Date Of Birth'} type={'text'} value={coverDate(formData?.dateOfBirth)} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input label={'Start Working Date'} type={'text'} value={coverDate(formData?.startWorkingDate)} />
                        <div className="mx-2" />
                        <Input label={'Group'}  type={'text'} value={formData?.groupType} />
                        <div className="mx-2" />
                        <Input label={'Function'} type={'text'} value={formData?.functionName} />
                        <div className="mx-2" />
                        <Input label={'Departemen'} type={'text'} value={formData?.departmentName} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input label={'Account No.'} setWidth="24%" type={'text'} value={formData?.accountNo} />
                        <div className="mx-2" />
                        <Input label={'Bank'} setWidth="24%" type={'text'} value={formData?.bank} />
                        <div className="mx-2" />
                        <Input label={'Division'} setWidth="24%" type={'text'} value={formData?.divisionName} />
                    </div>
                </div>

                {formData?.allowancedeductionDetails?.length > 0 &&
                <>
                    <div className="flex flex-row items-center mt-4">
                        <p className="font-bold text-sm pl-2">{'Allowance Deduction Details'}</p>
                    </div>

                    <div className="bg-[#ddd] my-3 h-[1.5px]" />

                    <div>
                        {formData?.allowancedeductionDetails?.filter(data => data?.amount > 0)?.map((val, idx) => (
                            <div key={idx} className="flex flex-row w-full">
                                <Input value={val?.name} label={'Name'} setWidth="24%" type={'text'} />
                                <div className="mx-2" />
                                <Input value={val?.type} label={'Type'} setWidth="24%" type={'text'} />
                                <div className="mx-2" />
                                <Input value={formatText(val?.amount)} label={'Amount'} setWidth="24%" type={'text'} textAlign="right" />
                            </div>
                        ))}
                    </div>
                </>
                }
            </div>
        </>
    );
}

export default EmployeeForm;