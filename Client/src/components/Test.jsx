import React, { useState, useEffect } from 'react';

function Test({name}) {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts/1');
      const json = await response.json();
      setData(json);
    };
    fetchData();
  }, []);

  return (
    <>
      <p>Test</p>
      <h1>Hi,there</h1>
      <div>{name}</div>
      <img src="https://images.unsplash.com/photo-1617854818583-09e7f077a156?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1170&q=80"/>
      {data && <div>{data.title}</div>}
    </>
    
  )
}

export default Test;