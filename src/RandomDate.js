import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { fire } from './database/fire';
import './random.date.css';

function RandomDate() {
  const [showForm, setShowForm] = useState(false);
  const [head, setHead] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [randomHead, setRandomHead] = useState('');
  const [randomShortDescription, setRandomShortDescription] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  // Function to fetch data from Firestore
  const fetchData = async () => {
    const collectionRef = collection(fire, 'form');
    const querySnapshot = await getDocs(collectionRef);
    const data = querySnapshot.docs.map((doc) => doc.data());
    return data;
  };

  // Function to set random head and short description
  const setRandomData = (data) => {
    const randomIndex = Math.floor(Math.random() * data.length);
    setRandomHead(data[randomIndex].head);
    setRandomShortDescription(data[randomIndex].shortDescription);
  };

  // Effect to fetch data when component mounts
  useEffect(() => {
    fetchData().then((data) => {
      setRandomData(data);
    });
  }, []);

  const handleRandomButtonClick = () => {
    fetchData().then((data) => {
      setRandomData(data);
    });
  };

  const handleEnterNewIdeasClick = () => {
    setShowForm(true);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // If the form is already submitted once, return without adding the second entry
      if (formSubmitted) {
        return;
      }

      // Get a reference to the Firestore collection
      const collectionRef = collection(fire, 'pending');

      // Post the first entry to Firestore
      await addDoc(collectionRef, {
        head: head,
        shortDescription: shortDescription,
      });

      // Reset the form and close the modal
      setHead('');
      setShortDescription('');
      setShowForm(false);
      setFormSubmitted(true);
      console.log('Form submitted successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div className="App">
      <h1>{randomHead}</h1>
      <p>{randomShortDescription}</p>
      <button onClick={handleRandomButtonClick}>Random Button</button>
      <p>
        <a href="#!" onClick={handleEnterNewIdeasClick}>
          Enter New Ideas
        </a>
      </p>

      {showForm && (
        <div className="modal">
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="heading">Heading:</label>
              <input
                type="text"
                id="heading"
                value={head}
                onChange={(e) => setHead(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="description">Description:</label>
              <textarea
                id="description"
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
              />
            </div>
            <div>
              <button type="submit">Submit</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default RandomDate;
