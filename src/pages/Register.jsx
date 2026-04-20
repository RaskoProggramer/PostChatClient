import React from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup'; 
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const navigate = useNavigate();
    const initialValue = {
        password : "",
        username : ""
    };
    
    const validationSchema = Yup.object().shape({
        password: Yup.string().min(4).max(20).required(),
        username: Yup.string().min(3).max(15).required()
    });

    const onSubmit = (data) => {
        try {
           axios.post('http://localhost:3001/auth', data).then((response) => {
            if (response.data.error) {
              alert(response.data.error);
            } else {
              alert("Registration successful!");
              navigate("/login");
            }
        }); 
        } catch (error) {
           console.log(error) 
        }
    }

  return (
    <div>
      <Formik initialValues={initialValue} onSubmit={onSubmit} validationSchema={validationSchema}>
              <Form className='formContainer'>
                <label>Username</label>
                <ErrorMessage name='username' component='span'/>
                <Field id="inputCreatePost" name='username' placeholder="e.g Mpho"/>
                <label>Password</label>
                <ErrorMessage name='password' component='span'/>
                <Field id="inputCreatePost" type='password' name='password' placeholder="Your password..."/>
                <button type='submit'>Register</button>
              </Form>
            </Formik>
    </div>
  )
}

export default Register;
