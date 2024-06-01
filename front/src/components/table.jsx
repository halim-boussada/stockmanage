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
import ModalCompEdit from "../components/modalEditStock";
import { message, Popconfirm } from "antd";
import axios from "axios";

export default function BasicTable({ data, fetchStock }) {
  const [editProduct, setEditProduct] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const columns = [
    "name",
    "Code",
    "Designation",
    "Category",
    "PrixAchatHT",
    "PrixVenteHT",
    "MargeHT",
    "Quantité",
    "stockMin",
    "Action", // New action column
  ];
  const headers = [
    "Nom",
    "Code",
    "Designation",
    "Catégorie",
    "Prix Achat HT",
    "Prix Vente HT",
    "Marge HT",
    "Quantité",
    "stockMin",
    "Action", // New action header
  ];
  const handleEdit = (row) => {
    setEditProduct(row);
    setModalVisible(true);
  };
  const handleCloseModal = () => {
    setEditProduct(null);
    setModalVisible(false);
  };
  const confirm = (row) => {
    try {
      axios
        .delete(process.env.REACT_APP_API_BASE_URL + `/stock/delete/${row.id}`)
        .then(() => {
          message.success("Product deleted successfully");
          fetchStock();
        })
        .catch((error) => {
          message.error("Failed to delete product");
          console.error(error);
        });
    } catch {
      message.error("Failed to delete product");
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
                backgroundColor: row.Quantité <= row.stockMin ? "#ff5252" : "inherit",
                color: row.Quantité <= row.stockMin ? "white" : "inherit",
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
                          title="Delete the product?"
                          description="Are you sure to delete this product?"
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
      {editProduct && (
        <ModalCompEdit
          product={editProduct}
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
