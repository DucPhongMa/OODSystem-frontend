"use client"
import { useEffect, useState } from "react"
import { checkLogin } from "@/app/api/auth"
import {
  AppBar,
  Toolbar,
  Button,
  Grid,
  Paper,
  Box,
  Typography,
} from "@mui/material";
import Link from "next/link";
import { LineChart, PieChart  } from '@mui/x-charts';

const data = [
  { id: 0, value: 10, label: 'series A' },
  { id: 1, value: 15, label: 'series B' },
  { id: 2, value: 20, label: 'series C' },
];

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  useEffect(() => {
    const checkLoggedIn = checkLogin()
    console.log(checkLoggedIn)
    setIsLoggedIn(checkLoggedIn)
    setIsLoading(false)
  }, [])

  return isLoading ? (
    <div>"Is Loading"</div>
  ) : isLoggedIn ? (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }} />
          <Link href="/edit-menu" passHref>
            <Button color="inherit">Edit Menu</Button>
          </Link>
          <Link href="/edit-theme" passHref>
            <Button color="inherit">Edit Theme</Button>
          </Link>
          <Link href="/edit-info" passHref>
            <Button color="inherit">Edit Info</Button>
          </Link>
          <Link href="/admin/login" passHref>
            <Button color="inherit">Logout</Button>
          </Link>
        </Toolbar>
      </AppBar>
      <Box mt={4} textAlign="center">
        <Typography variant="h4" fontWeight="bold">Dashboard</Typography>
      </Box>
      <Grid container spacing={3} style={{ padding: "20px" }}>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "20px", height: "100%" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Pick Up Order System
            </Typography>
            <Typography>Placed Orders: 313</Typography>
            <Typography>Success Orders: 290</Typography>
            <Typography>Fail Orders: 23</Typography>
            <Typography>Successful Order Rate: 92%</Typography>
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              <Grid item xs={6}>
                <Link href="/order-history" passHref>
                  <Button variant="contained" color="primary" fullWidth>
                    View Order History
                  </Button>
                </Link>
                
              </Grid>
              <Grid item xs={6}>
              <Link href="/order-dashboard" passHref>
                  <Button variant="contained" color="primary" fullWidth>
                    View Order Dashboard
                  </Button>
                </Link>
              </Grid>
            </Grid>
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              <Grid item xs={12}>
                <Box border={1} height={280}>
                  <LineChart
                    xAxis={[{ data: [1, 2, 3, 5, 8, 10] }]}
                    series={[
                      {
                        data: [2, 5.5, 2, 8.5, 1.5, 5],
                        area: true,
                      },
                    ]}
                    height={300}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper style={{ padding: "20px", height: "100%" }}>
            <Typography variant="h5" fontWeight="bold" gutterBottom>
              Website
            </Typography>
            <Typography>Total visitors: 900</Typography>
            <Typography>Monthly visitors: 254</Typography>
            <Typography>Most Traffic Month: August</Typography>
            <br />
            <Link href="http://localhost:3000/uniqueroute1223" passHref>
              <Button
                variant="contained"
                color="secondary"
                fullWidth
                style={{ marginTop: "35px" }}
              >
                View Website
              </Button>
            </Link>
          
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              <Grid item xs={12}>
                <Box border={1} height={280}>
                  <PieChart
                    series={[
                      {
                        data: [
                          { id: 0, value: 10, label: 'series A' },
                          { id: 1, value: 15, label: 'series B' },
                          { id: 2, value: 20, label: 'series C' },
                        ],
                      },
                    ]}
                    margin={{ top: 30, bottom: 30 }}
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
    </div>
  ) : (
    <div>"You are not auth"</div>
  )
}
