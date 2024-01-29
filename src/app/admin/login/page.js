"use client"
import { TextField, Button, Grid, Box, Container, Typography, AppBar, Toolbar } from "@mui/material";
import { useForm } from 'react-hook-form';
import Link from 'next/link';

export default function ManagementLoginPage() {
    const { register, handleSubmit } = useForm();

    const handleFormSubmit = (formData) => {
        console.log('form data is ', formData)
    }

    return (
        <>
            {/* Navbar */}
            <AppBar position="static">
                <Toolbar>
                    <Typography style={{ marginRight: '40px' }}>
                        <Link href="/about">About</Link>
                    </Typography>
                    <Typography>
                        <Link href="/contact">Contact</Link>
                    </Typography>

                    <div style={{ flexGrow: 1 }}></div>

                    <Typography style={{ marginRight: '40px' }}>
                        <Link href="/admin/login">Log In</Link>
                    </Typography>
                    <Typography>
                        <Link href="/admin/register">Register</Link>
                    </Typography>
                </Toolbar>
            </AppBar>

            { /* Body */ }
            <Container component="main">
                <Box
                    sx={{
                        marginTop: 8,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                    }}
                >
                    <Typography variant="h3">Log In</Typography>

                    <Box component="form" onSubmit={handleSubmit(handleFormSubmit)} noValidate sx={{ mt: 5 }}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="email"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    {...register('email')}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    autoComplete="password"
                                    required
                                    id="password"
                                    label="Password"
                                    type="password"
                                    {...register('password')}
                                />
                            </Grid>
                        </Grid>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            style={{ backgroundColor: '#1976d2', width: '180px', height: '35px', marginTop: '2em' }}
                        >
                            Log In
                        </Button>
                    </Box>
                </Box>
            </Container>
        </>
    );
}
