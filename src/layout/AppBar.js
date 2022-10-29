import * as React from "react";
import { AppBar, Container, Toolbar } from "@mui/material";
import { HiBars3 } from "react-icons/hi2";
import { ShoppingCart } from "@mui/icons-material";

const ResponsiveAppBar = ({ organization }) => {
  return (
    <AppBar
      position="static"
      style={{ background: organization?.theme_color || "#000" }}
    >
      <Container maxWidth="xl">
        <Toolbar
          disableGutters
          style={{
            minWidth: "300px",
            flex: "1",
            justifyContent: "space-between",
          }}
        >
          <div
            style={{ width: "30px", height: "20px", objectFit: "contain" }}
            className="flex"
          >
            <HiBars3 style={{ fontSize: "30px", fontWeight: "bold" }} />
          </div>

          {organization?.organization_logo ? (
            <img
              src={organization?.organization_logo}
              alt="NoImage"
              style={{ width: "200px", objectFit: "contain" }}
            />
          ) : (
            ""
          )}
          {organization?.organization_title ? (
            <h4 style={{ width: "200px" }}>
              {organization?.organization_title || ""}
            </h4>
          ) : (
            ""
          )}
          <div>
            <ShoppingCart />
          </div>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default ResponsiveAppBar;
