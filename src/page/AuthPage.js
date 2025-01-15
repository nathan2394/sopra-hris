import Button from "../component/button";
import Input from "../component/input";
import { sopra_full } from "../config/icon";
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/');
    }

    return (
    <div className="bg-gray-50">
        {/* <img className="w-[12%]" src={sopra_full} /> */}
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="border border-[#ddd] bg-white px-4 py-6 rounded-lg">
                <img className="w-[25%] mb-10 mx-auto" src={sopra_full} />
                <form className="max-w-sm mx-auto w-full">
                    <Input type={'text'} placeholder={"Username"} />
                    <Input type={'password'} placeholder={"Password"} />
                    <div className="flex items-start mb-5">
                        <div className="flex items-center h-5">
                        <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                        </div>
                        <label for="remember" className="ms-2 text-sm font-medium text-black">Remember me</label>
                    </div>
                    <Button text={'log In'} bgcolor={'#EA2427'} color={'white'} handleAction={handleLogin} />
                </form>
            </div>
        </div>

    </div>
    );
  };
  
  export default AuthPage;
  