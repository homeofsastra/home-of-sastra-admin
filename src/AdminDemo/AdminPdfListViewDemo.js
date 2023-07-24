import React, {useEffect, useState} from 'react'
import firebase from '../FirebaseAdmin/firebase'
import {useHistory, useLocation} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import './AdminPdfListViewDemo.css'

export const AdminPdfListViewDemo = () => {

    const location = useLocation();
    const npqId = location.state?.NpqId || '';
    const npq = location.state?.NPQ || '';
    const subject = location.state?.subject || '';
    const history = useHistory();
    const [pdfs, setPdfs] = useState([]);

    const [showOptions, setShowOptions] = useState(false);

    const handleOptionsClick = (e) => {
      e.stopPropagation(); // Prevent event bubbling to the li element
      setShowOptions(!showOptions);
    };
    
    const handleEditClick = (eventEdit, pdfId) => {
      eventEdit.stopPropagation(); // Stop event propagation
      setShowOptions(false);
      history.push({
        pathname: `/admin-edit-pdf-demo`,
        state: {pdfId}
      });
    };
    
    const handleDeleteClick = (eventDelete, PDFid, url, PDFTitle) => {
      eventDelete.stopPropagation(); // Stop event propagation
      setShowOptions(false);

      // Delete PDF from storage
      const storageRef = firebase.storage().refFromURL(url);
      storageRef
        .delete()
        .then(() => {
          // Delete PDF from database
          const booksRef = firebase.database().ref('Books/SASTRA');
          booksRef
            .child(PDFid)
            .remove()
            .then(() => {
              toast.success(`${PDFTitle} deleted successfully`);
            })
            .catch((error) => {
              toast.error('Failed to delete PDF from database');
              console.log(error);
            });
        })
        .catch((error) => {
          toast.error('Failed to delete PDF from storage');
          console.log(error);
        });

    };

    useEffect(() => {
        const user = firebase.auth().currentUser;
    
        if (user) {
          const booksRef = firebase.database().ref('Books/SASTRA');
    
          booksRef
            .orderByChild('NpqId')
            .equalTo(npqId)
            .on('value', (snapshot) => {
              const data = snapshot.val();
              if (data) {
                const pdfsArray = Object.values(data);
                setPdfs(pdfsArray);
                console.log(pdfsArray)
                pdfsArray.forEach((pdf) => {
                  console.log(pdf.url);
                });
              }
            });
    
          return () => {
            booksRef.off();
          };
        }
    }, [npqId]);

    const handleAdminPdfDemoClick = (PDFid, url, PDFTitle) => {
        history.push({
          pathname: `/admin-pdf-open-demo/${PDFTitle}`,
          state: { url: encodeURIComponent(url), PDFid } // Pass the URL as a property named "url"
        });
    };

  return (
    <div className='admin_pdflist_body_demo'>
        <div className='admin_pdflist_content_demo'>
            <div className='admin_pdflist_box_demo'>
                <div className='admin_pdflist_innerbox_demo'>
                    <div className='admin_pdflist_form_demo'>
                      <div className='admin_pdflist_form_title_demo'>
                        <span className='admin_title_pdflist_demo'>{subject} {npq}</span>
                      </div>
                      <div className='admin_pdflist_view_demo'>
                        {pdfs.length > 0 ? (
                            <ul>
                                {pdfs.map((pdf) => (
                                    <li key={pdf.PDFid} onClick={() => handleAdminPdfDemoClick(pdf.PDFid, pdf.url, pdf.PDFTitle)}>
                                    <i className='bx bx-file'></i>
                                    <span className='admin_pdf_name_demo'>{pdf.PDFTitle}</span>
                                    <i className='bx bx-dots-vertical-rounded' onClick={(e) => handleOptionsClick(e)}></i>
                                    {showOptions && (
                                      <div className='admin_pdf_options'>
                                        <span className='admin_pdf_option' onClick={(eventEdit) => handleEditClick(eventEdit,pdf.PDFid)}>Edit</span>
                                        <span className='admin_pdf_option' onClick={(eventDelete) => handleDeleteClick(eventDelete,pdf.PDFid, pdf.url, pdf.PDFTitle)}>Delete</span>
                                      </div>
                                    )}
                                  </li>                                  
                                ))}
                            </ul>
                        ) : (
                            <p>No PDF's Found</p>
                        )}
                      </div>
                    </div>
                </div>
            </div>
        </div>
        <Toaster position='top-right' />
    </div>
  )
}
export default AdminPdfListViewDemo;