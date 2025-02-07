const Input = ({label, setName, type, placeholder, setWidth = '100%', handleAction, value = '', textAlign = 'left', readOnly = false}) => {
    
    const formatDate = (dateString) => {
        return dateString ? dateString.split("T")[0] : null; // Extracts only 'YYYY-MM-DD'
    };

    return (
        // <div className="py-2">
        //     <input type={type} className="border border-black rounded-lg p-1 text-sm" placeholder={placeholder} />
        //     {isError && <p className="font-normal italic text-red-700">text</p>}
        // </div>
        <div className="mb-5" style={{width: setWidth }}>
            {label && <label className="block mb-2 text-xs font-medium text-gray-900">{label}</label> }
            <input type={type} value={type === 'date' ? formatDate(value) || null : value} style={{textAlign: textAlign}} name={setName} className={`border border-gray-300 text-gray-900 text-xs rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5`} placeholder={placeholder} onChange={handleAction ? handleAction : null} required disabled={readOnly} />
        </div>
    )
}

export default Input;