import React, { useState, useEffect } from 'react';
import { collection, getDocs, doc, updateDoc, deleteDoc, addDoc } from 'firebase/firestore';
import { fire } from '../database/fire'; // Import the Firestore instance

const PendingEntries = () => {
  const [pendingEntries, setPendingEntries] = useState([]);
  const [editingEntryId, setEditingEntryId] = useState(null);
  const [editedData, setEditedData] = useState({ head: '', shortDescription: '' });

  // Fetch data from Firestore on component mount
  useEffect(() => {
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

    fetchPendingEntries();
  }, []);

  // Handler for starting the edit mode
  const handleEdit = (entryId) => {
    const entryToEdit = pendingEntries.find((entry) => entry.id === entryId);
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
        await updateDoc(doc(fire, 'pending', entryId), editedData);
        console.log('Entry updated');
        setEditingEntryId(null);
        alert('Entry updated successfully!');
      } catch (error) {
        console.error('Error updating entry:', error);
      }
    }
  };

  // Handler for deleting an entry
  const handleDelete = async (entryId) => {
    const confirmation = window.confirm('Are you sure you want to delete this entry?');
    if (confirmation) {
      try {
        await deleteDoc(doc(fire, 'pending', entryId));
        console.log('Entry deleted');
        // Update state after successful deletion
        setPendingEntries((prevEntries) =>
          prevEntries.filter((entry) => entry.id !== entryId)
        );
      } catch (error) {
        console.error('Error deleting entry:', error);
      }
    }
  };
  // Handler for approving an entry
  const handleApprove = async (entryId) => {
    const entryToApprove = pendingEntries.find((entry) => entry.id === entryId);
    if (entryToApprove) {
      const confirmation = window.confirm('Are you sure you want to approve this entry?');
      if (confirmation) {
        try {
          // Add the approved entry to the 'approved_entries' collection
          await addDoc(collection(fire, 'form'), entryToApprove);
          console.log('Entry approved and added to the "approved_entries" collection');
          // After approving, delete the entry from the 'pending_entries' collection
          await deleteDoc(doc(fire, 'pending_entries', entryId));
          console.log('Entry deleted from the "pending_entries" collection');
          // Update state after successful approval and deletion
          setPendingEntries((prevEntries) =>
            prevEntries.filter((entry) => entry.id !== entryId)
          );
        } catch (error) {
          console.error('Error approving entry:', error);
        }
      }
    }
  };

  return (
    <div>
      <h2>Pending Entries</h2>
      {pendingEntries.map((entry) => (
        <div key={entry.id} style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
          {/* Left side: Editable input fields in edit mode */}
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
              <button onClick={() => handleSave(entry.id)}>Save</button>
            ) : (
              <button onClick={() => handleEdit(entry.id)}>Edit</button>
            )}
            <button onClick={() => handleDelete(entry.id)}>Delete</button>
            <button onClick={() => handleApprove(entry.id)}>Approve</button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PendingEntries;
