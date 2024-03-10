import React, { useState, useRef, useEffect } from 'react';
import './CreateProduct.css';
import TextField from '@mui/material/TextField';
import axios from 'axios';
import { PuffLoader } from 'react-spinners';
import LinearProgress from '@mui/material/LinearProgress';
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreateProduct() {
  const [files, setFiles] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState();
  const [price, setPrice] = useState();
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading,setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef();
  const [imageUrls, setImageUrls] = useState([]);
  const [message, setMessage] = useState('');
  const [test,setTest] = useState([])

  const handleFileChange = (event) => {
    const selectedFiles = Array.from(event.target.files);
    setFiles([...files, ...selectedFiles]);

    const selectedPreviewUrls = selectedFiles.map((file) => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...selectedPreviewUrls]);
  };

  const handleFormSubmit = async() => {
    try{
      setIsLoading(true);
      const data = {
        name,
        description,
        price,
        quantity,
        imageUrls: [...imageUrls],
      }

      const response = await axios.post("http://localhost:4040/api/product/createProduct", data);
      console.log(response.data);
      toast.success("Product is succesfully created !");
      
    }catch(error) {
      if (error.response && error.response.data && error.response.data.error) {
        toast.error(error.response.data.error);
      } else {
        toast.error(error.message);
      }
    }
    setIsLoading(false);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (files.length === 0) {
      toast.error("Please select atleast an image")
      return;
    }

    try {
      const formData = new FormData();
      files.forEach((file) => formData.append('images', file));

      const response = await axios.post('http://localhost:4040/upload', formData, {
        onUploadProgress: progressEvent => {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setProgress(percentCompleted);
        },
      });

      
      const imageUrls = response.data.map((image) => image.secure_url);
      setImageUrls((prevImageUrls) => [...prevImageUrls, ...imageUrls]); // make sure imageUrls is always an array
      setFiles([]);
      console.log(imageUrls);
      console.log(response.data);
      console.log(response.data.secure_url);
      setFiles([]);
      setPreviewUrls([]);
      setProgress(0);
      setMessage("Images uploaded succesfully")
      toast.success("Images uploaded succefully")
    } catch (err) {
      console.error(err);
      alert('Error uploading images');
    }
  };

  useEffect(() => {
    console.log(imageUrls);
  }, [imageUrls]);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  return (
    <>
     {isLoading && 
            <div style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: isLoading ? 'flex' : 'none', justifyContent: 'center', alignItems: 'center', zIndex: 9999 }}>
            <PuffLoader color="#fff" />
          </div>}
          <div className='create-product-container'>
            <div className='create-product-container-left'>
              <span className='create-product-title'>Create a product</span>
              <div className='create-product-container-input-bar'>
                <TextField id="outlined-multiline-flexible" label="Name"  value={name} onChange={(event) => {setName(event.target.value)}} style={{ width: 500 }} multiline maxRows={20}/>
              </div>

              <div className='create-product-container-input-bar'>
                <TextField id="outlined-multiline-flexible" label="Description" value={description} onChange={(event) => {setDescription(event.target.value)}} style={{ width: 500 }} multiline maxRows={20}/>
              </div>

              <div className='create-product-container-input-bar'>
                <TextField id="outlined-multiline-flexible" label="Price"  value={price} onChange={(event) => {setPrice(event.target.value)}} style={{ width: 500 }} multiline maxRows={20}/>
              </div>

              <div className='create-product-container-input-bar'>
                <TextField id="outlined-multiline-flexible" label="Quantity"  value={quantity} onChange={(event) => {setQuantity(event.target.value)}} style={{ width: 500 }} multiline maxRows={20}/>
              </div>



            </div>
            <div className='create-product-container-right'>
              <div className='create-product-container-right-image-uploader' onClick={handleClick}>
                <input className="file-input" type="file" hidden onChange={handleFileChange} ref={fileInputRef} multiple/>
                <div className='file-input-image'>
                  <CloudUploadOutlinedIcon/>
                  Upload Files
                </div>
              </div>
              {previewUrls.length > 0 && (
          <div className="create-product-container-preview">
            {previewUrls.map((url, index) => (
              <div key={index} className="create-product-container-preview-image">
                <img src={url} alt="preview" />
                <div className="create-product-container-preview-image-overlay">
                  <button
                    className='image-btn'
                    color="secondary"
                    onClick={() => {
                      const newFiles = [...files];
                      newFiles.splice(index, 1);
                      setFiles(newFiles);

                      const newPreviewUrls = [...previewUrls];
                      newPreviewUrls.splice(index, 1);
                      setPreviewUrls(newPreviewUrls);
                    }}
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="image-progress-bar">
          <div className='progress-moving'>
          <LinearProgress variant="determinate" value={progress} />
          </div>
          <p className='progress-info'>{progress}%</p>
        </div>
          <div className='image-submit-div'>
            <p className='image-submit-info'>{message}</p>
          <button className='image-submit-button' onClick={handleSubmit}>Upload</button>
          </div>
          <button className='product-submit-button' onClick={handleFormSubmit}>Submit</button>
            </div>
            
          </div>
          <ToastContainer/>
    </>
  );
}

export default CreateProduct;


