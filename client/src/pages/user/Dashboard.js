import React from 'react'
import Layout from '../../components/Layout/Layout'
import UserMenu from '../../components/Layout/UserMenu'
import { useAuth } from '../../context/auth'




const Dashboard = () => {
  const [auth] = useAuth();
  const defaultProfilePictureLink = "https://example.com/default-profile-picture.jpg";
  const backgroundImageUrl = "https://asset.gecdesigns.com/img/wallpapers/starry-night-sky-reflection-background-hd-wallpaper-sr10012425-1705222416280-cover.webp";

  const dashboardStyle = {
    backgroundImage: `url(${backgroundImageUrl})`,
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    minHeight: "100vh",
  };

  const cardStyle = {
    backgroundColor: "rgba(255, 255, 255, 0.05)", // semi-transparent white background
    color: "white", // default text color
    borderRadius: "8px", // rounded corners
    padding: "20px",
  };

  return (
    <Layout title={"Dashboard - Ritwin App"}>
      <div className="container-fluid m-3 p-3 dashboard" style={dashboardStyle}>
        <div className="row">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <div className="card w-75" style={cardStyle}>
              <div className="d-flex align-items-center mb-3">
                <img
                  src={auth?.user?.profilePicture || defaultProfilePictureLink}
                  alt="Profile"
                  className="rounded-circle me-3"
                  style={{ width: 50, height: 50 }}
                />
                <div>
                  <h3>{auth?.user?.name}</h3>
                  <p>{auth?.user?.email}</p>
                  <p>{auth?.user?.address}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
