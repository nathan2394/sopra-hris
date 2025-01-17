import { checkType, formatHeader, formatText } from "../config/helper";

const Table = ({ dataTable = []}) => {
    if(dataTable?.length > 0){
        const labelHeader = Object?.keys(dataTable[0]);
    
        return (
            <div className="w-full overflow-x-auto pt-4">
                <table className="table-auto w-full text-xs  rounded-lg">
                    <thead className="text-[10px] text-black uppercase bg-[rgb(221,221,221)]">
                        <tr>
                            {labelHeader?.map((val, idx) => (
                                <th scope="col" key={idx} className={`px-6 py-3 ${idx === 0 ? "rounded-tl-lg" : idx === labelHeader.length - 1 ? "rounded-tr-lg" : ""}`}>
                                    {formatHeader(val)}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {dataTable?.map((row, index) => (
                            <tr className="bg-[#f6f6f6] border-b last:rounded-b-lg" key={index}>
                                {Object.values(row)?.map((val, idx) =>(
                                    <th scope="row" key={idx} className={`px-6 py-4 font-normal text-black whitespace-nowrap ${checkType(val) === 'number' ? 'text-right' : 'text-left'}`}>
                                        {formatText(val)}
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        );
    }
}

export default Table;