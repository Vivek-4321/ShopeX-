import React, { useState, useEffect} from 'react';
import './passRes.css';
import LockResetOutlinedIcon from '@mui/icons-material/LockResetOutlined';
import TextField from '@mui/material/TextField';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { PuffLoader } from 'react-spinners';
import Cookies from 'js-cookie';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PasswordReset() {
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState("");
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const token = searchParams.get('token');
    const navigate = useNavigate();
    const accesToken = Cookies.get('access-token');

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
    };

    const handleConfirmPasswordChange = (event) => {
        setConfirmPassword(event.target.value);
    };


    const handleResSubmit = async (event) => {
        setIsLoading(true);
        console.log("Entered here..")
        console.log(searchParams.get('token'));
        event.preventDefault();
    
        if (password !== confirmPassword) {
          setMessage("Passwords do not match.");
          console.log(message);
          return;
        }
    
        try {
            console.log("reached here...")
            console.log(token);
            await axios.post(`http://localhost:4040/api/auth/reset-password?token=${token}`, { password }, {withCredentials: true});
            navigate('/api/home');
            console.log(message);
          } catch (error) {
            if (error.response && error.response.data) {
              toast.error(error.response.data.error);
            } else {
              toast.error("An error occurred while resetting your password.");
            }
          }
          setIsLoading(false);
      };
      useEffect(() => {
        if (accesToken) {
          navigate('/api/home');
        }
      }, [navigate, accesToken]);
      
  return (
    <>
    {isLoading && 
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: isLoading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <PuffLoader color="#fff" />
          </div>}
        <div className='pass-cont'>
            <div className='pass-box'>
                <div className='pass-box-box-logo'>
                    <LockResetOutlinedIcon className='pass-box-logo' />
                </div>
                <h1>
                    Reset Password
                </h1>
                <TextField value={password} onChange={handlePasswordChange} type="password" className="reset-input-bar1" label="Password" variant="outlined" />
                <TextField value={confirmPassword} onChange={handleConfirmPasswordChange} type="password" className="reset-input-bar2" label="Confirm Password" variant="outlined" />
                <button className='reset-button' onClick={handleResSubmit}>RESET</button>
            </div>
        </div>
        <ToastContainer/>
    </>
  );
}

export default PasswordReset;