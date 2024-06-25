// Path: frontend/src/api/auth.js

import axios from "axios";
// import { useNavigate  } from 'react-router-dom';     

const loginUser = async (email, password) => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/apis/token/', {
      email,
      password,
    });
    console.log("User logged in successfully:", response.data);
    
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    alert("Error logging in user");
    throw error;
  }
};

const registerParent = async (formData) => {
  try {
    const response = await axios.post("/apis/register/parent/", formData);
    console.log("Parent registered successfully:", response.data);
    alert("parent registered successfully");
    // Optionally, handle success message or redirect to another page
  } catch (error) {
    console.error("Error registering parent:", error);
    alert("Error registering parent");
    // Optionally, display error message to the user
  }
};

const registerTeacher = async (formData) => {
    try {
      const response = await axios.post("http://127.0.0.1:8000/apis/register/teacher/", formData);
      console.log("Teacher registered successfully:", response.data);
      alert("Teacher registered successfully");
      return response.data; // Optionally, you can return data for further processing
    } catch (error) {
      console.error("Error registering teacher:", error);
      alert("Error registering teacher");
      throw error; // Propagate the error for handling in the component
    }
  };

export { loginUser, registerParent, registerTeacher };
