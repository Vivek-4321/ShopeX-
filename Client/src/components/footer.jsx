import React from 'react';
import './footer.css';
import { useLocation,Link } from 'react-router-dom';

const Footer = () => {
    const scrollToTop = () =>{
        window.scrollTo({
          top: 0, 
          behavior: 'smooth'
          /* you can also use 'auto' behaviour
             in place of 'smooth' */
        });
      };

  return (
    <>
      <div className='footer-container'>
        <div className='footer-wrapper'>
          <div onClick={scrollToTop} className='footer-backtop'>Back to Top</div>
          <div className='footer-content'>
            <div className='footer-content-first'>
              <div className='footer-content-first-one'>
              <div className='t-head'>Get to know us</div>
                     <ul>
                         <li>Careers</li>
                         <li>Blog</li>
                         <li>About Amazon</li>
                         <li>Investors Relations</li>
                         <li>Amazon Advices</li>
                         <li>Amazon science</li>
                     </ul>
              </div>
              <div className='footer-content-first-second'>
              <div className='t-head'>Get to know us</div>
                     <ul>
                         <li>Careers</li>
                         <li>Blog</li>
                         <li>About Amazon</li>
                         <li>Investors Relations</li>
                         <li>Amazon Advices</li>
                         <li>Amazon science</li>
                     </ul>
              </div>
            </div>
            <div className='footer-content-last'>
              <div className='footer-content-last-one'>
              <div className='t-head'>Get to know us</div>
                     <ul>
                         <li>Careers</li>
                         <li>Blog</li>
                         <li>About Amazon</li>
                         <li>Investors Relations</li>
                         <li>Amazon Advices</li>
                         <li>Amazon science</li>
                     </ul>
              </div>
              <div className='footer-content-last-second'>
              <div className='t-head'>Get to know us</div>
                     <ul>
                         <li>Careers</li>
                         <li>Blog</li>
                         <li>About Amazon</li>
                         <li>Investors Relations</li>
                         <li>Amazon Advices</li>
                         <li>Amazon science</li>
                     </ul>
              </div>
            </div>
          </div>
          <div className='footer-copyright'>
          <span>&copy; Designed by Vivek Venugopal</span>
          </div>
        </div>
      </div>
    </>
  )
}

export default Footer;