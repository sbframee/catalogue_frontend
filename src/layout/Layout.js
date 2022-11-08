import React, { useCallback, useEffect, useState } from "react";
import AppBar from "../layout/AppBar";
import ContentWrapper from "../layout/ContentWrapper";
import { styled } from "@mui/material/styles";

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
 
  return (
    <>
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
            <Box
              sx={{ borderBottom: 1, borderColor: "divider", width: "100vw" }}
            >
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
                
                />
              </TabPanel>
            ))}
          </Box>
        </div>
      </div>

    </>
  );
};

export default Layout;
