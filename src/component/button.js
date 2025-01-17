import IconImage from "./icon_img";
import LoadingIndicator from "./loading_indicator";

const Button = ({type = 'button', setWidth = 'full', position = 'left', text = '', showBorder = false, borderColor = '#EA2427', bgcolor, color, isLoading = false, handleAction = null, icon = null}) => {
    const buttonLength = setWidth === 'full' ? 'w-full' : 'auto';
    const labelPositon = position === 'center' ? 'justify-center' : ''; 
    return (
        <div className="py-2">
            {/* <button className={`rounded-lg p-1 font-bold`} style={{background: bgcolor, color: color}} type="submit">{text}</button> */}
            <button className={`${type === 'inputFile' ? 'rounded-l-lg' : 'rounded-lg' } ${buttonLength} p-2 font-bold cursor-pointer ${showBorder ? `border border-[${borderColor}]` : '' }`} style={{background: bgcolor, color: color}} onClick={handleAction}>
                {isLoading ? 
                    <LoadingIndicator showText={true} label={"Loading"} position={'left'} /> 
                    : 
                    <div className={`flex flex-row items-center ${labelPositon}`}>
                        {icon && <IconImage size={'normal'} source={icon} />}
                        <p className={icon ? 'pl-2' : 'p-0'}>{text}</p>
                    </div>
                }
            </button>
        </div>
    );
}

export default Button;