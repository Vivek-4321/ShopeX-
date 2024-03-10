import React, { useState, useEffect, useCallback, useRef } from 'react';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import SearchIcon from '@mui/icons-material/Search';
import './NavigationBar.css';
import { useLocation,Link,useNavigate } from 'react-router-dom';
import { fetchProducts } from '../store/productSlice';
import { useDispatch,useSelector} from 'react-redux';

function NavigationBar() {
  const [searchInput, setSearchInput] = useState('');
  const items = useSelector((state) => state.cart.cart);
  const [menuOpen, setMenuOpen] = useState(false);
  const [suggestionOpen, setSuggestionOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const searchRef = useRef(null);
  const [searchSuggestions, setSearchSuggestions] = useState(0);
  const hideNavRoutes = ['/api/auth/login', '/api/auth/register'];
  const {data: products,status} = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const handleSearch = (input) => {
    fetch(`http://localhost:4040/api/search/${input}`)
      .then(res => res.json())
      .then(data => {
        setSearchSuggestions(data);
        console.log(data);
      })
      .catch(error => {
        console.error(error);
      });
  }


  const handleSubmit = (e) => {
    e.preventDefault();
    setSuggestionOpen(false);
    navigate(`/api/search/${searchInput}`);
  }

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  function debounce(func, timeout) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => { func.apply(this, args); }, timeout);
    };
  }
  

  
  const debouncedSearch = useCallback(
    debounce((input) => handleSearch(input), 500),
    []
  );
  
  const handleInputChange = (event) => {
    setSuggestionOpen(true);
    setSearchInput(event.target.value);
    debouncedSearch(event.target.value);
  }

  useEffect(()=>{

    dispatch(fetchProducts());
   
    },[]);

    useEffect(() => {
      function handleClickOutside(event) {
        if (searchRef.current && !searchRef.current.contains(event.target)) {
          setSuggestionOpen(false);
        }
      }
  
      window.addEventListener('click', handleClickOutside);
      return () => {
        window.removeEventListener('click', handleClickOutside);
      };
    }, []);

  useEffect(() => {
    if(searchInput === ''){
      setSuggestionOpen(false);
    }
  }, [searchInput]);

  // Hide the navigation bar on certain routes
  if (hideNavRoutes.includes(location.pathname)) {
    return null;
  }

  return (
    <>
        <div className='nav-container'>
            <div className='nav-container-left'>
                
                <div className='nav-menu-icon' onClick={toggleMenu}>
                  {menuOpen ? <CloseOutlinedIcon /> : <MenuOutlinedIcon />}
                </div>
                <p className='nav-logo'>ShopeX</p>
                <div className='nav-container-menu-items-div-large'>
                    <p className='nav-menu-item'><Link className="home-link" to='/api/home'>Home</Link></p>
                    <p className='nav-menu-item'>Categories</p>
                    <p className='nav-menu-item'>Wishlist</p>
                    <p className='nav-menu-item'>{products?.products?.length || 0}</p>
                </div>
                <div className='nav-container-menu-items' style={{ display: menuOpen ? 'block' : 'none' }}>
                  <div className='nav-container-menu-items-div'>
                    <p className='nav-menu-item'>Home</p>
                    <p className='nav-menu-item'>Categories</p>
                    <p className='nav-menu-item'>Wishlist</p>
                    <p className='nav-menu-item'>{products?.products?.length || 0}</p>
                </div>
              </div>

            </div>
            <div className='nav-container-middle'>
                <input ref={searchRef} onChange={handleInputChange} placeholder="Search Here"className='nav-container-search-bar' value={searchInput} />
                <div onClick={handleSubmit} className='nav-container-search-bar-icon'>
                <SearchIcon/>
                </div>
                <div ref={searchRef} className='search-suggestion' style={{ display: suggestionOpen ? 'block' : 'none' }}>
                  {searchInput && searchSuggestions.length > 0 && (
                    
                      searchSuggestions.map(suggestion => (
                        <>
                        <div onClick={handleSubmit} className='search-suggestion-container'>
                        <div className='search-suggestion-container-left'>
                          <img src={suggestion.imageUrls[0]} alt="image"/>
                          </div>
                          <div className='search-suggestion-container-right'>
                          {suggestion.name}
                          </div>
                        </div>
                        </>
                      ))
                  )}
                </div>
            </div>
            <div className='nav-container-right'>
                <div className='nav-container-right-group'>
                    <p className='nav-container-right-group-content'>Guest</p>
                    <div className='nav-container-right-group-icon'>
                    <AccountCircleOutlinedIcon/>
                    </div>
                </div>
                
               
                  <Link className='cart-link' to='/api/cart'>
                  <div className='nav-container-right-group'>
                  <p className='nav-container-right-group-content'>Cart</p>
                    <div className='nav-container-right-group-content-number'>{items && items.length}</div>
                    <div className='nav-container-right-group-icon'>
                    <ShoppingCartOutlinedIcon/></div>
                    </div>
                  </Link>
          </div>
      </div>
  </>
)
}

export default NavigationBar;