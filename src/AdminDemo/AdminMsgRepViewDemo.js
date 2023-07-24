import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import './AdminMsgRepViewDemo.css';

export const AdminMsgRepViewDemo = () => {

  const history = useHistory();
  const [allMessages, setallMessages] = useState([]);
  const [allReports, setallReports] = useState([]);
  const [activeMessageId, setActiveMessageId] = useState(null);
  const optionsMessageRef = useRef(null); // Ref for the options div

  /* Admin Message Edit and Delete */
  const handleEditMessageOptionsClick = (e,messageId) => {
    e.stopPropagation(); // Prevent event bubbling to the li element
    setActiveMessageId(messageId);
  };

  const handleEditMessageClick = (eventEdit, messageId) => {
    eventEdit.stopPropagation(); // Stop event propagation
    history.push({
      pathname: `/admin-edit-message-demo`,
      state: {messageId}
    });
  };

  const handleDeleteMessageClick = (eventDelete, messageId, messageTitle) =>{
    eventDelete.stopPropagation();
    //Delete NPQ From the Real Time DataBase
    const MessageRef = firebase.database().ref('Messages/SASTRA');
    MessageRef
      .child(messageId)
      .remove()
      .then(() => {
        // After successful deletion from the database, update the state
        setallMessages((prevMessages) => prevMessages.filter((messageTitle) => messageTitle.id !== messageId));
        toast.success(`${messageTitle} deleted successfully`);
      })
      .catch((error) => {
        toast.error('Failed to delete message from database');
        console.log(error);
      });
  };

  useEffect(() => {
    // Close options when clicking outside the options box
    function handleMessageClickOutside(event) {
      if (optionsMessageRef.current && !optionsMessageRef.current.contains(event.target)) {
        setActiveMessageId(null);
      }
    }
    document.addEventListener('click', handleMessageClickOutside);
    return () => {
      document.removeEventListener('click', handleMessageClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const snapshot = await firebase.database().ref('Messages/SASTRA').once('value');
        const messagesData = snapshot.val() || {};
        const MessagesArray = Object.values(messagesData);
        setallMessages(MessagesArray);
      } catch (error) {
        console.log(error);
      }
    };

    fetchMessages();
  }, []);

  /* Fetch the Reports */
  useEffect(() => {
    const fetchReports = async () => {
      try {
        const snapshotReports = await firebase.database().ref('Reports/SASTRA').once('value');
        const reportsData = snapshotReports.val() || {};
        const ReportsArray = Object.values(reportsData);
        setallReports(ReportsArray);
      } catch (error) {
        console.log(error);
      }
    };

    fetchReports();
  }, []);

  /* Delete the Report */
  const handleDeleteReportClick = (eventRepDelete, reportId, reportTitle) => {
    eventRepDelete.stopPropagation();
    //Delete NPQ From the Real Time DataBase
    const ReportRef = firebase.database().ref('Reports/SASTRA');
    ReportRef
      .child(reportId)
      .remove()
      .then(() => {
        // After successful deletion from the database, update the state
        setallReports((prevReports) => prevReports.filter((reportTitle) => reportTitle.id !== reportId));
        toast.success(`${reportTitle} deleted successfully`);
      })
      .catch((error) => {
        toast.error('Failed to delete report from database');
        console.log(error);
      });
  };


  return (
    <div className='admin_msg_rep_body'>
      <div className='admin_msg_rep_dashboard_content'>
        <div className='admin_msg_rep_dashboard_box'>
          <div className='admin_msg_rep_dashboard_innerbox'>
            <div className='admin_msg_form_msg_list_demo'>
              <div className='admin_msg_form_title_demo'>
                <span className='admin_msg_title_demo'>Messages</span>
              </div>
              <div className='admin_msg_list_view_demo'>
                {allMessages.length > 0 ? (
                  <ul>
                    {allMessages.map((message) => (
                      <li key={message.id}>
                        <div className='admin_msg_view_title_demo'>
                        <span className='admin_msg_text_title_demo'>{message.title}</span>
                        <i class='bx bx-dots-vertical-rounded' onClick={(e) => handleEditMessageOptionsClick(e,message.id)}></i>
                        </div>
                        <div className='admin_msg_view_description_demo'>
                        <span className='admin_msg_text_description_demo'>
                        {message.description}
                        </span>
                        </div>
                        {/* Render options only for the clicked Message */}
                        {activeMessageId === message.id &&(
                          <div ref={optionsMessageRef} className='admin_msg_options'>
                            <span className='admin_msg_option' onClick={(eventEdit) => handleEditMessageClick(eventEdit,message.id)}>Edit</span>
                            <span className='admin_msg_option' onClick={(eventDelete) => handleDeleteMessageClick(eventDelete, message.id, message.title)}>Delete</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Messages Found</p>
                )}     
              </div>
            </div>
            <div className='admin_rep_form_rep_list_demo'>
              <div className='admin_rep_form_title_demo'>
                <span className='admin_msg_rep_title_msg_dash'>Reports</span>
              </div>
              <div className='admin_rep_list_view_demo'>
                {allReports.length > 0 ? (
                  <ul>
                    {allReports.map((report) => (
                      <li key={report.id}>
                        <div className='admin_rep_view_title_demo'>
                          <span className='admin_rep_text_title_demo'>{report.title}</span>
                          <i class='bx bx-trash' onClick={(eventRepDelete) => handleDeleteReportClick(eventRepDelete, report.id, report.title)}></i>
                        </div>
                        <div className='admin_rep_view_description_demo'>
                          <span className='admin_rep_text_description_demo'>{report.description}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Reports Found</p>
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
export default AdminMsgRepViewDemo;
