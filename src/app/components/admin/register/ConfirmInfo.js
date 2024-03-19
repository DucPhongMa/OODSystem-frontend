import React from "react";
import { Grid, Box } from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { selectedFileAtom } from "../../../../../store";
import { selectedLogoAtom } from "../../../../../store";
import { useAtom } from "jotai";

function createData(field, value) {
  return { field, value };
}

function ConfirmInfo({ formData, setFormData }) {
  const [selectedFile, setSelectedFile] = useAtom(selectedFileAtom);
  const [selectedLogo, setSelectedLogo] = useAtom(selectedLogoAtom);

  const categoriesString = formData.categories
    .map((category) => {
      const itemsString = category.items
        .map((item) => `${item.name}: ${item.price}`)
        .join(", ");
      return `${category.name}: ${itemsString}`;
    })
    .join("\n");

  const rows = [
    createData("Email", formData.email),
    createData("Restaurant Name", formData.name),
    createData("Restaurant Route", formData.route),
    createData("Address", formData.restaurant_contact.address),
    createData("City", formData.restaurant_contact.city),
    createData("Province / State", formData.restaurant_contact.provinceOrState),
    createData("Postal Code", formData.restaurant_contact.postalCode),
    createData("Phone Number", formData.restaurant_contact.phone),
    createData(
      "Restaurant Banner Image",
      selectedFile == null ? "No banner file selected" : selectedFile.name
    ),
    createData(
      "Restaurant Logo Image",
      selectedLogo == null ? "No logo file selected" : selectedFile.name
    ),
    createData("Mon Opening Time", formData.hours["monday"]["open"]),
    createData("Mon Closing Time", formData.hours["monday"]["close"]),
    createData("Tue Opening Time", formData.hours["tuesday"]["open"]),
    createData("Tue Closing Time", formData.hours["tuesday"]["close"]),
    createData("Wed Opening Time", formData.hours["wednesday"]["open"]),
    createData("Wed Closing Time", formData.hours["wednesday"]["close"]),
    createData("Thu Opening Time", formData.hours["thursday"]["open"]),
    createData("Thu Closing Time", formData.hours["thursday"]["close"]),
    createData("Fri Opening Time", formData.hours["friday"]["open"]),
    createData("Fri Closing Time", formData.hours["friday"]["close"]),
    createData("Sat Opening Time", formData.hours["saturday"]["open"]),
    createData("Sat Closing Time", formData.hours["saturday"]["close"]),
    createData("Sun Opening Time", formData.hours["sunday"]["open"]),
    createData("Sun Closing Time", formData.hours["sunday"]["close"]),
    createData("Restaurant Theme", formData.restaurantTheme.name),
    createData("Menu", categoriesString),
  ];

  return (
    <Box sx={{ mt: 3 }}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TableContainer
            component={Paper}
            sx={{ maxHeight: 300, overflow: "auto" }}
          >
            <Table sx={{ minWidth: 250 }} aria-label="simple table">
              <TableBody>
                {rows.map((row) => (
                  <TableRow
                    key={row.field}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      sx={{ fontSize: "0.8rem" }}
                    >
                      {row.field}
                    </TableCell>
                    <TableCell align="right" sx={{ fontSize: "0.8rem" }}>
                      {row.value}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Grid>
      </Grid>
    </Box>
  );
}

export default ConfirmInfo;
