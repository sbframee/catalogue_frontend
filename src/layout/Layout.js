import React, { useCallback, useEffect, useState } from "react";
import AppBar from "../layout/AppBar";
import ContentWrapper from "../layout/ContentWrapper";
import { styled } from "@mui/material/styles";
import { BsTelephoneFill } from "react-icons/bs";
import WhatsApp from "../assets/whatsapp.svg";
import { motion } from "framer-motion";
import Fab from "@mui/material/Fab";
import axios from "axios";

import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { ArrowDropDown } from "@mui/icons-material";

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3, padding: 0 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

const Layout = ({ organization }) => {
  const [item_categories, setItemCategories] = useState([]);
  const [activecategories, setActiveCategories] = useState({});
  const [dropdown, setDropDown] = useState(false);
  const [height, setHeight] = useState(null);
  const parentElement = useCallback(
    (node) => {
      if (node !== null) {
        setHeight(node.getBoundingClientRect().height);
      }
    },
    [activecategories]
  );
  console.log(organization);
  const StyledTab = styled((props) => <Tab disableRipple {...props} />)(
    ({ theme }) => ({
      "&.Mui-selected": {
        color: organization?.theme_color || "#000",
        borderBottom: `2px solid ${organization?.theme_color || "#000"} `,
      },
    })
  );
  const GetOrganizationData = async (organization_uuid) => {
    const response = await axios({
      method: "get",
      url: "ItemCategories/getActiveItemCategories/" + organization_uuid,

      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      setItemCategories(
        response.data.result
          .map((a, i) => ({ ...a, index: i }))
          .sort((a, b) => +a.sort_order - +b.sort_order)
      );
    }
  };
  useEffect(() => {
    if (item_categories.length) setActiveCategories(item_categories[0]);
  }, [item_categories]);
  console.log(activecategories);
  function a11yProps(index) {
    return {
      id: index,
      "aria-controls": item_categories.find((a) => a.category_uuid === index),
      value: item_categories.find((a) => a.category_uuid === index),
    };
  }
  useEffect(() => {
    GetOrganizationData(organization?.organization_uuid);
  }, [organization?.organization_uuid]);

  const handleChange = (event, newValue) => {
    console.log(newValue);
    setActiveCategories(newValue);
  };
  const Buttons = () => (
    <>
        {dropdown && (
          <div
            className="overlay"
            style={{
              zIndex: "99999",
            }}
          >
            <motion.div
              id="customer-details-dropdown"
              initial={{ x: dropdown === "mobile" ? -100 : 100, y: 100 }}
              animate={{ x: 0, y: 0 }}
              className="flex"
              style={
                dropdown === "mobile"
                  ? {
                      bottom: "10vh",
                      left: "10%",
                      flexDirection: "column",
                      zIndex: "200",
                      width: "max-content",
                      height: "max-content",
                    }
                  : {
                      bottom: "10vh",
                      right: "10%",
                      flexDirection: "column",
                      zIndex: "200",
                      width: "max-content",
                      height: "max-content",
                    }
              }
              onMouseLeave={() => setDropDown(false)}
            >
              {dropdown === "mobile"
                ? organization?.org_call_number.map((a) => (
                    <button
                      style={{
                        padding: "10px",
                        backgroundColor: "#01a0e2",
                      }}
                      className="simple_Logout_button"
                      type="button"
                      onClick={() => {
                        window.open(`tel:+${a?.mobile}`);
                        setDropDown(false);
                      }}
                    >
                      {a.tag}
                    </button>
                  ))
                : organization?.org_whatsapp_number?.map((a) => (
                    <button
                      style={{
                        padding: "10px",
                        backgroundColor: "#0f9d15",
                      }}
                      className="simple_Logout_button"
                      type="button"
                      onClick={() => {
                        window.open(
                          `http://api.whatsapp.com/send?phone=${
                            a?.mobile
                          }&text=${encodeURI(a?.message)}`
                        );
                        setDropDown(false);
                      }}
                    >
                      {a.tag}
                    </button>
                  ))}
            </motion.div>
          </div>
        )}
      <motion.div
        className="flex"
        style={{
          // backgroundColor: "transparent",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontWeight: "600",

          letterSpacing: "2px",

          top: "90vh",

          left: "10%",
          backgroundColor: "#01a0e2",

          fontSize: "30px",
          position: "fixed",
          zIndex: dropdown === "mobile" ? "999999" : "9999",
        }}
        variant="extended"
        onClick={() => setDropDown((prev) => (prev ? "" : "mobile"))}
      >
        <BsTelephoneFill sx={{ mr: 1 }} style={{ color: "#fff" }} />
      </motion.div>
      <motion.div
        className="flex"
        style={{
          backgroundColor: "#0f9d15",
          borderRadius: "50%",
          width: "60px",
          height: "60px",
          fontWeight: "600",
          // color: "white",
          letterSpacing: "2px",
          position: "fixed",
          top: "90vh",

          right: "10%",
          zIndex: dropdown === "whatsapp" ? "999999" : "9999",
        }}
        variant="extended"
        onClick={() => setDropDown((prev) => (prev ? "" : "whatsapp"))}
      >
        <img src={WhatsApp} alt="" />
      </motion.div>
    </>
  );
  return (<>
    <div
      className="flex"
      style={{ width: "100vw", height: "100vh" }}
      ref={parentElement}
    >
      <div className="layout">
        <AppBar organization={organization} />
        <Box
          sx={{
            width: "100%",
            flexDirection: "column",
            justifyContent: "flex-start",
            alignItems: "flex-start",
            height: "cal(100vh - 56px)",
          }}
          className="flex"
        >
          <Box sx={{ borderBottom: 1, borderColor: "divider", width: "100vw" }}>
            <Tabs
              value={activecategories}
              onChange={handleChange}
              variant="scrollable"
              aria-label="scrollable force styled tabs  example"
              indicatorColor="#000"
            >
              {item_categories.map((item, i) => {
                return (
                  <StyledTab
                    key={i}
                    label={
                      item.category_title?.length > 10
                        ? item.category_title.slice(0, 10) + "..."
                        : item?.category_title
                    }
                    {...a11yProps(item.category_uuid)}
                  />
                );
              })}
            </Tabs>
          </Box>

          {item_categories.map((item, i) => (
            <TabPanel
              value={activecategories.index}
              index={item?.index}
              key={item?.category_uuid}
              className="flex"
            >
              <ContentWrapper
                organization={organization}
                activecategories={activecategories}
                Buttons={Buttons}
              />
            </TabPanel>
          ))}
        </Box>

      
      </div>
    </div>
    <Buttons />
    </>
  );
};

export default Layout;
