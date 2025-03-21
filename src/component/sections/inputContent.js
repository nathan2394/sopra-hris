import React from "react";
import { add_g, empty } from "../../config/icon";
import Button from "../button";
import { baseColor } from "../../config/setting";
import IconImage from "../icon_img";

const InputContent = ({children, showForm, setWidth = '100%', isAdd, setIsAdd, isEdit, setIsEdit, handleAction, btnLabel = 'Edit' }) => {
    const toggleEdit = () => setIsEdit((prev) => !prev);
    const toggleAdd = () => setIsAdd((prev) => !prev);

    return (
        <div className="flex flex-col" style={{width: setWidth}}>
            <div className="bg-white rounded-lg pt-2 min-h-[550px]" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                <div className={`flex flex-col ${showForm ? 'justify-between' : 'items-center justify-center'} py-2 px-3 h-full`}>
                    <div>
                        {showForm ? children :
                            <div className="flex flex-col items-center justify-center text-center">
                                <img className="w-[50%] mx-auto" alt="logo" src={empty} />
                                <p className="font-bold text-sm">Ups, Tidak Ada Data!</p>
                                <p className="text-xs text-[#333333a2]">Silahkan pilih salah satu data pada table agar dapat ditampilkan disini. Pilih “Tambah Data” untuk menambahkan.</p>
                            </div>
                        }
                    </div>
                    {showForm &&
                        <div>
                            <div className="bg-[#ddd] mb-3 w-full h-[1.5px]" />
                            <div className="flex flex-row justify-between w-full">
                                {(isEdit || isAdd) ?
                                    <>
                                        <Button text="Batal" showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={isEdit ? toggleEdit : toggleAdd} />
                                        <div className="mx-1" />
                                        <Button text="Simpan" showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={handleAction} />
                                    </>
                                    :
                                    <Button text={btnLabel} showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={toggleEdit} />
                                }
                            </div>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default InputContent;