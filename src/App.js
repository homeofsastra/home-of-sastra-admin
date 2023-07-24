import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import firebase from './FirebaseAdmin/firebase';
import EmailLogin from './AdminDemo/EmailLogin';
import AdminDashboard from './AdminDemo/AdminDashboard';
import CreateAccount from './AdminDemo/CreateAccount';
import AddSubjectsDemo from './AdminDemo/AddSubjectsDemo';
import AddUnitDemo from './AdminDemo/AddUnitDemo';
import AddNPQDemo from './AdminDemo/AddNPQDemo';
import AddPDFDemo from './AdminDemo/AddPDFDemo';
import AddMessageDemo from './AdminDemo/AddMessageDemo';
import AllSubjectsDemo from './AdminDemo/AllSubjectsDemo';
import AdminUnitViewDemo from './AdminDemo/AdminUnitViewDemo';
import AdminNPQViewDemo from './AdminDemo/AdminNPQViewDemo';
import AdminPdfListViewDemo from './AdminDemo/AdminPdfListViewDemo';
import AdminPdfOpenerDemo from './AdminDemo/AdminPdfOpenerDemo';
import AdminMsgRepViewDemo from './AdminDemo/AdminMsgRepViewDemo'
//Admin Edit Demo
import AdminEditPdfListViewDemo from './AdminEditDemo/AdminEditPdfListViewDemo';
import AdminEditNPQListDemo from './AdminEditDemo/AdminEditNPQListDemo';
import AdminEditUnitListDemo from './AdminEditDemo/AdminEditUnitListDemo';
import AdminEditSubjectListDemo from './AdminEditDemo/AdminEditSubjectListDemo';
import AdminEditMsgListDemo from './AdminEditDemo/AdminEditMsgListDemo';

import LoadingWebHos from './AdminLoadingWeb/LoadingWebHos'

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 4500);

    const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        setLoggedIn(true);
      } else {
        setLoggedIn(false);
      }
    });

    return () => {
      clearTimeout(timer);
      unsubscribe();
    };
  }, []);

  return (
    <div>
      {isLoading ? (
        <LoadingWebHos />
      ) : (
        <Router>
          <Switch> 
            <Route exact path="/">
              {loggedIn ? <Redirect to="/dashboard" /> : <EmailLogin />}
            </Route>
            <Route path="/create-account">
              {loggedIn ? <Redirect to="/dashboard" /> : <CreateAccount />}
            </Route>
            <Route path="/dashboard">
              {loggedIn ? <AdminDashboard /> : <Redirect to="/" />}
            </Route>
            <Route path="/all-subjects-demo">
              {loggedIn ? <AllSubjectsDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/add-subject-demo">
              {loggedIn ? <AddSubjectsDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/add-unit-demo">
              {loggedIn ? <AddUnitDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/add-npq-demo">
              {loggedIn ? <AddNPQDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/add-pdf-demo">
              {loggedIn ? <AddPDFDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/add-message-demo">
              {loggedIn ? <AddMessageDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/admin-unit-view-demo">
              {loggedIn ? <AdminUnitViewDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/admin-npq-View-demo">
              {loggedIn ? <AdminNPQViewDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/admin-Pdf-List-demo">
              {loggedIn ? <AdminPdfListViewDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/admin-pdf-open-demo">
              {loggedIn ? <AdminPdfOpenerDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/msg-rep-list-demo">
              {loggedIn ? <AdminMsgRepViewDemo /> : <Redirect to="/" />}
            </Route>

            {/* Admin Edit */}

            <Route path="/admin-edit-pdf-demo">
              {loggedIn ? <AdminEditPdfListViewDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/admin-edit-npq-demo">
              {loggedIn ? <AdminEditNPQListDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/admin-edit-unit-demo">
              {loggedIn ? <AdminEditUnitListDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/admin-edit-subject-demo">
              {loggedIn ? <AdminEditSubjectListDemo /> : <Redirect to="/" />}
            </Route>
            <Route path="/admin-edit-message-demo">
              {loggedIn ? <AdminEditMsgListDemo /> : <Redirect to="/" />}
            </Route>
          </Switch> 
        </Router>
      )}
    </div>
  );
}

export default App;
