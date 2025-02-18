import React, { useState, useEffect } from "react";
import TitlePage from "../../component/titlePage";
import { calculator, calculator_w, employee, empty, payroll, reload } from "../../config/icon";
import Input from "../../component/input";
import SearchableSelect from "../../component/select2";
import { loadData, postData } from "../../config/api";
import Button from "../../component/button";
import { baseColor } from "../../config/setting";
import { formatText } from "../../config/helper";

const Calculator = ({setIsLoading}) => {
    const calcLocaldata = JSON.parse(localStorage.getItem('calc')) ?? {};

    const [formData, setFormData] = useState({
        hks: 23,
        hka: 23,
        att: 23,
        meal: 23,
        ovt: 0,
        groupID: calcLocaldata.groupID ?? 0,
        basicSalary: calcLocaldata.basicSalary ?? 0,
        payrollType: calcLocaldata.payrollType?.toLowerCase() ?? "",
        bpjs: calcLocaldata.bpjs ?? 0
    });
    
    const [listGroup, setListGroup] = useState([]);
    const [calulateResult, setCalulateResult] = useState([]);

    const payrollListType  = [
        {
            value: 'bulanan',
            label: 'Bulanan'
        },
        {
            value: 'harian',
            label: 'Harian'
        }
    ]

    const handleChange = (event) => {
        setFormData({
          ...formData,
          [event.target.name]: event.target.value,
        });
    };
    

    const handleChangeSelect = (target, value) => {
        setFormData({
            ...formData,
            [target]: value,
          });
    }

    const handleReset = () => {
        setCalulateResult([]);
        localStorage?.removeItem('calc');
        setFormData({
            hks: 0,
            hka: 0,
            att: 0,
            meal: 0,
            ovt: 0,
            groupID: 0,
            basicSalary: 0,
            payrollType: "",
            bpjs: 0
        })
    }

    useEffect(() => {
        loadData({url: 'Groups'})?.then((res) => {
            setListGroup(res?.data?.map((data) => ({
                value: data?.groupID,
                label: `${data?.type}` + `${data?.name ? ` - ${data?.name}` : ''}`
            })));
        });

        if(calcLocaldata){
            calculateSalary();
        }
    }, [])

    const calculateSalary = () => {
        setIsLoading(true)
        postData({url: 'Salary/calculator', formData: formData})?.then((res) => {
            console.log(res)
            if(res?.data?.length > 0){
                setCalulateResult(res?.data)
            }
            setIsLoading(false)
        })
    }

    return (<>
        {calcLocaldata ? 
            <TitlePage type={'detail'} label={'Data Karyawan'} label2={'Data Personal'} subLabel={'Kalkulator'} source={employee} setNavigateBack={'/employee'} setNavigateBack2={`/employee/detail?id=${calcLocaldata?.employeeId}`}/>
            : 
            <TitlePage label={'Kalkulator'} source={calculator} />
        }
        <div className="flex flex-row justify-between">
            <div className="bg-white rounded-lg w-full p-4 mr-2">
                <p className="font-bold text-sm">{'Data Kalkulasi Karyawan'}</p>
                <div className="bg-[#ddd] my-3 h-[1.5px]" />
                <div className="flex flex-row flex-wrap w-full min-h-[400px] pt-2">
                    <SearchableSelect handleAction={handleChangeSelect} name={`payrollType`} setWidth="48%" label={'Tipe Payroll'} placeHolder={'Select Payroll Type'} options={payrollListType} value={formData?.payrollType} />
                    <div className="mx-2" />
                    <SearchableSelect handleAction={handleChangeSelect} name={`groupID`} setWidth="48%" label={'Grade'} placeHolder={'Select Grade'} options={listGroup} value={formData?.groupID} />
                    <Input textAlign={'right'} handleAction={handleChange} label={'Basic Salary'} setName={'basicSalary'} setWidth="48%" value={formData?.basicSalary} type={'number'} />
                    <div className="mx-2" />
                    <Input textAlign={'right'} handleAction={handleChange} label={'HKS'} setName={'hks'} setWidth="48%" value={formData?.hks} type={'number'} />
                    <Input textAlign={'right'} handleAction={handleChange} label={'HKA'} setName={'hka'} setWidth="48%" value={formData?.hka} type={'number'} />
                    <div className="mx-2" />
                    <Input textAlign={'right'} handleAction={handleChange} label={'ATT'} setName={'att'} setWidth="48%" value={formData?.att} type={'number'} />
                    <Input textAlign={'right'} handleAction={handleChange} label={'Meal'} setName={'meal'} setWidth="48%" value={formData?.meal} type={'number'} />
                    <div className="mx-2" />
                    <Input textAlign={'right'} handleAction={handleChange} label={'OVT'} setName={'ovt'} setWidth="48%" value={formData?.ovt} type={'number'} />
                    <Input textAlign={'right'} handleAction={handleChange} label={'BPJS'} setName={'bpjs'} setWidth="48%" value={formData?.bpjs} type={'number'} />
                </div>
                <div className="bg-[#ddd] my-3 h-[1.5px]" />
                <div className="flex justify-end">
                    <Button text="Reset" setWidth="auto" bgcolor={"white"} color={baseColor} icon={reload} handleAction={() => handleReset()} />
                    <div className="mx-[6px]" />
                    <Button text="Kalkulasi Data" setWidth="auto" bgcolor={baseColor} color={'white'} icon={calculator_w} handleAction={() => calculateSalary()} />
                </div>
            </div>
            <div className="bg-white rounded-lg w-full p-4 ml-2">
                <p className="font-bold text-sm">{'Hasil Kalkulasi'}</p>
                <div className="bg-[#ddd] my-3 h-[1.5px]" />
                {calulateResult?.length > 0 ? 
                    <>
                    <div className="min-h-[420px] pt-2">
                        {calulateResult?.filter(obj => !obj?.name?.includes('Netto') && !obj?.type?.includes('Deduction'))?.map((val, idx) => (
                            <div className="flex flex-row items-start justify-between" key={idx}>
                                <div className="flex flex-row justify-between w-full">
                                    <p className="font-normal text-xs pb-2 w-[300px]">{val?.name}</p>
                                    <p className="font-normal text-xs pb-2 ">: Rp.</p>
                                    <p className={`font-normal text-xs pb-2 text-end w-[100px] ${val?.type === 'Deduction' ? `text-[#D22F27]` : `text-[#369D00]`}`}>{`${val?.type === 'Deduction' ? '- ' : '+ '} ${formatText(val?.amount) || 0}`}</p>
                                </div>
                            </div>
                        ))}
                        {calulateResult?.filter(obj => obj?.type?.includes('Deduction'))?.map((val, idx) => (
                            <div className="flex flex-row items-start justify-between" key={idx}>
                                <div className="flex flex-row justify-between w-full">
                                    <p className="font-normal text-xs pb-2 w-[300px]">{'BPJS'}</p>
                                    <p className="font-normal text-xs pb-2 ">: Rp.</p>
                                    <p className={`font-normal text-xs pb-2 text-end w-[100px] ${val?.type === 'Deduction' ? `text-[#D22F27]` : `text-[#369D00]`}`}>{`${val?.type === 'Deduction' ? '- ' : '+ '} ${formatText(val?.amount) || 0}`}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="bg-[#ddd] my-3 h-[1.5px]" />
                    {calulateResult?.filter(obj => obj?.name?.includes('Netto'))?.map((val, idx) => (
                        <div className="flex flex-row items-start justify-between" key={idx}>
                            <div className="flex flex-row justify-between w-full">
                                <p className="font-bold text-xs pb-2 w-[300px]">{'Total'}</p>
                                <p className="font-bold text-xs pb-2 ">: Rp.</p>
                                <p className={`font-bold text-xs pb-2 text-end w-[100px] ${val?.type === 'Deduction' ? `text-[#D22F27]` : `text-[#369D00]`}`}>{`${val?.type === 'Deduction' ? '- ' : '+ '} ${formatText(val?.amount) || 0}`}</p>
                            </div>
                        </div>
                    ))}
                    </>
                    :
                    <div className="flex flex-col items-center justify-center p-6 mt-11">
                        <img className="w-[50%] mx-auto" alt="logo" src={empty} />
                        <p className="font-bold text-sm">Opps, Nothing to See Here!</p>
                    </div>
                }
            </div>
        </div>
    </>);
};

export default Calculator;