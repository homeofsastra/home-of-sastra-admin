import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import pic4 from './HOL5.png';
import firebase from '../FirebaseAdmin/firebase';
import './AdminDashboard.css';
import toast, { Toaster } from 'react-hot-toast';

export const AdminDashboard = () => {
    const history = useHistory();
    const [isLoggedOut, setIsLoggedOut] = useState(false);
    const [userId, setUserId] = useState('');
    const [userData, setUserData] = useState(null);

    /* SIDE BAR EFFECT */
    useEffect(() => {
        const handleButtonClick = () => {
          const sidebar = document.querySelector('.sidebar');
          sidebar.classList.toggle('active');
        };
    
        const btn = document.querySelector('#btn');
        btn.addEventListener('click', handleButtonClick);
    
        return () => {
          btn.removeEventListener('click', handleButtonClick);
        };
    }, []);

    // Getting user data
  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      const userDataRef = firebase.database().ref('Admin/' + user.uid);

      userDataRef.on('value', (snapshot) => {
        const data = snapshot.val();
        setUserData(data);
      });

      return () => {
        userDataRef.off();
      };
    }
  }, []);

  // For SignOut the user
  useEffect(() => {
    const user = firebase.auth().currentUser;
    if (user) {
      setUserId(user.uid);
    }
  }, []);

  // Sign out the user
  const handleLogout = () => {
    firebase
      .auth()
      .signOut()
      .then(() => {
        setIsLoggedOut(true);
        toast.success('Successfully logged out');
      })
      .catch((error) => {
        toast.error('Error occurred while logging out');
        console.error(error);
      });
  };

  useEffect(() => {
    if (isLoggedOut) {
      history.push('/'); // Redirect to the EmailLogin page after logout
    }
  }, [isLoggedOut, history]);

  return (
    <div className='body1'>
      <div className='sidebar'>
        <div className='logo_content'>
          <div className='side_logo'>
            <img src={pic4} alt='homeofsastra' />
            <div className='logo_name'>HomeOfSastra</div>
          </div>
          <i className='bx bx-menu' id='btn'></i>
        </div>
        <ul className='nav_list'>
          <li>
            <a onClick={() => history.push('/add-message-demo')}>
              <i className='bx bx-book'></i>
              <span className='links_name'>Add Message</span>
            </a>
            <span className='tooltip'>Add Message</span>
          </li>
          <li>
            <a onClick={() => history.push('/all-subjects-demo')}>
              <i class='bx bxs-book-content'></i>
              <span className='links_name'>All Subjects</span>
            </a>
            <span className='tooltip'>All Subjects</span>
          </li>
          <li>
            <a onClick={() => history.push('/msg-rep-list-demo')}>
              <i class='bx bxs-message-rounded-dots'></i>
              <span className='links_name'>Messages List</span>
            </a>
            <span className='tooltip'>Msg List</span>
          </li>
        </ul>
        <div className='profile_content' onClick={handleLogout}>
          <div className='profile'>
            <div className='profile_details'>
              <div className='name_job'>
                <div className='out'>Sign Out</div>
                {userData && <div className='name'>{userData.name}</div>}
              </div>
            </div>
            <i className='bx bx-log-out' id='sign_out'></i>
          </div>
        </div>
      </div>

      <div className='dashboard_content'>
        <div className='dashboard_box'>
          <div className='dashboard_innerbox'>
            <span className='title_sub_dash'> Add Subjects</span>
            <div className='form_fav_sub'>
              <div className='scroll-content'>
                <div className='scrollable-content'>
                    <ul className='fav_sub_list_view'>
                        <li onClick={() => history.push('/add-subject-demo')}>
                            <span className='fav_sub_code'>Add Subject</span>
                        </li>
                        <li onClick={() => history.push('/add-unit-demo')}>
                            <span className='fav_sub_code'>Add Unit</span>
                        </li>
                        <li onClick={() => history.push('/add-npq-demo')}>
                            <span className='fav_sub_code'>Add NPQ</span>
                        </li>
                        <li onClick={() => history.push('/add-pdf-demo')}>
                            <span className='fav_sub_code'>Add PDF</span>
                        </li>
                    </ul>
                </div>
              </div>
            </div>
            <div className='form_messages'>
              <span className='title_msg_dash'>Messages</span>
              <ul className='dashnoard_messages'>
                <li>
                  <span className='msg_title'>Hello All</span>
                  <br />
                  <span className='msg_description'>
                    Greetings from HomeOfSastra. We provide PDF files of all subjects on this website so that preparing for exams can be easy. You can also use this website to calculate your CGPA. Students can easily see the materials they need to study as well as calculate their grade point average so they can stay on top of their academic performance. For students applying for scholarships or other opportunities, the CGPA Calculator is particularly useful.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <footer className='footer'>
          <p>Copyright © 2023 homeofsastra | All rights reserved</p>
        </footer>
      </div>
      <Toaster position="top-right" />
      
    </div>
  )
}
export default AdminDashboard;