const Input = ({label, type, placeholder, value, isError = null}) => {
    return (
        // <div className="py-2">
        //     <input type={type} className="border border-black rounded-lg p-1 text-sm" placeholder={placeholder} />
        //     {isError && <p className="font-normal italic text-red-700">text</p>}
        // </div>
        <div className="mb-5">
            {label && <label for="email" className="block mb-2 text-sm font-medium text-gray-900">{label}</label> }
            <input type={type} className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5" placeholder={placeholder} required />
        </div>
    )
}

export default Input;