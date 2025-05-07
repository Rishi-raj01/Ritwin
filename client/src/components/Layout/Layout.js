import React from 'react'
import '../../index.css'; 
import Header from './Header'
import Footer from './Footer'
import {Helmet} from "react-helmet"
import { ToastContainer } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css"
const Layout = ({children,title,description, keywords, author}) => {
  return (
    <div>
       <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <title>{title}</title>
      </Helmet>
      <Header/>
      <main style={{ minHeight: "100vh" }}>        {/* background:"rgba(0,0,0,0.3)" */}    
        <ToastContainer />
        {children}
      </main>
         <Footer/>
      
    </div>
  )
}

Layout.defaultProps = {
    title: "Ritwin app",
    description: "Best Handmade Gift Company",
    keywords: "e-commerce, buy, sell,gift,handmade ,crochet,birthday,cards,keychain,keychains,customised gift,custom handmade,custom",
    author: "Rishi Raj",
  };

export default Layout

