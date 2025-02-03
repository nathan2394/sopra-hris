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
        uTransport: '',
        uJabatan: '',
        uFunctional: '',
        utKhusus: '',
        utOperational: '',
        uLembur: '',
        bpjs: '',
        thp: '',
    });

    const [isEdit, setIsEdit] = useState(false);
    const [isReadOnly, setIsReadOnly] = useState(true);

    useEffect(()=> {
        const getId = url.searchParams.get("id");
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
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Tunjangan Makan'} type={'text'} value={formData?.uMakan} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Tunjangan Transport'} type={'text'} value={formData?.uTransport} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Tunjangan Jabatan'} type={'text'} value={formData?.uJabatan} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Tunjangan Functional'} type={'text'} value={formData?.uFunctional} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Tunjangan Khusus'} type={'text'} value={formData?.utKhusus} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Tunjangan Operational'} type={'text'} value={formData?.utOperational} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'Tunjangan Lembur'}  type={'text'} value={formData?.uLembur} />
                        <div className="mx-2" />
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'BPJS'}  type={'text'} value={formData?.bpjs} />
                    </div>

                    <div className="flex flex-row w-full">
                        <Input readOnly={isAdd ? false : isReadOnly}  label={'THP'} setWidth="24%" type={'text'} value={formData?.thp} />
                    </div>
                </div>
            </div>
        </>
    );
}

export default ReportDetail;