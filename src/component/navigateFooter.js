import React, { useState } from "react";
import SearchableSelect from "./select2";
import Button from "./button";
import { arrow_left_g, arrow_right_g, d_arrow_left_g, d_arrow_right_g } from "../config/icon";
import { useNavigate } from "react-router-dom";

const NavigateFooter = ({showPrevFilter = false, navRoute, currId, handleAction}) => {
    const navigate = useNavigate();
    const listData = JSON.parse(localStorage?.getItem('empolyeeList'));
    const listFilterEmpl = JSON.parse(localStorage?.getItem('filterEmpl')) ?? {};
    const [isHovered, setIsHovered] = useState({});
    const [changesId, setChangesID] = useState(currId ?? 0);
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

    const currentIndex = listData?.findIndex(obj => obj?.id === parseInt(currId))
    const prevId = listData[currentIndex-1]?.id ?? 0;
    const nextId = listData[currentIndex+1]?.id ?? 0;
    const prevDataId = listData[0]?.id;
    const lastDataId = listData[listData?.length-1]?.id;

    return(<>
        <div className="my-5" />
        <div className="fixed bottom-0 left-0 w-full bg-white px-10 pb-2" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
            <div className="flex flex-row items-center justify-between mt-2">
                <div className="flex flex-row items-center w-full">
                    <SearchableSelect setWidth={showPrevFilter ? "30%" : "20%"} options={listSearch} value={targetSearch} setValue={setTargetSearch} />
                    <div className="mx-1" />
                    <SearchableSelect setWidth={showPrevFilter ? "54%" : "46%"} placeHolder={'Cari Karwayan...'} options={listData?.map((obj) => ({value: obj?.id, label: obj?.[targetSearch]}))} isDisabled={targetSearch === '' ? true : false} useSearchIcon={true} setValue={setChangesID} value={changesId} handleAfterExecute={handleAction} />
                </div>
                <div className="flex flex-row items-center justify-end w-full">
                    <Button setWidth="auto" bgcolor={'white'} icon={d_arrow_left_g} handleAction={() => {
                        navigate(`${navRoute}${prevDataId}`);
                        setChangesID(prevDataId);
                    }} />
                    <div className="mx-2" />
                    <Button setWidth="auto" bgcolor={'white'} icon={arrow_left_g} handleAction={prevId > 0 ? () => {
                        navigate(`${navRoute}${prevId}`);
                        setChangesID(prevId);
                    } : null} />
                    <div className="mx-[6px]" />
                    <Button setWidth="80px" bgcolor={'white'} position="center" text={`${currentIndex+1}/${listData?.length}`} />
                    <div className="mx-[6px]" />
                    <Button setWidth="auto" bgcolor={'white'} icon={arrow_right_g} handleAction={nextId > 0 ? () => {
                        navigate(`${navRoute}${nextId}`)
                        setChangesID(nextId);
                    } : null} />
                    <div className="mx-2" />
                    <Button setWidth="auto" bgcolor={'white'} icon={d_arrow_right_g} handleAction={() => {
                        navigate(`${navRoute}${lastDataId}`);
                        setChangesID(lastDataId);
                    }} />
                </div>
                {showPrevFilter &&
                    <div className="w-full flex flex-row items-end justify-end">
                        {listFilterEmpl?.checkedValue &&
                        Object.entries(listFilterEmpl?.checkedValue)?.map(([label, items]) => 
                        items?.length > 0 && (
                            <>
                            <div className={`py-1 w-auto pl-3 relative`}>
                                {isHovered[label] &&                                 
                                    <div className="bg-white p-2 min-w-[130px] rounded-md absolute bottom-12 right-0" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                                        {items?.map((data, idx) => (
                                            <p className="text-xs">{`${idx+1}. ${data?.value}`}</p>
                                        ))}
                                    </div>
                                }
                                <button className={`rounded-md w-auto p-2 bg-white`} style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}
                                    onMouseEnter={() => {
                                        const init = {...isHovered}
                                        init[label] = true;
                                        setIsHovered(init);
                                    }}
                                    onMouseLeave={() => {
                                        const init = {...isHovered}
                                        init[label] = false;
                                        setIsHovered(init);
                                    }}
                                >
                                    <div className={`flex flex-row items-center font-normal text-sm`}>
                                        {`${items?.length} ${label === 'group' ? 'grade' : label}`}
                                    </div>
                                </button>
                            </div>
                            </>
                        ))}

                    </div>
                }
            </div>
        </div>
    </>);
}

export default NavigateFooter;