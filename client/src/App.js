import {Routes,Route} from "react-router-dom"
import { ToastContainer,toast } from 'react-toastify';
  import 'react-toastify/dist/ReactToastify.css';
import HomePage from "./pages/HomePage";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Policy from "./pages/Policy";
import Pagenotfound from "./pages/Pagenotfound";
import Register from "./pages/Auth/Register";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/user/Dashboard";
import PrivateRoute from "./components/Layout/Routes/Private";
import AdminRoute from "./components/Layout/Routes/AdminRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import CreateCategory from "./pages/Admin/CreateCategory";
import CreateProduct from "./pages/Admin/CreateProduct";
import User from "./pages/Admin/User";
import Order from "./pages/user/Order";
import Profile from "./pages/user/Profile";
import Products from "./pages/Admin/Products";
import UpdateProduct from "./pages/Admin/UpdateProduct";
import Search from "./pages/Search";
import ProductDetails from "./pages/ProductDetail";
import Categories from "./pages/Categories";
import ProductCategory from "./pages/CategoryProduct";
import CartPage from "./pages/CartPage";
import AdminOrders from "./pages/Admin/AdminOrder";
import UserOrders from "./pages/Admin/UserOrders";
import ResetPassword from "./pages/ResetPassword";
import Forgetpassword from "./pages/Auth/ForgetPassword";
import CreateReview from "./pages/createReview";
import Success from "./pages/Success";
import Failure from "./pages/Failure";

function App() {
  return (
   <>
   <Routes>
<Route  path="/" element={<HomePage/>}/>
<Route path="/product/:slug" element={<ProductDetails/>} />
<Route path="/search" element={<Search/>} />
<Route path="/categories" element={<Categories/>} />
<Route path="/cart" element={<CartPage/>} />
<Route path="/category/:slug" element={<ProductCategory/>} />
<Route path="/user/resetpassword/:token" element={<ResetPassword />} />
<Route  path="/forget-password" element={<Forgetpassword/>}/>
<Route  path="/success" element={<Success/>}/>
<Route  path="/failure" element={<Failure/>}/>



<Route path="/dashboard" element={<PrivateRoute/>}>
<Route  path="user" element={<Dashboard/>}/>
<Route  path="user/orders" element={<Order/>}/>
<Route  path="user/profile" element={<Profile/>}/>
<Route path="user/create-review/:slug" element={<CreateReview />} />
</Route>


<Route path="/dashboard" element={<AdminRoute/>}>
<Route path="admin" element={<AdminDashboard/>}></Route>
<Route path="admin/create-category" element={<CreateCategory/>}></Route>
<Route path="admin/create-product" element={<CreateProduct/>}></Route>
<Route path="admin/products" element={<Products/>}></Route>
<Route path="admin/product/:slug" element={<UpdateProduct/>}></Route>
<Route path="admin/users" element={<User/>}></Route>
<Route path="admin/orders" element={<AdminOrders/>}></Route>
<Route path="admin/users/user-orders/:userId" element={<UserOrders/>}></Route>


</Route>
<Route  path="/about" element={<About/>}/>
<Route  path="/register" element={<Register/>}/>
<Route  path="/login" element={<Login/>}/>
<Route  path="/contact" element={<Contact/>}/>
<Route  path="/policy" element={<Policy/>}/>
<Route  path="*" element={<Pagenotfound/>}/>

   </Routes>
   </>
  );
}

export default App;
