import * as React from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Badge,
  Drawer,
  List,
  ListItem,
  ListItemText,
  useMediaQuery,
  Box,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
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
import { checkCustomerLogin, logoutCustomer } from "@/app/api/auth";
import { useRouter } from "next/navigation";
import styles from "../../styles/RestaurantNavbar.module.scss";

const RestaurantAppBar = ({ data }) => {
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const [theme, setTheme] = useState("");
  const [isOpen, setIsOpen] = useState(false);
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

  const router = useRouter();

  const handleOrderPickupClick = () => {
    // Direct navigation if the user is logged in or on subsequent clicks after the first one
    if (customerLoggedIn || pickupClicked >= 1) {
      router.push(`/${data.route}/menu`);
    } else {
      // Only show the login modal on the first click if not logged in
      setLoginModalOpen(true);
      setPickupClicked(1); // Mark the first click
    }
  };

  useEffect(() => {
    const status = data.status;
    if (status === "open") {
      setIsOpen(true);
    } else {
      setIsOpen(false);
    }

    const themeID = data.theme?.id || 1;
    switch (themeID) {
      case 1:
        setTheme(styles.theme1);
        break;
      case 2:
        setTheme(styles.theme2);
        break;
      case 3:
        setTheme(styles.theme3);
        break;
      default:
        setTheme(styles.theme1);
    }

    const checkLoginStatus = async () => {
      const customerInformation = checkCustomerLogin();
      setCustomerLoggedIn(!!customerInformation);
    };

    checkLoginStatus();
  }, [data.status, data.theme?.id]);

  const logOutCustomerHandler = () => {
    logoutCustomer();
    setCustomerLoggedIn(false);
    router.push(`/${data.route}`);
  };

  const [cart, setCart] = useAtom(cartAtom);

  const hoursOpen = data.hours?.[dayOfWeek]?.open || "Not Available";
  const hoursClose = data.hours?.[dayOfWeek]?.close || "Not Available";
  const restaurantAddress =
    data.restaurant_contact?.address +
    " " +
    data.restaurant_contact?.city +
    ", " +
    data.restaurant_contact?.provinceOrState;

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const getNavigationLinks = () =>
    [
      { name: "Home", route: "/", protected: false },
      { name: "Menu", route: "/menu", protected: false },
      { name: "About", route: "/about", protected: false },
      { name: "Reviews", route: "/reviews", protected: false },
      { name: "Order History", route: "/orderhistory", protected: true },
      {
        name: customerLoggedIn ? "Logout" : "Login",
        route: customerLoggedIn ? "/logout" : "/login",
        protected: false,
      },
    ].filter((link) => !link.protected || customerLoggedIn);

  const drawerContent = (
    <Box onClick={handleDrawerToggle} sx={{ width: 250 }} role="presentation">
      <List>
        {getNavigationLinks().map((link) => (
          <Link
            href={
              link.name === "Login"
                ? `/customer${link.route}`
                : link.name === "Logout"
                  ? `/${data.route}`
                  : `/${data.route}${link.route}`
            }
            passHref
            key={link.name}
          >
            <ListItem
              button
              component="a"
              onClick={() => {
                setMobileOpen(false);
                if (link.name === "Logout") {
                  logoutCustomer();
                  setCustomerLoggedIn(false);
                }
              }}
            >
              <ListItemText primary={link.name} />
            </ListItem>
          </Link>
        ))}
      </List>
    </Box>
  );

  return (
    <Box className={theme} sx={{ flexGrow: 1 }}>
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor:
            theme === styles.theme2
              ? "#101010"
              : theme === styles.theme3
                ? "#eb582c"
                : "#1565c0",
        }}
      >
        {isMobileOrTablet ? (
          <>
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={handleDrawerToggle}
              >
                <MenuIcon />
              </IconButton>
              <Box sx={{ flexGrow: 1 }} />
              <IconButton
                color="inherit"
                variant="outlined"
                aria-label="add to shopping cart"
                onClick={handleOpen}
                disabled={!isOpen} // disable cart icon if restaurant closed
                className={`${theme} ${styles.cartIcon}`}
              >
                <Badge
                  badgeContent={cart.reduce(
                    (total, item) => total + item.quantity,
                    0
                  )}
                  color="secondary"
                >
                  <AddShoppingCartIcon />
                </Badge>
              </IconButton>
            </Toolbar>
          </>
        ) : (
          <>
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
              <Typography
                variant="h6"
                component="div"
                className={`${theme} ${styles.restaurantInfo}`}
              >
                {restaurantAddress}
              </Typography>
            </Box>
            <Toolbar>
              <div style={{ position: "relative", width: 240 }}>
                <Link href={`/${data.route}/`}>
                  <Image
                    src={
                      data.logoURL && data.logoURL.length > 0
                        ? data.logoURL
                        : "/logo_placeholder.webp"
                    }
                    alt="logo"
                    width={100}
                    height={100}
                    priority={true}
                  />
                </Link>
                <span className={`${theme} ${styles.hoursDisplay}`}>
                  Hours: {hoursOpen} -
                </span>
                <span
                  className={`${theme} ${styles.hoursDisplay}`}
                  style={{
                    position: "absolute",
                    bottom: 30,
                    right: 10,
                  }}
                >
                  {hoursClose}
                </span>
              </div>
              <Box
                sx={{
                  flexGrow: 1,
                  display: "flex",
                  justifyContent: "flex-end",
                  paddingLeft: {
                    xs: "5px",
                    sm: "5px",
                    md: "20px",
                    lg: "100px",
                  },
                }}
              >
                <Typography
                  variant="h6"
                  component="div"
                  sx={{
                    flexGrow: 1,
                    cursor: "pointer",
                    textDecoration: "none",
                  }}
                  onClick={handleOrderPickupClick}
                  className={`${theme} ${styles.styledTypography}`}
                >
                  ORDER PICKUP
                </Typography>
                <Modal
                  aria-labelledby="unstyled-modal-title"
                  aria-describedby="unstyled-modal-description"
                  open={loginModalOpen}
                  onClose={handleLoginModalClose}
                  slots={{ backdrop: StyledBackdrop }}
                >
                  <ModalContent sx={{ width: 600, height: 300 }}>
                    <Typography
                      variant="h6"
                      component="div"
                      style={{ padding: 20 }}
                    >
                      Register for an account to collect rewards!
                    </Typography>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        padding: 20,
                      }}
                    >
                      <Link href="/customer/register" passHref>
                        <Button
                          style={{
                            borderColor: "white",
                            backgroundColor: "blue",
                            color: "white",
                            height: 100,
                            width: 120,
                          }}
                        >
                          Register
                        </Button>
                      </Link>
                      <Link href="/customer/login" passHref>
                        <Button
                          style={{
                            borderColor: "white",
                            backgroundColor: "blue",
                            color: "white",
                            height: 100,
                            width: 120,
                          }}
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Button
                        style={{
                          display: "flex",
                          justifyContent: "space-between",
                          padding: 20,
                          cursor: "pointer",
                          backgroundColor: "blue",
                          color: "white",
                          height: 100,
                          width: 120,
                        }}
                        onClick={() => {
                          // setCustomerID(0);
                          handleLoginModalClose();
                          router.push(`/${data.route}/menu`);
                        }}
                      >
                        Proceed without an account
                      </Button>
                    </Box>
                  </ModalContent>
                </Modal>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1 }}
                  className={`${theme} ${styles.styledTypography}`}
                >
                  <Link href={`/${data.route}/about`}>ABOUT</Link>
                </Typography>
                <Typography
                  variant="h6"
                  component="div"
                  sx={{ flexGrow: 1 }}
                  className={`${theme} ${styles.styledTypography}`}
                >
                  <Link href={`/${data.route}/reviews`}>REVIEWS</Link>
                </Typography>
                {customerLoggedIn && (
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ flexGrow: 1 }}
                    className={`${theme} ${styles.styledTypography}`}
                  >
                    <Link href={`/customer/orderhistory`}>ORDERS</Link>
                  </Typography>
                )}
                {!customerLoggedIn && (
                  <Button
                    color="inherit"
                    variant="outlined"
                    component={Link}
                    href="/customer/login"
                    style={{ textDecoration: "none" }}
                  >
                    Log In
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
                  disabled={!isOpen} // disable cart icon if restaurant closed
                  className={`${theme} ${styles.cartIcon}`}
                >
                  <Badge
                    badgeContent={cart.reduce(
                      (total, item) => total + item.quantity,
                      0
                    )}
                    sx={{
                      "& .MuiBadge-badge": {
                        width: 24,
                        height: 24,
                        fontSize: "1rem",
                        backgroundColor: !isOpen
                          ? "grey.500"
                          : theme === styles.theme2
                            ? "error.main"
                            : theme === styles.theme3
                              ? "success.main"
                              : "error.main",
                      },
                    }}
                  >
                    <AddShoppingCartIcon fontSize="large" />
                  </Badge>
                </IconButton>
              </Box>
            </Toolbar>
          </>
        )}

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={cartOpen}
          onClose={handleClose}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent
            sx={{
              width: 400,
              backgroundColor:
                theme === styles.theme2
                  ? "#3c3c3c"
                  : theme === styles.theme3
                    ? "#fbfbf7"
                    : "#ffffff",
              color:
                theme === styles.theme2
                  ? "#ffffff"
                  : theme === styles.theme3
                    ? "#4d4d4d"
                    : "#000000",
              border:
                theme === styles.theme2
                  ? "1px solid #3c3c3c"
                  : theme === styles.theme3
                    ? "1px solid #fbfbf7"
                    : "1px solid #dae2ed",
            }}
          >
            <CartContent handleClose={handleClose} theme={theme}></CartContent>
          </ModalContent>
        </Modal>
      </AppBar>
      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawerContent}
      </Drawer>
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

Backdrop.propTypes = {
  className: PropTypes.string.isRequired,
  open: PropTypes.bool,
};

Backdrop.displayName = "Backdrop";

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
