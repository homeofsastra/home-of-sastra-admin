import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import { useHistory } from 'react-router-dom';
import './AddPDFDemo.css';

const AddPDFDemo = () => {
  const [npq, setNpq] = useState('');
  const [pdf, setPdf] = useState(null);
  const [npqOptions, setNpqOptions] = useState([]);
  const history = useHistory(); // Get the history object

  useEffect(() => {
    // Fetch NPQ options from Firebase
    const fetchNpqOptions = async () => {
      try {
        const snapshot = await firebase.database().ref('NPQ/SASTRA').once('value');
        const npqs = snapshot.val() || {};
        const options = Object.values(npqs);
        setNpqOptions(options);
      } catch (error) {
        console.log('Error fetching NPQ options:', error);
      }
    };

    fetchNpqOptions();
  }, []);

  useEffect(() => {
    const inputs = document.querySelectorAll('.addpdf_input_field');
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

  const handleNpqChange = (e) => {
    setNpq(e.target.value);
  };

  const handleAddPdf = () => {
    if (!npq || !pdf) {
      toast.error('Please select NPQ and PDF file');
      return;
    }
  
    // Show progress
    toast.promise(
      new Promise((resolve, reject) => {
        // Timestamp
        const timestamp = Date.now();
  
        // Path of PDF in Firebase Storage
        const filePathAndName = `Books/${timestamp}`;
  
        const selectedNpq = npqOptions.find((item) => item.NPQ === npq);
        if (!selectedNpq) {
          reject('Invalid NPQ');
          return;
        }
  
        const { NpqId, NPQ: selectedNpqTitle } = selectedNpq;
  
        // Storage reference
        const storageReference = firebase.storage().ref(filePathAndName);
        const uploadTask = storageReference.put(pdf); // Start the file upload
  
        // Get the PDF URL and update the database
        uploadTask
          .then((snapshot) => {
            // Get the PDF URL
            return snapshot.ref.getDownloadURL();
          })
          .then((pdfUrl) => {
            // Upload PDF info to Firebase Database
            const newPDF = {
              uid: firebase.auth().currentUser.uid,
              NPQ: selectedNpqTitle,
              NpqId: NpqId,
              PDFid: timestamp,
              PDFTitle: pdf.name,
              college: 'SASTRA',
              url: pdfUrl,
              timestamp: timestamp,
            };
  
            const updateDatabasePromise = firebase
              .database()
              .ref('Books/SASTRA/' + timestamp)
              .set(newPDF);
  
            return Promise.all([pdfUrl, updateDatabasePromise]); // Wait for both promises to resolve
          })
          .then(([pdfUrl]) => {
            // Both file upload and database update are completed
            resolve(pdfUrl);
          })
          .catch((error) => {
            reject(error);
          });
      }),
      {
        loading: 'Uploading PDF...',
        success: (pdfUrl) => {
          setNpq('');
          setPdf(null);
          const inputs = document.querySelectorAll('.addpdf_input_field');
          inputs.forEach((inp) => {
            inp.classList.remove('active');
          });
          return 'PDF uploaded successfully';
        },
        error: 'Failed to upload PDF',
      }
    );
  };
  

  return (
    <div className='AddPdfBody'>
      <div className='AddPdf_content'>
        <div className='AddPdf_box'>
          <div className='addpdf_innerbox'>
            <div className='addpdf_form'>
              <form className='addpdf_form' autoComplete='off'>
                <div className='addpdf_back'>
                  <i className='bx bx-right-arrow-alt'></i>
                  <h4>Go To Dashboard</h4>
                </div>
                <div className='addpdf_heading'>
                  <h2>Add Unit</h2>
                </div>
                <div className='addpdf_input_wrap'>
                  <div className='choose_file_demo'>
                  <input
                      type='file'
                      className='upload_box'
                      accept='.pdf'
                      onChange={(e) => setPdf(e.target.files[0])}
                    />
                  </div>
                </div>
                <div className='addpdf_actual_form'>
                  <div className='addpdf_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addpdf_input_field'
                      autoComplete='off'
                      inputMode='text'
                      value={pdf ? pdf.name : ''}
                      readOnly
                    />
                    <label htmlFor='pdf'>PDF Title</label>
                  </div>

                  <div className='addpdf_input_wrap'>
                    <input
                      required
                      type='text'
                      className='addpdf_input_field'
                      autoComplete='off'
                      inputMode='text'
                      value={npq}
                      onChange={handleNpqChange}
                      list='npqOptions'
                    />
                    <label htmlFor='npq'>Select NPQ</label>
                    <datalist id='npqOptions'>
                      {npqOptions.map((item, index) => (
                        <option key={index} value={item.NPQ} />
                      ))}
                    </datalist>
                  </div>

                  <input type='button' value='Add PDF' className='add_pdf_btn' onClick={handleAddPdf} />
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

export default AddPDFDemo;
