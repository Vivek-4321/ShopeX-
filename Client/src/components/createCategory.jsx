import React, {useState, useEffect} from 'react';
import './createCategory.css';
import { ToastContainer, toast } from 'react-toastify';
import { PuffLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import TextField from '@mui/material/TextField';
import axios from 'axios';

function CreateCategory() {

  const[name, setName] = useState('');
  const[description, setDescription] = useState('');

  async function handleSubmit (event) {
    event.preventDefault();

    const data={
        name,
        description,
    }

    try{
        const response = await axios.post('http://localhost:4040/api/category/createCategory', data);
        toast.success("Product Created Succesfully");
        console.log(response.data);
    }catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
            toast.error(error.response.data.error);
          } else {
            toast.error(error.message);
          }
    }
  }

  return (
    <>
        <div className='create-category-container'>
            <div className='create-category-container-center'>
                <span className='create-category-title'>Create a category</span>
                <div className='create-category-container-input-bar'>
                <TextField id="outlined-multiline-flexible" label="Name"  value={name} onChange={(event) => {setName(event.target.value)}} style={{ width: 500 }} multiline maxRows={20}/>
                </div>

                <div className='create-category-container-input-bar'>
                <TextField id="outlined-multiline-flexible" label="Description"  value={description} onChange={(event) => {setDescription(event.target.value)}} style={{ width: 500 }} multiline maxRows={20}/>
                </div>

                <button className="handle-btn" onClick={handleSubmit}>Submit</button>
            </div>
        </div>
        <ToastContainer/>
    </>
  )
}

export default CreateCategory ;