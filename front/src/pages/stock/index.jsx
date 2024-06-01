import axios from "axios";
import { useState, React, useEffect } from "react";
import Table from "../../components/table";
import ModalComp from "../../components/modalAddStock";

const Stock = () => {
  const [stockData, setStockData] = useState([]);
  const [responseData, setResponseData] = useState(null);

  const handleResponseData = (data) => {
    setResponseData(data);
  };
  const fetchStock = async () => {
    try {
      const res = await axios.get(
        process.env.REACT_APP_API_BASE_URL + "/stock/getAll"
      );
      setStockData(
        res.data.map((item) => ({
          id: item._id,
          name: item.name,
          Code: item.code,
          Designation: item.designation,
          Category: item.category,
          PrixAchatHT: item.prixAchatHT,
          PrixVenteHT: item.prixVenteHT,
          MargeHT: item.MargeHT,
          Quantité: item.quantite,
          stockMin: item.stockMin,
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
        <ModalComp onResponseData={handleResponseData} />
      </div>
    </div>
  );
};

export default Stock;
