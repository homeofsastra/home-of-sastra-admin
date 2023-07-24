import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import './AddUnitDemo.css';

export const AddUnitDemo = () => {
  const [subjectCode, setSubjectCode] = useState('');
  const [unit, setUnit] = useState('');
  const [subjectCodeOptions, setSubjectCodeOptions] = useState([]);
  const history = useHistory(); // Get the history object

  useEffect(() => {
    // Fetch subject code options from Firebase
    const fetchSubjectCodeOptions = async () => {
      try {
        const snapshot = await firebase.database().ref('Subjects/SASTRA').once('value');
        const subjects = snapshot.val() || {};
        const options = Object.values(subjects);
        setSubjectCodeOptions(options);
      } catch (error) {
        console.log('Error fetching subject code options:', error);
      }
    };

    fetchSubjectCodeOptions();
  }, []);

  useEffect(() => {
    const inputs = document.querySelectorAll('.addunit_input_field');
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

  const handleSubjectCodeChange = (e) => {
    setSubjectCode(e.target.value);
  };

  const handleAddUnit = () => {
    if (!unit || !subjectCode) {
      toast.error('Please enter unit and subject code');
      return;
    }
    const unitId = Date.now();
    const selectedSubject = subjectCodeOptions.find((subject) => subject.subject === subjectCode);
    if (!selectedSubject) {
      toast.error('Invalid subject code');
      return;
    }
    const { subjectId, subject } = selectedSubject;
    const newUnit = {
      college: 'SASTRA',
      subjectId: subjectId,
      subjectTittle: subject,
      timestamp: unitId,
      uid: firebase.auth().currentUser.uid,
      unit: unit,
      unitId: unitId,
    };

    firebase
      .database()
      .ref('Units/SASTRA/' + unitId)
      .set(newUnit)
      .then(() => {
        toast.success('Unit added successfully');
        setUnit('');
        setSubjectCode('');
        const inputs = document.querySelectorAll('.addunit_input_field');
        inputs.forEach((inp) => {
          inp.classList.remove('active');
        });
      })
      .catch((error) => {
        console.log('Error adding unit:', error);
        toast.error('Failed to add unit');
      });
  };

  return (
    <div className='AddUnitBody'>
      <div className='AddUnitt_content'>
        <div className='AddUnit_box'>
          <div className='addunit_innerbox'>
            <div className='addunit_form'>
              <form className='addunit_form' autoComplete='off'>
                <div className='addunit_back'>
                  {/* onClick={handleClickToCreateAccount} */}
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Dashboard</h4>
                </div>
                <div className='addunit_heading'>
                  <h2>Add Unit</h2>
                </div>

                <div className='addunit_actual_form'>
                  <div className='addunit_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addunit_input_field'
                      autoComplete='off'
                      inputMode='text'
                      value={unit}
                      onChange={(e) => setUnit(e.target.value)}
                    />
                    <label htmlFor='unit'>Unit Title</label>
                  </div>

                  <div className='addunit_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addunit_input_field'
                      autoComplete='off'
                      inputMode='text'
                      value={subjectCode}
                      onChange={handleSubjectCodeChange}
                      list='subjectCodeOptions'
                    />
                    <label htmlFor='subjectCode'>Select Subject Code</label>
                    <datalist id='subjectCodeOptions'>
                      {subjectCodeOptions.map((subject) => (
                        <option key={subject.subjectId} value={subject.subject} />
                      ))}
                    </datalist>
                  </div>

                  <input type='button' value='Add Unit' className='add_unit_btn' onClick={handleAddUnit} />
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

export default AddUnitDemo;
