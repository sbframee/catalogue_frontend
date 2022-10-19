import * as React from "react";
import {
  AppBar,
  Avatar,
  Box,
  Container,
  IconButton,
  Toolbar,
} from "@mui/material";
import logo from "../assets/logo.png";
import {
  WhatsApp,
  Call,
  AttachEmailOutlined as Email,
} from "@mui/icons-material";

const ResponsiveAppBar = ({ organization }) => {
  return (
    <AppBar position="static" style={{ background: "#F75253" }}>
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          style={{
            minWidth: "300px",
            flex: "1",
            justifyContent: "space-between",
          }}
        >
          {console.log(organization)}
          {organization?.organization_logo ? (
            <img
              src={organization?.organization_logo}
              alt="NoImage"
              style={{ width: "50px", height: "50px",objectFit:"contain" }}
            />
          ) : (
            ""
          )}
          <h4 style={{width:"100%"}}>{organization?.organization_title || ""}</h4>
          {/* <Avatar src={logo} alt="logo" sx={{ width: 48, height: 48 }} /> */}
          {/* <Box>
            <IconButton
              aria-label="WhatsApp Us"
              color="inherit"
              href={`http://api.whatsapp.com/send?phone=+919146780897&text=${encodeURI(
                "Hi, I would like to know more about the product"
              )}`}
            >
              <WhatsApp />
            </IconButton>
            <IconButton
              aria-label="Call Us"
              color="inherit"
              href="tel:+919146780897"
            >
              <Call />
            </IconButton>
            <IconButton
              aria-label="Email Us"
              color="inherit"
              href="mailto:support@fooddo.in"
            >
              <Email />
            </IconButton>
          </Box> */}
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
