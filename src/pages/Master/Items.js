import React, { useState, useEffect } from "react";
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import { ChevronUpIcon, ChevronDownIcon } from "@heroicons/react/solid";
import { Cancel, DeleteOutline, Edit, Image } from "@mui/icons-material";
import axios from "axios";
const ItemsPage = () => {
  const [itemsData, setItemsData] = useState([]);
  const [disabledItem, setDisabledItem] = useState(false);

  const [filterItemsData, setFilterItemsData] = useState([]);
  const [itemCategories, setItemCategories] = useState([]);

  const [popupForm, setPopupForm] = useState(false);
  const [deletePopup, setDeletePopup] = useState(false);
  const [pictureUploadPopup, setPictureUploadPopup] = useState(false);
  const [filterTitle, setFilterTitle] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

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
  const getItemsData = async () => {
    const response = await axios({
      method: "get",
      url: "/Items/getItems/" + localStorage.getItem("organization_uuid"),

      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success)
      setItemsData(
        response.data.result.map((b) => ({
          ...b,

          category_title:
            itemCategories.find((a) => a.category_uuid === b.category_uuid)
              ?.category_title || "-",
        }))
      );
  };
  useEffect(() => {
    getItemsData();
  }, [popupForm, itemCategories]);
  useEffect(
    () =>
      setFilterItemsData(
        itemsData
          .filter((a) => a.item_title)
          .filter((a) => disabledItem || +a.status)
          .filter(
            (a) =>
              !filterTitle ||
              a.item_title
                .toLocaleLowerCase()
                .includes(filterTitle.toLocaleLowerCase())
          )

          .filter(
            (a) =>
              !filterCategory ||
              a.category_title
                .toLocaleLowerCase()
                .includes(filterCategory.toLocaleLowerCase())
          )
      ),
    [itemsData, filterTitle, filterCategory, disabledItem]
  );

  useEffect(() => {
    getItemCategories();
  }, []);
  return (
    <>
      <Sidebar />
      <Header />
      <div className="item-sales-container orders-report-container">
        <div id="heading">
          <h2>Items</h2>
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
              onChange={(e) => setFilterTitle(e.target.value)}
              value={filterTitle}
              placeholder="Search Item Title..."
              className="searchInput"
            />

            <input
              type="text"
              onChange={(e) => setFilterCategory(e.target.value)}
              value={filterCategory}
              placeholder="Search Category..."
              className="searchInput"
            />
            <div>Total Items: {filterItemsData.length}</div>
            <div
              style={{
                display: "flex",
                width: "120px",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <input
                type="checkbox"
                onChange={(e) => setDisabledItem(e.target.checked)}
                value={disabledItem}
                className="searchInput"
                style={{ scale: "1.2" }}
              />
              <div style={{ width: "100px" }}>Disabled Items</div>
            </div>

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
            itemsDetails={filterItemsData}
            categories={itemCategories}
            setPopupForm={setPopupForm}
            setDeletePopup={setDeletePopup}
            setPictureUploadPopup={setPictureUploadPopup}
          />
        </div>
      </div>
      {popupForm ? (
        <NewUserForm
          onSave={() => setPopupForm(false)}
          setItemsData={setItemsData}
          itemCategories={itemCategories}
          popupInfo={popupForm}
          items={itemsData}
          getItem={getItemsData}
        />
      ) : (
        ""
      )}
      {deletePopup ? (
        <DeleteItemPopup
          onSave={() => setDeletePopup(false)}
          setItemsData={setItemsData}
          popupInfo={deletePopup}
        />
      ) : (
        ""
      )}
      {pictureUploadPopup ? (
        <PicturesPopup
          onSave={() => setPictureUploadPopup(false)}
          setItemsData={setItemsData}
          popupInfo={pictureUploadPopup}
          getItem={getItemsData}
        />
      ) : (
        ""
      )}
    </>
  );
};

export default ItemsPage;
function Table({
  itemsDetails,
  setPopupForm,
  setDeletePopup,
  setPictureUploadPopup,
}) {
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

          <th colSpan={3}>
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
          <th colSpan={3}>
            <div className="t-head-element">
              <span>Item Title</span>
              <div className="sort-buttons-container">
                <button
                  onClick={() => {
                    setItems("item_title");
                    setOrder("asc");
                  }}
                >
                  <ChevronUpIcon className="sort-up sort-button" />
                </button>
                <button
                  onClick={() => {
                    setItems("item_title");
                    setOrder("desc");
                  }}
                >
                  <ChevronDownIcon className="sort-down sort-button" />
                </button>
              </div>
            </div>
          </th>
          <th colSpan={2}>
            <div className="t-head-element">
              <span>Description</span>
              <div className="sort-buttons-container">
                <button
                  onClick={() => {
                    setItems("description");
                    setOrder("asc");
                  }}
                >
                  <ChevronUpIcon className="sort-up sort-button" />
                </button>
                <button
                  onClick={() => {
                    setItems("description");
                    setOrder("desc");
                  }}
                >
                  <ChevronDownIcon className="sort-down sort-button" />
                </button>
              </div>
            </div>
          </th>
          <th colSpan={2}>
            <div className="t-head-element">
              <span>Sort Order</span>
              <div className="sort-buttons-container">
                <button
                  onClick={() => {
                    setItems("sort_order");
                    setOrder("asc");
                  }}
                >
                  <ChevronUpIcon className="sort-up sort-button" />
                </button>
                <button
                  onClick={() => {
                    setItems("sort_order");
                    setOrder("desc");
                  }}
                >
                  <ChevronDownIcon className="sort-down sort-button" />
                </button>
              </div>
            </div>
          </th>
          <th colSpan={2}>
            <div className="t-head-element">
              <span>Status</span>
              <div className="sort-buttons-container">
                <button
                  onClick={() => {
                    setItems("status");

                    setOrder("asc");
                  }}
                >
                  <ChevronUpIcon className="sort-up sort-button" />
                </button>
                <button
                  onClick={() => {
                    setItems("status");
                    setOrder("desc");
                  }}
                >
                  <ChevronDownIcon className="sort-down sort-button" />
                </button>
              </div>
            </div>
          </th>

          <th colSpan={3}></th>
        </tr>
      </thead>
      <tbody className="tbody">
        {itemsDetails
          .map((a) => ({ ...a, item_discount: +a.item_discount || 0 }))
          .sort((a, b) =>
            order === "asc"
              ? typeof a[items] === "string"
                ? a[items]?.localeCompare(b[items])
                : a[items] - b[items]
              : typeof a[items] === "string"
              ? b[items]?.localeCompare(a[items])
              : b[items] - a[items]
          )
          ?.map((item, i) => (
            <tr
              key={Math.random()}
              style={{ height: "30px" }}
              onClick={() => {}}
            >
              <td>{i + 1}</td>

              <td colSpan={3}>{item.category_title}</td>
              <td colSpan={3}>{item.item_title}</td>
              <td colSpan={2}>{item.description}</td>
              <td colSpan={2}>{item.sort_order || 0}</td>
              <td colSpan={2}>{item.status}</td>

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
              <td
                colSpan={1}
                onClick={(e) => {
                  e.stopPropagation();

                  setPictureUploadPopup(item);
                }}
              >
                <Image />
              </td>
            </tr>
          ))}
      </tbody>
    </table>
  );
}
function NewUserForm({ onSave, popupInfo, itemCategories, getItem }) {
  const [data, setdata] = useState({});

  const [errMassage, setErrorMassage] = useState("");

  useEffect(() => {
    if (popupInfo?.type === "edit")
      setdata({
        status: 1,
        ...popupInfo.data,
      });
    else
      setdata({
        category_uuid: itemCategories[0]?.category_uuid,

        status: 1,
      });
  }, [itemCategories, popupInfo.data, popupInfo?.type]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!data.item_title) {
      setErrorMassage("Please insert Item Title");
      return;
    }

    if (popupInfo?.type === "edit") {
      const response = await axios({
        method: "put",
        url: "/Items/putItem",
        data: data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        getItem();
        onSave();
      }
    } else {
      const response = await axios({
        method: "post",
        url: "/Items/postItem",
        data,
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        getItem();
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
                <h1>{popupInfo.type === "edit" ? "Edit" : "Add"} Items</h1>
              </div>

              <div className="formGroup">
                <div className="row">
                  <label className="selectLabel">
                    Item Title
                    <input
                      type="text"
                      name="route_title"
                      className="numberInput"
                      value={data?.item_title}
                      onChange={(e) =>
                        setdata({
                          ...data,
                          item_title: e.target.value,
                        })
                      }
                      maxLength={60}
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
                    Item Category
                    <select
                      name="user_type"
                      className="select"
                      value={data?.category_uuid}
                      onChange={(e) =>
                        setdata({
                          ...data,
                          category_uuid: e.target.value,
                        })
                      }
                    >
                      {itemCategories
                        .filter((a) => a.company_uuid === data.company_uuid)
                        .sort((a, b) => a.sort_order - b.sort_order)
                        .map((a) => (
                          <option value={a.category_uuid}>
                            {a.category_title}
                          </option>
                        ))}
                    </select>
                  </label>
                  <label className="selectLabel">
                    Price
                    <input
                      type="number"
                      name="route_title"
                      className="numberInput"
                      value={data?.price}
                      onChange={(e) =>
                        setdata({
                          ...data,
                          price: e.target.value,
                        })
                      }
                      maxLength={60}
                    />
                  </label>
                </div>
                <div className="row">
                  <label className="selectLabel">
                    Description
                    <textarea
                      type="text"
                      onWheel={(e) => e.target.blur()}
                      name="sort_order"
                      className="numberInput"
                      value={data?.description}
                      style={{ height: "100px" }}
                      onChange={(e) =>
                        setdata({
                          ...data,
                          description: e.target.value,
                        })
                      }
                    />
                  </label>
                  <label className="selectLabel">
                    Status
                    <div
                      className="flex"
                      style={{ justifyContent: "space-between" }}
                    >
                      <div className="flex">
                        <input
                          type="radio"
                          name="sort_order"
                          className="numberInput"
                          checked={+data?.status}
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
                          checked={!+data.status}
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
function PicturesPopup({ onSave, popupInfo, getItem }) {
  const [data, setdata] = useState({});
  const [images, setImages] = useState();
  const [deleteImages, setDeletedImages] = useState([]);

  useEffect(() => {
    setdata(popupInfo || {});
  }, [popupInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();
    let itemData = data;
    let url = await axios.get("s3url");
    url = url.data.url;

    const result = await axios({
      url,
      method: "put",
      headers: { "Content-Type": "multipart/form-data" },
      data: images,
    });
    if (result.status === 200) {
      let image_url = url?.split("?")[0];
      itemData = {
        ...itemData,
        image_urls: itemData?.image_urls?.length
          ? [...itemData?.image_urls, image_url]
          : [image_url],
      };
    }

    const response = await axios({
      method: "put",
      url: "/Items/putItem",
      data: itemData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      getItem();
      onSave();
    }
  };
  const deleteSubmitHandler = async (e) => {
    e.preventDefault();
    let itemData = {
      ...data,
      image_urls: data.image_urls.filter((a) =>
        !deleteImages.find((b) => b === a)
      ),
    };

    const response = await axios({
      method: "put",
      url: "/Items/putItem",
      data: itemData,
      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      getItem();
      onSave();
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
                <h1>Items Images</h1>
              </div>

              <div className="formGroup">
                <div className="row">
                  <label
                    htmlFor="upload_image"
                    className="selectLabel file_upload"
                  >
                    <h2>
                      <Image />
                      Upload Image
                    </h2>

                    <input
                      type="file"
                      id="upload_image"
                      name="route_title"
                      className="numberInput"
                      style={{ display: "none" }}
                      onChange={
                        (e) => setImages(e.target.files[0])
                        // setImages((prev) =>
                        //   prev.length
                        //     ? [...prev, ...e.target.files]
                        //     : [...e.target.files]
                        // )
                      }
                      accept="image/*"
                      maxLength={60}
                    />
                  </label>
                  {images ? (
                    <div className="imageContainer">
                      <img
                        src={URL.createObjectURL(images)}
                        className="previwImages"
                        alt="yourimage"
                      />
                      <button
                        onClick={() => setImages(false)}
                        className="closeButton"
                        style={{
                          fontSize: "20px",
                          right: "5px",
                          padding: "0 10px",
                          width: "20px",
                          height: "20px",
                        }}
                      >
                        x
                      </button>
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              </div>
              <div className="formGroup">
                <div className="row">
                  {data?.image_urls?.length ? (
                    data?.image_urls.map((img) => (
                      <div
                        className="imageContainer"
                        style={
                          deleteImages.find((b) => b === img)
                            ? { border: "1px solid red" }
                            : {}
                        }
                      >
                        <img src={img} alt="NoImage" className="previwImages" />
                        {deleteImages.find((b) => b === img) ? (
                          <button
                            onClick={() =>
                              setDeletedImages((prev) =>
                                prev.filter((b) => b !== img)
                              )
                            }
                            className="closeButton"
                            style={{
                              fontSize: "20px",
                              right: "5px",
                              padding: "0 10px",
                              width: "20px",
                              height: "20px",
                            }}
                            type="button"
                          >
                            <Cancel fontSize="5px" />
                          </button>
                        ) : (
                          <button
                            onClick={() =>
                              setDeletedImages((prev) => [...prev, img])
                            }
                            className="closeButton"
                            style={{
                              fontSize: "20px",
                              right: "5px",
                              padding: "0 10px",
                              width: "20px",
                              height: "20px",
                            }}
                            type="button"
                          >
                            <DeleteOutline fontSize="5px" />
                          </button>
                        )}
                      </div>
                    ))
                  ) : (
                    <h1>No Image Uploaded yet</h1>
                  )}
                </div>
              </div>

              {images ? (
                <button type="submit" className="submit">
                  Upload Image
                </button>
              ) : (
                ""
              )}
              {deleteImages.length ? (
                <button
                  type="button"
                  className="submit"
                  onClick={deleteSubmitHandler}
                >
                  Save
                </button>
              ) : (
                ""
              )}
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
  const [errMassage, setErrorMassage] = useState("");
  const [enable, setEnable] = useState("");
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => setEnable(true), 5000);
  }, []);
  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios({
        method: "delete",
        url: "/Items/deleteItem",
        data: { item_uuid: popupInfo.item_uuid },
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.data.success) {
        setItemsData((prev) =>
          prev.filter((i) => i.item_uuid !== popupInfo.item_uuid)
        );
        onSave();
      }
    } catch (err) {
      console.log(err);
      setErrorMassage("Order already exist");
    }
    setLoading(false);
  };

  return (
    <div className="overlay">
      <div className="modal" style={{ width: "fit-content", height: "250px" }}>
        <div
          className="content"
          style={{
            height: "100px",
            padding: "20px",
            width: "fit-content",
          }}
        >
          <div style={{ overflowY: "scroll" }}>
            <form className="form" onSubmit={submitHandler}>
              <div className="row">
                <h1>
                  All the Item Images will be deleted.
                  <br /> Confirm Delete Item ?
                </h1>
              </div>
              <div className="row">
                <h1>{popupInfo.item_title}</h1>
              </div>

              <i style={{ color: "red" }}>
                {errMassage === "" ? "" : "Error: " + errMassage}
              </i>
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
        </div>
      </div>
    </div>
  );
}
