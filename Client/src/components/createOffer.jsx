import React, { useState, useEffect } from 'react';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import axios from 'axios';
import './createOffer.css';
import TextField from '@mui/material/TextField';
import { ToastContainer, toast } from 'react-toastify';
import { PuffLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';

function CreateOffer() {
  const [data, setData] = useState([]);
  const [date, setDate] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [Offer, setOffer] = useState(0);

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setDate(newDate);
    console.log(newDate);
  };

  const handleSubmit = async(event) => {
    event.preventDefault();

    const offer = {
        discountPercentage: Offer,
        endDate: date,
    }

    try{
        console.log(offer);
        const response = await axios.post(`http://localhost:4040/api/product/updateOffer/${selectedProductId}`, offer);
        if(response){
            toast.success("succesfull......");
        }
    }catch(error){
        console.error(error);
    }
  }

  const handleProductChange = (event) => {
    setSelectedProduct(event.target.value.name);
    setSelectedProductId(event.target.value._id);
    console.log(selectedProduct);
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('http://localhost:4040/api/product/getAllProducts');
      const json = await response.json();
      setData(json);
      console.log(json);
      setSelectedProduct("Select a product");
    };
    fetchData();
  }, []);
  

  return (
    <>
      <div className='create-offer-container'>
       
       <div className='create-offer-container-select'>
       <Select
            labelId="demo-simple-select-label"
            className="demo-simple-select"
            value={selectedProduct}
            onChange={handleProductChange}
            >
            {data && data.map((product) => (
            <MenuItem key={product._id} value={product}>
                {product.name}
            </MenuItem>
            ))}

        </Select>
       </div>
       <div className='create-offer-container-input-bar-offer'>
       <TextField id="outlined" label="Offer"  value={Offer} onChange={(event) => {setOffer(event.target.value)}} style={{ width: 250 }}/>
       </div>
        <div className='create-offer-container-input-bar'>
       <input
          className="date-changer"
          type="date"
          value={date}
          onChange={handleDateChange}
        />
       </div>
       <button onClick={handleSubmit}>Submit here</button>
      </div>
      <ToastContainer/>
    </>
  );
}

export default CreateOffer;
