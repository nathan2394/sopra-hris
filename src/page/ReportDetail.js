import React, { useEffect, useRef, useState } from "react";
import TitlePage from "../component/titlePage";
import Input from "../component/input";
import { employee, empty, payroll } from "../config/icon";
import { loadData } from "../config/api";
import { coverDate, formatText } from "../config/helper";
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
        uLembur: '',
        bpjs: '',
        netto: '',
    });

    const [isEdit, setIsEdit] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);

    useEffect(()=> {
        const getId = url.searchParams.get("id");
        if(getId){
            loadData({url: `SalaryDetails/${getId}`}).then((res) => {
                if(res?.data){
                    setFormData({
                        name: '',
                        depart: '',
                        jobTitle: '',
                        basicSalary: '',
                        uMakan: '',
                        uLembur: '',
                        bpjs: '',
                        netto: '',
                    })
                }
            })
        }
    }, []);

    return (
        <>
            <TitlePage label={'Report Data'} subLabel={'Report Detail'} source={employee} type={'detail'} setNavigateBack={`/report`} />
            <div className="border bg-white p-4 rounded-lg">
                {/* <div className="flex flex-row justify-between items-center">
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
                </div> */}

                <div className="bg-[#ddd] my-3 h-[1.5px]" />

                <div>
                    <div className="flex flex-row w-full">
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Name'} type={'text'} value={formData?.name} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Department'}  type={'text'} value={formData?.depart} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Job Title'} type={'text'} value={formData?.jobTitle} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Basic Salary'} type={'text'} value={formData?.basicSalary} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'U Makan'} type={'text'} value={formData?.uMakan} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'U Lembur'}  type={'text'} value={formData?.uLembur} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'BPJS'}  type={'text'} value={formData?.bpjs} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Netto'} type={'text'} value={formData?.netto} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReportDetail;