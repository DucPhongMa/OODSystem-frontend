"use client";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import Link from "next/link";
import { removeToken } from "../../../api/auth";

export default function MainNavbar({ isLoggedin }) {
  const [mobileMenuAnchor, setMobileMenuAnchor] = useState(null);
  const isMobileOrTablet = useMediaQuery("(max-width:960px)");

  const handleMobileMenuOpen = (event) => {
    setMobileMenuAnchor(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuAnchor(null);
  };

  const logout = () => {
    removeToken();
  };

  return (
    <>
      {isMobileOrTablet ? (
        <>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMobileMenuOpen}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                RestaurantWeb ADMIN Portal
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            anchor="left"
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
          >
            <List>
              <ListItem button>
                {isLoggedin ? (
                  <Link href="/admin/dashboard">
                    RestaurantWeb ADMIN Portal
                  </Link>
                ) : (
                  <Link href="/admin">RestaurantWeb ADMIN Portal</Link>
                )}
              </ListItem>
              <ListItem button>
                <Link href="/about">About</Link>
              </ListItem>
              <ListItem button>
                <Link href="/contact">Contact</Link>
              </ListItem>
              {isLoggedin ? (
                <>
                  <ListItem button>
                    <Link href="/admin/promotion/edit">Edit Promotions</Link>
                  </ListItem>
                  <ListItem button>
                    <Link href="/admin/menu/edit">Edit Menu</Link>
                  </ListItem>
                  <ListItem button>
                    <Link href="/admin/theme/edit">Edit Theme</Link>
                  </ListItem>
                  <ListItem button>
                    <Link href="/">Edit Info</Link>
                  </ListItem>
                  <ListItem button>
                    <Link href="/admin/login" onClick={logout}>
                      Logout
                    </Link>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem button>
                    <Link href="/admin/login">Log In</Link>
                  </ListItem>
                  <ListItem button>
                    <Link href="/admin/register">Register</Link>
                  </ListItem>
                </>
              )}
            </List>
          </Drawer>
        </>
      ) : (
        <AppBar position="static">
          <Toolbar>
            <Typography style={{ marginRight: "40px" }}>
              {isLoggedin ? (
                <Link href="/admin/dashboard">RestaurantWeb ADMIN Portal</Link>
              ) : (
                <Link href="/admin">RestaurantWeb ADMIN Portal</Link>
              )}
            </Typography>
            <Typography style={{ marginRight: "20px" }}>
              <Link href="/about">About</Link>
            </Typography>
            <Typography style={{ marginRight: "20px" }}>
              <Link href="/contact">Contact</Link>
            </Typography>

            <div style={{ flexGrow: 1 }}></div>

            {isLoggedin ? (
              <>
                <Typography style={{ marginRight: "40px" }}>
                  <Link href="/admin/promotion/edit">Edit Promotions</Link>
                </Typography>
                <Typography style={{ marginRight: "40px" }}>
                  <Link href="/admin/menu/edit">Edit Menu</Link>
                </Typography>
                <Typography style={{ marginRight: "30px" }}>
                  <Link href="/admin/theme/edit">Edit Theme</Link>
                </Typography>
                <Typography style={{ marginRight: "30px" }}>
                  <Link href="/">Edit Info</Link>
                </Typography>
                <Typography>
                  <Link href="/admin/login" onClick={logout}>
                    Logout
                  </Link>
                </Typography>
              </>
            ) : (
              <>
                <Typography style={{ marginRight: "40px" }}>
                  <Link href="/admin/login">Log In</Link>
                </Typography>
                <Typography>
                  <Link href="/admin/register">Register</Link>
                </Typography>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}
