import Button from "../component/button";
import Input from "../component/input";
import { google, sopra_full } from "../config/icon";
import { Link, useNavigate } from 'react-router-dom';
import { useGoogleLogin } from '@react-oauth/google';
import React, { useEffect, useState } from "react";
import { baseColor } from "../config/setting";
import axios from 'axios';
import { postData } from "../config/api";

const AuthPage = ({setAuth}) => {
    const [ user, setUser ] = useState([]);
    const isLoggedIn = localStorage.getItem("statusAuth");

    const login = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log('Login Failed:', error)
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
                    console.log(user.access_token);
                    postData({ url: `Auth/google-login`, formData: {token: user.access_token} })?.then((res) => {
                        if(res?.token){
                            setAuth(true);
                            localStorage.setItem('statusAuth', true);
                            localStorage.setItem('userToken', res?.token);
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
                        <Input type={'text'} placeholder={"Username"} />
                        <Input type={'password'} placeholder={"Password"} />
                        <div className="flex flex-row items-center justify-between mb-5">
                            <div className="flex items-start">
                                <div className="flex items-center h-5">
                                <input id="remember" type="checkbox" value="" className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800" required />
                                </div>
                                <label for="remember" className="ms-2 text-sm font-medium text-black">Remember me</label>
                            </div>
                            {/* <Link to='#' className="ms-2 text-sm font-medium underline text-[#EA2427]">Forgot Password</Link> */}
                        </div>

                        <div className="bg-[#ddd] my-4 h-[1px]" />

                        <Button text={'log In'} position={"center"} showBorder={true} bgcolor={baseColor} color={'white'} handleAction={handleLogin} />
                        {/* <Button text={'Create Account'} position={"center"} showBorder={true} bgcolor={'white'} color={baseColor} /> */}

                        {/* <div className="bg-[#ddd] my-4 h-[1px]" /> */}

                        <Button text={'Sign In with Google'} position={"center"} bgcolor={'white'} color={'black'} icon={google} handleAction={() => login()} />
                    </div>
                </div>
            </div>
        </div>

    </div>
    );
  };
  
  export default AuthPage;
  