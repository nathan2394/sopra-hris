import React, { useEffect, useState } from "react";

const DataTable = ({ dataTable = [], columns, isAction = false, detailPath = '', beforeNavigate = null, actionDelete, actionEdit, actionClick, setWidth = '100%', rowActive = 0 }) => {
    const [listTable, setListTable] = useState([]);
    
    useEffect(() => {
        setListTable(dataTable);
    }, [dataTable]);

    return (
        <div className="overflow-x-auto" style={{width: setWidth}}>
        <table className="w-full table-auto text-xs rounded-lg overflow-hidden border border-[#939292]" border="1" cellPadding="5" style={{ borderCollapse: "collapse" }}>
            <thead className="text-white capitalize bg-[#333333c3]">
                <tr>
                    {columns.map((col, index) => (
                    <th key={col.field} className={`border border-[#939292] p-3 ${index === 0 ? "first:rounded-tl-lg" : ""} ${index === columns.length - 1 ? "last:rounded-tr-lg" : ""}`}>
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
                    className={`p-[8px] font-normal border-x border-[#d2cfcf] text-black whitespace-nowrap text-${col.alignment || "left"}`}
                    >
                    {col.render ? col.render(row[col.field], row) : row[col.field]}
                    </td>
                ))}
                </tr>
            ))}
            </tbody>
        </table>
        </div>
    );
};

export default DataTable;

// Example usage
// const columns = [
//   { field: "name", header: "Name", alignment: "left", color: "text-blue-500" },
//   { field: "age", header: "Age", alignment: "center", color: "text-red-500", render: (value) => `${value} years old` },
//   { field: "email", header: "Email", alignment: "right", color: "text-green-500", render: (value) => <a href={`mailto:${value}`} className="underline">{value}</a> },
//   { field: "dateRange", header: "Date Range", alignment: "center", color: "text-purple-500", render: (_, row) => `${row.startDate} - ${row.endDate}` },
// ];

// const data = [
//   { name: "John Doe", age: 28, email: "john@example.com", startDate: "2024-01-01", endDate: "2024-12-31" },
//   { name: "Jane Smith", age: 34, email: "jane@example.com", startDate: "2023-06-15", endDate: "2024-06-14" },
// ];

// <DataTable data={data} columns={columns} />
