import { sopra_full } from "../config/icon";

const Sidebar = () => {
    return (
      <aside style={{ width: "200px", background: "#ddd" }}>
        <div className="px-4 py-3">
          <img className="w-auto" src={sopra_full} />
        </div>
        <ul className="mt-4">
          <li className="bg-[#eee] hover:bg-[#cbcbcb] py-1 px-4 transition-[2s] cursor-pointer">
            <a href="/">Master Payroll</a>
          </li>
        </ul>
      </aside>
    );
  };
  
export default Sidebar;
  