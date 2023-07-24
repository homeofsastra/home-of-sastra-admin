import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import './AddMessageDemo.css';

export const AddMessageDemo = () => {

  const [messageTitle, setMessageTitle] = useState('');
  const [messageDescription, setMessageDescription] = useState('');
  const history = useHistory(); // Get the history object

  useEffect(() => {
    const inputs = document.querySelectorAll('.addmessage_input_field');
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

  const handleAddMessage = () => {
    if (!messageTitle || !messageDescription) {
      toast.error('Please enter Message Title and Description');
      return;
    }
  
    const messageId = Date.now();
    const newMessage = {
      college: 'SASTRA',
      title: messageTitle,
      description: messageDescription,
      id: messageId,
      timestamp: messageId,
      uid: firebase.auth().currentUser.uid,
    };
  
    firebase
      .database()
      .ref('Messages/SASTRA/' + messageId)
      .set(newMessage)
      .then(() => {
        toast.success('Message added successfully');
        setMessageTitle('');
        setMessageDescription('');
        const inputs = document.querySelectorAll('.addmessage_input_field');
        inputs.forEach((inp) => {
          inp.classList.remove('active');
        });
      })
      .catch((error) => {
        console.log('Error adding message:', error);
        toast.error('Failed to add message');
      });
  };

  return (
    <div className='AddMessageBody'>
      <div className='AddMessage_content'>
        <div className='AddMessage_box'>
          <div className='addmessage_innerbox'>
            <div className='addmessage_form'>
              <form className='addmessage_form' autoComplete='off'>
                <div className='addmessage_back'>
                  {/* onClick={handleClickToCreateAccount} */}
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Dashboard</h4>
                </div>
                <div className='addmessage_heading'>
                  <h2>Add Message</h2>
                </div>

                <div className='addmessage_actual_form'>
                  <div className='addmessage_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addmessage_input_field'
                      autoComplete='off'
                      inputMode='text'
                      value={messageTitle}
                      onChange={(e) => setMessageTitle(e.target.value)}
                    />
                    <label htmlFor='messageTitle'>Message Title</label>
                  </div>

                  <div className='addmessage_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addmessage_input_field'
                      autoComplete='off'
                      inputMode='text'
                      value={messageDescription}
                      onChange={(e) => setMessageDescription(e.target.value)}
                    />
                    <label htmlFor='messageDescription'>Message Description</label>
                  </div>

                  <input
                    type='button'
                    value='Add Message'
                    className='add_message_btn'
                    onClick={handleAddMessage}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster position='top-right' />
    </div>
  )
}
export default AddMessageDemo;