import React, { useCallback, useEffect, useRef, useState } from "react";
import TitlePage from "../component/titlePage";
import Input from "../component/input";
import { arrow_left_g, arrow_right_g, d_arrow_left_g, d_arrow_right_g, employee, empty, payroll } from "../config/icon";
// import { loadData } from "../config/api";
import { useAPI } from "../config/fetchApi";
import { convertDate, formatText, getMonthName, getQueryParam } from "../config/helper";
import { baseColor } from "../config/setting";
import SearchableSelect from "../component/select2";
import Button from "../component/button";
import { useNavigate } from "react-router-dom";

const ReportDetail = ({setIsLoading}) => {
    const navigate = useNavigate();
    const { loadData } = useAPI();
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

    const getId = getQueryParam("id");
    const [changesId, setChangesID] = useState(getQueryParam("id") ?? 0);
    const listData = JSON.parse(localStorage?.getItem('empolyeeList'));
    const [targetSearch, setTargetSearch] = useState('name');

    const listSearch = [
        {
            value: 'name',
            label: 'Nama',
        },
        {
            value: 'nik',
            label: 'NIK',
        }
    ];

    const currentIndex = listData?.findIndex(obj => obj?.id === parseInt(getId))
    const prevId = listData[currentIndex-1]?.id ?? 0;
    const nextId = listData[currentIndex+1]?.id ?? 0;
    const prevDataId = listData[0]?.id;
    const lastDataId = listData[listData?.length-1]?.id;

    useEffect(()=> {
        const getId = getQueryParam("id");
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

    useEffect(() => {
        console.log(changesId, getId, parseInt(changesId) !== getId);
        if(changesId !== getId){
            console.log(changesId);
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
                    });
                    setIsLoading(false);
                }
            })
        }
    }, [changesId]);

    const handleAfterExecute = useCallback((targetId) => {
        if(targetId){
            navigate(`/report/detail?id=${targetId}`);
        }
    }, [navigate, changesId]);

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
                label: 'Lembur',
                value: formData?.uLembur
            },
            {
                label: `Transport (${formData?.att} hari x Rp. ${formatText(formData?.uHransport)})`,
                value: formData?.uTransport
            },
            {
                label: `U Makan (${formData?.meal} hari x Rp. ${formatText(formData?.uhMakan)})`,
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
            <TitlePage label={'Report Data'} subLabel={'Report Detail'} source={employee} type={'detail'} setNavigateBack={`/report`} />
            <div className="border bg-white p-6 rounded-lg mb-16">

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
                            <p className="font-normal text-xs pb-2">{convertDate(formData?.startWorkingDate)}</p>
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

            <div className="fixed bottom-0 left-0 w-full bg-white px-10 pb-2" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                {/* <div className="bg-[#ddd] mt-6 mb-3 h-[1.5px]" /> */}
                <div className="flex flex-row items-center justify-between mt-2">
                    <div className="flex flex-row items-center w-full">
                        <SearchableSelect setWidth="20%" options={listSearch} value={targetSearch} setValue={setTargetSearch} />
                        <div className="mx-1" />
                        <SearchableSelect setWidth="46%" placeHolder={'Cari Karwayan...'} options={listData?.map((obj) => ({value: obj?.id, label: obj?.[targetSearch]}))} isDisabled={targetSearch === '' ? true : false} useSearchIcon={true} setValue={setChangesID} value={changesId} handleAfterExecute={handleAfterExecute} />
                    </div>
                    <div className="flex flex-row items-center justify-end w-full">
                        <Button setWidth="auto" bgcolor={'white'} icon={d_arrow_left_g} handleAction={() => {
                            navigate(`/report/detail?id=${prevDataId}`);
                            setChangesID(prevDataId);
                        }} />
                        <div className="mx-2" />
                        <Button setWidth="auto" bgcolor={'white'} icon={arrow_left_g} handleAction={prevId > 0 ? () => {
                            navigate(`/report/detail?id=${prevId}`);
                            setChangesID(prevId);
                        } : null} />
                        <div className="mx-[6px]" />
                        <Button setWidth="80px" bgcolor={'white'} position="center" text={`${currentIndex+1}/${listData?.length}`} />
                        <div className="mx-[6px]" />
                        <Button setWidth="auto" bgcolor={'white'} icon={arrow_right_g} handleAction={nextId > 0 ? () => {
                            navigate(`/report/detail?id=${nextId}`)
                            setChangesID(nextId);
                        } : null} />
                        <div className="mx-2" />
                        <Button setWidth="auto" bgcolor={'white'} icon={d_arrow_right_g} handleAction={() => {
                            navigate(`/report/detail?id=${lastDataId}`);
                            setChangesID(lastDataId);
                        }} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReportDetail;