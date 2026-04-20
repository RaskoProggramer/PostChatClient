import React, {useState, useEffect} from 'react';
import {Formik, Form, Field, ErrorMessage} from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Create() {
  const [newPost, setNewPost] = useState({});
  let navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("accessToken")) {
      navigate('/login');
    }
  }, []);
  
  const initialValue = {
    title : "",
    postText : ""
  };

  const validationSchema = Yup.object().shape({
    title: Yup.string().required(),
    postText: Yup.string().required(),
  });

  const onSubmit = (async (data) => {
   try {
    await axios.post(
      "http://localhost:3001/posts",
      data,
      {
        headers: {
          accessToken: localStorage.getItem("accessToken"),
        },
      }
    );

    navigate("/");
    } catch (error) {
      console.log(error);
    }
    
  });

  return (
    <div className='createPostPage'>
      <Formik initialValues={initialValue} onSubmit={onSubmit} validationSchema={validationSchema}>
        <Form className='formContainer'>
            <label>Title</label>
            <ErrorMessage name='title' component='span'/>
            <Field id="inputCreatePost" name='title' placeholder="Title"/>
            <label>Post</label>
            <ErrorMessage name='postText' component='span'/>
            <Field id="inputCreatePost" name='postText' placeholder="Whats on your Mind?"/>
             <button type="submit" onClick={onSubmit}> Create Post</button>
        </Form>
      </Formik>
    </div>
  )
}

export default Create;
