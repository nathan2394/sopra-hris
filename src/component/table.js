import { Link } from "react-router-dom";
import { checkType, formatHeader, formatText } from "../config/helper";
import { baseColor } from "../config/setting";
import { employee } from "../config/icon";

const Table = ({ dataTable = [], isAction = false }) => {
  if (dataTable?.length > 0) {
    const labelHeader = Object?.keys(dataTable[0]);

    return (
      <div className="w-full overflow-x-auto pt-4">
        <table className="table-auto  text-xs rounded-lg overflow-hidden border border-[#595858]">
          <thead className="text-[10px] text-white uppercase bg-[#333333]">
            <tr>
              {labelHeader?.map((val, idx) => (
                <th
                  scope="col"
                  key={idx}
                  style={{ width: `${100 / labelHeader.length}%` }} // Adjust the width calculation as needed
                  className={`border border-[#595858] min-w-[105px] p-[10px] ${
                    idx === 0 ? "first:rounded-tl-lg" : ""
                  } ${idx === labelHeader.length - 1 ? "last:rounded-tr-lg" : ""}`}
                >
                  <Link >{formatHeader(val)}</Link> 
                </th>
              ))}
              {isAction &&
                <th
                  scope="col"
                  style={{ width: `${100}%` }} // Adjust the width calculation as needed
                  className={`border border-[#595858] min-w-[105px] p-[10px] last:rounded-tr-lg`}
                >
                  Action
                </th>
              }
            </tr>
          </thead>
          <tbody>
            {dataTable?.map((row, index) => (
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
                      idx === 0 && index === dataTable.length - 1
                        ? "first:rounded-bl-lg"
                        : ""
                    } ${
                      idx === Object.values(row).length - 1 &&
                      index === dataTable.length - 1
                        ? "last:rounded-br-lg"
                        : ""
                    }`}
                  >
                    {isAction 
                    ? 
                      <Link to={row?.employeeID ? `/employee/detail?id=${row?.employeeID}` : '#'}>{formatText(val)}</Link>
                    :
                      formatText(val)
                    }
                  </th>
                ))}
                {/* {isAction &&
                  <th scope="row" className={`p-[10px] font-normal border border-[#d2cfcf] text-black whitespace-nowrap ${"text-left"}`}>
                      <Link to={row?.employeeID ? `/employee/detail?id=${row?.employeeID}` : '#'} className={`underline text-[#369D00]`}>View</Link>
                  </th>
                } */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default Table;
