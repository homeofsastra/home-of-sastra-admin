import React, {useEffect, useState} from 'react'
import firebase from '../FirebaseAdmin/firebase'
import pic2 from './HOL5.png';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import './EmailLogin.css'

export const EmailLogin = () => {
  const [email, setEmail] = useState('');
  const [passWord, setpassWord] = useState('');
  const history = useHistory(); // Get the history object

  /* Login */

  const handleLogin = () => {
    firebase
      .auth()
      .signInWithEmailAndPassword(email, passWord)
      .then(() => {
        // toast.success('Successfully logged in');
        // Redirect to the AdminDashboard page after login
        history.push('/dashboard');
      })
      .catch((error) => {
        toast.error('Incorrect email or password');
        console.error(error);
      });
  };

  useEffect(() => {
    const inputs = document.querySelectorAll('.input-field');
    // Event listeners for input fields
    inputs.forEach((inp) => {
      inp.addEventListener('focus', () => {
        inp.classList.add('active');
      });
      inp.addEventListener('blur', () => {
        if (inp.value !== '') return;
        inp.classList.remove('active');
      });
    });

    // Clean up event listeners and interval
    return () => {
      inputs.forEach((inp) => {
        inp.removeEventListener('focus', () => {
          inp.classList.add('active');
        });
        inp.removeEventListener('blur', () => {
          if (inp.value !== '') return;
          inp.classList.remove('active');
        });
      });
    };

  }, []);

  const handleClickToCreateAccount = () => {
    history.push('/create-account');
  };


  return (
    <div className='EmailBody'>
      <div className='Email_content'>
        <div className='Email_box'>
          <div className='email_innerbox'>
            <div className='eamil_form'>
              <form className='email_signup_form' autoComplete='off'>
              <div className='back' 
               onClick={handleClickToCreateAccount}
              >
                <i class='bx bx-right-arrow-alt'></i>
                <h4>Go To Create Account</h4>
              </div>
              <div className='logo1'>
                <img src={pic2} alt='homeofsastra' />
                <h4>Home Of Sastra</h4>
              </div>

              <div className='heading'>
                <h2>Admin</h2>
              </div>

              <div className='actual-form'>
                <div className='input-wrap'>
                  <input
                    required
                    type='email'
                    className='input-field'
                    autoComplete='off'
                    inputMode='eamil'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <label htmlFor='email'>Email</label>
                </div>

                <div className='input-wrap'>
                  <input
                    required
                    type='text'
                    className='input-field'
                    autoComplete='off'
                    inputMode='text'
                    value={passWord}
                    onChange={(e) => setpassWord(e.target.value)}
                  />
                  <label htmlFor='passWord'>Password</label>
                </div>
                  <input
                    type='button'
                    value='Login'
                    onClick={handleLogin}
                    className='sign_up_btn'
                  />
              </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster position="top-right" />
    </div>
  )
}
export default EmailLogin;