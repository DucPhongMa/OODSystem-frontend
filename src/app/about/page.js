"use client"
import { Box, Typography, Grid, Container, Paper } from '@mui/material';
import MainNavbar from '../components/admin/register/MainNavbar';
import Image from 'next/image';

export default function AboutPage() {
    return (
        <>
            <MainNavbar isLoggedin={false} />

            <Container maxWidth="lg" sx={{ mt: 8, mb: 8 }}>
                {/* Hero Section */}
                <Box sx={{ my: 4, textAlign: 'center' }}>
                    <Typography variant="h3" component="h1" gutterBottom>
                        About Us
                    </Typography>
                    <Typography variant="subtitle1" color="text.secondary">
                        Learn more about our mission, vision, and values.
                    </Typography>
                </Box>

                {/* Image and Intro Section */}
                <Grid container spacing={4} alignItems="center">
                    <Grid item xs={12} md={6}>
                        <Image
                            src="https://picsum.photos/650/600"
                            alt="About Us Image"
                            width={650}
                            height={400}
                            layout="responsive"
                            style={{ borderRadius: '8px' }}
                        />
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Typography variant="h5" gutterBottom>
                            Our Mission
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Our mission is to empower restaurant owners with a digital presence that enhances their customer's experience, offering an intuitive and efficient online ordering system.
                        </Typography>
                    </Grid>
                </Grid>

                {/* Our Story Section */}
                <Paper elevation={3} sx={{ p: 4, mt: 6, bgcolor: 'background.paper' }}>
                    <Typography variant="h5" gutterBottom>
                        Our Story
                    </Typography>
                    <Typography variant="body1" paragraph>
                        Born from the need to bridge the gap between restaurants and digital convenience, our platform was envisioned as a one-stop solution for restaurant owners. From humble beginnings, we have grown into a service trusted by numerous establishments across the country.
                    </Typography>
                </Paper>

                {/* Values Section */}
                <Box sx={{ mt: 6 }}>
                    <Typography variant="h5" gutterBottom>
                        Our Values
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" gutterBottom>
                                Customer First
                            </Typography>
                            <Typography>
                                We prioritize the needs and satisfaction of our customers above all else, ensuring every interaction adds value.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" gutterBottom>
                                Innovation
                            </Typography>
                            <Typography>
                                Continuously seeking out new ways to improve and evolve our platform to meet the changing needs of the industry.
                            </Typography>
                        </Grid>
                        <Grid item xs={12} sm={4}>
                            <Typography variant="h6" gutterBottom>
                                Integrity
                            </Typography>
                            <Typography>
                                Conducting business with the highest standards of professionalism and ethical principles.
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Container>
        </>
    );
}
