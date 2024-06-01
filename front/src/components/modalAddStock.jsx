import React, { useState } from "react";
import { Button, Modal, Space } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";

const ModalComp = ({ onResponseData }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [code, setCode] = useState("");
  const [codeError, setCodeError] = useState(false);
  const [designation, setDesignation] = useState("");
  const [designationError, setDesignationError] = useState(false);
  const [category, setCategory] = useState("");
  const [categoryError, setCategoryError] = useState(false);
  const [prixAchatHt, setPrixAchatHt] = useState("");
  const [prixAchatHtError, setPrixAchatHtError] = useState(false);
  const [prixVenteHt, setPrixVenteHt] = useState("");
  const [prixVenteHtError, setPrixVenteHtError] = useState(false);
  const [stockMin, setstockMin] = useState(5);
  const [margeHt, setMargeHt] = useState("");
  const [margeHtError, setMargeHtError] = useState(false);
  const [quantity, setQuantity] = useState("");
  const [quantityError, setQuantityError] = useState(false);
  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
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
        toast.error("Price must be a number");
      }
      if (prixVenteHt !== "" && !/^\d+$/.test(prixVenteHt)) {
        setPrixVenteHtError(true);
        toast.error("Price must be a number");
      }
      if (quantity !== "" && !/^\d+$/.test(quantity)) {
        setQuantityError(true);
        toast.error("Quantity must be a number");
      }
      if (margeHt !== "" && !/^\d+$/.test(margeHt)) {
        setMargeHtError(true);
        toast.error("Marge must be a number");
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
          .post(process.env.REACT_APP_API_BASE_URL + "/stock/create", {
            name: name,
            code: code,
            designation: designation,
            category: category,
            prixAchatHT: prixAchatHt,
            prixVenteHT: prixVenteHt,
            MargeHT: margeHt,
            stockMin : stockMin,
            quantite: quantity,
          })
          .then((res) => {
            if (res.data.message === "Code already exist") {
              setLoading(false);
              setCodeError(true);
              toast.error("Code already exist");
              return;
            }
            setLoading(false);
            onResponseData(res.data);
            setOpen(false);
            setName("");
            setCategory("");
            setPrixAchatHt("");
            setPrixVenteHt("");
            setstockMin(5)
            setQuantity("");
            setCode("");
            setMargeHt("");
            setDesignation("");
            toast.success("Stock added successfully");
          })
          .catch((err) => {
            console.log(err);
            setLoading(false);
          });
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };
  return (
    <>
      <Space>
        <Button type="primary" onClick={showModal}>
          Add Stock
        </Button>
      </Space>
      <Modal
        open={open}
        title="Create a new stock"
        onOk={handleOk}
        okText="Save"
        loading={loading}
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

export default ModalComp;
