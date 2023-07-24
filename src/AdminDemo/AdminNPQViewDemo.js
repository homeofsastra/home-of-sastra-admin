import React, { useEffect, useState, useRef } from 'react';
import firebase from '../FirebaseAdmin/firebase';
import { useHistory, useLocation } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import './AdminNPQViewDemo.css';

export const AdminNPQViewDemo = () => {
  const location = useLocation();
  const unitId = location.state?.unitId || '';
  const unit = location.state?.unit || '';
  const subject = location.state?.subject || '';
  const history = useHistory();
  const [ppts, setPpts] = useState([]);
  const [activeNpqId, setActiveNpqId] = useState(null);
  const optionsRef = useRef(null); // Ref for the options div

  /*Admin NPQ Edit and Delete */
  const handleNpqOptionsClick = (e, NpqId) => {
    e.stopPropagation();
    setActiveNpqId(NpqId);
  };

  const handleNpqEditClick = (eventEdit, NpqId) => {
    eventEdit.stopPropagation();
    history.push({
      pathname: `/admin-edit-npq-demo`,
      state: { NpqId },
    });
  };

  const handleNpqDeleteClick = (eventDelete, NPQ, NpqId) => {
    eventDelete.stopPropagation();
    //Delete NPQ From the Real Time DataBase
    const npqRef = firebase.database().ref('NPQ/SASTRA');
    npqRef
      .child(NpqId)
      .remove()
      .then(() => {
        // After successful deletion from the database, update the state
        setPpts((prevPpts) => prevPpts.filter((ppt) => ppt.NpqId !== NpqId));
        toast.success(`${NPQ} deleted successfully`);
      })
      .catch((error) => {
        toast.error('Failed to delete NPQ from database');
        console.log(error);
      });
  };

  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      const pptsRef = firebase.database().ref('NPQ/SASTRA');

      pptsRef
        .orderByChild('unitId')
        .equalTo(unitId)
        .on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const pptsArray = Object.values(data);
            setPpts(pptsArray);
            console.log(pptsArray);
          }
        });

      return () => {
        pptsRef.off();
      };
    }
  }, [unitId]);

  useEffect(() => {
    // Close options when clicking outside the options box
    function handleClickOutside(event) {
      if (optionsRef.current && !optionsRef.current.contains(event.target)) {
        setActiveNpqId(null);
      }
    }
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleAdminNPQClickDemo = (NPQ, NpqId, subject) => {
    history.push({
      pathname: `/admin-Pdf-List-demo/${NPQ}`,
      state: { NpqId, NPQ, subject },
    });
  };

  return (
    <div className='Admin_NPQ_Body_demo'>
      <div className='admin_npq_content_demo'>
        <div className='admin_npq_box_demo'>
          <div className='admin_npq_innerbox_demo'>
            <div className='admin_npq_form_demo'>
              <div className='admin_npq_form_title_demo'>
                <span className='admin_title_npq_demo'>Notes AND PPT's</span>
              </div>
              <div className='admin_npq_list_view_demo'>
                {ppts.length > 0 ? (
                  <ul>
                    {ppts.map((ppt) => (
                      <li
                        key={ppt.NpqId}
                        onClick={() =>
                          handleAdminNPQClickDemo(ppt.NPQ, ppt.NpqId, subject)
                        }
                      >
                        <i class='bx bxs-folder'></i>
                        <span className='admin_npq_name_demo'>{ppt.NPQ}</span>
                        <i
                          className='bx bx-dots-vertical-rounded'
                          onClick={(e) => handleNpqOptionsClick(e, ppt.NpqId)}
                        ></i>
                        {/* Render options only for the clicked NPQ */}
                        {activeNpqId === ppt.NpqId && (
                          <div ref={optionsRef} className='admin_npq_options'>
                            <span
                              className='admin_npq_option'
                              onClick={(eventEdit) =>
                                handleNpqEditClick(eventEdit, ppt.NpqId)
                              }
                            >
                              Edit
                            </span>
                            <span
                              className='admin_npq_option'
                              onClick={(eventDelete) =>
                                handleNpqDeleteClick(
                                  eventDelete,
                                  ppt.NPQ,
                                  ppt.NpqId
                                )
                              }
                            >
                              Delete
                            </span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Notes And PPT's Found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Toaster position='top-right' />
    </div>
  );
};

export default AdminNPQViewDemo;
