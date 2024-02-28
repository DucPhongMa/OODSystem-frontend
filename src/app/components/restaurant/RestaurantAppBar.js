import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Link from "next/link";
import Image from "next/image";
import { useAtom } from "jotai";
import { cartAtom } from "../../../../store";
import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import clsx from "clsx";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import CartContent from "./CartContent";
import { Badge } from "@mui/material";
import { checkCustomerLogin, logoutCustomer } from "@/app/api/auth";

const RestaurantAppBar = ({ restaurantInfo }) => {
  const currentDate = new Date();
  const dayOfWeek = currentDate
    .toLocaleDateString("en-US", { weekday: "long" })
    .toLowerCase();
  const [cartOpen, setCartOpen] = useState(false);
  const [customerLoggedIn, setCustomerLoggedIn] = useState(false);
  const handleOpen = () => setCartOpen(true);
  const handleClose = () => setCartOpen(false);
  const [pickupClicked, setPickupClicked] = useState(0);
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);

  useEffect(() => {
    const customerInformation = checkCustomerLogin();
    if (customerInformation) {
      setCustomerLoggedIn(true);
    }
  }, []);

  const logOutCustomerHandler = () => {
    logoutCustomer();
    setCustomerLoggedIn(false);
  };

  const [cart, setCart] = useAtom(cartAtom);

  // console.log("cart:");
  // console.log(cart);

  const hoursOpen = restaurantInfo.hours?.[dayOfWeek]?.open || "Not Available";
  const hoursClose =
    restaurantInfo.hours?.[dayOfWeek]?.close || "Not Available";
  const restaurantAddress =
    restaurantInfo.restaurant_contact?.address || "Address not available";

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-end",
            mr: 5,
            paddingTop: 2,
          }}
        >
          <Typography variant="h6" component="div" sx={{ display: "inline" }}>
            {restaurantInfo.name}: {restaurantAddress}
          </Typography>
        </Box>
        <Toolbar>
          <div style={{ position: "relative", width: 240 }}>
            <Link href={`/${restaurantInfo.route}/`}>
              <Image
                src="/sushi.png"
                alt="sushi logo"
                width={100}
                height={100}
                priority={true}
              />
            </Link>
            <span
              style={{
                position: "absolute",
                bottom: 50,
                right: 40,
                color: "white",
              }}
            >
              Hours: {hoursOpen} -
            </span>
            <span
              style={{
                position: "absolute",
                bottom: 30,
                right: 50,
                color: "white",
              }}
            >
              {hoursClose}
            </span>
          </div>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            {(customerLoggedIn || (!customerLoggedIn && pickupClicked > 0)) && (
              <Link href={`/${restaurantInfo.route}/menu`}>ORDER PICKUP</Link>
            )}
            {!customerLoggedIn && pickupClicked < 1 && (
              <Typography
                variant="h6"
                component="div"
                sx={{ cursor: "pointer", flexGrow: 1 }}
                onClick={() => {
                  handleLoginModalOpen();
                  setPickupClicked(1);
                }}
              >
                ORDER PICKUP
              </Typography>
            )}
          </Typography>
          <Modal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={loginModalOpen}
            onClose={handleLoginModalClose}
            slots={{ backdrop: StyledBackdrop }}
          >
            <ModalContent sx={{ width: 600, height: 300 }}>
              <Typography variant="h6" component="div" style={{ padding: 20 }}>
                Register for an account to collect rewards!
              </Typography>
              <Box
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  padding: 20,
                }}
              >
                <Button
                  style={{
                    borderColor: "white",
                    backgroundColor: "blue",
                    color: "white",
                    height: 100,
                    width: 120,
                  }}
                >
                  <Link href={`/customer/register`}>Register</Link>
                </Button>
                <Button
                  style={{
                    borderColor: "white",
                    backgroundColor: "blue",
                    color: "white",
                    height: 100,
                    width: 120,
                  }}
                >
                  <Link href={`/customer/login`}>Sign In</Link>
                </Button>
                <Button
                  style={{
                    borderColor: "white",
                    backgroundColor: "blue",
                    color: "white",
                    height: 100,
                    width: 120,
                  }}
                  onClick={() => {
                    // setCustomerID(0);
                    handleLoginModalClose();
                  }}
                >
                  Proceed without an account
                </Button>
              </Box>
            </ModalContent>
          </Modal>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantInfo.route}/about`}>ABOUT</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantInfo.route}/reviews`}>REVIEWS</Link>
          </Typography>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href={`/${restaurantInfo.route}/orderhistory`}>ORDERS</Link>
          </Typography>
          {!customerLoggedIn && (
            <Button color="inherit" variant="outlined">
              <Link href={`/customer/login`}>Log In</Link>
            </Button>
          )}
          {customerLoggedIn && (
            <Button
              color="inherit"
              variant="outlined"
              onClick={logOutCustomerHandler}
            >
              Log Out
            </Button>
          )}

          <IconButton
            color="inherit"
            variant="outlined"
            aria-label="add to shopping cart"
            onClick={handleOpen}
          >
            <Badge
              badgeContent={cart.reduce(
                (total, item) => total + item.quantity,
                0
              )}
              color="error"
            >
              <AddShoppingCartIcon />
            </Badge>
          </IconButton>
          <Modal
            aria-labelledby="unstyled-modal-title"
            aria-describedby="unstyled-modal-description"
            open={cartOpen}
            onClose={handleClose}
            slots={{ backdrop: StyledBackdrop }}
          >
            <ModalContent sx={{ width: 400 }}>
              <CartContent handleClose={handleClose}></CartContent>
            </ModalContent>
          </Modal>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default RestaurantAppBar;

const Backdrop = React.forwardRef((props, ref) => {
  const { open, className, ...other } = props;
  return (
    <div
      className={clsx({ "base-Backdrop-open": open }, className)}
      ref={ref}
      {...other}
    />
  );
});

Backdrop.displayName = "Back Drop";

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

const blue = {
  200: "#99CCFF",
  300: "#66B2FF",
  400: "#3399FF",
  500: "#007FFF",
  600: "#0072E5",
  700: "#0066CC",
};

const grey = {
  50: "#F3F6F9",
  100: "#E5EAF2",
  200: "#DAE2ED",
  300: "#C7D0DD",
  400: "#B0B8C4",
  500: "#9DA8B7",
  600: "#6B7A90",
  700: "#434D5B",
  800: "#303740",
  900: "#1C2025",
};

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);

const TriggerButton = styled("button")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 600;
    font-size: 0.875rem;
    line-height: 1.5;
    padding: 8px 16px;
    border-radius: 8px;
    transition: all 150ms ease;
    cursor: pointer;
    background: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    color: ${theme.palette.mode === "dark" ? grey[200] : grey[900]};
    box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);

    &:hover {
      background: ${theme.palette.mode === "dark" ? grey[800] : grey[50]};
      border-color: ${theme.palette.mode === "dark" ? grey[600] : grey[300]};
    }

    &:active {
      background: ${theme.palette.mode === "dark" ? grey[700] : grey[100]};
    }

    &:focus-visible {
      box-shadow: 0 0 0 4px
        ${theme.palette.mode === "dark" ? blue[300] : blue[200]};
      outline: none;
    }
  `
);
