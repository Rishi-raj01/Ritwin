import React,{useState,useEffect} from 'react'
import Layout from '../../components/Layout/Layout'
import { useAuth } from '../../context/auth';
import { toast } from 'react-toastify';
import axios from "axios";
import "../../styles/ProfileStyle.css"; // Import your custom CSS for styling

const Profile = () => {
  const [auth, setAuth] = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (auth?.user) {
      const { email, name, phone, address } = auth.user;
      setName(name || "");
      setPhone(phone || "");
      setEmail(email || "");
      setAddress(address || "");
    }
  }, [auth?.user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userData = { name, email, phone, location: address }; // Change address to location
      if (password.trim() !== "") {
        userData.password = password;
      }
  
      const { data } = await axios.put("/api/v1/user/profile", userData, { withCredentials: true });
      if (data?.error) {
        toast.error(data.error);
      } else {
        setAuth({ ...auth, user: data?.updatedUser });
        let ls = localStorage.getItem("auth");
        ls = JSON.parse(ls);
        ls.user = data.updatedUser;
        localStorage.setItem("auth", JSON.stringify(ls));
        toast.success("Profile Updated Successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  

  return (
    <Layout title={"Your Profile"}>
      <div className="container-fluid profile-container d-flex">
       
          <div className="col-md-8">
          
            <div className="form-container d-flex  " style={{border:"none"}}>
              <form onSubmit={handleSubmit} className="profile-form">
                <h4 className="title">USER PROFILE</h4>
                <div className="form-group" >
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="form-control"
                    placeholder="Enter Your Name"
                    autoFocus
                    style={{backgroundColor:"rgba(0,0,0,0.001)" ,color:"white"}}
                    
                  />
                </div>
                <div className="form-group">
                  <input
                    type="email"
                    value={email}
                    className="form-control"
                    placeholder="Enter Your Email"
                    disabled
                    style={{backgroundColor:"rgba(0,0,0,0.001)"}}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="form-control"
                    placeholder="Enter New Password"
                    style={{backgroundColor:"rgba(0,0,0,0.001)",color:"white"}}
                  />
                </div>
                <div className="form-group">
                  <input
                    type="number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="form-control "
                    placeholder="Enter Your Phone"
                    style={{backgroundColor:"rgba(0,0,0,0.001)",color:"white"}}
                  />
                </div>
                <div className="form-group">
                <input
                type="text"
               value={address}
               onChange={(e) => setAddress(e.target.value)}
                 className="form-control"
                  placeholder="Enter Your Address"
                  style={{backgroundColor:"rgba(0,0,0,0.001)",color:"white"}}
/>

                </div>

                <button type="submit" className="btn btn-primary btn-block">
                  UPDATE
                </button>
              </form>
            </div>
          </div>
        </div>
     <style>{
      `/* General styling for the form */
.profile-container {
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.profile-form {
  width: 100%;
  max-width: 600px;
  margin: auto;
  padding: 20px;
  border-radius: 10px;
}

.form-group input {
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.btn-block {
  width: 100%;
  padding: 10px;
  font-size: 16px;
  border-radius: 5px;
}

/* Responsive styling */
@media (max-width: 768px) {
  .profile-container {
    padding: 15px;
    flex-direction: column;
  }

  .profile-form {
    padding: 15px;
  }

  .form-group input {
    padding: 10px;
  }

  .btn-block {
    padding: 10px;
    font-size: 14px;
  }
}

@media (max-width: 480px) {
  .profile-container {
    padding: 10px;
    flex-direction: column;
  }

  .profile-form {
    padding: 10px;
    max-width: 90%; /* Adjust form width for smaller screens */
  }

  .title {
    font-size: 18px;
    text-align: center;
    margin-bottom: 15px;
  }

  .form-group input {
    padding: 8px;
    font-size: 14px;
  }

  .btn-block {
    padding: 8px;
    font-size: 14px;
  }
}
`}</style>
    </Layout>
  );
};

export default Profile;
