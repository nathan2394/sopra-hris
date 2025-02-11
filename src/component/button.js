import { close_white } from "../config/icon";
import IconImage from "./icon_img";
import LoadingIndicator from "./loading_indicator";

const Button = ({type = 'button', setWidth = 'full', position = 'left', text = '', showBorder = false, bgcolor, color, isLoading = false, handleAction = null, icon = null, flagFilter = false}) => {
    const buttonLength = setWidth === 'full' ? 'w-full' : 'auto';
    const labelPositon = position === 'center' ? 'justify-center' : ''; 
    return (
        <div className={`py-2 ${setWidth === 'full' ? 'w-full' : 'auto'}`}>
            {/* <button className={`rounded-lg p-1 font-bold`} style={{background: bgcolor, color: color}} type="submit">{text}</button> */}
            <button className={`${type === 'inputFile' ? 'rounded-l-md' : 'rounded-md' } ${buttonLength} p-2 font-bold cursor-pointer ${showBorder ? `border-2 border-[#369D00]` : '' }`} style={{background: bgcolor, color: color, boxShadow: '0 1px 4px 0 rgba(0, 0, 0, 0.2)'}} onClick={flagFilter ? () => handleAction(text) : handleAction}>
                <div className={`flex flex-row items-start ${labelPositon}`}>
                    {isLoading ? 
                        <LoadingIndicator showText={true} label={"Loading"} position={'left'} /> 
                        : 
                        <div className={`flex flex-row items-center ${labelPositon}`}>
                            {icon && <IconImage size={'normal'} source={icon} />}
                            {text && <p className={`${icon ? 'pl-2' : 'p-0'} text-sm`}>{text}</p> }
                        </div>
                    }
                    {flagFilter &&                
                        <div className="cursor-pointer pl-2">
                            <IconImage size="small" source={close_white} />
                        </div>
                    }
                </div>
            </button>
        </div>
    );
}

export default Button;