import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import './AddNPQDemo.css';

export const AddNPQDemo = () => {
  const [unit, setUnit] = useState('');
  const [npq, setNpq] = useState('');
  const [unitOptions, setUnitOptions] = useState([]);
  const history = useHistory(); // Get the history object

  useEffect(() => {
    // Fetch units options from Firebase
    const fetchUnitsOptions = async () => {
      try {
        const snapshot = await firebase.database().ref('Units/SASTRA').once('value');
        const units = snapshot.val() || {};
        const options = Object.values(units);
        setUnitOptions(options);
        console.log(options);
      } catch (error) {
        console.log('Error fetching unit options:', error);
      }
    };

    fetchUnitsOptions();
  }, []);

  useEffect(() => {
    const inputs = document.querySelectorAll('.addnpq_input_field');
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

  const handleUnitChange = (e) => {
    setUnit(e.target.value);
  };

  const handleAddNpq = () => {
    if (!npq || !unit) {
      toast.error('Please enter NPQ and Unit');
      return;
    }
    const NpqId = Date.now();
    const selectedUnit = unitOptions.find((item) => item.unit === unit);
    if (!selectedUnit) {
      toast.error('Invalid unit');
      return;
    }
    const { unitId, unit: selectedUnitTitle } = selectedUnit;
    const newNPQ = {
      college: 'SASTRA',
      unitId: unitId,
      unitTittle: selectedUnitTitle,
      timestamp: NpqId,
      uid: firebase.auth().currentUser.uid,
      NPQ: npq,
      NpqId: NpqId,
    };
    firebase
      .database()
      .ref('NPQ/SASTRA/' + NpqId)
      .set(newNPQ)
      .then(() => {
        toast.success('NPQ added successfully');
        setNpq('');
        setUnit('');
        const inputs = document.querySelectorAll('.addnpq_input_field');
        inputs.forEach((inp) => {
          inp.classList.remove('active');
        });
      })
      .catch((error) => {
        console.log('Error adding npq:', error);
        toast.error('Failed to add npq');
      });
  };

  return (
    <div className='AddNPQBody'>
      <div className='AddNPQBody_content'>
        <div className='AddNPQBody_box'>
          <div className='addnpq_innerbox'>
            <div className='addnpq_form'>
              <form className='addnpq_form' autoComplete='off'>
                <div className='addnpq_back'>
                  {/* onClick={handleClickToCreateAccount} */}
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Dashboard</h4>
                </div>
                <div className='addnpq_heading'>
                  <h2>Add NPQ</h2>
                </div>

                <div className='addnpq_actual_form'>
                  <div className='addnpq_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addnpq_input_field'
                      autoComplete='off'
                      inputMode='text'
                      value={npq}
                      onChange={(e) => setNpq(e.target.value)}
                    />
                    <label htmlFor='npq'>NPQ Title</label>
                  </div>

                  <div className='addnpq_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addnpq_input_field'
                      autoComplete='off'
                      inputMode='text'
                      value={unit}
                      onChange={handleUnitChange}
                      list='unitOptions'
                    />
                    <label htmlFor='unit'>Select Unit</label>
                    <datalist id='unitOptions'>
                      {unitOptions.map((item, index) => (
                        <option key={index} value={item.unit} />
                      ))}
                    </datalist>
                  </div>

                  <input type='button' value='Add NPQ' className='add_npq_btn' onClick={handleAddNpq} />
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

export default AddNPQDemo;
