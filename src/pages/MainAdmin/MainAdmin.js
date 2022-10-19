
import React from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "./style.css";


// import VerticalTabs from "../../components/VerticalTabs";

const MainAdmin = () => {
  return (
    <>
      <Sidebar />
      <div className="right-side">
        <Header />
  
        <div style={{ display: "flex", height: "100%" }}>
          {/* <VerticalTabs /> */}
          <div className="inputs"></div>

          <div className="content-container" id="content-file-container">
            <div className="noOrder">No Order</div>

            <div
              className="searchBar"
              style={{
                width: "400px",
              }}
            >
              <input
                type="text"
                placeholder="Search..."
                // value={searchItems}
                // onChange={(e) => setSearhItems(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default MainAdmin;
