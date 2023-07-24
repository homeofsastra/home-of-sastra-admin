import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory, useLocation } from 'react-router-dom';
import './AdminEditNPQListDemo.css';

export const AdminEditNPQListDemo = () => {

  const [npq, setNpq] = useState('');
  const location = useLocation();
  const NpqId = location.state?.NpqId || '';
  const history = useHistory(); // Get the history object

    useEffect(() => {
        const inputs = document.querySelectorAll('.adminnpqedit_input_field');
    
        // Activate input field if value is present
        if (npq !== '') {
          inputs.forEach((inp) => {
            inp.classList.add('active');
          });
        }
    
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
    
        // Clean up event listeners
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
      }, [npq]);

      useEffect(() => {
        const fetchNpqTitle = async () => {
          try {
            const snapshot = await firebase
              .database()
              .ref(`NPQ/SASTRA/${NpqId}/NPQ`)
              .once('value');
    
            const title = snapshot.val();
            setNpq(title);
          } catch (error) {
            toast.error('Error fetching NPQ title');
          }
        };
    
        fetchNpqTitle();
      }, [NpqId]);

      const handleUpdateNpq = async () => {
        try {
          await firebase
            .database()
            .ref(`NPQ/SASTRA/${NpqId}/NPQ`)
            .set(npq);
          history.goBack(); // Navigate back to the previous page
        } catch (error) {
          toast.error('Failed to update NPQ title');
        }
      };

  return (
    <div className='AdminNpqEditBody'>
      <div className='AdminNpqEdit_content'>
        <div className='AdminNpqEdit_box'>
          <div className='adminnpqedit_innerbox'>
            <div className='adminnpqedit_form'>
              <form className='adminnpqedit_form' autoComplete='off'>
                <div className='adminnpqedit_back'>
                  {/* onClick={handleClickToCreateAccount} */}
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Back</h4>
                </div>
                <div className='adminnpqedit_heading'>
                  <h2>PDF Edit</h2>
                </div>

                <div className='adminnpqedit_actual_form'>
                  <div className='adminnpqedit_input_wrap'>
                    <input
                      required
                      type='text'
                      className={`adminnpqedit_input_field ${npq !== '' ? 'active' : ''}`}
                      autoComplete='off'
                      inputMode='text'
                      value={npq}
                      onChange={(e) => setNpq(e.target.value)}
                    />
                    <label htmlFor='npq'>NPQ Title</label>
                  </div>

                  <input
                    type='button'
                    value='Update NPQ'
                    className='update_npq_btn'
                    onClick={handleUpdateNpq}
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
export default AdminEditNPQListDemo;