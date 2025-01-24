import { baseColor } from "../config/setting";
import Button from "./button";
import IconImage from "./icon_img";
import { Link, useNavigate } from 'react-router-dom';

const TitlePage = ({label, subLabel = '', source, type = 'header', setNavigateBack}) => { 
    const navigate = useNavigate();
    const menu = [
        {
            title: 'Master Payroll',
            navRoute: '/',
        },
        {
            title: 'Employee Data',
            navRoute: '/employee',
        }
    ];

    return (
        <>
            <div className="flex flex-row justify-between items-center">
                {type === 'header' ? 
                    <div className="flex flex-row items-center">
                        <IconImage size="small" source={source} />
                        <p className="font-bold text-sm pl-2">{label}</p>
                    </div>
                :
                    <div className="flex flex-row items-center">
                        <Link to={setNavigateBack}>
                            <div className="flex flex-row items-center">
                                <IconImage size="small" source={source} />
                                <p className="font-bold text-sm pl-2">{label}</p>
                            </div>
                        </Link>
                        <p className="font-bold text-sm px-2">{`>`}</p>
                        <p className="font-bold text-sm pl-2 underline">{subLabel}</p>
                    </div>
                }
                {type === 'header' &&                
                    <div className="flex flex-row">
                        {menu?.map((val, idx) => (
                            <div key={idx} className={`${idx+1 !== menu?.length ? 'pr-3' : '' }`}>
                                <Button text={val.title} setWidth={'auto'} bgcolor={`${val.title === label ? baseColor : 'rgb(51 51 51 / 30%)'}`} color={'white'} handleAction={() => navigate(val.navRoute)} />
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