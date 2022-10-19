import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid";
import "./styles.css";
import axios from "axios";
import { DeleteOutline, Edit } from "@mui/icons-material";
const ItemCompanies = () => {
  const [itemCategories, setItemCategories] = useState([]);
  const [filterItemCategories, setFilterItemCategories] = useState([]);
  const [deletePopup, setDeletePopup] = useState(false);
  const [filterItemCategoriesTitle, setFilterItemCategoriesTitle] =
    useState("");

  const [popupForm, setPopupForm] = useState(false);
  const getItemCategories = async () => {
    const response = await axios({
      method: "get",
      url:
        "/ItemCategories/getItemCategories/" +
        localStorage.getItem("organization_uuid"),

      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) setItemCategories(response.data.result);
  };

  useEffect(() => {
    getItemCategories();
  }, [popupForm]);

  useEffect(
    () =>
      setFilterItemCategories(
        itemCategories
          .filter((a) => a.category_title)
          .filter(
            (a) =>
              !filterItemCategoriesTitle ||
              a.category_title
                .toLocaleLowerCase()
                .includes(filterItemCategoriesTitle.toLocaleLowerCase())
          )
      ),
    [itemCategories, filterItemCategoriesTitle]
  );

  return (
    <>
      <Sidebar />
      <Header />
      <div className="item-sales-container orders-report-container">
        <div id="heading">
          <h2>Item Categories</h2>
        </div>
        <div id="item-sales-top">
          <div
            id="date-input-container"
            style={{
              overflow: "visible",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <input
              type="text"
              onChange={(e) => setFilterItemCategoriesTitle(e.target.value)}
              value={filterItemCategoriesTitle}
              placeholder="Search Category Title..."
              className="searchInput"
            />

            <div>Total Items: {filterItemCategories.length}</div>
            <button
              className="item-sales-search"
              onClick={() => setPopupForm(true)}
            >
              Add
            </button>
          </div>
        </div>
        <div className="table-container-user item-sales-container">
          <Table
            itemsDetails={filterItemCategories}
            setPopupForm={setPopupForm}
            setDeletePopup={setDeletePopup}
          />
        </div>
      </div>
      {popupForm ? (
        <NewUserForm
          onSave={() => setPopupForm(false)}
          setRoutesData={setItemCategories}
          popupInfo={popupForm}
        />
      ) : (
        ""
      )}
      {deletePopup ? (
        <DeleteItemPopup
          onSave={() => setDeletePopup(false)}
          setItemsData={setItemCategories}
          popupInfo={deletePopup}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default ItemCompanies;
function Table({ itemsDetails, setPopupForm, setDeletePopup }) {
  const [items, setItems] = useState("sort_order");
  const [order, setOrder] = useState("");
  return (
    <table
      className="user-table"
      style={{ maxWidth: "100vw", height: "fit-content", overflowX: "scroll" }}
    >
      <thead>
        <tr>
          <th>S.N</th>

          <th colSpan={2}>
            <div className="t-head-element">
              <span>Category Title</span>
              <div className="sort-buttons-container">
                <button
                  onClick={() => {
                    setItems("category_title");
                    setOrder("asc");
                  }}
                >
                  <ChevronUpIcon className="sort-up sort-button" />
                </button>
                <button
                  onClick={() => {
                    setItems("category_title");
                    setOrder("desc");
                  }}
                >
                  <ChevronDownIcon className="sort-down sort-button" />
                </button>
              </div>
            </div>
          </th>
          <th colSpan={2}></th>
        </tr>
      </thead>
      <tbody className="tbody">
        {itemsDetails
          .sort((a, b) =>
            order === "asc"
              ? typeof a[items] === "string"
                ? a[items].localeCompare(b[items])
                : a[items] - b[items]
              : typeof a[items] === "string"
              ? b[items].localeCompare(a[items])
              : b[items] - a[items]
          )
          ?.map((item, i) => (
            <tr key={Math.random()} style={{ height: "30px" }}>
              <td>{i + 1}</td>

              <td colSpan={2}>{item.category_title}</td>
              <td
                colSpan={1}
                onClick={(e) => {
                  e.stopPropagation();

                  setPopupForm({ type: "edit", data: item });
                }}
              >
                <Edit />
              </td>
              <td
                colSpan={1}
                onClick={(e) => {
                  e.stopPropagation();

                  setDeletePopup(item);
                }}
              >
                <DeleteOutline />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
function NewUserForm({ onSave, popupInfo, setRoutesData }) {
  const [data, setdata] = useState();
  const [errMassage, setErrorMassage] = useState("");
  useEffect(() => {
    if (popupInfo?.type === "edit") setdata(popupInfo.data);
    else
      setdata({
        status: 1,
        organization_uuid: localStorage.getItem("organization_uuid"),
      });
  }, [popupInfo.data, popupInfo?.type]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!data.category_title) {
      setErrorMassage("Please insert Category Title");
      return;
    }
    if (popupInfo?.type === "edit") {
      const response = await axios({
        method: "put",
        url: "/ItemCategories/putItemCategories",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setRoutesData((prev) =>
          prev.map((i) => (i.user_uuid === data.user_uuid ? data : i))
        );
        onSave();
      }
    } else {
      const response = await axios({
        method: "post",
        url: "/ItemCategories/postItemCategories",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setRoutesData((prev) => [...prev, data]);
        onSave();
      }
    }
  };

  return (
    <div className="overlay">
      <div
        className="modal"
        style={{ height: "fit-content", width: "fit-content" }}
      >
        <div
          className="content"
          style={{
            height: "fit-content",
            padding: "20px",
            width: "fit-content",
          }}
        >
          <div style={{ overflowY: "scroll" }}>
            <form className="form" onSubmit={submitHandler}>
              <div className="row">
                <h1>{popupInfo.type === "edit" ? "Edit" : "Add"} Category</h1>
              </div>

              <div className="formGroup">
                <div className="row">
                  <label className="selectLabel">
                    Category Title
                    <input
                      type="text"
                      name="route_title"
                      className="numberInput"
                      value={data?.category_title}
                      onChange={(e) =>
                        setdata({
                          ...data,
                          category_title: e.target.value,
                        })
                      }
                      maxLength={42}
                    />
                  </label>
                  <label className="selectLabel">
                    Sort Order
                    <input
                      type="number"
                      onWheel={(e) => e.target.blur()}
                      name="sort_order"
                      className="numberInput"
                      value={data?.sort_order}
                      onChange={(e) =>
                        setdata({
                          ...data,
                          sort_order: e.target.value,
                        })
                      }
                    />
                  </label>
                </div>
                <div className="row">
                  <label className="selectLabel">
                    Status
                    <div
                      className="flex"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                      }}
                    >
                      <div className="flex">
                        <input
                          type="radio"
                          name="sort_order"
                          className="numberInput"
                          checked={data?.status}
                          style={{ height: "25px" }}
                          onClick={() =>
                            setdata((prev) => ({ ...prev, status: 1 }))
                          }
                        />
                        On
                      </div>
                      <div className="flex">
                        <input
                          type="radio"
                          name="sort_order"
                          className="numberInput"
                          checked={!data?.status}
                          style={{ height: "25px" }}
                          onClick={() =>
                            setdata((prev) => ({ ...prev, status: 0 }))
                          }
                        />
                        Off
                      </div>
                    </div>
                  </label>
                </div>
              </div>
              <i style={{ color: "red" }}>
                {errMassage === "" ? "" : "Error: " + errMassage}
              </i>

              <button type="submit" className="submit">
                Save changes
              </button>
            </form>
          </div>
          <button onClick={onSave} className="closeButton">
            x
          </button>
        </div>
      </div>
    </div>
  );
}
function DeleteItemPopup({ onSave, popupInfo, setItemsData }) {
  const [errMassage, setErrorMassage] = useState(false);
  const [enable, setEnable] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => setEnable(true), 5000);
  }, [errMassage]);
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios({
        method: "delete",
        url: "/ItemCategories/deleteItemCategories",
        data: { category_uuid: popupInfo.category_uuid },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setItemsData((prev) =>
          prev.filter((i) => i.category_uuid !== popupInfo.category_uuid)
        );
        onSave();
      } else {
        setErrorMassage(response.data.message);
      }
    } catch (err) {
      console.log(err);
      setErrorMassage("Order already exist");
    }
    setLoading(false);
  };
  const submitConfirmHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios({
        method: "delete",
        url: "/ItemCategories/deleteAllItemCategories",
        data: { category_uuid: popupInfo.category_uuid },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setItemsData((prev) =>
          prev.filter((i) => i.category_uuid !== popupInfo.category_uuid)
        );
        onSave();
      } else {
        setErrorMassage(response.data.message);
      }
    } catch (err) {
      console.log(err);
      setErrorMassage("Order already exist");
    }
    setLoading(false);
  };

  return (
    <div className="overlay">
      <div
        className="modal"
        style={{ width: "fit-content", height: "fit-content" }}
      >
        <div
          className="content"
          style={{
            padding: "20px",
            width: "fit-content",
          }}
        >
          {!errMassage ? (
            <div style={{ overflowY: "scroll" }}>
              <form className="form" onSubmit={submitHandler}>
                <div className="row">
                  <h1>Confirm Delete ?</h1>
                </div>
                <div className="row">
                  <h1>{popupInfo.item_title}</h1>
                </div>

                <div
                  className="flex"
                  style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {loading ? (
                    <button
                      className="submit"
                      id="loading-screen"
                      style={{ background: "red", width: "120px" }}
                    >
                      <svg viewBox="0 0 100 100">
                        <path
                          d="M10 50A40 40 0 0 0 90 50A40 44.8 0 0 1 10 50"
                          fill="#ffffff"
                          stroke="none"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            dur="1s"
                            repeatCount="indefinite"
                            keyTimes="0;1"
                            values="0 50 51;360 50 51"
                          ></animateTransform>
                        </path>
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="submit"
                      style={{ background: "red" }}
                    >
                      Confirm
                    </button>
                  )}
                  <button type="button" className="submit" onClick={onSave}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          ) : (
            <div style={{ overflowY: "scroll" }}>
              <form className="form" onSubmit={submitConfirmHandler}>
                <div className="row">
                  <h1>{errMassage}</h1>
                </div>
                <div className="row">
                  <h1>{popupInfo.item_title}</h1>
                </div>

                <div
                  className="flex"
                  style={{
                    display: "flex",
                    alignContent: "center",
                    justifyContent: "space-between",
                    width: "100%",
                  }}
                >
                  {loading ? (
                    <button
                      className="submit"
                      id="loading-screen"
                      style={{ background: "red", width: "120px" }}
                    >
                      <svg viewBox="0 0 100 100">
                        <path
                          d="M10 50A40 40 0 0 0 90 50A40 44.8 0 0 1 10 50"
                          fill="#ffffff"
                          stroke="none"
                        >
                          <animateTransform
                            attributeName="transform"
                            type="rotate"
                            dur="1s"
                            repeatCount="indefinite"
                            keyTimes="0;1"
                            values="0 50 51;360 50 51"
                          ></animateTransform>
                        </path>
                      </svg>
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="submit"
                      style={{ background: "red", opacity: enable ? 1 : 0.5 }}
                      disabled={!enable}
                    >
                      Confirm
                    </button>
                  )}
                  <button type="button" className="submit" onClick={onSave}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
