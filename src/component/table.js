import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkType, formatHeader, formatText } from "../config/helper";
import { baseColor } from "../config/setting";
import { edit_g, employee, empty, sort_asc, sort_desc } from "../config/icon";
import IconImage from "./icon_img";

const Table = React.memo(({ dataTable = [], rowSettings, isAction = false, detailPath = '', beforeNavigate = null, actionDelete, actionEdit, actionClick, styleHeader = 'default', setWidth = '100%' }) => {
  const [listTable, setListTable] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: null });

  useEffect(() => {
    setListTable(dataTable);
  }, [dataTable]);

  const sortData = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    const sortedList = [...listTable].sort((a, b) => {
      if (a[key] < b[key]) return direction === 'asc' ? -1 : 1;
      if (a[key] > b[key]) return direction === 'asc' ? 1 : -1;
      return 0;
    });
    setListTable(sortedList);
    setSortConfig({ key, direction });
  }

  const DefaultTabel = ({headers = []}) => {
    return (
      <div className="overflow-x-auto" style={{width: setWidth}}>
        <table className="w-full table-auto text-xs rounded-lg overflow-hidden border border-[#939292]">
          <thead className="text-[10px] text-white uppercase bg-[#333333c3]">           
            <tr>
              {headers?.filter(obj => obj !== 'id')?.map((val, idx) => (
                <th
                  scope="col"
                  key={idx}
                  className={`border border-[#939292] ${val?.length > 9 ? 'min-w-[205px]' : val?.length > 7 ? 'min-w-[165px]' : val?.length >= 5 ? 'min-w-[100px]' : val?.length >= 3 ? 'min-w-[80px]' : 'min-w-[60px]' }  p-[10px] ${
                    idx === 0 ? "first:rounded-tl-lg" : ""
                  } ${idx === headers.length - 1 ? "last:rounded-tr-lg" : ""}`}
                >
                  <div className="flex flex-row items-center">
                    <Link>
                      <span className="font-medium text-[12px]">{formatHeader(val)}</span>
                    </Link> 
                    <div className="flex flex-col pl-2" onClick={() => sortData(val)}>
                      <div className={`cursor-pointer`}><IconImage size={'smaller'} source={sort_asc} /></div>
                      <div className={`mt-[-11px] cursor-pointer`}><IconImage size={'smaller'} source={sort_desc} /></div>
                    </div>
                  </div>
                </th>
              ))}
              {(isAction && (actionDelete || actionEdit)) &&
                <th
                  scope="col"
                  style={{ width: `${100}%` }} // Adjust the width calculation as needed
                  className={`border border-[#939292] min-w-[105px] p-[10px] last:rounded-tr-lg`}
                >
                  Action
                </th>
              }
            </tr>
          </thead>
          <tbody>
            {listTable?.map((row, index) => (
              <tr
                className={`${
                  index % 2 === 0 ? "bg-[rgb(255,255,255)]" : "bg-[#ebebeb]"
                } cursor-pointer hover:bg-[#379d0043]`}
                key={index}
                onClick={actionClick ? () => actionClick(row) : null}
              >
                {Object.entries(row)?.map(([key, val], idx) => {
                  if (key === 'id') return null; // Skip rendering if key is "id"

                  return (
                    <th
                      scope="row"
                      key={idx}
                      style={rowSettings ? {textAlign: rowSettings[idx]?.alignment} : {}}
                      className={`p-[8px] font-normal border border-[#d2cfcf] text-black whitespace-nowrap ${
                        checkType(val) === "number" ? "text-right" : "text-left"
                      } ${
                        idx === 0 && index === listTable?.length - 1
                          ? "first:rounded-bl-lg"
                          : ""
                      } ${
                        idx === Object.keys(row).length - 1 && index === listTable?.length - 1
                          ? "last:rounded-br-lg"
                          : ""
                      }`}
                    >
                      {isAction
                        ? beforeNavigate 
                          ? <div onClick={() => beforeNavigate(row?.id, idx)}>{formatText(val)}</div>
                          : <Link to={row?.id ? `${detailPath}${row?.id}` : '#'}>{formatText(val)}</Link>
                        : formatText(val)}
                    </th>
                  );
                })}

                {(isAction && (actionDelete || actionEdit)) &&
                  <th scope="row" className={`p-[10px] font-normal border border-[#d2cfcf] text-black whitespace-nowrap ${"text-left"}`}>
                      <div className="flex flex-row items-center justify-center">
                        {actionEdit && <Link to={row?.id ? `${detailPath}${row?.id}` : '#'} className={`font-semibold hover:underline text-[#369D00] mr-2`}>View</Link>}
                        {actionDelete && <p className={`font-semibold hover:underline text-[#D22F27]`} onClick={() => actionDelete(row?.id)}>Delete</p>}
                      </div>
                  </th>
                }
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  if(dataTable?.length > 0){
    const labelHeader = Object?.keys(dataTable[0]);

    return <DefaultTabel headers={labelHeader} />
  }else{
    return (
      <div className="border border-[#ddd] bg-[#ffffff] rounded-lg w-full my-2 min-h-[400px] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center p-6">
            <img className="w-[28%] mx-auto" alt="logo" src={empty} />
            <p className="font-bold text-sm">Ups, Tidak Ada Data!</p>
          </div>
        </div>
      </div>
    );
  }
});

export default Table;
