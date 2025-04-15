import { months, years } from "../config/helper";
import { exportData, filterData, search } from "../config/icon";
import { baseColor } from "../config/setting";
import Button from "./button";
import IconImage from "./icon_img";
import { Link, useNavigate } from 'react-router-dom';
import SearchableSelect from "./select2";
import MyDatePicker from "./date_picker";
import Input from "./input";

const TitlePage = ({label, label2, subLabel = '', subMenu = [], source, type = 'header', setNavigateBack, setNavigateBack2, isAction = false, handleSearch = false, handleFilter = false, handleExport = false, handleAdd = false, handleSubmit = null, startDateVal, setStartDateVal, endDateVal, setEndDateVal }) => { 
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userdata'));
    const breadcrumb = JSON.parse(localStorage?.getItem('breadcrumb')) || null;

    return (
        <>
            <div className={`flex flex-row justify-between items-center ${!isAction ? 'pt-4 pb-2' : 'pt-2'}`}>
                {type === 'header' ? 
                    <div className="flex flex-row items-center w-full">
                        <IconImage size="small" source={source} />
                        <p className="font-bold text-sm pl-2">{label}</p>
                    </div>
                :
                    <>
                        <div className="flex flex-row items-center w-full">
                            {breadcrumb &&
                                <Link to={breadcrumb?.navRoute}>
                                    <div className="flex flex-row items-center">
                                        <IconImage size="small" source={breadcrumb?.icon} />
                                        <p className="font-bold text-sm pl-2">{breadcrumb?.label}</p>
                                    </div>
                                </Link>
                            }
                            {/* <Link to={setNavigateBack}>
                                <div className="flex flex-row items-center">
                                    <IconImage size="small" source={source} />
                                    <p className="font-bold text-sm pl-2">{label}</p>
                                </div>
                            </Link> */}
                            {label2 && <>
                                <p className="font-bold text-sm px-2">{`>`}</p>
                                <Link to={setNavigateBack2}>
                                    <p className="font-bold text-sm">{label2}</p>
                                </Link>
                            </>}
                            <p className="font-bold text-sm px-2">{`>`}</p>
                            <p className="font-bold text-sm underline">{subLabel}</p>
                        </div>
                    </>
                } 
                {(type === 'header' && isAction) &&                
                    <div className="flex flex-row items-center w-full justify-end">
                        {handleSearch && 
                            <>
                                <Button setWidth="auto" bgcolor={'white'} icon={search} handleAction={handleSearch} />
                            </>
                        }
                        {handleFilter && 
                            <>
                                <div className="mx-[6px]" />
                                <Button setWidth="auto" bgcolor={'white'} icon={filterData} handleAction={handleFilter} />
                            </>
                        }
                        {handleExport && 
                            <>
                                <div className="mx-[6px]" />
                                <Button text={'Export Data'} setWidth={'auto'} bgcolor={'white'} color={baseColor} icon={exportData} handleAction={handleExport} />
                            </>
                        }
                        {(handleAdd) && 
                            <>
                                <div className="bg-[#33333328] h-[30px] w-[1px] mx-4" />
                                <Button text={'+ Tambah Data'} setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={handleAdd} />
                            </>
                        }
                        {label === 'Kehadiran' &&
                            <>
                                <div className="mx-2" />
                                <MyDatePicker isRange={true} setWidth="220px" startDateVal={startDateVal} setStartDateVal={setStartDateVal} endDateVal={endDateVal} setEndDateVal={setEndDateVal} />
                                <div className="bg-[#33333328] h-[30px] w-[1px] mx-4" />

                                {handleSubmit !== null &&
                                <>
                                    <Button text={'Terapkan'} setWidth={'auto'} bgcolor={baseColor} color={'white'} handleAction={handleSubmit} />
                                </>
                                }
                            </>
                        }
                    </div>
                }
                {subMenu?.length > 0 &&
                    <div className="flex flex-row w-full justify-end">
                        {subMenu?.map((data, idx) => (
                            <div className="ml-2" key={idx}>
                                <Button bgcolor={subLabel === data?.title ? baseColor : '#33333340'} color={'white'} text={data?.title} handleAction={data?.navRoute ? () => navigate(data?.navRoute) : data?.handleAction} />
                            </div>
                        ))}
                    </div>
                }
            </div>
            <div className="bg-[#ddd] my-3 h-[1.5px]" />
        </>
    )
}

export default TitlePage;