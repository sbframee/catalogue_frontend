import React, { useEffect, useMemo, useState } from "react";
import { Box } from "@mui/material";

import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
const TypesOfOutlets = ({ item, value }) => {
  const [position, setPosition] = useState(0);
  const pages = useMemo(
    () => item?.image_urls?.map((a, i) => ({ index: i, src: a })) || [],

    [item?.image_urls]
  );
  useEffect(() => {
    setPosition(pages[0]);
  }, [pages]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setPosition((prev) =>
        prev.index === pages.length - 1
          ? prev
          : pages.find((a) => a?.index === position?.index + 1)
      );
      console.log("swipeup");
    },
    onSwipedRight: () => {
      setPosition((prev) =>
        prev.index === 0
          ? prev
          : pages.find((a) => a?.index === prev?.index - 1)
      );
      console.log("swipedown");
    },
    delta: 60, // min distance(px) before a swipe starts. *See Notes*
    preventScrollOnSwipe: true, // prevents scroll during swipe (*See Details*)
    trackTouch: true, // track touch input
    trackMouse: true, // track mouse input
    rotationAngle: 0, // set a rotation angle
    swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
    touchEventOptions: { passive: true },
  });
  return (
    <div
      {...handlers}
      style={{
        position: "relative",
        backgroundColor: "rgba(247, 82, 83,0.5)",
        width: "90%",
        height: "fit-content",
        borderRadius: "30px",
        padding: "10px",
        marginTop: "10px",
      }}
    >
      <h1 style={{ zIndex: "9999", padding: "20px 10px" }}>
        {item.item_title || ""}
      </h1>

      <div
        style={{
          position: "relative",
          objectFit: "contain",
          width: "350px",
          height: "350px",
        }}
      >
        {pages.map((page, i) => (
          <motion.div
            key={i}
            className="container_main"
            initial={{ rotate: 1 }}
            animate={{
              rotate: 0,
              left: `${(page.index - (position.index || 0)) * 100 - 1}vw`,
            }}
            transition={{
              type: "tween",
              bounceStifafness: 260,
              bounceDamping: 20,
            }}
            style={{
              objectFit: "contain",
            }}
          >
            <div
              className="navigation_btn"
              style={{ left: "0", opacity: position.index === 0 ? 0.2 : 1 }}
              onClick={() => {
                setPosition((prev) =>
                  prev.index === 0
                    ? prev
                    : pages.find((a) => a?.index === prev?.index - 1)
                );
              }}
            >
              <ArrowBackIosIcon fontSize="30" />
            </div>
            <div
              className="navigation_btn"
              style={{
                right: "0",
                opacity: position.index === pages.length - 1 ? 0.2 : 1,
              }}
              onClick={() => {
                setPosition((prev) =>
                  prev.index === pages.length - 1
                    ? prev
                    : pages.find((a) => a?.index === position?.index + 1)
                );
              }}
            >
              <ArrowForwardIosIcon fontSize="30" />
            </div>
            <img
              src={page?.src}
              style={{ objectFit: "contain", width: "350px", height: "350px" }}
              alt="abc"
            />
          </motion.div>
        ))}
      </div>
      <div style={{ zIndex: 99999999, padding: "0 10px" }}>
        <h1>Rs.{item?.price || 0}</h1>
        <p>{item?.description || "Description..."}</p>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: "-22vh",
          left: "calc(50% - 20px)",
        }}
      >
        <h2>{value || 0}</h2>
      </div>
    </div>
  );
};

export default TypesOfOutlets;
