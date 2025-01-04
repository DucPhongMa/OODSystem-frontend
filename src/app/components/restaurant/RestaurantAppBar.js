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
  Modal,
  Paper,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import AddShoppingCartIcon from "@mui/icons-material/AddShoppingCart";
import Link from "next/link";
import Image from "next/image";
import { useAtom } from "jotai";
import { cartAtom } from "../../../../store";
import { useEffect, useState } from "react";
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
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const handleLoginModalOpen = () => setLoginModalOpen(true);
  const handleLoginModalClose = () => setLoginModalOpen(false);

  const router = useRouter();

  const handleOrderPickupClick = () => {
    // Show login modal if user is not logged in, otherwise go to menu
    if (customerLoggedIn) {
      router.push(`/${data.route}/menu`);
    } else {
      setLoginModalOpen(true);
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
                  : link.name === "Order History"
                    ? `/customer/orderhistory`
                    : `/${data.route}${link.route}`
            }
            passHref
            key={link.name}
          >
            <ListItem
              sx={{ cursor: "pointer" }}
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

  const modalStyle = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
  };

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
                disabled={!isOpen}
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

                {/* Simplified Login Modal */}
                <Modal open={loginModalOpen} onClose={handleLoginModalClose}>
                  <Paper sx={modalStyle}>
                    <Typography variant="h6" gutterBottom>
                      Register for an account to collect rewards!
                    </Typography>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 2,
                        mt: 3,
                      }}
                    >
                      <Link href="/customer/register" passHref>
                        <Button
                          variant="contained"
                          sx={{
                            height: 120,
                            width: 120,
                            backgroundColor: "blue",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "darkblue",
                            },
                          }}
                        >
                          Register
                        </Button>
                      </Link>
                      <Link href="/customer/login" passHref>
                        <Button
                          variant="contained"
                          sx={{
                            height: 120,
                            width: 120,
                            backgroundColor: "blue",
                            color: "white",
                            "&:hover": {
                              backgroundColor: "darkblue",
                            },
                          }}
                        >
                          Sign In
                        </Button>
                      </Link>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleLoginModalClose();
                          router.push(`/${data.route}/menu`);
                        }}
                        sx={{
                          height: 120,
                          width: 120,
                          backgroundColor: "blue",
                          color: "white",
                          "&:hover": {
                            backgroundColor: "darkblue",
                          },
                        }}
                      >
                        Continue as Guest
                      </Button>
                    </Box>
                  </Paper>
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
                  disabled={!isOpen}
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

        <Modal open={cartOpen} onClose={handleClose}>
          <Paper
            sx={{
              ...modalStyle,
              width: 400,
              bgcolor:
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
            }}
          >
            <CartContent handleClose={handleClose} theme={theme} />
          </Paper>
        </Modal>
      </AppBar>

      <Drawer anchor="left" open={mobileOpen} onClose={handleDrawerToggle}>
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default RestaurantAppBar;
