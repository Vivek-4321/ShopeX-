import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./components/login";
import Register from "./components/register";
import Verify from "./components/verify";
import Home from "./components/home";
import PasswordReset from "./components/passRest";
import PageNotFound from "./components/PageNotFound";
import NavigationBar from "./components/NavigationBar";
import { Provider } from "react-redux";
import store from "./store/store.js";
import Footer from "./components/footer";
import SingleProduct from "./components/SingleProduct";
import CreateProduct from "./components/CreateProduct";
import CreateCategory from "./components/createCategory";
import CreateOffer from "./components/createOffer.jsx";
import SearchPage from "./components/searchPage.jsx";
import Cart from "./components/cart.jsx";

function App() {
  return (
    <>
      <Provider store={store}>
        <BrowserRouter>
          <NavigationBar />
          <Routes>
            <Route path="/api/auth/login" element={<Login />} />
            <Route path="/api/auth/register" element={<Register />} />
            <Route path="/api/auth/verify" element={<Verify />} />
            <Route
              path="/api/auth/reset-password"
              element={<PasswordReset />}
            />
            <Route path="/" element={<Home />} />
            <Route path="/api/product/:id" element={<SingleProduct />} />
            <Route path="/api/createProduct" element={<CreateProduct />} />
            <Route path="/api/createCategory" element={<CreateCategory />} />
            <Route path="/api/createOffer" element={<CreateOffer />} />
            <Route path="/api/cart" element={<Cart />} />
            <Route path="/api/search/:input" element={<SearchPage />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <Footer />
      </Provider>
    </>
  );
}

export default App;

// render={(props) => <PasswordReset {...props} />}
