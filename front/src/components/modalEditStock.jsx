import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";

const ModalCompEdit = ({
  product,
  onResponseData,
  open,
  handleCancel,
  setOpen,
}) => {
  const [name, setName] = useState(product.name || "");
  const [nameError, setNameError] = useState(false);
  const [code, setCode] = useState(product.code || "");
  const [codeError, setCodeError] = useState(false);
  const [designation, setDesignation] = useState(product.designation || "");
  const [designationError, setDesignationError] = useState(false);
  const [stockMin, setstockMin] = useState(5);
  const [category, setCategory] = useState(product.category || "");
  const [categoryError, setCategoryError] = useState(false);
  const [prixAchatHt, setPrixAchatHt] = useState(product.prixAchatHT || "");
  const [prixAchatHtError, setPrixAchatHtError] = useState(false);
  const [prixVenteHt, setPrixVenteHt] = useState(product.prixVenteHT || "");
  const [prixVenteHtError, setPrixVenteHtError] = useState(false);
  const [margeHt, setMargeHt] = useState(product.MargeHT || "");
  const [margeHtError, setMargeHtError] = useState(false);
  const [quantity, setQuantity] = useState(product.quantite || "");
  const [quantityError, setQuantityError] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (product) {

      
      setName(product.name || "");
      setCode(product.Code || "");
      setDesignation(product.Designation || "");
      setCategory(product.Category || "");
      setPrixAchatHt(product.PrixAchatHT || "");
      setPrixVenteHt(product.PrixVenteHT || "");
      setMargeHt(product.MargeHT || "");
      setQuantity(product.Quantité || "");
      setstockMin(product.stockMin || 5);
    }
  }, [product]);
  const handleOk = () => {
    try {
      if (name === "") {
        setNameError(true);
      }
      if (category === "") {
        setCategoryError(true);
      }
      if (prixAchatHt === "") {
        setPrixAchatHtError(true);
      }
      if (prixVenteHt === "") {
        setPrixVenteHtError(true);
      }
      if (quantity === "") {
        setQuantityError(true);
      }
      if (code === "") {
        setCodeError(true);
      }
      if (designation === "") {
        setDesignationError(true);
      }
      if (margeHt === "") {
        setMargeHtError(true);
      }

      if (prixAchatHt !== "" && !/^\d+$/.test(prixAchatHt)) {
        setPrixAchatHtError(true);
      }
      if (prixVenteHt !== "" && !/^\d+$/.test(prixVenteHt)) {
        setPrixVenteHtError(true);
      }
      if (quantity !== "" && !/^\d+$/.test(quantity)) {
        setQuantityError(true);
      }
      if (margeHt !== "" && !/^\d+$/.test(margeHt)) {
        setMargeHtError(true);
      }

      if (
        name !== "" &&
        category !== "" &&
        prixAchatHt !== "" &&
        prixVenteHt !== "" &&
        quantity !== "" &&
        /^\d+$/.test(prixAchatHt) &&
        /^\d+$/.test(prixVenteHt) &&
        /^\d+$/.test(quantity) &&
        code !== "" &&
        designation !== "" &&
        margeHt !== "" &&
        /^\d+$/.test(margeHt)
      ) {
        setLoading(true);
        axios
          .put(
            process.env.REACT_APP_API_BASE_URL + `/stock/update/${product.id}`,
            {
              name: name,
              code: code,
              designation: designation,
              category: category,
              prixAchatHT: prixAchatHt,
              prixVenteHT: prixVenteHt,
              stockMin : stockMin , 
              MargeHT: margeHt,
              quantite: quantity,
            }
          )
          .then((res) => {
            setLoading(false);
            onResponseData(res.data);
            setOpen(false);
            setName(res.data.name);
            setCode(res.data.code);
            setDesignation(res.data.designation);
            setCategory(res.data.category);
            setPrixAchatHt(res.data.prixAchatHt);
            setPrixVenteHt(res.data.prixVenteHt);
            setQuantity(res.data.quantity);
            setMargeHt(res.data.margeHt);
            toast.success("Product updated successfully");
          })
          .catch((err) => {
            setLoading(false);
            console.log(err);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <>
      <Modal
        visible={open}
        title="Edit Product"
        onOk={handleOk}
        okText="Edit"
        confirmLoading={loading}
        onCancel={handleCancel}
      >
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="Name"
            variant="standard"
            value={name}
            className="w-full"
            onChange={(e) => {
              setName(e.target.value);
              setNameError(false);
            }}
            error={nameError}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="Code"
            variant="standard"
            className="w-full"
            value={code}
            onChange={(e) => {
              setCode(e.target.value);
              setCodeError(false);
            }}
            error={codeError}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="Designation"
            className="w-full"
            variant="standard"
            value={designation}
            onChange={(e) => {
              setDesignation(e.target.value);
              setDesignationError(false);
            }}
            error={designationError}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="Category"
            variant="standard"
            className="w-full"
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setCategoryError(false);
            }}
            error={categoryError}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="Prix Achat Ht"
            variant="standard"
            className="w-full"
            value={prixAchatHt}
            onChange={(e) => {
              setPrixAchatHt(e.target.value);
              setPrixAchatHtError(false);
            }}
            error={prixAchatHtError}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="Prix Vente Ht"
            className="w-full"
            variant="standard"
            value={prixVenteHt}
            onChange={(e) => {
              setPrixVenteHt(e.target.value);
              setPrixVenteHtError(false);
            }}
            error={prixVenteHtError}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="Marge Ht"
            className="w-full"
            variant="standard"
            value={margeHt}
            onChange={(e) => {
              setMargeHt(e.target.value);
              setMargeHtError(false);
            }}
            error={margeHtError}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="stockMin"
            variant="standard"
            className="w-full"
            value={stockMin}
            onChange={(e) => {
              setstockMin(e.target.value);
            }}
            error={false}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            className="w-full"
            label="Quantity"
            variant="standard"
            value={quantity}
            onChange={(e) => {
              setQuantity(e.target.value);
              setQuantityError(false);
            }}
            error={quantityError}
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalCompEdit;
