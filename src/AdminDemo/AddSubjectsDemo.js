import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import './AddSubjectsDemo.css';

export const AddSubjectsDemo = () => {
  const [subjectCode, setSubjectCode] = useState('');
  const [subjectFullName, setSubjectFullName] = useState('');

  useEffect(() => {
    const inputs = document.querySelectorAll('.addsubject_input_field');
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

  const handleAddSubject = () => {

    if (!subjectCode || !subjectFullName) {
      toast.error('Please enter subject code and full name');
      return;
    }

    const subjectId = Date.now();
    const newSubject = {
      college: 'SASTRA',
      subject: subjectCode,
      subjectFullName: subjectFullName,
      subjectId: subjectId,
      timestamp: subjectId,
      uid: firebase.auth().currentUser.uid,
    };

    firebase
      .database()
      .ref('Subjects/SASTRA/' + subjectId)
      .set(newSubject)
      .then(() => {
        toast.success('Subject added successfully');
        setSubjectCode('');
        setSubjectFullName('');
        const inputs = document.querySelectorAll('.addsubject_input_field');
        inputs.forEach((inp) => {
          inp.classList.remove('active');
        });
      })
      .catch((error) => {
        console.log('Error adding subject:', error);
        toast.error('Failed to add subject');
      });
  };

  return (
    <div className='AddSubjectBody'>
      <div className='AddSubject_content'>
        <div className='AddSubject_box'>
          <div className='addsubject_innerbox'>
            <div className='addsubject_form'>
              <form className='addsubject_form' autoComplete='off'>
                <div className='addsubject_back'>
                  {/* onClick={handleClickToCreateAccount} */}
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Dashboard</h4>
                </div>
                <div className='addsubject_heading'>
                  <h2>Add Subject</h2>
                </div>

                <div className='addsubject_actual_form'>
                  <div className='addsubject_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addsubject_input_field'
                      autoComplete='off'
                      inputMode='text'
                      id='subjectCode' // Add id attribute
                      value={subjectCode}
                      onChange={(e) => setSubjectCode(e.target.value)}
                    />
                    <label htmlFor='subjectCode'>Subject Code</label>
                  </div>

                  <div className='addsubject_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addsubject_input_field'
                      autoComplete='off'
                      inputMode='text'
                      id='subjectFullName' // Add id attribute
                      value={subjectFullName}
                      onChange={(e) => setSubjectFullName(e.target.value)}
                    />
                    <label htmlFor='subjectFullName'>Subject Full Name</label>
                  </div>

                  <input
                    type='button'
                    value='Add Subject'
                    className='add_subject_btn'
                    onClick={handleAddSubject}
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

export default AddSubjectsDemo;
