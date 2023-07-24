import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory, useLocation } from 'react-router-dom';
import './AdminEditPdfListViewDemo.css';

export const AdminEditPdfListViewDemo = () => {

  const [pdf, setPdf] = useState('');
  const location = useLocation();
  const pdfId = location.state?.pdfId || '';
  const history = useHistory(); // Get the history object

  useEffect(() => {
    const inputs = document.querySelectorAll('.adminpdfedit_input_field');

    // Activate input field if value is present
    if (pdf !== '') {
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
  }, [pdf]);

  useEffect(() => {
    const fetchPdfTitle = async () => {
      try {
        const snapshot = await firebase
          .database()
          .ref(`Books/SASTRA/${pdfId}/PDFTitle`)
          .once('value');

        const title = snapshot.val();
        setPdf(title);
      } catch (error) {
        toast.error('Error fetching PDF title');
      }
    };

    fetchPdfTitle();
  }, [pdfId]);

  const handleUpdatePdf = async () => {
    try {
      await firebase
        .database()
        .ref(`Books/SASTRA/${pdfId}/PDFTitle`)
        .set(pdf);
      history.goBack(); // Navigate back to the previous page
    } catch (error) {
      toast.error('Failed to update PDF title');
    }
  };

  return (
    <div className='AdminPdfEditBody'>
      <div className='AdminPdfEdit_content'>
        <div className='AdminPdfEdit_box'>
          <div className='adminpdfedit_innerbox'>
            <div className='adminpdfedit_form'>
              <form className='adminpdfedit_form' autoComplete='off'>
                <div className='adminpdfedit_back'>
                  {/* onClick={handleClickToCreateAccount} */}
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Back</h4>
                </div>
                <div className='adminpdfedit_heading'>
                  <h2>PDF Edit</h2>
                </div>

                <div className='adminpdfedit_actual_form'>
                  <div className='adminpdfedit_input_wrap'>
                    <input
                      required
                      type='text'
                      className={`adminpdfedit_input_field ${pdf !== '' ? 'active' : ''}`}
                      autoComplete='off'
                      inputMode='text'
                      value={pdf}
                      onChange={(e) => setPdf(e.target.value)}
                    />
                    <label htmlFor='pdf'>PDF Title</label>
                  </div>

                  <input
                    type='button'
                    value='Update PDF'
                    className='update_pdf_btn'
                    onClick={handleUpdatePdf}
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
export default AdminEditPdfListViewDemo;
