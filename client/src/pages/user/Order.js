import Layout from '../../components/Layout/Layout';
import React, { useState, useEffect } from "react";
import UserMenu from "../../components/Layout/UserMenu";
import axios from "axios";
import moment from "moment";
import styled from "styled-components";




// Define GlassTable component for the table with glass morphism
const GlassTable = styled.table`
  width: 100%;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  color: #fff;
  font-size: 14px;

  th,
  td {
    padding: 10px;
    text-align: center;
    vertical-align: middle;
  }

  @media (max-width: 768px) {
    font-size: 12px;
    th,
    td {
      padding: 5px;
    }
  }
`;


// Define GlassContainer component for the background image with styled-components
const GlassContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 0px;
  background-image: url('https://asset.gecdesigns.com/img/wallpapers/aesthetic-purple-orange-beautiful-nature-desktop-wallpaper-sr10012413-1706503295947-cover.webp');
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    padding: 10px;
  }
`;





const GlassCardContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 20px;

  @media (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    gap: 15px;
  }

  @media (max-width: 480px) {
   display: flex;
   
   font-size: 8px;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 10px;
  }
`;





// Updated GlassCard for better image handling and responsiveness
const GlassCard = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  img {
    width: 100%; 
    aspect-ratio: 4 / 3; // Maintain consistent proportions
    border-radius: 5px;
    margin-bottom: 10px;
    object-fit: cover; 
  }

  .card-details {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
  }

  p {
    margin: 5px 0;
    color: #fff;
    font-size: 14px;
    text-align: center;
  }

  @media (max-width: 768px) {
    img {
      aspect-ratio: 4 / 3; 
    }
    p {
      font-size: 12px;
    }
  }

  @media (max-width: 480px) {
    img {
      aspect-ratio: 4 / 3; // Square ratio for very small screens
    }
  }
`;
// UserMenu responsiveness
const UserMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 10px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-around;
  }

  a {
    color: #fff;
    text-decoration: none;
    margin: 5px 0;

    @media (max-width: 768px) {
      margin: 5px;
    }
  }
`;


const Orders = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const getOrders = async () => {
      try {
        const { data } = await axios.get("/api/v1/user/orders");
        setOrders(data);
      } catch (error) {
        console.log(error);
      }
    };

    getOrders();
  }, []);

  return (
    <Layout title={"Your Orders"}>
      <GlassContainer>
        <div className="row dashboard">
          <div className="col-md-3">
            <UserMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center text-white">All Orders</h1>
            {orders?.map((o, i) => (
              <GlassTable className="table" key={o._id}>
                <thead>
                  <tr>
                    <th scope="col">#</th>
                    <th scope="col">Status</th>
                    <th scope="col">Buyer</th>
                    <th scope="col">Date</th>
                    <th scope="col">Payment</th>
                    <th scope="col">Quantity</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{i + 1}</td>
                    <td>{o?.status}</td>
                    <td>{o?.buyer?.name}</td>
                    <td>{moment(o?.createdAt).format("DD MMM YYYY, h:mm A")}</td>
                    <td>{o?.payment?.success ? "Success" : "Failed"}</td>
                    <td>{o?.products?.length}</td>
                  </tr>
                </tbody>
                <GlassCardContainer>
  {o?.products?.map((f) => (
    <GlassCard className="card" key={f._id}>
      <img
        src={f.photos[0]}
        alt={f.name}
      />
      {/* <div className="card-details">
        <p>{f.name}</p>
        <p>Price: {f.price}</p>
      </div> */}
       <p>{f.name}</p>
       <p>Price: {f.price}</p>
    </GlassCard>
  ))}
</GlassCardContainer>
              </GlassTable>
            ))}
          </div>
        </div>
      </GlassContainer>
    </Layout>
  );
};

export default Orders;
