import React, { useEffect, useRef, useState } from "react";
import { loadData } from "../../config/api";
import { coverDate, formatText, getMonthName, getQueryParam } from "../../config/helper";
import TitlePage from "../../component/titlePage";
import { employee } from "../../config/icon";

const EmployeePaySlip = () => {
    const getId = getQueryParam("id");
    const employeeId = getQueryParam("employeeId");
    const [formData, setFormData] = useState({
        name: '',
        nik: '',
        groupName: '',
        depart: '',
        jobTitle: '',
        basicSalary: '',
        paidSalary: '',
        uMakan: '',
        uhMakan: '',
        uTransport: '',
        uHransport: '',
        uJabatan: '',
        uFunctional: '',
        utKhusus: '',
        utOperational: '',
        uLembur: '',
        uMasaKerja: '',
        bpjs: '',
        thp: '',
        netto: '',
        employeeType: '',
        startWorkingDate: '',
        month: 0,
        year: 0,
        division: '',
        hks: 0,
        hka: 0,
        att: 0,
        meal: 0,
        absent: 0,
        ovt: 0,
        late: 0,
        rapel: 0,
        deductionTotal: 0,
        allowanceTotal: 0,
        otherAllowances: 0,
        otherDeductions: 0,
    });

    useEffect(()=> {
        if(getId){
            loadData({url: `SalaryDetails/${getId}`}).then((res) => {
                if(res?.data){
                    setFormData({
                        name: res?.data?.employeeName,
                        nik: res?.data?.nik,
                        groupName: res?.data?.groupName,
                        depart: res?.data?.department,
                        jobTitle: res?.data?.employeeJobTitle,
                        basicSalary: res?.data?.basicSalary,
                        paidSalary: res?.data?.paidSalary,
                        uMakan: res?.data?.uMakan,
                        uhMakan: res?.data?.uhMakan,
                        uTransport: res?.data?.uTransport,
                        uHransport: res?.data?.uhTransport,
                        uJabatan: res?.data?.uJabatan,
                        uFunctional: res?.data?.uFunctional,
                        utKhusus: res?.data?.utKhusus,
                        utOperational: res?.data?.utOperational,
                        uLembur: res?.data?.uLembur,
                        uMasaKerja: res?.data?.uMasaKerja,
                        bpjs: res?.data?.bpjs,
                        thp: res?.data?.thp,
                        netto: res?.data?.netto,
                        employeeType: res?.data?.employeeType,
                        startWorkingDate: res?.data?.startWorkingDate,
                        month: res?.data?.month,
                        year: res?.data?.year,
                        division: res?.data?.division,
                        hks: res?.data?.hks,
                        hka: res?.data?.hka,
                        att: res?.data?.att,
                        meal: res?.data?.meal,
                        absent: res?.data?.absent,
                        ovt: res?.data?.ovt,
                        late: res?.data?.late,
                        rapel: res?.data?.rapel,
                        deductionTotal: res?.data?.deductionTotal,
                        allowanceTotal: res?.data?.allowanceTotal,
                        otherAllowances: res?.data?.otherAllowances,
                        otherDeductions: res?.data?.otherDeductions,
                    })
                }
            })
        }
    }, []);

    const TitleContent = ({text}) => {
        return (
            <div className="bg-[#33333318] p-2 mb-2 w-full">
                <p className="font-semibold text-black text-sm text-center">{text}</p>
            </div>
        );
    }

    const AllowanceDeducationContent = ({type}) => {
        const data = (type === 'Allowance' || type === 'Pendapatan') ? [
            {
                label: 'Gaji Dibayar',
                value: formData?.paidSalary
            },
            {
                label: 'Tunjangan Jabatan',
                value: formData?.uJabatan
            },
            {
                label: 'Tunjangan Khusus',
                value: formData?.utKhusus
            },
            {
                label: 'Tunjangan Operational',
                value: formData?.utOperational
            },
            {
                label: 'Tunjangan Functional',
                value: formData?.uFunctional
            },
            {
                label: 'TMK',
                value: formData?.uMasaKerja
            },
            {
                label: `Transport (${formData?.att} hari x Rp. ${formatText(formData?.uHransport)})`,
                value: formData?.uTransport
            },
            {
                label: `Uang Makan (${formData?.meal} hari x Rp. ${formatText(formData?.uhMakan)})`,
                value: formData?.uMakan
            },
            {
                label: 'Rapel',
                value: formData?.rapel
            },
            {
                label: 'Lain-lain',
                value: formData?.otherAllowances
            }
        ] : [
            {
                label: 'BPJS',
                value: formData?.bpjs
            },
            {
                label: 'Lain-lain',
                value: formData?.otherDeductions
            }
        ];
        return (
            <div className="p-4 border border-[#ddd] rounded-lg">
                <TitleContent text={type} />
                <div className="py-1" />
                {data?.map((value, idx) => (
                    <div className="flex flex-row justify-between mb-2 w-full" key={idx}>
                        <p className="text-xs w-full">{value?.label}</p>
                        <p className="text-xs w-[20%] text-end">: Rp.</p>
                        <p className="text-xs w-full text-end">{formatText(value?.value)}</p>
                    </div>
                ))}
                <div className="bg-[#ddd] mt-1 mb-3 h-[1.5px]" />
                <div className="flex flex-row justify-between w-full">
                    <p className="text-xs font-semibold w-full">{`Jumlah ${type}`}</p>
                    <p className="text-xs font-semibold w-[20%] text-end">: Rp.</p>
                    <p className="text-xs font-semibold w-full text-end">{(type === 'Allowance' || type === 'Pendapatan') ? formatText(formData?.thp) : formatText(formData?.deductionTotal)}</p>
                </div>

            </div>
        )
    }

    return (
        <>
            <TitlePage label={'Detil Karyawan'} subLabel={'Slip Gaji'} source={employee} type={'detail'} setNavigateBack={`/employee/detail?id=${employeeId}`} />
            <div className="border bg-white p-6 rounded-lg">

                <div className="flex flex-row justify-between">
                    <div className="mb-2">
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[100px]">Name</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{formData?.name || '-'}</p>
                        </div>
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[100px]">NIK</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{formData?.nik || '-'}</p>
                        </div>
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[100px]">Grade</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{formData?.groupName || '-'}</p>
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[100px]">Departemen</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{formData?.depart || '-'}</p>
                        </div>
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[100px]">Divisi</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{formData?.division || '-'}</p>
                        </div>
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[100px]">Fungsi</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{'-'}</p>
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[100px]">Jabatan</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{formData?.jobTitle || '-'}</p>
                        </div>
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[100px]">Tanggal Masuk</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{coverDate(formData?.startWorkingDate)}</p>
                        </div>
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[100px]">Status</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{formData?.employeeType || '-'}</p>
                        </div>
                    </div>

                    <div className="mb-2">
                        <div className="flex flex-row items-start">
                            <p className="font-normal text-xs pb-2 w-[50px]">Periode</p>
                            <p className="font-normal text-xs pb-2 w-[10px]">:</p>
                            <p className="font-normal text-xs pb-2">{getMonthName(formData?.month) + ' ' + formData?.year}</p>
                        </div>
                    </div>
                </div>

                <div className="bg-[#ddd] mt-1 mb-3 h-[1.5px]" />

                <div className="flex flex-row justify-between w-full">
                    <div className={`w-full mr-2`}>
                        <AllowanceDeducationContent type={'Pendapatan'} />
                        <div className="py-2" />
                        <table className="table-auto text-xs w-full">
                            <tbody>
                            <tr className={``}>
                                <td className={`border border-[#ddd] py-1 px-3`}>
                                    <div className="flex flex-row">
                                        <p className="text-xs w-[50px]">HKS</p> 
                                        <p className="text-xs">: {formData?.hks}</p>
                                    </div>
                                </td>
                                <td className={`border border-[#ddd] py-1 px-3`}>
                                    <div className="flex flex-row">
                                        <p className="text-sm w-[50px]">HKA</p> 
                                        <p className="text-xs">: {formData?.hka}</p>
                                    </div>
                                </td>
                                <td className={`border border-[#ddd] py-1 px-3`}>
                                    <div className="flex flex-row">
                                        <p className="text-xs w-[50px]">ATT</p> 
                                        <p className="text-xs">: {formData?.att}</p>
                                    </div>
                                </td>
                            </tr>
                            <tr className={``}>
                                <td className={`border border-[#ddd] py-1 px-3`}>
                                    <div className="flex flex-row">
                                        <p className="text-xs w-[50px]">Meal</p> 
                                        <p className="text-xs">: {formData?.meal}</p>
                                    </div>
                                </td>
                                <td className={`border border-[#ddd] py-1 px-3`}>
                                    <div className="flex flex-row">
                                        <p className="text-xs w-[50px]">Absen</p> 
                                        <p className="text-xs">: {formData?.absent}</p>
                                    </div>
                                </td>
                                <td className={`border border-[#ddd] py-1 px-3`}>
                                    <div className="flex flex-row">
                                        <p className="text-xs w-[50px]">OVT</p> 
                                        <p className="text-xs">: {formData?.ovt}</p>
                                    </div>
                                </td>
                            </tr>
                            </tbody>
                        </table>
                    </div>
                    <div className={`w-full ml-2`}>
                        <AllowanceDeducationContent type={'Potongan'} />
                        <div className="py-2" />
                        <div className="p-4 bg-[#33333318] border border-[#ddd] rounded-lg">
                            <div className="flex flex-row justify-between mb-2 w-full">
                                <p className="text-xs w-full">{`Jumlah Pendapatan`}</p>
                                <p className="text-xs w-[20%] text-end">: Rp.</p>
                                <p className="text-xs w-full text-end">{formatText(formData?.thp)}</p>
                            </div>
                            <div className="flex flex-row justify-between mb-2 w-full">
                                <p className="text-xs w-full">{`Jumlah Potongan`}</p>
                                <p className="text-xs w-[20%] text-end">: Rp.</p>
                                <p className="text-xs w-full text-end">{formatText(formData?.deductionTotal)}</p>
                            </div>
                            <div className="bg-[#ddd] mt-1 mb-3 h-[1.5px]" />
                            <div className="flex flex-row justify-between w-full">
                                <p className="text-xs font-semibold w-full">{`Jumlah Gaji Bersih`}</p>
                                <p className="text-xs font-semibold w-[20%] text-end">: Rp.</p>
                                <p className="text-xs font-semibold w-full text-end">{formatText(formData?.netto)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default EmployeePaySlip;