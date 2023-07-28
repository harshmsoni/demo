import React, { useState, useEffect } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import 'react-tabs/style/react-tabs.css';
import ApprovedEntries from './ApprovedEntries';
import PendingEntries from './PendingEntries';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs } from 'firebase/firestore';
import { signOut, onAuthStateChanged } from 'firebase/auth';
import { fire } from '../database/fire'; // Import the Firestore instance
import { auth } from '../database/fire'; // Import the Firebase auth instance

const AdminPage = () => {
  const [pendingEntries, setPendingEntries] = useState([]);
  const [approvedEntries, setApprovedEntries] = useState([]);
  const [authorized, setAuthorized] = useState(true); // State to check if the user is authorized
  const navigate = useNavigate(); // Initialize the useNavigate hook

  // Check if a user is logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        // If user is not logged in, redirect to the login page
        setAuthorized(false);
      }
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  // Fetch data from Firestore on component mount if authorized
  useEffect(() => {
    if (authorized) {
      const fetchPendingEntries = async () => {
        try {
          const querySnapshot = await getDocs(collection(fire, 'pending'));
          const entriesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setPendingEntries(entriesData);
        } catch (error) {
          console.error('Error fetching pending entries:', error);
        }
      };

      const fetchApprovedEntries = async () => {
        try {
          const querySnapshot = await getDocs(collection(fire, 'form'));
          const entriesData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setApprovedEntries(entriesData);
        } catch (error) {
          console.error('Error fetching approved entries:', error);
        }
      };

      fetchPendingEntries();
      fetchApprovedEntries();
    }
  }, [authorized]);

  // Handle user logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate('/login'); // Redirect to login page after logout
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  useEffect(() => {
    // Redirect to RandomDate page after 3 seconds if not authorized
    if (!authorized) {
      const redirectTimer = setTimeout(() => {
        navigate('/');
      }, 3000);

      return () => clearTimeout(redirectTimer);
    }
  }, [authorized, navigate]);

  if (!authorized) {
    return <div>You are not authorized to access this page. Redirecting to HomePage</div>;
  }

  return (
    <div>
      <h1>Admin Page</h1>
      <button onClick={handleLogout}>Logout</button>

      <Tabs>
        <TabList>
          <Tab>Approved Entries ({approvedEntries.length})</Tab>
          <Tab>Pending Entries ({pendingEntries.length})</Tab>
        </TabList>
        <TabPanel>
          <ApprovedEntries />
        </TabPanel>
        <TabPanel>
          <PendingEntries />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default AdminPage;
