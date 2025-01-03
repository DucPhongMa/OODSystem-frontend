"use client";
import { useState, useEffect, useCallback } from "react";
import { getOrderBasedOnStatus, updateOrder } from "@/app/api/order";
import {
  getRestaurantByBusinessName,
  getRestaurantByRoute,
} from "@/app/api/restaurant";
import { checkBusinessLogin } from "@/app/api/auth";
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
  TablePagination,
  Divider,
} from "@mui/material";
import { alpha } from "@mui/material/styles";
import { visuallyHidden } from "@mui/utils";
import MainNavbar from "../../components/admin/register/MainNavbar";
import ActionButtons from "../../components/admin/orders/ActionButtons";

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
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const columnWidths = ["10%", "10%", "16%", "20%", "12%", "10%", "10%", "12%"];
  const [windowHeight, setWindowHeight] = useState(null);
  const [restaurantID, setRestaurantID] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("dateTime");
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showEstimatedTimeInput, setShowEstimatedTimeInput] = useState(false);
  const [estimatedPrepTime, setEstimatedPrepTime] = useState("");
  const [currentOrder, setCurrentOrder] = useState({
    id: null,
    currentStatus: null,
  });
  const [tabValue, setTabValue] = useState("all");

  // Filter orders based on search term
  const filterOrders = useCallback((orders, searchTerm) => {
    if (!searchTerm) return orders;
    return orders.filter((order) =>
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, []);

  // Check if user is authenticated and store in state variable
  // Get restaurant id and store in state variable
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Set loading to true at start of any async operation

      const isLoggedInResult = checkBusinessLogin();
      setIsLoggedIn(isLoggedInResult);

      // Check if user is logged in
      if (!isLoggedInResult) {
        console.error("User is not authenticated");
        setIsLoading(false);
        return;
      }
      console.log("User is authenticated");

      // Get the username from localStorage
      const storedUsername = localStorage.getItem("business-username");
      if (!storedUsername) {
        console.error("No username found in local storage.");
        setIsLoading(false);
        return;
      }
      console.log(`Fetched username from localStorage: ${storedUsername}`);

      // Use username to get the route
      let route;
      try {
        route = await getRestaurantByBusinessName(storedUsername);
      } catch (error) {
        console.error(
          "Error fetching route, getRestaurantByBusinessName failed: ",
          error
        );
        setIsLoading(false);
        return;
      }
      console.log(`Fetched route: ${route}`);

      // Use route to get restaurant id
      try {
        const restaurantData = await getRestaurantByRoute(route);
        setRestaurantID(restaurantData.id);
        console.log(`Fetched restaurant id: ${restaurantData.id}`);
        setIsLoading(false);
        return;
      } catch (error) {
        console.error(
          "Error fetching restaurant id, getRestaurantByBusinessName failed: ",
          error
        );
        setIsLoading(false);
        return;
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    setTabValue(hash === "past" ? "past" : "all");
  }, []);

  useEffect(() => {
    window.location.hash = tabValue;
  }, [tabValue]);

  useEffect(() => {
    setWindowHeight(window.innerHeight);
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    window.location.hash = tabValue;
  }, [tabValue]);

  useEffect(() => {
    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const dialogMaxHeight = Math.max(windowHeight * 0.8, 300);

  const fetchAndFormatOrders = useCallback(
    async (statusFilter) => {
      if (!restaurantID || !isLoggedIn) {
        console.log("Waiting for auth and restaurant ID...");
        return;
      }

      let allOrderData = [];

      if (statusFilter === "past") {
        let completedOrders;
        try {
          completedOrders = await getOrderBasedOnStatus(
            restaurantID,
            "completed"
          );
        } catch (error) {
          console.error(
            "getOrderBasedOnStatus failed for completed orders: ",
            error
          );
          return;
        }

        let cancelledOrders;
        try {
          cancelledOrders = await getOrderBasedOnStatus(
            restaurantID,
            "cancelled"
          );
        } catch (error) {
          console.error(
            "getOrderBasedOnStatus failed for cancelled orders: ",
            error
          );
          return;
        }

        if (
          !Array.isArray(completedOrders) ||
          !Array.isArray(cancelledOrders)
        ) {
          console.error(
            "Fetched data is not an array:",
            completedOrders,
            cancelledOrders
          );
          return;
        }
        allOrderData = [...completedOrders, ...cancelledOrders];
      } else {
        let orderData;
        try {
          orderData = await getOrderBasedOnStatus(restaurantID);
          console.log(orderData);
        } catch (error) {
          console.error(
            "getOrderBasedOnStatus failed for getting all orders: ",
            error
          );
          return;
        }

        if (!Array.isArray(orderData)) {
          console.error("Fetched data is not an array:", orderData);
          return;
        }
        allOrderData = orderData;
      }

      const formattedOrders = allOrderData
        .map((order) => {
          const taxRate = parseFloat(order.attributes.tax) || 0;
          const initialAccumulator = { subtotal: 0, totalDiscount: 0 };

          const { subtotal, totalDiscount } =
            order.attributes.order_details.data.reduce((acc, detail) => {
              const itemPrice = parseFloat(detail.attributes.unit_price) || 0;
              const itemQuantity =
                parseInt(detail.attributes.quantity, 10) || 0;
              const itemDiscountPercent =
                parseFloat(
                  detail.attributes.menu_item.data.attributes.discount
                ) / 100 || 0;

              const itemSubtotal = itemPrice * itemQuantity;
              const itemDiscountAmount = itemSubtotal * itemDiscountPercent;

              acc.subtotal += itemSubtotal;
              acc.totalDiscount += itemDiscountAmount;

              return acc;
            }, initialAccumulator);

          const adjustedSubtotal = subtotal - totalDiscount;
          const taxAmount = adjustedSubtotal * taxRate;
          const totalWithTax = adjustedSubtotal + taxAmount;

          return {
            id: order.id,
            createdAt: order.attributes.createdAt,
            dateTime: order.attributes.time_placed,
            note: order.attributes.note,
            details: order.attributes.order_details.data.map((detail) => ({
              id: detail.id,
              name:
                detail.attributes.menu_item.data?.attributes.name ??
                "Unknown Item",
              quantity: detail.attributes.quantity,
              unitPrice: detail.attributes.unit_price,
            })),
            status: order.attributes.status,
            subtotal: subtotal,
            totalDiscount: totalDiscount,
            tax: taxAmount,
            totalPrice: totalWithTax,
            customer: order.attributes.username ?? "N/A",
            phoneNumber: order.attributes.phone_number,
            timeCompleted: order.attributes.time_completed,
          };
        })
        .sort((a, b) => new Date(b.dateTime) - new Date(a.dateTime));

      setOrders(formattedOrders);
      setFilteredOrders(filterOrders(formattedOrders, searchTerm));

      console.log(
        `Fetched orders for restaurant id# ${restaurantID} at:  ${new Date()}`
      );
    },
    [isLoggedIn, restaurantID, filterOrders, searchTerm]
  );

  // When page tab changes, refetch orders
  useEffect(() => {
    fetchAndFormatOrders(tabValue);
  }, [fetchAndFormatOrders, tabValue]);

  // Auto-refresh orders every 10 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAndFormatOrders(tabValue);
    }, 10000);

    return () => clearInterval(interval);
  }, [fetchAndFormatOrders, tabValue]);

  const theme = useTheme();

  const handleRowClick = (order) => {
    setSelectedOrder(order);
  };

  const handleDialogOpen = (orderId, newStatus) => {
    const statusLower = newStatus.toLowerCase();

    setCurrentOrder({
      id: orderId,
      newStatus: statusLower,
    });

    setShowEstimatedTimeInput(statusLower === "in progress");

    setOpenDialog(true);
    setEstimatedPrepTime("");
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
  };

  const handleStatusChange = async (newStatus) => {
    setIsLoading(true); // Set loading to true at start of any async operation

    if (currentOrder.id && newStatus) {
      let estimateTime = null;

      if (newStatus.toLowerCase() === "in progress" && estimatedPrepTime > 0) {
        const currentTime = new Date();
        const futureTime = new Date(
          currentTime.getTime() + estimatedPrepTime * 60000
        );
        estimateTime = futureTime.toISOString();
      }

      try {
        await updateOrder(currentOrder.id, newStatus, estimateTime);
      } catch (error) {
        console.error("Status change updateOrder failed: ", error);
        setIsLoading(false);
        return;
      }

      try {
        await fetchAndFormatOrders();
      } catch (error) {
        console.error("Status change fetchAndFormatOrders failed: ", error);
        setIsLoading(false);
        return;
      }

      setOpenDialog(false);
    }
    setIsLoading(false);
  };

  // Get row bg color based on order status
  const getRowBackgroundColor = (status, theme) => {
    const statusColorMap = {
      pending: "#f8f4cc",
      "in progress": "#b9d5b2",
      "ready for pickup": "#84b29e",
      completed: "#e2e8f0",
      cancelled: "#f7fafc",
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
    setFilteredOrders(filterOrders(orders, value));
    setPage(0);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0); // Reset to the first page
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

  if (!isLoading && !isLoggedIn) {
    return (
      <Box>
        <MainNavbar isLoggedin={isLoggedIn} />
        <Typography variant="h6" textAlign="center" marginTop={2}>
          You are not not logged in.
        </Typography>
      </Box>
    );
  }

  if (windowHeight === null) {
    return null;
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
              <TableCell
                sx={{ width: columnWidths[0] }}
                sortDirection={orderBy === "status" ? order : false}
              >
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
              <TableCell
                sx={{ width: columnWidths[1] }}
                sortDirection={orderBy === "id" ? order : false}
              >
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
              <TableCell
                sx={{ width: columnWidths[2] }}
                sortDirection={orderBy === "customer" ? order : false}
              >
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
              <TableCell sx={{ width: columnWidths[3] }}>Items</TableCell>
              <TableCell sx={{ width: columnWidths[4] }}>Notes</TableCell>
              <TableCell
                sx={{ width: columnWidths[5] }}
                sortDirection={orderBy === "dateTime" ? order : false}
              >
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
                sx={{ width: columnWidths[6] }}
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
              <TableCell sx={{ width: columnWidths[7] }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {isLoading ? (
              // Render a row with a spinner if data is still loading
              <TableRow>
                <TableCell colSpan={1000} style={{ textAlign: "center" }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            ) : (
              stableSort(filteredOrders, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
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
                      {order.timeCompleted
                        ? formatDate(order.timeCompleted)
                        : ""}
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
                ))
            )}
          </TableBody>
        </Table>
      </Box>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={filteredOrders.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />

      <Dialog
        open={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
        PaperProps={{
          style: { maxHeight: `${dialogMaxHeight}px` },
        }}
        scroll="paper"
      >
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
                  {`$${selectedOrder.subtotal.toFixed(2)}`}
                </Typography>
              </div>
              {selectedOrder.totalDiscount > 0 && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                    marginBottom: "4px",
                  }}
                >
                  <Typography variant="body2">Total Discount</Typography>
                  <Typography variant="body2" style={{ textAlign: "right" }}>
                    {`− $${selectedOrder.totalDiscount.toFixed(2)}`}
                  </Typography>
                </div>
              )}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginTop: "8px",
                  marginBottom: "4px",
                }}
              >
                <Typography variant="body2">Tax</Typography>
                <Typography variant="body2" style={{ textAlign: "right" }}>
                  {`$${selectedOrder.tax.toFixed(2)}`}
                </Typography>
              </div>
              <Divider />
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
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
          {showEstimatedTimeInput && (
            <>
              <Box mt={2} />
              <TextField
                autoFocus
                margin="dense"
                id="estimatedPrepTime"
                label="Estimated Prep Time (min)"
                type="number"
                variant="outlined"
                value={estimatedPrepTime}
                onChange={(e) => setEstimatedPrepTime(e.target.value)}
                inputProps={{ min: "1" }}
                size="small"
                sx={{ width: "200px" }}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose} color="primary">
            CANCEL
          </Button>
          <Button
            onClick={() => handleStatusChange(currentOrder.newStatus)}
            color="primary"
            disabled={
              showEstimatedTimeInput &&
              (!estimatedPrepTime || parseInt(estimatedPrepTime, 10) <= 0)
            }
            autoFocus
          >
            CONFIRM
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
