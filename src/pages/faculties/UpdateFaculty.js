import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import handleApiError from '../../utils/handleApiError';

const UpdateFaculty = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [faculty, setFaculty] = useState({
    facultyCode: '',
    facultyName: '',
  });

  useEffect(() => {
    // извлича се факултета по id-то му
    axios.get(`http://localhost:8081/faculties/${id}/find`,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
    })
      .then(response => setFaculty(response.data))
      .catch(error => handleApiError(error, navigate));
       // console.error('Error fetching faculty details:', error));
  }, [id]);//[id] e добавен като зависимост
  // при промяна на id-то ще се извика отново useEffect

  const handleChange = (e) => {
    setFaculty({ ...faculty, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    //e.preventDefault() предотвратява презареждането на страницата
    e.preventDefault();

    // използва се endpoint-а за редактиране на факултет
    axios.put(`http://localhost:8081/faculties/${id}/update`, faculty,
    {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
        },
    })
      .then(response => {
        alert('Faculty updated successfully!');
        // връща обратно към списъка с факултетите
        navigate('/faculty/list');
      })
      .catch(error => handleApiError(error, navigate));
        //console.error('Error updating faculty:', error));
  };

  const isButtonDisabled = () => {
    // ще върне true, ако има празно поле
    return faculty.facultyCode === '' || faculty.facultyName === '';
  };

  return (
    <div>
      <h1>Update Faculty</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Faculty Code:
          <input type="text" name="facultyCode" value={faculty.facultyCode} onChange={handleChange} />
        </label>
        <br />
        <label>
          Faculty Name:
          <input type="text" name="facultyName" value={faculty.facultyName} onChange={handleChange} />
        </label>
        <br />
        <button type="submit"
          disabled={isButtonDisabled()}
          title = {isButtonDisabled() ? "All fields are required" : ""}
        >Update Faculty</button>
      </form>
    </div>
  );
};

export default UpdateFaculty;