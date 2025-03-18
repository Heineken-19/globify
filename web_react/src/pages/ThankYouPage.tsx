import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const ThankYouPage = () => {
  const [message, setMessage] = useState("Fizetés feldolgozása...");
  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => {
      setMessage("Fizetés sikeresen teljesítve! Köszönjük a vásárlást.");
      setTimeout(() => navigate("/"), 3000); // 3 másodperc után vissza a főoldalra
    }, 1000);
  }, [navigate]);

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h1>{message}</h1>
    </div>
  );
};

export default ThankYouPage;
