import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import { fire } from './database/fire';
import { Modal, Form, Navbar, Container, Button } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './random.date.css';
import logo from "./logo.png";

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
    const data = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
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

  // Function to show a toast notification for successful submission
  const showSuccessToast = () => {
    toast.success('Your request has been sent successfully!', {
      position: toast.POSITION.TOP_RIGHT,
      autoClose: 3000,
      hideProgressBar: false,
    });
  };

  // Function to generate a unique share link based on the unique ID
  const generateShareLink = (id) => {
    return `https://demo-lyart-six.vercel.app/share/${id}`;
  };

  const handleRandomButtonClick = () => {
    fetchData().then((data) => {
      setRandomData(data);
    });
  };

  const handleEnterNewIdeasClick = () => {
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
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

      // Post the entry to Firestore
      const docRef = await addDoc(collectionRef, {
        head: head,
        shortDescription: shortDescription,
      });

      // Generate the share link with the unique ID and set it to the clipboard
      const shareLink = generateShareLink(docRef.id);
      setFormSubmitted(true);

      // Show the success toast
      showSuccessToast();

      console.log('Form submitted successfully!');
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  return (
    <div>
      <Navbar expand="lg">
        <Container>
          <Navbar.Brand>
            <img
              src={logo}
              style={{ marginTop: '-30px' }}
              width="160"
              height="160"
              className="d-inline-block align-top"
              alt="Your Logo"
            />
          </Navbar.Brand>
        </Container>
      </Navbar>
      <div className='DateApp'>
        <div className="App">
          <h1 className='heading'>{randomHead}</h1>
          <p className='description'>{randomShortDescription}</p>
          <div className='button'>
            <Button variant='secondary' onClick={handleRandomButtonClick}>
              Random Button
            </Button>
            <Button variant='primary' onClick={handleEnterNewIdeasClick}>
              Enter New Ideas
            </Button>
            {/* Add the share button */}
            {formSubmitted && (
              <Button variant='success' onClick={() => {navigator.clipboard.writeText(generateShareLink())}}>
                Share Link
              </Button>
            )}
          </div>
          <Modal show={showForm} onHide={handleCloseForm}>
            <Modal.Header closeButton>
              <Modal.Title>Enter New Ideas</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="heading">
                  <Form.Label>Title:</Form.Label>
                  <Form.Control
                    type="text"
                    value={head}
                    onChange={(e) => setHead(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="description">
                  <Form.Label>Description:</Form.Label>
                  <Form.Control
                    as="textarea"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                  />
                </Form.Group>
                <Button type="submit">Submit</Button>
              </Form>
            </Modal.Body>
          </Modal>
        </div>
      </div>
      <ToastContainer /> {/* Toast container for displaying toast notifications */}
    </div>
  );
}

export default RandomDate;
