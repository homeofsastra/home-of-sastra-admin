import React, {useEffect, useState, useRef} from 'react'
import firebase from '../FirebaseAdmin/firebase'
import {useHistory, useLocation} from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast';
import './AdminUnitViewDemo.css'



export const AdminUnitViewDemo = () => {

  const [units, setUnits] = useState([]);
  const location = useLocation();
  const subjectId = location.state?.subjectId || '';
  const subject = location.state?.subject || '';
  const history = useHistory();
  const [activeUnitId, setActiveUnitId] = useState(null);
  const optionsUnitRef = useRef(null); // Ref for the options div

  /*Admin Unit Edit and Delete*/
  const handleEditUnitOptionsClick = (e,unitId) => {
    e.stopPropagation(); // Prevent event bubbling to the li element
    setActiveUnitId(unitId);
  };

  const handleEditUnitClick = (eventEdit, unitId) => {
    eventEdit.stopPropagation(); // Stop event propagation
    history.push({
      pathname: `/admin-edit-unit-demo`,
      state: {unitId}
    });
  };

  const handleDeleteUnitClick = (eventDelete, unitId, unit) =>{
    eventDelete.stopPropagation();
    //Delete NPQ From the Real Time DataBase
    const unitRef = firebase.database().ref('Units/SASTRA');
    unitRef
      .child(unitId)
      .remove()
      .then(() => {
        // After successful deletion from the database, update the state
        setUnits((prevUnits) => prevUnits.filter((unit) => unit.unitId !== unitId));
        toast.success(`${unit} deleted successfully`);
      })
      .catch((error) => {
        toast.error('Failed to delete unit from database');
        console.log(error);
      });
  };

  useEffect(() => {
    // Close options when clicking outside the options box
    function handleUnitClickOutside(event) {
      if (optionsUnitRef.current && !optionsUnitRef.current.contains(event.target)) {
        setActiveUnitId(null);
      }
    }
    document.addEventListener('click', handleUnitClickOutside);
    return () => {
      document.removeEventListener('click', handleUnitClickOutside);
    };
  }, []);


  useEffect(() => {
    const user = firebase.auth().currentUser;

    if (user) {
      const unitsRef = firebase.database().ref('Units/SASTRA');

      unitsRef
        .orderByChild('subjectId')
        .equalTo(subjectId)
        .on('value', (snapshot) => {
          const data = snapshot.val();
          if (data) {
            const unitsArray = Object.values(data);
            setUnits(unitsArray);
            console.log(unitsArray);
          }
        });

      return () => {
        unitsRef.off();
      };
    }
  }, [subjectId]);

  const handleAdminUnitDemoClick = (unit, unitId , subject) =>{
    history.push({
      pathname: `/admin-npq-View-demo/${unit}`,
      state: {unitId,subject}
    });
  };

  return (
    <div className='AdminUnitBodyDemo'>
      <div className='Admin_Unit_content_Demo'>
        <div className='Admin_Unit_box_demo'>
          <div className='admin_unit_innerbox_demo'>
            <div className='admin_unit_form_demo'>
              <div className='admin_unit_form_title_demo'>
              <span className='admin_title_unit_demo'>{subject} Units</span>
              </div>
              <div className='admin_units_list_view_demo'>
                {units.length > 0 ? (
                  <ul>
                    {units.map((unit) => (
                      <li key={unit.unitId} onClick={() => handleAdminUnitDemoClick(unit.unit, unit.unitId,subject)}>
                        <i class='bx bxs-folder'></i>
                        <span className='admin_unit_name_demo'>{unit.unit}</span>
                        <i className='bx bx-dots-vertical-rounded' onClick={(e) => handleEditUnitOptionsClick(e,unit.unitId)}></i>
                        {/* Render options only for the clicked Unit */}
                        {activeUnitId === unit.unitId &&(
                          <div ref={optionsUnitRef} className='admin_unit_options'>
                            <span className='admin_unit_option' onClick={(eventEdit) => handleEditUnitClick(eventEdit,unit.unitId)}>Edit</span>
                            <span className='admin_unit_option' onClick={(eventDelete) => handleDeleteUnitClick(eventDelete,unit.unitId, unit.unit)}>Delete</span>
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p>No Units Found</p>
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
export default AdminUnitViewDemo;