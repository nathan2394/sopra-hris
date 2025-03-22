import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { empty } from "../config/icon";

const DataTable = ({ dataTable = [], columns, isAction = false, detailPath, beforeNavigate = null, actionDelete, actionEdit, actionClick, setWidth = '100%', rowActive = 0 }) => {
    const [listTable, setListTable] = useState([]);
    
    useEffect(() => {
        setListTable(dataTable);
    }, [dataTable]);

    return (<>
        {listTable?.length > 0 ?
        <div className="overflow-x-auto" style={{width: setWidth}}>
        <div className="max-h-[550px] overflow-y-auto">
        <table className="w-full table-auto text-xs rounded-lg " border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
            <thead className="text-white capitalize bg-[#747474] sticky top-0">
                <tr>
                    {columns.map((col, index) => (
                    <th key={col.field} className={`border-x border-[#d2cfcf] p-3 ${index === 0 ? "first:rounded-tl-lg" : ""} ${index === columns.length - 1 ? "last:rounded-tr-lg" : ""}`}>
                        {col.header}
                    </th>
                    ))}
                </tr>
            </thead>
            <tbody>
            {dataTable.map((row, rowIndex) => (
                <tr key={rowIndex} className={`${rowActive === row?.id ? 'bg-[#379d0043]' : rowIndex % 2 !== 0 ? "bg-[rgb(255,255,255)]" : "bg-[#ebebeb]" } cursor-pointer hover:bg-[#379d0043]`} onClick={actionClick ? () => actionClick(row) : null}>
                {columns.map((col) => (
                    <td
                    key={col.field}
                    className={`p-[8px] font-normal border-x border-[#d2cfcf] text-[${col?.color || "black"}] whitespace-nowrap text-${col.alignment || "left"}`}
                    >
                        <div>{col.render ? col.render(row[col.field], row) : row[col.field]}</div>
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
        </div>
        :
        <div className="border border-[#ddd] bg-[#ffffff] rounded-lg w-full my-2 min-h-[400px] flex flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center p-6">
            <div className="flex flex-col items-center justify-center p-6">
                <img className="w-[28%] mx-auto" alt="logo" src={empty} />
                <p className="font-bold text-sm">Ups, Tidak Ada Data!</p>
            </div>
            </div>
        </div>
        }
    </>);
};

export default DataTable;
