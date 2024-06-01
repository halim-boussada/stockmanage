import axios from "axios";
import { useState, React, useEffect } from "react";
import Table from "../../components/tableF";
import ModalCompF from "../../components/modalAddF";
const Frounisseur = () => {
  const [stockData, setStockData] = useState([]);
  const [responseData, setResponseData] = useState(null);

  const handleResponseData = (data) => {
    setResponseData(data);
  };
  const fetchStock = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/fournisseur/getAll"
      );
      setStockData(
        res.data.map((item) => ({
          id: item._id,
          name: item.name,
          Phone: item.phone,
          Adresse: item.adresse,
          matriculeFiscale: item.matriculeFiscale,
        }))
      );
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    fetchStock();
  }, [responseData]);
  return (
    <div className="w-full h-full  p-4">
      <div className="w-full h-full  p-4">
        <Table data={stockData} fetchStock={fetchStock} />
      </div>
      <div className="absolute top-5 right-10">
        <ModalCompF onResponseData={handleResponseData} />
      </div>
    </div>
  );
};

export default Frounisseur;
