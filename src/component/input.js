const Input = ({label, setName, type, placeholder, setWidth = '100%', handleAction, value = '', textAlign = 'left', readOnly = false}) => {
    return (
        // <div className="py-2">
        //     <input type={type} className="border border-black rounded-lg p-1 text-sm" placeholder={placeholder} />
        //     {isError && <p className="font-normal italic text-red-700">text</p>}
        // </div>
        <div className="mb-5" style={{width: setWidth }}>
            {label && <label for="email" className="block mb-2 text-sm font-medium text-gray-900">{label}</label> }
            <input type={type} value={value} style={{textAlign: textAlign}} name={setName} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} onChange={handleAction ? handleAction : null} required readOnly={readOnly} />
        </div>
    )
}

export default Input;