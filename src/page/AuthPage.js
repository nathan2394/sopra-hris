import Button from "../component/button";
import Input from "../component/input";
import { google, sopra_full } from "../config/icon";
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from "react";
import { baseColor } from "../config/setting";
import { postData } from "../config/api";

const AuthPage = ({setAuth}) => {
    const [ user, setUser ] = useState([]);
    const isLoggedIn = localStorage.getItem("statusAuth");

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error),
        redirect_uri: "https://hris.solusi-pack.com/"
    });

    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/');
    }

    useEffect(() => {
        if (isLoggedIn) {
          navigate("/");
        }
    }, [isLoggedIn, navigate]);

    useEffect(
        () => {
            try {
                if (user.access_token) {
                    postData({ url: `Auth/google-login`, formData: {token: user.access_token} })?.then((res) => {
                        console?.log(res?.data);
                        if(res?.token){
                            setAuth(true);
                            localStorage.setItem('statusAuth', true);
                            localStorage.setItem('userToken', res?.token);
                            localStorage.setItem('userdata', JSON.stringify(res.data));
                            navigate('/');
                        }
                    });
                }
            } catch (err) {
                console.log(err)
            }
        },
        [ user ]
    );

    return (
    <div className="bg-gray-50">
        {/* <img className="w-[12%]" src={sopra_full} /> */}
        <div className="w-full h-screen flex flex-col items-center justify-center">
            <div className="border border-[#ddd] bg-white rounded-lg py-6 w-[400px]">
                <div className="px-4 pb-6">
                    <div className="flex flex-col justify-center items-center">
                        <img className="w-[28%] mx-auto" alt="logo" src={sopra_full} />
                        <p className="text-sm font-bold text-gray-500 mt-2">Master Payroll</p>
                    </div>
                </div>

                <div className="bg-[#ddd] my-1 h-[1px]" />

                <div className="px-4 pt-6">
                    <div className="max-w-sm mx-auto w-full">
                        <Input type={'text'} sufix={'+62'} placeholder={"858xxxx"} />

                        <div className="bg-[#ddd] my-4 h-[1px]" />

                        <Button text={'Send OTP'} position={"center"} showBorder={true} bgcolor={baseColor} color={'white'} handleAction={handleLogin} />

                        <Button text={'Sign In with Google'} position={"center"} bgcolor={'white'} color={'black'} icon={google} handleAction={() => login()} />
                        <Link to={'/privacypolicy'}> <p className={`text-xs underline text-[${baseColor}] pt-2`}>Privacy Policy</p> </Link>
                    </div>
                </div>
            </div>
        </div>

    </div>
    );
  };
  
  export default AuthPage;
  