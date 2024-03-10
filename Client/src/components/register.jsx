import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { getAuth, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import registerImage from './register-image.jpg';
import googleLogo from './google-logo.png';
import './register.css';
import { PuffLoader } from 'react-spinners';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';

function register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confpassword, setConfPassword] = useState('');
  const navigate = useNavigate();
  const accessToken = Cookies.get('access-token');
  const provider = new GoogleAuthProvider();
  const [isLoading, setIsLoading] = useState(false);

  const signInWithGoogle = async () => {

    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      const response = await axios.post(
        'http://localhost:4040/api/auth/google-register',
        user,
        { withCredentials: true }
      );
      toast.success('Registration successful!');
      navigate('/api/home');
      setIsLoading(false);
    } catch (error) {
      toast.error(error.response.data.error);
    }
    setIsLoading(false);
  };

  const handleSubmit = async (event) => {
    console.log(username);
    console.log(password);
    console.log(confpassword);
    console.log(email);
    console.log(phone);
    // event.preventDefault();
    if (username === '' || email === '' || phone === '' || password === '' || confpassword === '') {
      toast.error("Please fill out all fields");
      return;
    }
    setIsLoading(true)
    const userData = {
      username,
      email,
      phone,
      password,
    };
    try {
      const response = await axios.post(
        'http://localhost:4040/api/auth/register',
        userData
      );
      toast.success('Registration successful!');
      navigate(`/api/auth/verify?email=${email}`);
    } catch (error) {
      toast.error(error.response.data.error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (accessToken) {
      navigate('/api/home');
    }
  }, [navigate, accessToken]);


    return (
      <>
        {isLoading && 
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: isLoading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <PuffLoader color="#fff" />
          </div>}
        <div className='sign-container'>
          <div className='sign-cont-left'>
            <div className='sign-cont-left-top'>
              <p className='logo'>ShopeX</p>
            </div>
            <div className='sign-cont-left-bottom'>
              <h1>Create new account</h1>
              <p className='left-bottom-des'>Please enter your details.</p>
  
              <Formik
   initialValues={{
      username: '',
      phone: '',
      email: '',
      password: '',
      confpassword: ''
   }}
   onSubmit={async (values, { resetForm }) => {
    setIsLoading(true);
    const userData = {
      username: values.username,
      email: values.email,
      phone: values.phone,
      password: values.password,
    };
    try {
      const response = await axios.post(
        'http://localhost:4040/api/auth/register',
        userData
      );
      toast.success('Registration successful!');
      navigate(`/api/auth/verify?email=${values.email}`);
      } catch(error){
        toast.error(error.response.data.error);
      }
      setIsLoading(false);
   }}
   validationSchema={Yup.object({
    username: Yup.string()
      .max(15, 'Must be 10 characters or less')
      .required('Required'),
    phone: Yup.string()
      .matches(/^\d{10}$/, 'Must be 10 digits')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email address')
      .required('Required'),
      password: Yup.string()
  .matches(
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{6,}$/,
    'Password must contain:<br>- at least one uppercase letter<br>- at least one lowercase letter<br>- at least one number<br>- at least one symbol<br>and be at least 6 characters'
  )
  .required('Required'),
    confpassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Required')
  })}
>
   {formik => (
      <>
         <TextField
            {...formik.getFieldProps('username')}
            className="input-bar"
            label="Username"
            variant="outlined"
            // value={username}
            // onChange={(event) => {setUsername(event.target.value)}}
            name='username'
            
         />
         {formik.touched.username && formik.errors.username ? (
            <div className='err-input-msg'>*{formik.errors.username}</div>
         ) : null}

         <TextField
            {...formik.getFieldProps('phone')}
            className="input-bar"
            label="Phone"
            variant="outlined"
            // value={phone}
            // onChange={(event) => {setPhone(event.target.value)}}
            name='phone'
         />
         {formik.touched.phone && formik.errors.phone ? (
            <div className='err-input-msg'>*{formik.errors.phone}</div>
         ) : null}

         <TextField
            {...formik.getFieldProps('email')}
            className="input-bar"
            label="Email"
            variant="outlined"
            // value={email}
            // onChange={(event) => {setEmail(event.target.value)}}
         />
         {formik.touched.email && formik.errors.email ? (
            <div className='err-input-msg'>*{formik.errors.email}</div>
         ) : null}

         <TextField
            {...formik.getFieldProps('password')}
            className='input-bar'
            type="password"
            label="Password"
            variant="outlined"
            // value={password}
            // onChange={(event) => {setPassword(event.target.value)}}
            name='password'
         />
         {formik.touched.password && formik.errors.password ? (
            <div className='err-input-msg' dangerouslySetInnerHTML={{__html: formik.errors.password}}></div>

         ) : null}

         <TextField
            {...formik.getFieldProps('confpassword')}
            className='input-bar'
            type="password"
            label="Confirm Password"
            variant="outlined"
            // value={confpassword}
            // onChange={(event) => {setConfPassword(event.target.value)}}
         />
         {formik.touched.confpassword && formik.errors.confpassword ? (
            <div className='err-input-msg'>*{formik.errors.confpassword}</div>
         ) : null}
         <Button onClick={formik.handleSubmit} className="btn" variant="contained">Sign up</Button>
      </>
   )}
</Formik>

              {/* <div className='sign-cont-left-bottom-des'>
                <p className='reminder'>Remembered for 30 days</p>
                <p className='forgot-password'>Forgot password</p>
              </div> */}
              
              <button className="button" onClick={signInWithGoogle}><img src={googleLogo} alt="google-signo"/>Sign up with Google</button>
              <div className='sign-up'>Already have an account ? <Link to='/api/auth/login'><p className="sign-up-login">Login In</p></Link></div>
            </div>
          </div>
          <div className='sign-cont-right'>
            <img className='sign-img' src={registerImage} alt='signin-image'/>
          </div>
        </div>
        <ToastContainer />
      </>
    )
  
}

export default register;