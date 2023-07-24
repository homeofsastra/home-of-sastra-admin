import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory, useLocation } from 'react-router-dom';
import './AdminEditUnitListDemo.css';

export const AdminEditUnitListDemo = () => {

  const [unit, setUnit] = useState('');
  const location = useLocation();
  const unitId = location.state?.unitId || '';
  const history = useHistory(); // Get the history object

  useEffect(() => {
    const inputs = document.querySelectorAll('.adminunitedit_input_field');

    // Activate input field if value is present
    if (unit !== '') {
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
  }, [unit]);

  useEffect(() => {
    const fetchUnitTitle = async () => {
      try {
        const snapshot = await firebase
          .database()
          .ref(`Units/SASTRA/${unitId}/unit`)
          .once('value');

        const title = snapshot.val();
        setUnit(title);
      } catch (error) {
        toast.error('Error fetching Unit title');
      }
    };

    fetchUnitTitle();
  }, [unitId]);

  const handleUpdateUnit = async () => {
    try {
      await firebase
        .database()
        .ref(`Units/SASTRA/${unitId}/unit`)
        .set(unit);
      history.goBack(); // Navigate back to the previous page
    } catch (error) {
      toast.error('Failed to update Unit title');
    }
  };

  return (
    <div className='AdminUnitEditBody'>
      <div className='AdminUnitEdit_content'>
        <div className='AdminUnitEdit_box'>
          <div className='adminunitedit_innerbox'>
            <div className='adminunitedit_form'>
              <form className='adminunitedit_form' autoComplete='off'>
                <div className='adminunitedit_back'>
                  {/* onClick={history.goBack()} */}
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Back</h4>
                </div>
                <div className='adminunitedit_heading'>
                  <h2>Unit Edit</h2>
                </div>

                <div className='adminunitedit_actual_form'>
                  <div className='adminunitedit_input_wrap'>
                    <input
                      required
                      type='text'
                      className={`adminunitedit_input_field ${unit !== '' ? 'active' : ''}`}
                      autoComplete='off'
                      inputMode='text'
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                    <label htmlFor='unit'>Unit Title</label>
                  </div>

                  <input
                    type='button'
                    value='Update Unit'
                    className='update_unit_btn'
                    onClick={handleUpdateUnit}
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
export default AdminEditUnitListDemo;