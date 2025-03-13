import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { add_g, empty } from "../../config/icon";
import SearchableSelect from "../select2";
import Input from "../input";
import Button from "../button";
import { baseColor } from "../../config/setting";
import IconImage from "../icon_img";

const InputContent = ({children, showForm}) => {

    return (
        <div className="bg-white rounded-lg pt-2 w-[45%] min-h-[550px]" style={{boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}}>
            <div className={`flex flex-col ${showForm ? 'justify-between' : 'items-center justify-center'} py-2 px-3 h-full`}>
                {showForm ? children :
                    <div className="flex flex-col items-center justify-center">
                      <img className="w-[50%] mx-auto" alt="logo" src={empty} />
                      <p className="font-bold text-sm">Opps, Nothing to See Here!</p>
                    </div>
                }
            </div>
        </div>
    );
}

export default InputContent;