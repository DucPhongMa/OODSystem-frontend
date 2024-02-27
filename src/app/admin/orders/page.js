"use client";
import { useState, useEffect, useCallback } from "react";
import { getOrderBasedOnStatus, updateOrder } from "@/app/api/order";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Button,
  TextField,
  Tabs,
  Tab,
  CircularProgress,
  Typography,
  TableSortLabel,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  useTheme,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import MainNavbar from "../../components/admin/register/MainNavbar";
import ActionButtons from "../../components/admin/orders/ActionButtons";
import { checkBusinessLogin } from "@/app/api/auth";

function descendingComparator(a, b, orderBy) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

function getComparator(order, orderBy) {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function stableSort(array, comparator) {
  const stabilizedThis = array.map((el, index) => [el, index]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

export default function AdminOrders() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("dateTime");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [currentOrder, setCurrentOrder] = useState({
    id: null,
    currentStatus: null,
  });

  const [tabValue, setTabValue] = useState("all");

  useEffect(() => {
    async function authenticateAndFetchOrders() {
      const isLoggedInResult = await checkBusinessLogin();
      setIsLoggedIn(isLoggedInResult);

      if (isLoggedInResult) {
        const status = tabValue === "past" ? "completed" : "";
        const orderData = await getOrderBasedOnStatus(50, status);
        console.log(orderData);

        if (orderData && Array.isArray(orderData)) {
          const formattedOrders = orderData
            .map((order) => ({
              id: order.id,
              createdAt: order.attributes.createdAt,
              dateTime: order.attributes.time_placed,
              note: order.attributes.note,
              details: order.attributes.order_details.data.map((detail) => ({
                id: detail.id,
                name: detail.attributes.menu_item.data.attributes.name,
                quantity: detail.attributes.quantity,
                unitPrice: detail.attributes.unit_price,
              })),
              status: order.attributes.status,
              tax: order.attributes.tax,
              totalPrice: order.attributes.total_price,
              customer:
                order.attributes.users_permissions_user?.data?.attributes
                  ?.fullname ?? "N/A",
              phoneNumber: order.attributes.phone_number,
              timeCompleted: order.attributes.time_completed,
            }))
            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

          setOrders(formattedOrders);
          setFilteredOrders(formattedOrders);
        } else {
          console.error("Fetched data is not an array:", orderData);
        }
      }
      setIsLoading(false);
    }

    authenticateAndFetchOrders();
  }, [tabValue]);

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace("#", "");
      setTabValue(hash === "past" ? "past" : "all");
    };

    handleHashChange();

    window.addEventListener("hashchange", handleHashChange);

    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const theme = useTheme();

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const handleDialogOpen = (orderId, newStatus) => {
    setCurrentOrder({ id: orderId, newStatus });
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const fetchOrders = useCallback(async () => {
    const isLoggedInResult = await checkBusinessLogin();
    setIsLoggedIn(isLoggedInResult);

    if (isLoggedInResult) {
      const status = tabValue === "past" ? "completed" : "";
      const orderData = await getOrderBasedOnStatus(50, status);

      if (orderData && Array.isArray(orderData)) {
        const formattedOrders =
          orderData
            .map((order) => ({
              id: order.id,
              createdAt: order.attributes.createdAt,
              dateTime: order.attributes.time_placed,
              note: order.attributes.note,
              details: order.attributes.order_details.data.map((detail) => ({
                id: detail.id,
                name: detail.attributes.menu_item.data.attributes.name,
                quantity: detail.attributes.quantity,
                unitPrice: detail.attributes.unit_price,
              })),
              status: order.attributes.status,
              tax: order.attributes.tax,
              totalPrice: order.attributes.total_price,
              customer:
                order.attributes.users_permissions_user?.data?.attributes
                  ?.fullname ||
                order.attributes.username ||
                "",
              phoneNumber: order.attributes.phone_number,
              timeCompleted: order.attributes.time_completed,
            }))
            .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime)) || [];

        setOrders(formattedOrders);
        setFilteredOrders(formattedOrders);
      } else {
        console.error("Fetched data is not an array:", orderData);
      }
    }
  }, [tabValue]);

  useEffect(() => {
    fetchOrders();
    const interval = setInterval(() => {
      fetchOrders(); // Refetch the orders every 10 seconds
      console.log("Orders refreshed");
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchOrders]);

  const handleStatusChange = async (newStatus) => {
    if (currentOrder.id && newStatus) {
      await updateOrder(currentOrder.id, newStatus);
      fetchOrders();
      setOpenDialog(false);
    }
  };

  // Get row bg color based on order status
  const getRowBackgroundColor = (status, theme) => {
    const statusColorMap = {
      pending: "#f8f4cc",
      "in progress": "#b9d5b2",
      completed: "#e2e8f0",
      "ready pickup": "#84b29e",
      "ready for pickup": "#84b29e",
      "ready for pick up": "#84b29e",
      default: "#f7fafc",
    };

    const bgColor = statusColorMap[status] || statusColorMap.default;

    return {
      backgroundColor: bgColor,
      "&:hover": {
        backgroundColor: alpha(bgColor, 0.7),
      },
      cursor: "pointer",
    };
  };

  const handleRequestSort = (event, property) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString)
      .toLocaleString("default", options)
      .replace(",", "");
  };

  const handleSearch = (event) => {
    const value = event.target.value.toLowerCase();
    setSearchTerm(value);
    const filtered = orders.filter((order) =>
      order.customer.toLowerCase().includes(value)
    );
    setFilteredOrders(filtered);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const createSortHandler = (property) => (event) => {
    handleRequestSort(event, property);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isLoggedIn) {
    return (
      <Box>
        <MainNavbar isLoggedin={isLoggedIn} />
        <Typography variant="h6" textAlign="center" marginTop={2}>
          You are not authenticated.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <MainNavbar isLoggedin={isLoggedIn} />
      <Box sx={{ bgcolor: "background.paper", p: 2 }}>
        <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            textColor="primary"
            indicatorColor="primary"
            sx={{ flexGrow: 1 }}
          >
            <Tab label="ALL" value="all" />
            <Tab label="PAST" value="past" />
          </Tabs>
          <TextField
            label="Search by Customer"
            variant="outlined"
            value={searchTerm}
            onChange={handleSearch}
            size="small"
            sx={{ width: "25%" }}
          />
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sortDirection={orderBy === "status" ? order : false}>
                <TableSortLabel
                  active={orderBy === "status"}
                  direction={orderBy === "status" ? order : "asc"}
                  onClick={createSortHandler("status")}
                >
                  Status
                  {orderBy === "status" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "id" ? order : false}>
                <TableSortLabel
                  active={orderBy === "id"}
                  direction={orderBy === "id" ? order : "asc"}
                  onClick={createSortHandler("id")}
                >
                  Order#
                  {orderBy === "id" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell sortDirection={orderBy === "customer" ? order : false}>
                <TableSortLabel
                  active={orderBy === "customer"}
                  direction={orderBy === "customer" ? order : "asc"}
                  onClick={createSortHandler("customer")}
                >
                  Customer
                  {orderBy === "customer" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>Items</TableCell>
              <TableCell>Notes</TableCell>
              <TableCell sortDirection={orderBy === "dateTime" ? order : false}>
                <TableSortLabel
                  active={orderBy === "dateTime"}
                  direction={orderBy === "dateTime" ? order : "asc"}
                  onClick={createSortHandler("dateTime")}
                >
                  Time Placed
                  {orderBy === "dateTime" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell
                sortDirection={orderBy === "timeCompleted" ? order : false}
              >
                <TableSortLabel
                  active={orderBy === "timeCompleted"}
                  direction={orderBy === "timeCompleted" ? order : "asc"}
                  onClick={createSortHandler("timeCompleted")}
                >
                  Time Completed
                  {orderBy === "timeCompleted" ? (
                    <Box component="span" sx={visuallyHidden}>
                      {order === "desc"
                        ? "sorted descending"
                        : "sorted ascending"}
                    </Box>
                  ) : null}
                </TableSortLabel>
              </TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stableSort(filteredOrders, getComparator(order, orderBy)).map(
              (order) => (
                <TableRow
                  key={order.id}
                  sx={getRowBackgroundColor(order.status, theme)}
                  onClick={() => handleRowClick(order)}
                >
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{order.id}</TableCell>
                  <TableCell>{order.customer}</TableCell>
                  <TableCell>
                    {order.details.map((detail, index) => (
                      <span key={index}>
                        {`${detail.quantity} x ${detail.name}`}
                        {index < order.details.length - 1 ? <br /> : null}
                      </span>
                    ))}
                  </TableCell>
                  <TableCell>
                    {order.note && order.note.length > 50
                      ? `${order.note.substring(0, 50)}...`
                      : order.note || ""}
                  </TableCell>
                  <TableCell>{formatDate(order.dateTime)}</TableCell>
                  <TableCell>
                    {order.timeCompleted ? formatDate(order.timeCompleted) : ""}
                  </TableCell>
                  <TableCell>
                    <ActionButtons
                      status={order.status}
                      orderId={order.id}
                      onActionClick={(action, id) => {
                        handleDialogOpen(id, action);
                      }}
                    />
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </Box>

      <Dialog open={!!selectedOrder} onClose={() => setSelectedOrder(null)}>
        <DialogContent dividers>
          {selectedOrder && (
            <>
              <Typography variant="h6" gutterBottom>
                {`Order#${selectedOrder.id} - ${selectedOrder.customer} (${selectedOrder.phoneNumber})`}
              </Typography>
              <Typography variant="body2" gutterBottom>
                {`Placed at: ${formatDate(selectedOrder.dateTime)}`}
              </Typography>

              <Typography variant="body2" gutterBottom>
                Completed at:{" "}
                {selectedOrder.timeCompleted
                  ? formatDate(selectedOrder.timeCompleted)
                  : "(order still in progress)"}
              </Typography>
              <br />
              {selectedOrder.details.map((detail, index) => (
                <div
                  key={index}
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <Typography variant="body2" style={{ marginRight: "16px" }}>
                    {`${detail.quantity} x ${detail.name}`}
                  </Typography>
                  <Typography variant="body2" style={{ textAlign: "right" }}>
                    {`$${detail.unitPrice.toFixed(2)}`}
                  </Typography>
                </div>
              ))}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                  marginBottom: "4px",
                }}
              >
                <Typography variant="body2">Subtotal</Typography>
                <Typography variant="body2" style={{ textAlign: "right" }}>
                  {`$${selectedOrder.totalPrice.toFixed(2)}`}
                </Typography>
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "4px",
                }}
              >
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2" style={{ textAlign: "right" }}>
                  {`$${selectedOrder.tax.toFixed(2)}`}
                </Typography>
              </div>
              {selectedOrder.marketplaceFacilitatorTax && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: "4px",
                  }}
                >
                  <Typography variant="body2">
                    Marketplace Facilitator Tax
                  </Typography>
                  <Typography variant="body2" style={{ textAlign: "right" }}>
                    {`$${selectedOrder.marketplaceFacilitatorTax.toFixed(2)}`}
                  </Typography>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontWeight: "bold",
                  marginTop: "8px",
                  marginBottom: "4px",
                }}
              >
                <Typography variant="body2">Total</Typography>
                <Typography variant="body2" style={{ textAlign: "right" }}>
                  {`$${selectedOrder.totalPrice.toFixed(2)}`}
                </Typography>
              </div>
              <Typography
                variant="body2"
                gutterBottom
                style={{ marginTop: "16px" }}
              >
                Notes: {selectedOrder.note}
              </Typography>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Change Dialog */}
      <Dialog open={openDialog} onClose={handleDialogClose}>
        <DialogTitle>Change Order Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to change the status of this order to "
            {currentOrder.newStatus}"?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => handleStatusChange(currentOrder.newStatus)}
            color="primary"
            autoFocus
          >
            CONFIRM
          </Button>
          <Button onClick={handleDialogClose} color="primary">
            CANCEL
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
