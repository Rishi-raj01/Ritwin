import React, { useState, useEffect } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import AdminMenu from "../../components/Layout/AdminMenu";
import Layout from "../../components/Layout/Layout";
import { useAuth } from "../../context/auth";
import moment from "moment";
import { Select } from "antd";
import styled from "styled-components";

const { Option } = Select;

// Styled Components
const GlassContainer = styled.div`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  background-image: url("https://asset.gecdesigns.com/img/wallpapers/aesthetic-purple-orange-beautiful-nature-desktop-wallpaper-sr10012413-1706503295947-cover.webp");
  background-size: cover;
  background-position: center;
  min-height: 100vh;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const GlassTable = styled.div`
  background: rgba(0, 0, 0, 0.2);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  overflow-x: auto;

  table {
    width: 100%;
    border-collapse: collapse;
  }

  th,
  td {
    padding: 10px;
    text-align: center;
    color: white;
  }

  th {
    background: rgba(0, 0, 0, 0.3);
  }

  td {
    background: rgba(255, 255, 255, 0.1);
  }

  .ant-select {
    width: 100%;
  }

  @media (max-width: 768px) {
    th:nth-child(3),
    th:nth-child(4),
    th:nth-child(6),
    td:nth-child(3),
    td:nth-child(4),
    td:nth-child(6) {
      display: none;
    }
  }
`;

const GlassCard = styled.div`
  background: rgba(255, 255, 255, 0.3);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex;
  align-items: center;

  .image-container {
    width: 120px;
    height: 120px;
    flex-shrink: 0;
    overflow: hidden;
    border-radius: 5px;
    margin-right: 15px;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .details {
    flex: 1;
    color: white;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;

    .image-container {
      margin: 0 auto 10px auto;
    }
  }
`;

const StatusButton = styled.div`
  position: relative;

  button {
    background: rgba(255, 255, 255, 0.2);
    color: white;
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;
    width: 100%;
    text-align: center;

    &:hover {
      background: rgba(255, 255, 255, 0.3);
    }
  }

  ul {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: rgba(0, 0, 0, 0.8);
    border-radius: 5px;
    list-style: none;
    margin: 5px 0 0 0;
    padding: 5px 0;
    display: ${({ isOpen }) => (isOpen ? "block" : "none")};
    z-index: 10;

    li {
      padding: 5px 10px;
      cursor: pointer;
      color: white;

      &:hover {
        background: rgba(255, 255, 255, 0.2);
      }
    }
  }
`;

const AdminOrders = () => {
  const [status] = useState(["Not Processed", "Processing", "Shipped", "Delivered", "Cancelled"]);
  const [orders, setOrders] = useState([]);
  const [auth] = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState({});

  useEffect(() => {
    if (auth?.token) getOrders();
  }, [auth?.token]);

  const getOrders = async () => {
    try {
      const { data } = await axios.get("/api/v1/user/all-orders");
      setOrders(data);
    } catch (error) {
      toast.error("Error fetching orders!");
      console.error(error);
    }
  };

  const handleChange = async (orderId, value) => {
    try {
      await axios.put(`/api/v1/user/order-status/${orderId}`, { status: value });
      toast.success("Order status updated!");
      getOrders();
    } catch (error) {
      toast.error("Failed to update status!");
      console.error(error);
    }
  };

  const toggleDropdown = (id) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <Layout title={"All Orders Data"}>
      <GlassContainer>
        <div className="row dashboard">
          <div className="col-md-3">
            <AdminMenu />
          </div>
          <div className="col-md-9">
            <h1 className="text-center text-white">All Orders</h1>
            {orders.length === 0 ? (
              <h4 className="text-center text-white">No orders found.</h4>
            ) : (
              orders.map((order, index) => (
                <GlassTable key={order._id}>
                  <table>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Status</th>
                        <th>Buyer</th>
                        <th>Date</th>
                        <th>Payment</th>
                        <th>Quantity</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>{index + 1}</td>
                        <td>
                          <StatusButton isOpen={dropdownOpen[order._id]}>
                            <button onClick={() => toggleDropdown(order._id)}>
                              {order?.status || "Select Status"}
                            </button>
                            <ul>
                              {status.map((s) => (
                                <li
                                  key={s}
                                  onClick={() => {
                                    handleChange(order._id, s);
                                    toggleDropdown(order._id);
                                  }}
                                >
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </StatusButton>
                        </td>
                        <td>{order?.buyer?.name}</td>
                        <td>{moment(order?.createdAt).fromNow()}</td>
                        <td>{order?.payment?.success ? "Success" : "Failed"}</td>
                        <td>{order?.products?.length}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="container">
                    {order?.products?.map((product) => (
                      <GlassCard key={product._id}>
                        <div className="image-container">
                          <img
                           // src={`/api/v1/product/get-photos/${product._id}`}
                           src={product.photos[0]}
                            alt={product.name}
                          />
                        </div>
                        <div className="details">
                          <p>{product.name}</p>
                          {/* <p>{product.description?.substring(0, 30)}...</p> */}
                          <p>Price: ₹{product.price}</p>
                          <p> Delivery place: {order.buyer.location}</p>
                          <p>Contact:{order.buyer.phone}</p>
                        </div>
                      </GlassCard>
                    ))}
                  </div>
                </GlassTable>
              ))
            )}
          </div>
        </div>
      </GlassContainer>
    </Layout>
  );
};

export default AdminOrders;