import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import ModalCompEditF from "./modalEditF";
import { message, Popconfirm } from "antd";
import axios from "axios";

export default function BasicTable({ data, fetchStock }) {
  const [editfournisseur, setEditfournisseur] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const columns = ["name", "Phone", "Adresse", "matriculeFiscale", "Action"];
  const headers = ["name", "Phone", "Adresse", "matricule Fiscale", "Action"];
  const handleEdit = (row) => {
    setEditfournisseur(row);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setEditfournisseur(null);
    setModalVisible(false);
  };
  const confirm = (row) => {
    try {
      axios
        .delete(
          process.env.REACT_APP_API_BASE_URL + `/fournisseur/delete/${row.id}`
        )
        .then(() => {
          message.success("Fournisseur deleted successfully");
          fetchStock();
        })
        .catch((error) => {
          message.error("Failed to delete Fournisseur");
          console.error(error);
        });
    } catch {
      message.error("Failed to delete Fournisseur");
    }
  };
  const cancel = (e) => {};
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {headers.map((header, index) => (
              <TableCell key={index}>{header}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, rowIndex) => (
            <TableRow
              key={rowIndex}
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                backgroundColor: "inherit",
                color: "inherit",
              }}
            >
              {columns.map((column, colIndex) => (
                <TableCell key={colIndex}>
                  {column === "Action" ? (
                    <>
                      <IconButton
                        aria-label="edit"
                        onClick={() => {
                          handleEdit(row);
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton aria-label="delete">
                        <Popconfirm
                          title="Delete the Fournisseur?"
                          description="Are you sure to delete this Fournisseur?"
                          onConfirm={() => confirm(row)}
                          onCancel={cancel}
                          okText="Yes"
                          cancelText="No"
                        >
                          <DeleteIcon />
                        </Popconfirm>
                      </IconButton>
                    </>
                  ) : (
                    row[column]
                  )}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      {editfournisseur && (
        <ModalCompEditF
          fournisseur={editfournisseur}
          onResponseData={() => {
            fetchStock();
          }}
          open={modalVisible} // Pass modalVisible as the open prop
          handleCancel={handleCloseModal}
          setOpen={setModalVisible}
        />
      )}
    </TableContainer>
  );
}
