import React, { useMemo, useState } from "react";
import "./style.css";
import NavLink from "./Navlink";
import {
  AutoAwesomeMosaicOutlined as MasterIcon,
  AssessmentOutlined as ReportsIcon,
  FlashOn as QuickAccessIcon,
  SettingsOutlined as SettingsIcon,
  UpgradeOutlined,
} from "@mui/icons-material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useLocation } from "react-router-dom";
let titleData = [
  { value: "itemCategory", name: "Item Category" },
  { value: "credentials", name: "Organization Data" },
  { value: "item", name: "Item" },
  { value: "admin", name: "DASHBOARD" },
];
const Sidebar = ({ setIsItemAvilableOpen }) => {
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const updateMinLevel = async () => {
    if (loading) return;
    setLoading(true);
    const response = await axios({
      method: "get",
      url: "MinLevelUpdate",

      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response.data.result.user_type);
    setLoading(false);
  };
  document.title = useMemo(() => {
    let title = titleData.find((a) => location.pathname.includes(a.value));

    return title.name || "BT";
  }, [location]);
  return (
    <div
      className="left-panel"
      style={{ position: "relative", zIndex: "9000000" }}
    >
      <div className="nav" style={{ height: "100vh",marginTop:"80px" }}>
        <NavLink
          title={"Master"}
          icon={<MasterIcon sx={{ fontSize: 50 }} />}
          isActive={true}
          menuList={[
            {
              name: "Item Category",
              link: "/admin/itemCategory",
            },
            {
              name: "Item",
              link: "/admin/item",
            },
          ]}
        />

        <NavLink
          setIsItemAvilableOpen={setIsItemAvilableOpen}
          title={"Quick Access"}
          icon={<QuickAccessIcon sx={{ fontSize: 50 }} />}
          isActive={false}
          menuList={[
            {
              name: "Trips",
              link: "#",
            },
            {
              name: "Signed Bills",
              link: "/admin/signedBills",
            },
            {
              name: "Tasks",
              link: "/admin/tasks",
            },
          ]}
        />
        <NavLink
          title={"Report"}
          icon={<AssessmentIcon sx={{ fontSize: 50 }} />}
          isActive={false}
          menuList={[
            {
              name: "User Activity",
              link: "/admin/userActivity",
            },
            {
              name: "UPI and Cheque Transaction",
              link: "/admin/upiTransactionReport",
            },
            {
              name: "Completed Orders",
              link: "/admin/completeOrderReport",
            },
            {
              name: "Items Wise",
              link: "/admin/OrderItemReport",
            },
            {
              name: "Completed Trips",
              link: "/admin/CompletedTripsReport",
            },
            {
              name: "Counter Ledger",
              link: "/admin/CounterLeger",
            },
            {
              name: "Outstandings",
              link: "/admin/Outstandings",
            },
            {
              name: "Pending Entry",
              link: "/admin/pendingEntry",
            },
            {
              name: "Current Stock",
              link: "/admin/currentStock",
            },
            {
              name: "Vochers",
              link: "/admin/stockTransferVochers",
            },
            {
              name: "Cancel Order",
              link: "/admin/cancelOrders",
            },
            {
              name: "Invoice Number Wise Order",
              link: "/admin/InvoiceNumberWiseOrder",
            },
            {
              name: "Party Wise Company Discount",
              link: "/admin/PartyWiseCompanyDiscount",
            },
            {
              name: "Retailer Margin Report",
              link: "/admin/RetailerMarginReport",
            },
          ]}
        />
        <NavLink
          title={"Setup"}
          icon={<SettingsIcon sx={{ fontSize: 50 }} />}
          isActive={false}
          menuList={[
            {
              name: "Organization Data",
              link: "/admin/credentials",
            },

          ]}
        />
        <div
          className="nav_link_container"
          onClick={updateMinLevel}
          style={{ width: "100%" }}
        >
          <div className={`nav-link`}>
            <>
              <UpgradeOutlined sx={{ fontSize: 50 }} />
              <p>
                <span className={`nav_title`}>Update MinLevel</span>
              </p>
            </>
            {/* Submenu popup*/}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
