import IconImage from "./icon_img";
import LoadingIndicator from "./loading_indicator";

const Button = ({type = 'button', text, bgcolor, color, isLoading = false, handleAction = null, icon = null}) => {
    return (
        <div className="py-2">
            {/* <button className={`rounded-lg p-1 font-bold`} style={{background: bgcolor, color: color}} type="submit">{text}</button> */}
            <button className={`${type === 'inputFile' ? 'rounded-l-lg' : 'rounded-lg' } p-2 font-bold cursor-pointer`} style={{background: bgcolor, color: color}} onClick={handleAction}>
                {isLoading ? 
                    <LoadingIndicator showText={true} label={"Loading"} position={'left'} /> 
                    : 
                    <div className="flex flex-row items-center">
                        <p className={icon ? 'pr-2' : 'p-0'}>{text}</p>
                        {icon && <IconImage size={'normal'} source={icon} />}
                    </div>
                }
            </button>
        </div>
    );
}

export default Button;