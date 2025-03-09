import React, { useEffect, useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import Button from "../component/button";
import Input from "../component/input";
import { google, sopra_full } from "../config/icon";
import { baseColor } from "../config/setting";
// import { postData } from "../config/api";
import { useAPI } from "../config/fetchApi";
import { AuthContext } from "../context/authContext";

const AuthPage = () => {
    const [user, setUser] = useState([]);
    const { postData } = useAPI();
    const { login } = useContext(AuthContext); // Get login function from context
    const isLoggedIn = localStorage.getItem("statusAuth");
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: (codeResponse) => setUser(codeResponse),
        onError: (error) => console.log("Login Failed:", error),
        redirect_uri: "https://hris.solusi-pack.com/",
    });

    useEffect(() => {
        if (isLoggedIn) {
            navigate("/");
        }
    }, [isLoggedIn, navigate]);

    useEffect(() => {
        if (user.access_token) {
            postData({ url: "Auth/google-login", formData: { token: user.access_token } })
                .then((res) => {
                    if (res?.token) {
                        login(res.token, res.data); // Call login function from AuthContext
                        navigate("/");
                    }
                })
                .catch((err) => console.log(err));
        }
    }, [user, login, navigate]);

    return (
        <div className="bg-gray-50">
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
                            <Input type={"text"} sufix={"+62"} placeholder={"858xxxx"} />

                            <div className="bg-[#ddd] my-4 h-[1px]" />

                            <Button text={"Send OTP"} position={"center"} showBorder={true} bgcolor={baseColor} color={"white"} handleAction={() => navigate("/")} />

                            <div className="my-2" />

                            <Button text={"Sign In with Google"} position={"center"} bgcolor={"white"} color={"black"} icon={google} handleAction={() => googleLogin()} />

                            <Link to={"/privacypolicy"}>
                                <p className={`text-xs underline text-[${baseColor}] pt-2`}>Privacy Policy</p>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthPage;