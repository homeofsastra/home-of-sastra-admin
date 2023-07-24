import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory, useLocation } from 'react-router-dom';
import './AdminEditMsgListDemo.css';

export const AdminEditMsgListDemo = () => {
  const [messageTitle, setMessageTitle] = useState('');
  const [messageDescription, setMessageDescription] = useState('');
  const location = useLocation();
  const messageId = location.state?.messageId || '';
  const history = useHistory(); // Get the history object

  // Fetch the message data from the Firebase database on component mount
  useEffect(() => {
    const fetchMessageData = async () => {
      try {
        const messageRef = firebase.database().ref(`Messages/SASTRA/${messageId}`);
        const snapshot = await messageRef.once('value');
        const messageData = snapshot.val();
        if (messageData) {
          setMessageTitle(messageData.title);
          setMessageDescription(messageData.description);
        } else {
          toast.error('Message not found');
        //   history.goBack();
        }
      } catch (error) {
        console.error(error);
        toast.error('Error occurred while fetching message data');
        // history.goBack();
      }
    };
    fetchMessageData();
  }, [messageId, history]);

  // Function to handle the message update
  const handleUpdateMessage = async () => {
    try {
      const messageRef = firebase.database().ref(`Messages/SASTRA/${messageId}`);
      await messageRef.update({
        title: messageTitle,
        description: messageDescription,
      });
      toast.success('Message updated successfully');
      history.goBack();
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while updating message');
    }
  };

  return (
    <div className='AdminMessageEditBody'>
      <div className='AdminMessageEdit_content'>
        <div className='AdminMessageEdit_box'>
          <div className='adminmessageedit_innerbox'>
            <div className='adminmessageedit_form'>
              <form className='adminmessageedit_form' autoComplete='off'>
                <div className='adminmessageedit_back' onClick={() => history.goBack()}>
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Back</h4>
                </div>
                <div className='adminmessageedit_heading'>
                  <h2>Message Edit</h2>
                </div>

                <div className='adminmessageedit_actual_form'>
                  <div className='adminmessageedit_input_wrap'>
                    <input
                      required
                      type='text'
                      className={`adminmessageedit_input_field ${messageTitle !== '' ? 'active' : ''}`}
                      autoComplete='off'
                      inputMode='text'
                      value={messageTitle}
                      onChange={(e) => setMessageTitle(e.target.value)}
                    />
                    <label htmlFor='messageTitle'>Message Title</label>
                  </div>

                  <div className='adminmessageedit_input_wrap'>
                    <input
                      required
                      type='text'
                      className={`adminmessageedit_input_field ${messageDescription !== '' ? 'active' : ''}`}
                      autoComplete='off'
                      inputMode='text'
                      value={messageDescription}
                      onChange={(e) => setMessageDescription(e.target.value)}
                    />
                    <label htmlFor='messageDescription'>Msg Description</label>
                  </div>

                  <input
                    type='button'
                    value='Update Message'
                    className='update_message_btn'
                    onClick={handleUpdateMessage}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <Toaster position='top-right' />
    </div>
  );
};

export default AdminEditMsgListDemo;
