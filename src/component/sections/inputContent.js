import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { add_g, empty } from "../../config/icon";
import SearchableSelect from "../select2";
import Input from "../input";
import Button from "../button";
import { baseColor } from "../../config/setting";
import IconImage from "../icon_img";

const InputContent = ({children, showForm, buttonHeader = false, showContent = '', setShowContent}) => {

    return (
        <div className="flex flex-col w-[40%]">
            {buttonHeader &&
                <div className="w-full flex flex-row items-center mb-2">
                    <Button text="Shift" bgcolor={showContent === 'Shift' ? baseColor : '#9d9d9d'} color={'white'} handleAction={setShowContent ? () => setShowContent('Shift') : null} />
                    <div className="mx-1" />
                    <Button text="Ketidakhadiran" bgcolor={showContent === 'Unnatendance' ? baseColor : '#9d9d9d'} color={'white'} handleAction={setShowContent ? () => setShowContent('Unnatendance') : null} />
                    <div className="mx-1" />
                    <Button text="Lembur" bgcolor={showContent === 'Overtime' ? baseColor : '#9d9d9d'} color={'white'} handleAction={setShowContent ? () => setShowContent('Overtime') : null} />
                </div>
            }
            <div className="bg-white rounded-lg pt-2 min-h-[550px]" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
                <div className={`flex flex-col ${showForm ? 'justify-between' : 'items-center justify-center'} py-2 px-3 h-full`}>
                    {showForm ? children :
                        <div className="flex flex-col items-center justify-center text-center">
                            <img className="w-[50%] mx-auto" alt="logo" src={empty} />
                            <p className="font-bold text-sm">Ups, Tidak Ada Data!</p>
                            <p className="text-xs text-[#333333a2]">Silahkan pilih salah satu data pada table agar dapat ditampilkan disini. Pilih “Tambah Data” untuk menambahkan.</p>
                        </div>
                    }
                </div>
            </div>
        </div>
    );
}

export default InputContent;