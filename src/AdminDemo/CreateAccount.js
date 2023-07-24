import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import { useHistory } from 'react-router-dom';
import pic3 from './HOL5.png';
import './CreateAccount.css';

export const CreateAccount = () => {
  const [email, setEmail] = useState('');
  const [passWord, setPassWord] = useState('');
  const [fullname, setFullName] = useState('');
  const history = useHistory();

  const handleCreateAccount = () => {
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, passWord)
      .then((userCredential) => {
        const { user } = userCredential;
        const uid = user.uid;

        const usersRef = firebase.database().ref('Admin');
        const newUserRef = usersRef.child(uid);
        const timestamp = firebase.database.ServerValue.TIMESTAMP;

        newUserRef
          .set({
            name: fullname,
            email: email,
            timestamp: timestamp,
            uid: uid,
          })
          .then(() => {
            console.log('User details saved in the database.');
            history.push('/dashboard');
          })
          .catch((error) => {
            console.error('Error saving user details:', error);
          });
      })
      .catch((error) => {
        console.error('Error creating account:', error);
      });
  };

  useEffect(() => {
    const inputs = document.querySelectorAll('.create_input-field');

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

  return (
    <div className='CreateAccountBody'>
      <div className='CreateAccount_content'>
        <div className='CreateAccount_box'>
          <div className='createaccount_innerbox'>
            <div className='createaccount_form'>
              <form className='createaccount_signup_form' autoComplete='off'>
                <div className='logo2'>
                  <img src={pic3} alt='homeofsastra' />
                  <h4>Home Of Sastra</h4>
                </div>

                <div className='create_heading'>
                  <h2>Create Account</h2>
                </div>

                <div className='create_actual-form'>
                  <div className='create_input-wrap'>
                    <input
                      required
                      type='text'
                      className='create_input-field'
                      autoComplete='off'
                      inputMode='text'
                      value={fullname}
                      onChange={(e) => setFullName(e.target.value)}
                    />
                    <label htmlFor='email'>Full Name</label>
                  </div>

                  <div className='create_input-wrap'>
                    <input
                      required
                      type='email'
                      className='create_input-field'
                      autoComplete='off'
                      inputMode='email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <label htmlFor='email'>Email</label>
                  </div>

                  <div className='create_input-wrap'>
                    <input
                      required
                      type='password'
                      className='create_input-field'
                      autoComplete='off'
                      inputMode='text'
                      value={passWord}
                      onChange={(e) => setPassWord(e.target.value)}
                    />
                    <label htmlFor='passWord'>Password</label>
                  </div>

                  <input
                    type='button'
                    value='Create Account'
                    onClick={handleCreateAccount}
                    className='create_sign_up_btn'
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateAccount;
