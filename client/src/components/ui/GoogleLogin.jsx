import React from 'react'
import { Button } from './Button';
import { FcGoogle } from "react-icons/fc";
import { signInWithPopup } from 'firebase/auth';
import { auth, provider } from '@/helpers/firebase';
import { RouteIndex } from '@/helpers/RouteName';
import { useNavigate } from 'react-router-dom';
import { showToast } from '@/helpers/showToast';
import { getEnv } from '@/helpers/getEnv';
import { useDispatch } from 'react-redux';
import { setUser } from '@/redux/user/user.slice.js';


const GoogleLogin = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const handleLogin = async () => {
        try {
            const googleResponse = await signInWithPopup(auth, provider);
            const user = googleResponse.user;
            const bodyData = {
                name: user.displayName,
                email: user.email,
                avatar: user.photoURL
            }
             const response = await fetch(
               `${getEnv("VITE_API_BASE_URL")}/auth/google-login`,
               {
                 method: "post",
                 headers: { "Content-Type": "application/json" },
                 credentials:'include', // to include cookies
                 body: JSON.stringify(bodyData),
               }
             );
       
             const data = await response.json();
       
             if (!response.ok) {
               showToast("error", data.message);
               return;
            }
             dispatch(setUser({...data.user, token: data.AccessToken}));
             navigate(RouteIndex);
             showToast("success", data.message);
           } catch (error) {
            return showToast("error", error.message);

           }
    }
  return (
    <Button  variant ="outline" className='w-full' onClick={handleLogin} >
        <FcGoogle /> 
        Continue with Google
    </Button>
  )
}

export default GoogleLogin;