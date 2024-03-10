import React, { useState, useEffect, useRef } from 'react';
import './verify.css';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { useNavigate } from 'react-router';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Cookies from 'js-cookie';
import { PuffLoader } from 'react-spinners';

const Verify = () => {
  const [inputs, setInputs] = useState({
    ist: '',
    sec: '',
    third: '',
    fourth: '',
    fifth: '',
    sixth: ''
  });
  const [combinedValue, setCombinedValue] = useState('');
  const [timer, setTimer] = useState(30);
  const [isResendDisabled, setIsResendDisabled] = useState(true);
  const [otpVerified, setOtpVerified] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const navigate = useNavigate();
  const inputRefs = useRef([]);
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const email = searchParams.get('email');
  const accesToken = Cookies.get('access-token');
  const [isLoading,setIsLoading] = useState(false);
  

  useEffect(() => {
    // Start the timer when the component mounts
    const intervalId = setInterval(() => {
      setTimer((prevTimer) => prevTimer - 1);
    }, 1000);

    // Clear the timer when it reaches 0 or when the OTP is successfully submitted
    if (timer === 0 || otpVerified) {
      clearInterval(intervalId);
      setIsResendDisabled(false);
    }

    return () => clearInterval(intervalId);
  }, [timer, otpVerified]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (event, index) => {
    const value = event.target.value;
    const newInputs = { ...inputs };
    newInputs[index] = value;
    setInputs(newInputs);

    // Concatenate the values of all input fields
    const combinedValue = Object.values(newInputs).join('');
    // Store the concatenated value in a state variable
    setCombinedValue(combinedValue);

    if (value !== '') {
      if (event.target.nextElementSibling) {
        event.target.nextElementSibling.focus();
      } else {
        handleSubmit(event);
      }
    } else if (event.target.previousElementSibling) {
      event.target.previousElementSibling.focus();
    }
  };

  const handleKeyDown = (event, id) => {
    if (event.key === 'Backspace' && event.target.value === '' && event.target.previousElementSibling) {
      event.target.previousElementSibling.focus();
    }
  };


  const handleSubmit = () => {
    setIsLoading(true);
    if (combinedValue.length === 6) {
      axios.post(`http://localhost:4040/api/auth/verify?email=${email}`, { verificationCode: combinedValue })
      .then(response => {
        console.log(response.data); // This will log the response from the API to the console
        setOtpVerified(true);
        setErrorMsg('');
        navigate('/api/home');
      })
      .catch((error) => {
        toast.error(error.response.data.error);
      });
      console.log(combinedValue); // This will log the concatenated OTP string to the console
      setOtpVerified(true);
      setErrorMsg('');
    } else {
      setErrorMsg('Please enter a valid OTP');
    }
    setIsLoading(false);
  };

  const handleResend = async() => {
    // Here you can call your backend API to resend the OTP
    setIsLoading(true);
    try {
      await axios.post(`http://localhost:4040/api/auth/forgot-password/${email}`);
      toast.success("Email has been sent");
    } catch (error) {
      setMessage(error.response.data.error);
    }

    setInputs({
      ist: '',
      sec: '',
      third: '',
      fourth: '',
      fifth: '',
      sixth: ''
    });
    setCombinedValue('');
    setTimer(30);
    setIsResendDisabled(true);
    setOtpVerified(false);
    setErrorMsg('');
    inputRefs.current[0].focus();
    setIsLoading(false);
  };

  useEffect(() => {
    console.log(accesToken);
    toast.success("Check your mail box for OTP")
    if (accesToken) {
      console.log("TOken verified")
      navigate('/api/home');
    }
  }, [navigate, accesToken]);

  if(!accesToken){
    return (
      <>
       {isLoading && 
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: isLoading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <PuffLoader color="#fff" />
          </div>}
      <div className="verify-container">
        <div className='verify-box'>
          <div className='verify-logo'>
            <LockOutlinedIcon className='lock-logo'/>
          </div>
        <h1>Enter OTP</h1>
        <div className="userInput">
          <input
            type="text"
            id="ist"
            maxLength="1"
            onChange={(event) => handleChange(event, 'ist')}
            onKeyDown={(event) => handleKeyDown(event, 'ist')}
            value={inputs.ist}
          />
          <input
            type="text"
            id="sec"
            maxLength="1"
            onChange={(event) => handleChange(event, 'sec')}
            onKeyDown={(event) => handleKeyDown(event, 'sec')}
            value={inputs.sec}
          />
          <input
            type="text"
            id="third"
            maxLength="1"
            onChange={(event) => handleChange(event, 'third')}
            onKeyDown={(event) => handleKeyDown(event, 'third')}
            value={inputs.third}
          />
          <input
            type="text"
            id="fourth"
            maxLength="1"
            onChange={(event) => handleChange(event, 'fourth')}
            onKeyDown={(event) => handleKeyDown(event, 'fourth')}
            value={inputs.fourth}
          />
          <input
            type="text"
            id="fifth"
            maxLength="1"
            onChange={(event) => handleChange(event, 'fifth')}
            onKeyDown={(event) => handleKeyDown(event, 'fifth')}
            value={inputs.fifth}
          />
           <input
            type="text"
            id="sixth"
            maxLength="1"
            onChange={(event) => handleChange(event, 'sixth')}
            onKeyDown={(event) => handleKeyDown(event, 'sixth')}
            value={inputs.sixth}
          />
        </div>
        <div>{timer === 0 ? (
    <div>
      <p className="verify-p" onClick={handleResend} disabled={isResendDisabled}>
        Resend OTP
      </p>
    </div>
  ) : (
    <div className='timer'>Time remaining: {timer} seconds</div>
  )}</div>
        <button className='confirm-button' onClick={handleSubmit}>CONFIRM</button>
        </div>
      </div>
      <ToastContainer/></>
    );
  }
  
  }
  
export default Verify;

