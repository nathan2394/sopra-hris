import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { checkType, formatHeader, formatText } from "../config/helper";
import { baseColor } from "../config/setting";
import { employee, empty, sort_asc, sort_desc } from "../config/icon";
import IconImage from "./icon_img";

const Table = React.memo(({ dataTable = [], isAction = false, detailPath = '', setIsFilter = null, listFilter = [], setListFilter }) => {
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

  if (dataTable?.length > 0) {
    const labelHeader = Object?.keys(dataTable[0]);

    return (
      <div className="w-full overflow-x-auto pt-4">
        <table className="table-auto  text-xs rounded-lg overflow-hidden border border-[#595858]">
          <thead className="text-[10px] text-white uppercase bg-[#333333c3]">
            <tr>
              {labelHeader?.map((val, idx) => (
                <th
                  scope="col"
                  key={idx}
                  style={{ width: `${100 / labelHeader.length}%` }} // Adjust the width calculation as needed
                  className={`border border-[#595858] min-w-[115px] p-[10px] ${
                    idx === 0 ? "first:rounded-tl-lg" : ""
                  } ${idx === labelHeader.length - 1 ? "last:rounded-tr-lg" : ""}`}
                >
                  <div className="flex flex-row items-center">
                    <Link >{formatHeader(val)}</Link> 
                    <div className="flex flex-col pl-2" onClick={() => sortData(val)}>
                      <div className={`cursor-pointer`}><IconImage size={'smaller'} source={sort_asc} /></div>
                      <div className={`mt-[-9.8px] cursor-pointer`}><IconImage size={'smaller'} source={sort_desc} /></div>
                    </div>
                  </div>
                </th>
              ))}
              {/* {isAction &&
                <th
                  scope="col"
                  style={{ width: `${100}%` }} // Adjust the width calculation as needed
                  className={`border border-[#595858] min-w-[105px] p-[10px] last:rounded-tr-lg`}
                >
                  Action
                </th>
              } */}
            </tr>
          </thead>
          <tbody>
            {listTable?.map((row, index) => (
              <tr
                className={`${
                  index % 2 === 0 ? "bg-[rgb(255,255,255)]" : "bg-[#ebebeb]"
                } cursor-pointer`}
                key={index}
              >
                {Object.values(row)?.map((val, idx) => (
                  <th
                    scope="row"
                    key={idx}
                    className={`p-[10px] font-normal border border-[#d2cfcf] text-black whitespace-nowrap ${
                      checkType(val) === "number"
                        ? "text-right"
                        : "text-left"
                    } ${
                      idx === 0 && index === listTable?.length - 1
                        ? "first:rounded-bl-lg"
                        : ""
                    } ${
                      idx === Object.values(row).length - 1 &&
                      index === listTable?.length - 1
                        ? "last:rounded-br-lg"
                        : ""
                    }`}
                  >
                    {isAction 
                    ? 
                      <Link to={row?.id ? `${detailPath}${row?.id}` : '#'}>{formatText(val)}</Link>
                    :
                      formatText(val)
                    }
                  </th>
                ))}
                {/* {isAction &&
                  <th scope="row" className={`p-[10px] font-normal border border-[#d2cfcf] text-black whitespace-nowrap ${"text-left"}`}>
                      <Link to={row?.id ? `/employee/detail?id=${row?.id}` : '#'} className={`underline text-[#369D00]`}>View</Link>
                  </th>
                } */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }else{
    return (
      <div className="border border-[#ddd] bg-[#ffffff] rounded-lg w-full my-2 min-h-[400px] flex flex-col items-center justify-center p-6">
        <div className="flex flex-col items-center justify-center p-6">
          <div className="flex flex-col items-center justify-center p-6">
            <img className="w-[28%] mx-auto" alt="logo" src={empty} />
            <p className="font-bold text-sm">Opps, Nothing to See Here!</p>
          </div>
        </div>
      </div>
    );
  }
});

export default Table;
