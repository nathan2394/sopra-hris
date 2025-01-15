import { Link } from "react-router-dom";
import IconImage from "../component/icon_img";
import { logout, menu, user } from "../config/icon";

const Navbar = () => {
    return (
      <nav className="flex flex-row items-center justify-between py-3 px-6 bg-[#eee]">
        <a className="cursor-pointer">
          <IconImage size={'normal'} source={menu} />
        </a>
        <div className="flex flex-row">
          <Link to="/login" className="ml-4">
            <IconImage size={'normal'} source={user} />
          </Link>
          <Link to="/login" className="ml-4">
            <IconImage size={'normal'} source={logout} />
          </Link>
        </div>
      </nav>
    );
};
  
export default Navbar;
  