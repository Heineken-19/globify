import { useNavigate } from "react-router-dom";

const CancelPage = () => {
  const navigate = useNavigate();

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h1>A fizetés megszakadt</h1>
      <p>Úgy tűnik, hogy nem fejezted be a vásárlást.</p>
      <button onClick={() => navigate("/cart")}>Vissza a főoldalra</button>
    </div>
  );
};

export default CancelPage;
