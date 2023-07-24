import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory, useLocation } from 'react-router-dom';
import './AdminEditSubjectListDemo.css';

export const AdminEditSubjectListDemo = () => {

  const [subject, setSubject] = useState('');
  const [subjectFullName, setSubjectFullName] = useState('');
  const location = useLocation();
  const subjectId = location.state?.subjectId || '';
  const history = useHistory(); // Get the history object

  useEffect(() => {
    const inputs = document.querySelectorAll('.adminsubjectedit_input_field');

    // Activate input field if value is present
    if (subject !== '') {
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
  }, [subject]);

  useEffect(() => {
    const fetchSubjectTitle = async () => {
    try {
        const subjectRef = firebase.database().ref(`Subjects/SASTRA/${subjectId}`);
        const snapshot = await subjectRef.once('value');
        const subjectData = snapshot.val();
        if (subjectData) {
          setSubject(subjectData.subject);
          setSubjectFullName(subjectData.subjectFullName);
        } else {
          toast.error('Subject not found');
        }
      } catch (error) {
        console.error(error);
        toast.error('Error occurred while fetching Subject data');
      }
    };  

    fetchSubjectTitle();
  }, [subjectId]);

  const handleUpdateSubject = async () => {
    try {
      const subjectRef = firebase.database().ref(`Subjects/SASTRA/${subjectId}`);
      await subjectRef.update({
        subject: subject,
        subjectFullName: subjectFullName,
      });
      toast.success('Subject updated successfully');
      history.goBack();
    } catch (error) {
      console.error(error);
      toast.error('Error occurred while updating subject');
    }
  };

  return (
    <div className='AdminSubjectEditBody'>
      <div className='AdminSubjectEdit_content'>
        <div className='AdminSubjectEdit_box'>
          <div className='adminsubjectedit_innerbox'>
            <div className='adminsubjectedit_form'>
              <form className='adminsubjectedit_form' autoComplete='off'>
                <div className='adminsubjectedit_back'>
                  {/* onClick={history.goBack()} */}
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Back</h4>
                </div>
                <div className='adminsubjectedit_heading'>
                  <h2>Unit Edit</h2>
                </div>

                <div className='adminsubjectedit_actual_form'>
                  <div className='adminsubjectedit_input_wrap'>
                    <input
                      required
                      type='text'
                      className={`adminsubjectedit_input_field ${subject !== '' ? 'active' : ''}`}
                      autoComplete='off'
                      inputMode='text'
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                    />
                    <label htmlFor='subject'>Subject Title</label>
                  </div>

                  <div className='adminsubjectedit_input_wrap'>
                    <input
                      required
                      type='text'
                      className={`adminsubjectedit_input_field ${subjectFullName !== '' ? 'active' : ''}`}
                      autoComplete='off'
                      inputMode='text'
                      value={subjectFullName}
                      onChange={(e) => setSubjectFullName(e.target.value)}
                    />
                    <label htmlFor='subjectFullName'>Subject Code</label>
                  </div>

                  <input
                    type='button'
                    value='Update Subject'
                    className='update_subject_btn'
                    onClick={handleUpdateSubject}
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
export default AdminEditSubjectListDemo;