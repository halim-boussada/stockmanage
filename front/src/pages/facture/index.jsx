import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./style.css";
import { Modal } from "antd";

const Facture = () => {
  const [toUser, setToUser] = useState("");
  const [toUserError, setToUserError] = useState("");
  const [fromUser, setFromUser] = useState("");
  const [fromUserError, setFromUserError] = useState("");
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentMethodError, setPaymentMethodError] = useState("");
  const [giveRemise, setGiveRemise] = useState(false);
  const [Remise, setRemise] = useState("");
  const [RemiseError, setRemiseError] = useState("");
  const [timbreF, setTimbreF] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [options, setOptions] = useState([
    {
      value: "",
      code: "",
      label: "",
      designation: "",
      category: "",
      prixAchatHT: "",
      prixVenteHT: "",
      MargeHT: "",
      quantite: "",
    },
  ]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [productQuantities, setProductQuantities] = useState({});
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const showModal = (e) => {
    e.preventDefault();
    if (toUser === "") {
      setToUserError("To User is required");
      toast.error("User is required");
      return;
    }
    if (fromUser === "") {
      setFromUserError("From User is required");
      toast.error("From User is required");
      return;
    }
    if (selectedProducts.length === 0) {
      toast.error("Please select at least one product");

      return;
    }

    if (paymentMethod === "") {
      setPaymentMethodError("Payment Method is required");
      toast.error("Payment Method is required");
      return;
    }
    if (giveRemise && Remise === "") {
      setRemiseError("Remise is required");
      toast.error("Remise is required");
      return;
    }

    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    const User = JSON.parse(localStorage.getItem("user"));
    if (!User) {
      navigate("/");
    }
  }, [navigate]);

  const getFacture = async (id) => {
    try {
      const response = await axios.get(
        process.env.REACT_APP_API_BASE_URL + `/facture/get/${id}`
      );
      const factureData = response.data;

      const pdfResponse = await axios.post(
        process.env.REACT_APP_API_BASE_URL + "/pdf/get",
        {
          content: [
            {
              to: toUser,
              from: fromUser,
              factureId: response.data._id,
              count: response.data.count,
              PaimentMethod: paymentMethod,
              giveRemise: giveRemise,
              Remise: Remise,
              timbreFiscal: timbreF,
              products: factureData.products,
            },
          ],
        },
        { responseType: "blob" }
      );

      const blob = new Blob([pdfResponse.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "facture.pdf");

      document.body.appendChild(link);
      link.click();

      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.log(error);
    }
  };

  const onButtonClick = async (e) => {
    e.preventDefault();
    try {
      if (Object.keys(productQuantities).length === 0) {
        toast.error("Please enter quantity for selected products");
        return;
      }
      setLoading(true);
      const response = await axios.post(
        "http://localhost:3637/facture/create",
        {
          to: toUser,
          from: fromUser,
          PaimentMethod: paymentMethod,
          Remise: Remise,
          giveRemise: giveRemise,
          timbreFiscal: timbreF,
          products: selectedProducts.map((product) => ({
            _id: product.value,
            code: product.code,
            designation: product.designation,
            category: product.category,
            prixAchatHT: product.prixAchatHT,
            prixVenteHT: product.prixVenteHT,
            MargeHT: product.MargeHT,
            quantite: productQuantities[product.value],
          })),
        }
      );
      if (response.data.msg === "Out of stock") {
        toast.error("Out of stock");
        setLoading(false);

        return;
      } else {
        toast.success("Facture created successfully");
        setToUser("");
        setFromUser("");
        setSelectedProducts([]);
        setProductQuantities({});
        setLoading(false);
        setPaymentMethod("");
        setRemise("");
        setIsModalOpen(false);
        getFacture(response.data._id);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleQuantityChange = (productId, quantity) => {
    setProductQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };
  const searchProduct = (inputValue) => {
    axios
      .post("http://localhost:3637/stock/search", {
        search: inputValue.target.value,
      })
      .then((res) => {
        const filteredOptions = res.data.filter(
          (item) =>
            !selectedProducts.find((selected) => selected.value === item._id)
        );

        setOptions(
          filteredOptions.map((item) => ({
            value: item._id,
            label: item.name,
            code: item.code,
            designation: item.designation,
            category: item.category,
            prixAchatHT: item.prixAchatHT,
            prixVenteHT: item.prixVenteHT,
            MargeHT: item.MargeHT,
            quantite: item.quantite,
          }))
        );
        setShowOptions(true);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleOptionSelect = (option) => {
    setSelectedProducts([...selectedProducts, option]);
    setShowOptions(false);
  };

  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      <div className="bg-gray-100 flex rounded-2xl shadow-lg w-full max-w-2xl p-10 items-center">
        <div className="w-full px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#002D74] text-center mb-5">
            Facture
          </h2>

          <form className="flex flex-col gap-4 w-full">
            <input
              type="text"
              placeholder="User"
              value={toUser}
              onChange={(e) => {
                setToUser(e.target.value);
                setToUserError("");
              }}
              className={`p-2 rounded-xl border text-sm w-full ${
                toUserError ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              type="text"
              placeholder="From User"
              value={fromUser}
              onChange={(e) => {
                setFromUser(e.target.value);
                setFromUserError("");
              }}
              className={`p-2 rounded-xl border text-sm w-full ${
                fromUserError ? "border-red-500" : "border-gray-300"
              }`}
            />
            <input
              type="text"
              placeholder="Product"
              onChange={searchProduct}
              className={`p-2 rounded-xl border text-sm w-full`}
            />
            {showOptions && options.length > 0 && (
              <div className="options-container w-full">
                {options.map((option) => (
                  <div
                    key={option.value}
                    className="option"
                    onClick={() => handleOptionSelect(option)}
                  >
                    {option.label}
                  </div>
                ))}
              </div>
            )}
            <div className="flex flex-col gap-4 w-full">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  value={giveRemise}
                  className="mr-2"
                  onChange={(e) => setGiveRemise(e.target.checked)}
                  style={{ marginRight: "10px" }}
                />
                <label>Give Remise</label>
              </div>
              <input
                type="text"
                placeholder="Remise"
                value={Remise}
                onChange={(e) => {
                  setRemise(e.target.value);
                  setRemiseError("");
                }}
                className={`p-2 rounded-xl border text-sm w-full`}
                disabled={!giveRemise}
              />
            </div>
            <select
              value={paymentMethod}
              className={`p-2 rounded-xl border text-sm w-full`}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setPaymentMethodError("");
              }}
            >
              <option value="">Select Payment Method</option>
              <option value="Cash">Cash</option>
              <option value="Cheque">Cheque</option>
              <option value="Bon de Dommande">Bon De Commande</option>
            </select>
            <div className="w-full">
              <input
                type="checkbox"
                value={timbreF}
                onChange={(e) => setTimbreF(e.target.checked)}
                style={{ marginRight: "10px" }}
              />
              <label>Timbre Fiscale</label>
            </div>
            <button
              onClick={(e) => showModal(e)}
              className="bg-[#002D74] rounded-xl text-white py-3 hover:bg-[#001F56] transition-transform transform hover:scale-105 duration-300 w-full"
            >
              Set The Quantity Of Products{" "}
              {selectedProducts.length > 0 && `(${selectedProducts.length})`}
            </button>
          </form>
        </div>
      </div>
      <Modal
        title="Set Quantity of Products"
        open={isModalOpen}
        onOk={(e) => onButtonClick(e)}
        onCancel={handleCancel}
      >
        {selectedProducts.length > 0 &&
          selectedProducts.map((product, index) => (
            <div className="row-input-q w-full mb-4" key={index}>
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div
                    className="delete cursor-pointer mr-2 text-red-600 italic"
                    onClick={() =>
                      setSelectedProducts([
                        ...selectedProducts.filter(
                          (item) => item.value !== product.value
                        ),
                      ])
                    }
                  >
                    X
                  </div>
                  <div className="label mr-4">{product.label}</div>
                </div>
                <input
                  className="p-2 rounded-xl border text-sm w-1/2"
                  type="number"
                  placeholder="Quantity"
                  value={productQuantities[product.value] || ""}
                  onChange={(e) =>
                    handleQuantityChange(product.value, e.target.value)
                  }
                />
              </div>
            </div>
          ))}
      </Modal>
    </section>
  );
};

export default Facture;
