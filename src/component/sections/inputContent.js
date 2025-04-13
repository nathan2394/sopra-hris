import React from "react";
import { add_g, empty } from "../../config/icon";
import Button from "../button";
import { baseColor } from "../../config/setting";
import IconImage from "../icon_img";

const InputContent = ({children, showForm, setWidth = '100%', isAdd, setIsAdd, isEdit, setIsEdit, handleAction, handleApproveReject, handleCancel, btnLabel = 'Edit', showBtnApprove = false, showBtnCancel = false, setBtnCancel, showBtnAction = true, setBtnAction, showBtnAdd = false, showBtnBack = false }) => {
    const toggleEdit = () => {
        setIsEdit((prev) => !prev);
        if(setBtnAction) setBtnAction(!showBtnAction);
        if(setBtnCancel && showBtnCancel) setBtnCancel(false);
    };
    const toggleAdd = () => {
        setIsAdd((prev) => !prev);
    };
    const userData = JSON.parse(localStorage.getItem('userdata'));

    return (
        <div className="flex flex-col" style={{width: setWidth}}>
            <div className="bg-white rounded-lg pt-2 min-h-[500px]" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
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
                    {(showForm && userData?.roleID !== 3) &&
                        <div>
                            <div className="bg-[#ddd] mb-3 w-full h-[1.5px]" />
                            {(showBtnApprove) ?
                                <>
                                    <div className="flex flex-row justify-between w-full">
                                        <Button text="Reject" showBorder={true} position="center" bgcolor={'#D22F27'} color={'white'} handleAction={() => handleApproveReject(false)} />
                                        <div className="mx-1" />
                                        <Button text="Approve" showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={() => handleApproveReject(true)} />
                                    </div>
                                </>
                                :
                                <div className="flex flex-row justify-between w-full">
                                    {showBtnAction && (
                                        ((isAdd || isEdit)) ?
                                        <>
                                            <Button text="Batal" showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={isEdit ? toggleEdit : toggleAdd} />
                                            <div className="mx-1" />
                                            <Button text="Simpan" showBorder={true} position="center" bgcolor={baseColor} color={'white'} handleAction={handleAction} />
                                        </>
                                        :
                                        <>
                                            {showBtnAdd && <Button text={btnLabel} showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={toggleAdd} />}
                                        </>
                                    )} 
                                    {(!showBtnAction) && showBtnBack &&
                                        <Button text="Kembali" showBorder={true} position="center" bgcolor={'white'} color={baseColor} handleAction={toggleEdit} />
                                    }
                                    {showBtnBack && showBtnCancel && <div className="mx-1" />}
                                    {showBtnCancel &&
                                        <Button text="Cancel" showBorder={true} position="center" bgcolor={'#D22F27'} color={'white'} handleAction={handleCancel} />                       
                                    }
                                </div>
                            }
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default InputContent;