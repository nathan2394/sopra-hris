import React, { useEffect, useRef, useState } from "react";
import TitlePage from "../component/titlePage";
import Input from "../component/input";
import { employee, empty, payroll } from "../config/icon";
import { loadData } from "../config/api";
import { coverDate, formatText, getQueryParam } from "../config/helper";
import { baseColor } from "../config/setting";

const ReportDetail = () => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const [isAdd] = useState(url.searchParams.get("action") === 'add' ? true : false);

    const [formData, setFormData] = useState({
        name: '',
        depart: '',
        jobTitle: '',
        basicSalary: '',
        uMakan: '',
        uTransport: '',
        uJabatan: '',
        uFunctional: '',
        utKhusus: '',
        utOperational: '',
        uLembur: '',
        bpjs: '',
        thp: '',
        deductionTotal: 0,
        allowanceTotal: 0,
        otherAllowances: 0,
        otherDeductions: 0,
    });

    const [isEdit, setIsEdit] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);

    useEffect(()=> {
        const getId = getQueryParam("id");
        if(getId){
            loadData({url: `SalaryDetails/${getId}`}).then((res) => {
                if(res?.data){
                    setFormData({
                        name: res?.data?.employeeName,
                        depart: res?.data?.department,
                        jobTitle: res?.data?.employeeJobTitle,
                        basicSalary: res?.data?.basicSalary,
                        uMakan: res?.data?.uMakan,
                        uTransport: res?.data?.uTransport,
                        uJabatan: res?.data?.uJabatan,
                        uFunctional: res?.data?.uFunctional,
                        utKhusus: res?.data?.utKhusus,
                        utOperational: res?.data?.utOperational,
                        uLembur: res?.data?.uLembur,
                        bpjs: res?.data?.bpjs,
                        thp: res?.data?.thp,
                        deductionTotal: res?.data?.deductionTotal,
                        allowanceTotal: res?.data?.allowanceTotal,
                        otherAllowances: res?.data?.otherAllowances,
                        otherDeductions: res?.data?.otherDeductions,
                    })
                }
            })
        }
    }, []);

    return (
        <>
            <TitlePage label={'Report Data'} subLabel={'Report Detail'} source={employee} type={'detail'} setNavigateBack={`/report`} />
            <div className="border bg-white p-4 rounded-lg">
                <p className="font-bold text-sm">{'Report Data'}</p>
                <div className="bg-[#ddd] my-3 h-[1.5px]" />

                <div className="border-b border-[#eee] mb-2">
                    <div className="flex flex-row items-start">
                        <p className="font-normal text-sm pb-1 w-[100px]">Name</p>
                        <p className="font-normal text-sm pb-1 w-[10px]">:</p>
                        <p className="font-normal text-sm pb-1">{formData?.name || '-'}</p>
                    </div>
                    <div className="flex flex-row items-start">
                        <p className="font-normal text-sm pb-1 w-[100px]">Department</p>
                        <p className="font-normal text-sm pb-1 w-[10px]">:</p>
                        <p className="font-normal text-sm pb-1">{formData?.depart || '-'}</p>
                    </div>
                    <div className="flex flex-row items-start">
                        <p className="font-normal text-sm pb-1 w-[100px]">Job Title</p>
                        <p className="font-normal text-sm pb-1 w-[10px]">:</p>
                        <p className="font-normal text-sm pb-1">{formData?.jobTitle || '-'}</p>
                    </div>
                </div>

                <div className="border-b border-[#eee] my-2">
                    <div className="flex flex-row items-start">
                        <p className="font-normal text-sm pb-1 w-[100px]">Basic Salary</p>
                        <p className="font-normal text-sm pb-1 w-[10px]">:</p>
                        <p className="font-normal text-sm pb-1">{formatText(formData?.basicSalary) || '-'}</p>
                    </div>

                    <div className="flex flex-col items-start mt-2">
                        <p className="font-normal text-sm pb-1 w-[100px]">Allowance:</p>
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <p className="font-normal text-sm pb-1 ">a.</p>
                                <p className="font-normal text-sm pb-1 px-1">Makan: {formatText(formData?.uMakan)}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="font-normal text-sm py-1 ">b.</p>
                                <p className="font-normal text-sm p-1">Transport: {formatText(formData?.uTransport)}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="font-normal text-sm py-1 ">c.</p>
                                <p className="font-normal text-sm p-1">Jabatan: {formatText(formData?.uJabatan)}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="font-normal text-sm py-1 ">d.</p>
                                <p className="font-normal text-sm p-1">Khusus: {formatText(formData?.utKhusus)}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="font-normal text-sm py-1 ">e.</p>
                                <p className="font-normal text-sm p-1">Operational: {formatText(formData?.utOperational)}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="font-normal text-sm py-1 ">f.</p>
                                <p className="font-normal text-sm p-1">Lembur: {formData?.uLembur}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="font-normal text-sm py-1">Other: {formatText(formData?.otherAllowances)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row items-start py-2">
                        <p className="font-semibold text-sm pb-1 w-auto">Total Allowance</p>
                        <p className="font-normal text-sm pb-1 w-[10px]">:</p>
                        <p className="font-normal text-sm pb-1">{formatText(formData?.allowanceTotal) || 0}</p>
                    </div>

                    <div className="flex flex-col items-start mt-2">
                        <p className="font-normal text-sm pb-1 w-[110px]">Deduction:</p>
                        <div className="flex flex-col">
                            <div className="flex flex-row">
                                <p className="font-normal text-sm pb-1">a.</p>
                                <p className="font-normal text-sm pb-1 px-1">BPJS: {formatText(formData?.bpjs)}</p>
                            </div>
                            <div className="flex flex-row">
                                <p className="font-normal text-sm py-1">Other: {formatText(formData?.otherDeductions)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-row items-start py-2">
                        <p className="font-semibold text-sm pb-1 w-auto">Total Deduction</p>
                        <p className="font-normal text-sm pb-1 w-[10px]">:</p>
                        <p className="font-normal text-sm pb-1">{formatText(formData?.deductionTotal) || 0}</p>
                    </div>
                </div>

                <div className=" mt-6">
                    <div className="flex flex-row items-start">
                        <p className="font-bold text-sm pb-1 w-[100px]">THP</p>
                        <p className="font-bold text-sm pb-1 w-[10px]">:</p>
                        <p className="font-bold text-sm pb-1">{formatText(formData?.thp) || 0}</p>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReportDetail;