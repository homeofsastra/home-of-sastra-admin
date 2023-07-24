import React, { useEffect, useState } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import { useHistory, useLocation } from 'react-router-dom';
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import AES from 'crypto-js/aes';
import { enc } from 'crypto-js';
import { defaultLayoutPlugin } from '@react-pdf-viewer/default-layout';
import '@react-pdf-viewer/default-layout/lib/styles/index.css';
import './AdminPdfOpenerDemo.css';

export const AdminPdfOpenerDemo = () => {

  const location = useLocation();
  const pdfId = location.state?.PDFid || '';
  const history = useHistory();
  const [bookPdf, setBookPdf] = useState(null);

  const renderToolbar = (Toolbar) => (
    <Toolbar>
      {(slots) => {
        const {
          EnterFullScreen,
          Zoom,
          ZoomIn,
          ZoomOut,
        } = slots;
        return (
          <div
            style={{
              alignItems: 'center',
              display: 'flex',
              width: '100%',
            }}
          >
            <div style={{ padding: '0px 2px' }}>
              <ZoomOut />
            </div>
            <div style={{ padding: '0px 2px' }}>
              <Zoom />
            </div>
            <div style={{ padding: '0px 2px' }}>
              <ZoomIn />
            </div>
            <div style={{ padding: '0px 2px', marginLeft: 'auto' }}>
              <EnterFullScreen />
            </div>
          </div>
        );
      }}
    </Toolbar>
  );

  const defaultLayoutPluginInstance = defaultLayoutPlugin({
    renderToolbar,
    sidebarTabs: (defaultTabs) => [defaultTabs[0]],
  });

  useEffect(() => {
    const storageRef = firebase.storage().ref();
    const pdfRef = storageRef.child(`Books/${pdfId}`);

    // Check if the PDF URL is already saved in local storage
    const encryptedPdfUrl = localStorage.getItem(pdfId);
    if (encryptedPdfUrl) {
      const decryptedPdfUrl = AES.decrypt(encryptedPdfUrl, 'encryptionKey').toString(enc.Utf8);
      console.log('Loading PDF from local storage:', decryptedPdfUrl);
      setBookPdf(decryptedPdfUrl);
    } else {
      pdfRef.getDownloadURL().then((url) => {
        const encryptedUrl = AES.encrypt(url, 'encryptionKey').toString();
        localStorage.setItem(pdfId, encryptedUrl);
        setBookPdf(url);
      });
    }
  }, [pdfId]);

  const handleGoBackToAdminPdfListViewDemo = () => {
    history.goBack();
  };



  return (
    <div className="Admin_Pdf_Opener_Body_Demo">
      <div className="admin_backshadow_demo">
        <div className="admin_custom_modal_demo">
          <div className="admin_delete_icon_demo" onClick={handleGoBackToAdminPdfListViewDemo}>
            <i className="bx bx-x"></i>
          </div>
          {bookPdf && (
            <Worker workerUrl="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.7.107/pdf.worker.js">
              <Viewer
                fileUrl={bookPdf}
                plugins={[defaultLayoutPluginInstance]}
              />
            </Worker>
          )}
        </div>
      </div>
    </div>
  )
}
export default AdminPdfOpenerDemo;