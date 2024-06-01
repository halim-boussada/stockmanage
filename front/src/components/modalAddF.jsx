import React, { useState } from "react";
import { Button, Modal, Space } from "antd";
import axios from "axios";
import { toast } from "react-toastify";
import TextField from "@mui/material/TextField";

const ModalCompF = ({ onResponseData }) => {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [Phone, setPhone] = useState("");
  const [PhoneError, setPhoneError] = useState(false);
  const [Adresse, setAdresse] = useState("");
  const [AdresseError, setAdresseError] = useState(false);
  const [matriculeFiscale, setMatriculeFiscale] = useState("");
  const [matriculeFiscaleError, setMatriculeFiscaleError] = useState(false);

  const [loading, setLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };
  const handleOk = () => {
    try {
      if (name === "") {
        setNameError(true);
        toast.error("Name is required");
      }
      if (Phone === "") {
        setPhoneError(true);
        toast.error("Phone is required");
      }
      if (Adresse === "") {
        setAdresseError(true);
        toast.error("Adresse is required");
      }
      if (matriculeFiscale === "") {
        setMatriculeFiscaleError(true);
        toast.error("Matricule Fiscale is required");
      }

      if (Phone !== "" && !/^\d+$/.test(Phone)) {
        setPhoneError(true);
        toast.error("Phone must be a number");
      }

      if (
        name !== "" &&
        Phone !== "" &&
        Adresse !== "" &&
        matriculeFiscale !== "" &&
        /^\d+$/.test(Phone)
      ) {
        setLoading(true);
        axios
          .post(process.env.REACT_APP_API_BASE_URL + "/fournisseur/create", {
            name: name,
            phone: Phone,
            adresse: Adresse,
            matriculeFiscale: matriculeFiscale,
          })
          .then((res) => {
            if (res.status === 200) {
              setLoading(false);
              onResponseData(res.data);
              setOpen(false);
              setName("");
              setPhone("");
              setAdresse("");
              setMatriculeFiscale("");

              toast.success("Fournisseur added successfully");
            } else {
              toast.error("Failed to add Fournisseur");
            }
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
          Add Fournisseur
        </Button>
      </Space>
      <Modal
        open={open}
        title="Create a new  Fournisseur"
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
            label="Phone"
            variant="standard"
            value={Phone}
            className="w-full"
            onChange={(e) => {
              setPhone(e.target.value);
              setPhoneError(false);
            }}
            error={PhoneError}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="Adresse"
            variant="standard"
            value={Adresse}
            className="w-full"
            onChange={(e) => {
              setAdresse(e.target.value);
              setAdresseError(false);
            }}
            error={AdresseError}
          />
        </div>
        <div className="mb-4">
          <TextField
            id="standard-basic"
            label="Matricule Fiscale"
            variant="standard"
            value={matriculeFiscale}
            className="w-full"
            onChange={(e) => {
              setMatriculeFiscale(e.target.value);
              setMatriculeFiscaleError(false);
            }}
            error={matriculeFiscaleError}
          />
        </div>
      </Modal>
    </>
  );
};

export default ModalCompF;
