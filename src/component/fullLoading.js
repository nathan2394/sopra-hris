import { gif_loader, google } from "../config/icon";
import IconImage from "./icon_img";

const FullLoading = () => {

    return (
        <div className={`bg-[#0000003e] mx-auto w-full h-full fixed top-0 flex items-center justify-center overflow-hidden`} style={{zIndex: 9999}}>
            <img className={`w-[340px]`} alt="icon" src={gif_loader} />
        </div>
    )
}

export default FullLoading;