import React,{useState, useEffect} from 'react';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { auth } from "../firebase";
import loginImage from './login-image.jpg';
import googleLogo from './google-logo.png';
import './login.css'
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router';
import axios from 'axios';
import Cookies from 'js-cookie';
import { PuffLoader } from 'react-spinners';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link } from 'react-router-dom';


function Login() {
    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const accesToken = Cookies.get('access-token');
    const provider = new GoogleAuthProvider();
    const [isLoading, setIsLoading] = useState(false);

    const signInWithGoogle = async () => {

      try {
        setIsLoading(true);
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        const userEmail = user.email;
        console.log(user)

        const response = await axios.post(`http://localhost:4040/api/auth/google-login`,{userEmail}, { withCredentials: true });
        console.log("reached here");
        console.log(response);
        toast.success('Registration successful!');

      } catch (error) {
        toast.error("User doesn't exist");
      }
      setIsLoading(false);
    }
  
    const handleForgotSubmit = async (event) => {
      if(email === ''){
        toast.error("Enter the email");
        return ;
      }
      setIsLoading(true);
      event.preventDefault();
  
      try {
        await axios.post(`http://localhost:4040/api/auth/forgot-password/${email}`);
        toast.success("Email has been succesfully sent");
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          toast.error(error.response.data.error);
        } else {
          toast.error(error.message);
        }
        
      }
      setIsLoading(false);
    };

    const handleSubmit = async(event) => {
      if(email === '' || password ===  ''){
        toast.error("Please fill out all the fields");
        return;
      }
      setIsLoading(true);
      event.preventDefault();
      console.log("hi there")
      const userData = {
        email,
        password,
      }
  
      try {
        const response = await axios.post('http://localhost:4040/api/auth/login', userData, { withCredentials: true });
        console.log("reached here");
        console.log(response);
        toast.success('login successful!');
        navigate(`/api/home`);
      } catch (error) {
        console.log(error);
        toast.error(error.response.data.error);
      }
      setIsLoading(false);
    }

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
      <div className='log-container'>
        <div className='log-cont-left'>
          <div className='log-cont-left-top'>
            <p className='logo'>ShopeX</p>
          </div>
          <div className='log-cont-left-bottom'>
            <h1>Welcome back</h1>
            <p className='left-bottom-des'>Welcome back! Please enter your details.</p>

            <Formik
              initialValues={{
                email: '',
                password: '',
              }}
              onSubmit={values => {
                console.log(values);
              }}

              validationSchema={Yup.object({
                email: Yup.string()
                .email('Invalid email address')
                .required('Required'),
                password: Yup.string()
                .required('Required'),
              })}>
                {formik => (
                  <>
                    <TextField 
                      {...formik.getFieldProps('email')}
                      className='input-bar'
                      label='Email'
                      variant='outlined'
                      value={email}
                      onChange={(event) => {setEmail(event.target.value)}}
                    />
                    {formik.touched.email && formik.errors.email ? (
                      <div className='err-input-msg'>*{formik.errors.email}</div>
                    ): null}

                    <TextField
                      {...formik.getFieldProps('password')}
                      className='input-bar'
                      label='Password'
                      type="password"
                      variant='outlined'
                      value={password}
                      onChange={(event ) => {setPassword(event.target.value)}}

                    />
                    {formik.touched.password && formik.errors.password ? (
                      <div className='err-input-msg'>*{formik.errors.password}</div>
                    ): null}
                  </>
                )}
              </Formik>
            <div className='log-cont-left-bottom-des'>
              <p className='reminder'>Remembered for 30 days</p>
              <p className='forgot-password' onClick={handleForgotSubmit}>Forgot password</p>
            </div>
            <Button onClick={handleSubmit} className="btn" variant="contained">Sign in</Button>
            <button className="button" onClick={signInWithGoogle}><img src={googleLogo} alt="google-logo"/>Sign in with Google</button>
            <div className='sign-up'>Don't have an account? <Link to='/api/auth/register'><p>Sign Up</p></Link></div>
          </div>
        </div>
        <div className='log-cont-right'>
          <img className='log-img' src={loginImage} alt='login-image'/>
        </div>
      </div>
      <ToastContainer/>
      {/* <button onClick={signInWithGoogle}>Sign in with Google</button> */}
      </>
  )
  
}

export default Login;