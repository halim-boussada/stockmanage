import React, { useState, useEffect } from "react";
import { Modal } from "antd";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import TextField from "@mui/material/TextField";
import { toast } from "react-toastify";

const ModalCompEditF = ({
  fournisseur,
  onResponseData,
  open,
  handleCancel,
  setOpen,
}) => {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false);
  const [Phone, setPhone] = useState("");
  const [PhoneError, setPhoneError] = useState(false);
  const [Adresse, setAdresse] = useState("");
  const [AdresseError, setAdresseError] = useState(false);
  const [matriculeFiscale, setMatriculeFiscale] = useState("");
  const [matriculeFiscaleError, setMatriculeFiscaleError] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (fournisseur) {
      setName(fournisseur.name || "");
      setPhone(fournisseur.Phone || "");
      setAdresse(fournisseur.Adresse || "");
      setMatriculeFiscale(fournisseur.matriculeFiscale || "");
    }
  }, [fournisseur]);
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
          .put(
            process.env.REACT_APP_API_BASE_URL +
              `/fournisseur/update/${fournisseur.id}`,
            {
              name: name,
              phone: Phone,
              adresse: Adresse,
              matriculeFiscale: matriculeFiscale,
            }
          )
          .then((res) => {
            setLoading(false);
            onResponseData(res.data);
            setOpen(false);
            setName(res.data.name);
            setPhone(res.data.phone);
            setAdresse(res.data.adresse);
            setMatriculeFiscale(res.data.matriculeFiscale);

            toast.success("Fournisseur updated successfully");
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
        title="Edit Fournisseur"
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

export default ModalCompEditF;
