import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { fire } from '../database/fire'; // Import the Firestore instance

const ApprovedEntries = () => {
  const [approvedEntries, setApprovedEntries] = useState([]);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editedData, setEditedData] = useState({ head: '', shortDescription: '' });

  // Fetch data from Firestore on component mount
  useEffect(() => {
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

    fetchApprovedEntries();
  }, []);

  // Handler for starting the edit mode
  const handleEdit = (entryId) => {
    const entryToEdit = approvedEntries.find((entry) => entry.id === entryId);
    if (entryToEdit) {
      setEditingEntryId(entryId);
      setEditedData({
        head: entryToEdit.head,
        shortDescription: entryToEdit.shortDescription,
      });
    }
  };

  // Handler for updating the edited data
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditedData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handler for saving the edited data
  const handleSave = async (entryId) => {
    const confirmation = window.confirm('Are you sure you want to update this entry?');
    if (confirmation) {
      try {
        await updateDoc(doc(fire, 'form', entryId), editedData);
        console.log('Entry updated');

        // Update the local state with the edited data
        setApprovedEntries((prevEntries) =>
          prevEntries.map((entry) => (entry.id === entryId ? editedData : entry))
        );

        setEditingEntryId(null);
        window.alert('Entry updated successfully!');
      } catch (error) {
        console.error('Error updating entry:', error);
      }
    }
  };

  // Handler for deleting an approved entry
  const handleDelete = async (entryId) => {
    try {
      await deleteDoc(doc(fire, 'form', entryId));
      console.log('Approved entry deleted');
      // Update state after successful deletion
      setApprovedEntries((prevEntries) =>
        prevEntries.filter((entry) => entry.id !== entryId)
      );
    } catch (error) {
      console.error('Error deleting approved entry:', error);
    }
  };

  return (
    <div>
      <h2>Approved Entries</h2>
      {approvedEntries.map((entry) => (
        <div key={entry.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {/* Left side: Read-only input fields */}
          <div style={{ marginRight: '20px' }}>
            <label>Head:</label>
            {editingEntryId === entry.id ? (
              <input
                type="text"
                name="head"
                value={editedData.head}
                onChange={handleInputChange}
              />
            ) : (
              <input
                type="text"
                value={entry.head}
                readOnly
              />
            )}
            <br />
            <label>Short Description:</label>
            {editingEntryId === entry.id ? (
              <input
                type="text"
                name="shortDescription"
                value={editedData.shortDescription}
                onChange={handleInputChange}
              />
            ) : (
              <input
                type="text"
                value={entry.shortDescription}
                readOnly
              />
            )}
          </div>

          {/* Right side: Action buttons */}
          <div>
            {editingEntryId === entry.id ? (
              <>
                <button onClick={() => handleSave(entry.id)}>Save</button>
                <button onClick={() => setEditingEntryId(null)}>Cancel</button>
              </>
            ) : (
              <>
                <button onClick={() => handleEdit(entry.id)}>Edit</button>
                <button onClick={() => handleDelete(entry.id)}>Delete</button>
              </>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApprovedEntries;
