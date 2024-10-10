"use client";
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
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

  const linkStyle = { color: "#fefcfc", textDecoration: "none" };

  return (
    <>
      {isMobileOrTablet ? (
        <>
          <AppBar
            position="static"
            style={{ background: "transparent", boxShadow: "none" }}
          >
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
                Restaurante Wiz
              </Typography>
            </Toolbar>
          </AppBar>
          <Drawer
            anchor="left"
            open={Boolean(mobileMenuAnchor)}
            onClose={handleMobileMenuClose}
            PaperProps={{
              style: { backgroundColor: "gray", color: "black" }, // Change these values as needed
            }}
          >
            <List>
              <ListItem button>
                {isLoggedin ? (
                  <Link href="/admin/dashboard" style={linkStyle}>
                    Restaurante Wiz
                  </Link>
                ) : (
                  <Link href="/admin" style={linkStyle}>
                    Restaurante Wiz
                  </Link>
                )}
              </ListItem>
              <ListItem button>
                <Link href="/about" style={linkStyle}>
                  About
                </Link>
              </ListItem>
              <ListItem button>
                <Link href="/contact" style={linkStyle}>
                  Contact
                </Link>
              </ListItem>
              {isLoggedin ? (
                <>
                  <ListItem button>
                    <Link href="/admin/promotion/edit" style={linkStyle}>
                      Edit Promotions
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link href="/admin/menu/edit" style={linkStyle}>
                      Edit Menu
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link href="/admin/theme/edit" style={linkStyle}>
                      Edit Theme
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link href="/" style={linkStyle}>
                      Edit Info
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link
                      href="/admin/login"
                      onClick={logout}
                      style={linkStyle}
                    >
                      Logout
                    </Link>
                  </ListItem>
                </>
              ) : (
                <>
                  <ListItem button>
                    <Link href="/admin/login" style={linkStyle}>
                      Log In
                    </Link>
                  </ListItem>
                  <ListItem button>
                    <Link href="/admin/register" style={linkStyle}>
                      Register
                    </Link>
                  </ListItem>
                </>
              )}
            </List>
          </Drawer>
        </>
      ) : (
        <AppBar
          position="static"
          style={{ background: "transparent", boxShadow: "none" }}
        >
          <Toolbar>
            <Typography style={{ marginRight: "40px" }}>
              {isLoggedin ? (
                <Link href="/admin/dashboard" style={linkStyle}>
                  Restaurante Wiz
                </Link>
              ) : (
                <Link href="/admin" style={linkStyle}>
                  Restaurante Wiz
                </Link>
              )}
            </Typography>
            <Typography style={{ marginRight: "20px" }}>
              <Link href="/about" style={linkStyle}>
                About
              </Link>
            </Typography>
            <Typography style={{ marginRight: "20px" }}>
              <Link href="/contact" style={linkStyle}>
                Contact
              </Link>
            </Typography>

            <div style={{ flexGrow: 1 }}></div>

            {isLoggedin ? (
              <>
                <Typography style={{ marginRight: "40px" }}>
                  <Link href="/admin/promotion/edit" style={linkStyle}>
                    Edit Promotions
                  </Link>
                </Typography>
                <Typography style={{ marginRight: "40px" }}>
                  <Link href="/admin/menu/edit" style={linkStyle}>
                    Edit Menu
                  </Link>
                </Typography>
                <Typography style={{ marginRight: "30px" }}>
                  <Link href="/admin/theme/edit" style={linkStyle}>
                    Edit Theme
                  </Link>
                </Typography>
                <Typography style={{ marginRight: "30px" }}>
                  <Link href="/" style={linkStyle}>
                    Edit Info
                  </Link>
                </Typography>
                <Typography>
                  <Link href="/admin/login" onClick={logout} style={linkStyle}>
                    Logout
                  </Link>
                </Typography>
              </>
            ) : (
              <>
                <Typography style={{ marginRight: "40px" }}>
                  <Link href="/admin/login" style={linkStyle}>
                    Log In
                  </Link>
                </Typography>
                <Typography>
                  <Link href="/admin/register" style={linkStyle}>
                    Register
                  </Link>
                </Typography>
              </>
            )}
          </Toolbar>
        </AppBar>
      )}
    </>
  );
}
