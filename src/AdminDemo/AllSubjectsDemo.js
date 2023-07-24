import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import firebase from '../FirebaseAdmin/firebase';
import toast, { Toaster } from 'react-hot-toast';
import './AllSubjectsDemo.css'

export const AllSubjectsDemo = () => {
    const history = useHistory();
    const [allSubjectsDemo, setallSubjectsDemo] = useState([]);
    const [searchTextDemoAdmin, setSearchTextDemoAdmin] = useState('');
    const [activeSubjectId, setActiveSubjectId] = useState(null);
    const optionsSubjectRef = useRef(null); // Ref for the options div

    /*Admin Unit Edit and Delete*/
  const handleEditSubjectOptionsClick = (e,subjectId) => {
    e.stopPropagation(); // Prevent event bubbling to the li element
    setActiveSubjectId(subjectId);
  };

  const handleEditSubjectClick = (eventEdit, subjectId) => {
    eventEdit.stopPropagation(); // Stop event propagation
    history.push({
      pathname: `/admin-edit-subject-demo`,
      state: {subjectId}
    });
  };

  const handleDeleteSubjectClick = (eventDelete, subjectId, subject) =>{
    eventDelete.stopPropagation();
    //Delete NPQ From the Real Time DataBase
    const subjectRef = firebase.database().ref('Subjects/SASTRA');
    subjectRef
      .child(subjectId)
      .remove()
      .then(() => {
        // After successful deletion from the database, update the state
        setallSubjectsDemo((prevSubjects) => prevSubjects.filter((subject) => subject.subjectId !== subjectId));
        toast.success(`${subject} deleted successfully`);
      })
      .catch((error) => {
        toast.error('Failed to delete subject from database');
        console.log(error);
      });
  };

  useEffect(() => {
    // Close options when clicking outside the options box
    function handleSubjectClickOutside(event) {
      if (optionsSubjectRef.current && !optionsSubjectRef.current.contains(event.target)) {
        setActiveSubjectId(null);
      }
    }
    document.addEventListener('click', handleSubjectClickOutside);
    return () => {
      document.removeEventListener('click', handleSubjectClickOutside);
    };
  }, []);

    useEffect(() => {
        const fetchSubjects = async () => {
          try {
            const snapshot = await firebase.database().ref('Subjects/SASTRA').once('value');
            const subjectsData = snapshot.val() || {};
            const subjectsArray = Object.values(subjectsData);
            const sortedSubjects = subjectsArray.sort((a, b) => a.subject.localeCompare(b.subject)); // Sort subjects alphabetically
            setallSubjectsDemo(sortedSubjects);
          } catch (error) {
            console.log(error);
          }
        };
    
        fetchSubjects();
    }, []);

    const handleSearchDemoAdminChange = (e) => {
        setSearchTextDemoAdmin(e.target.value);
    }

    const filteredSubjectsDemoAdmin = allSubjectsDemo.filter((subject) =>
        subject.subject.toLowerCase().includes(searchTextDemoAdmin.toLowerCase())
    );

    const handleAllSubjectsDemoClick = (subjectId, subject) =>{
        history.push({
            pathname: `/admin-unit-view-demo/${subject}`,
            state: {subjectId,subject}
        });
    }

  return (
    <div className='AllSubjectsBody'>
      <div className='AllSubjects_content'>
        <div className='AllSubjects_box'>
          <div className='allsubjects_innerbox'>
            <div className='allsubjects_form'>
                <div className='allsubjects_search'>
                    <input
                    type="text"
                    placeholder="Search"
                    value={searchTextDemoAdmin}
                    onChange={handleSearchDemoAdminChange}
                    ></input>
                    <i className="bx bx-search"></i>
                </div>
                <div className='allsubjects_view_demo'>
                    <ul className='all_sub_list_demo'>
                        {filteredSubjectsDemoAdmin.map((subject, index) => (
                            <li key={index} onClick={() => handleAllSubjectsDemoClick(subject.subjectId,subject.subject)}>
                            <i className='bx bxs-folder'></i>
                                <span className='all_sub_code_demo'>
                                {subject.subject}
                                <br />
                                <span className='all_sub_full_name_demo'>{subject.subjectFullName}</span>
                                </span>
                                <i className='bx bx-dots-vertical-rounded' onClick={(e) => handleEditSubjectOptionsClick(e,subject.subjectId)}></i>
                                {/* Render options only for the clicked Unit */}
                                {activeSubjectId === subject.subjectId &&(
                                  <div ref={optionsSubjectRef} className='admin_subject_options'>
                                    <span className='admin_subject_option' onClick={(eventEdit) => handleEditSubjectClick(eventEdit,subject.subjectId)}>Edit</span>
                                    <span className='admin_subject_option' onClick={(eventDelete) => handleDeleteSubjectClick(eventDelete,subject.subjectId, subject.subject)}>Delete</span>
                                  </div>
                                )}
                            </li>
                        ))}
                    </ul>
                </div>   
            </div>
          </div>
        </div>
      </div>
      <Toaster position='top-right' />
    </div>
  )
}
export default AllSubjectsDemo;