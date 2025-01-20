import { Link } from "react-router-dom";
import IconImage from "../component/icon_img";
import { logout, menu, user } from "../config/icon";

const Navbar = ({setAuth}) => {
    return (
        <nav className="flex flex-row fixed items-center justify-between py-3 px-6 bg-[#eee] " style={{width: '-webkit-fill-available', zIndex: 99}}>
          <div className="flex flex-row items-center">
            <div className="cursor-pointer">
              <IconImage size={'normal'} source={menu} />
            </div>
          </div>
          <div className="flex flex-row">
            <Link to="/" className="ml-4">
              <IconImage size={'normal'} source={user} />
            </Link>
            <Link to="/login" className="ml-4" onClick={() => { setAuth(false) }}>
              <IconImage size={'normal'} source={logout} />
            </Link>
          </div>
        </nav>
    );
};
  
export default Navbar;
  