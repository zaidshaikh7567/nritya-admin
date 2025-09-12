// src/components/Footer.js
import React from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Link,
  IconButton,
  Divider,
  Stack,
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  LinkedIn,
  Email,
  Phone,
  LocationOn,
} from '@mui/icons-material';

function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#000000',
        color: 'white',
        mt: 'auto',
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#67569E' }}>
              Nritya Admin
            </Typography>
            <Typography variant="body2" sx={{ mb: 2, color: '#b0b0b0', lineHeight: 1.6 }}>
              Empowering nritya admin with comprehensive management tools. 
            </Typography>
            <Stack direction="row" spacing={1}>
              <IconButton sx={{ color: '#67569E', '&:hover': { color: '#8B7AC8' } }}>
                <Facebook />
              </IconButton>
              <IconButton sx={{ color: '#67569E', '&:hover': { color: '#8B7AC8' } }}>
                <Twitter />
              </IconButton>
              <IconButton sx={{ color: '#67569E', '&:hover': { color: '#8B7AC8' } }}>
                <Instagram />
              </IconButton>
              <IconButton sx={{ color: '#67569E', '&:hover': { color: '#8B7AC8' } }}>
                <LinkedIn />
              </IconButton>
            </Stack>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} md={2}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#67569E' }}>
              Quick Links
            </Typography>
            <Stack spacing={1}>
              <Link href="/studiosCrud" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
                Studio Management
              </Link>
              <Link href="/workshopsCrud" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
                Workshop Management
              </Link>
              <Link href="/users" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
                User Management
              </Link>
              <Link href="/bookings" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
                Bookings
              </Link>
              <Link href="/transactions" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
                Transactions
              </Link>
            </Stack>
          </Grid>

          {/* Support */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#67569E' }}>
              Support
            </Typography>
            <Stack spacing={1}>
              <Link href="/user-kycs" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
                KYC Management
              </Link>
              <Link href="/instructors" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
                Instructor Management
              </Link>
              <Link href="/carouselImgMgmt" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
                Content Management
              </Link>
              <Link href="/data" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
                Analytics
              </Link>
            </Stack>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#67569E' }}>
              Contact Info
            </Typography>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Email sx={{ mr: 1, color: '#67569E', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="#b0b0b0">
                  support@nritya.co.in
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Phone sx={{ mr: 1, color: '#67569E', fontSize: '1.2rem' }} />
                <Typography variant="body2" color="#b0b0b0">
                  +91 9876543210
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'flex-start' }}>
                <LocationOn sx={{ mr: 1, color: '#67569E', fontSize: '1.2rem', mt: 0.2 }} />
                <Typography variant="body2" color="#b0b0b0">
                  India
                </Typography>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: '#333333' }} />

        {/* Bottom Section */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap' }}>
          <Typography variant="body2" color="#b0b0b0">
            © {new Date().getFullYear()} Nritya. All rights reserved.
          </Typography>
          <Stack direction="row" spacing={3}>
            <Link href="#" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
              Privacy Policy
            </Link>
            <Link href="#" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
              Terms of Service
            </Link>
            <Link href="#" color="#b0b0b0" underline="hover" sx={{ '&:hover': { color: '#67569E' } }}>
              Cookie Policy
            </Link>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}

export default Footer;
