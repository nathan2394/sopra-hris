const Button = ({type = 'button', text, bgcolor, color, handleAction}) => {
    return (
        <div className="py-2">
            {/* <button className={`rounded-lg p-1 font-bold`} style={{background: bgcolor, color: color}} type="submit">{text}</button> */}
            <button className={`${type === 'inputFile' ? 'rounded-l-lg' : 'rounded-lg' } p-2 font-bold cursor-pointer`} style={{background: bgcolor, color: color}} type="submit" onClick={handleAction}>{text}</button>
        </div>
    );
}

export default Button;