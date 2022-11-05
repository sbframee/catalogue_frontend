import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { useSwipeable } from "react-swipeable";
import { Box, CircularProgress } from "@mui/material";
import axios from "axios";
import TypesOfOutlets from "../pages/TypesOfOutlets";

const ContentWrapper = ({ organization, activecategories }) => {
  const [position, setPosition] = useState();
  const [Items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const GetOrganizationData = async (organization_uuid, category_uuid) => {
    const response = await axios({
      method: "get",
      url: "Items/getAtiveItems/" + organization_uuid + "/" + category_uuid,

      headers: {
        "Content-Type": "application/json",
      },
    });
    if (response.data.success) {
      setItems(response.data.result);
      setLoading(false);
    }
  };
  useEffect(() => {
    GetOrganizationData(
      organization?.organization_uuid,
      activecategories?.category_uuid
    );
  }, [activecategories?.category_uuid, organization?.organization_uuid]);

  const pages = useMemo(
    () =>
      Items?.sort((a, b) => +a.sort_order - +b.sort_order)?.map((item, i) => ({
        index: i,
        name: item?.item_title,
        item,
      })),
    [Items]
  );
  useEffect(() => {
    setPosition(0);
  }, []);

  const handlers = useSwipeable({
    onSwipedUp: () => {
      setPosition((prev) => (prev === pages.length - 1 ? prev : prev + 1));
      console.log("swipeup");
    },
    onSwipedDown: () => {
      setPosition((prev) => (prev === 0 ? prev : prev - 1));
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
  console.log(position);
  return loading ? (
    <Box>
      <div
        className="flex"
        style={{
          width: "100vw",
          maxWidth: "480px",
          height: "fit-content",
          maxHeight: "calc(100vh - 74px)",
          overflow: "hidden",
        }}
      >
        <CircularProgress />
      </div>
    </Box>
  ) : (
    <div
      style={{
        width: "100vw",
        maxWidth: "480px",
        height: "fit-content",
        maxHeight: "calc(100vh - 74px)",
        overflow: "hidden",
      }}
      className="flex"
      {...handlers}
    >
      <div
        style={{
          position: "relative",
          objectFit: "contain",
          width: "100%",
          height: "calc(100vh - 74px)",
        }}
        className="flex"
      >
        {pages.map((page, i) => (
          <motion.div
            key={i}
            className="container_anime flex"
            initial={{ rotate: 1 }}
            animate={{
              rotate: 0,
              top: `${(page.index - (position || 0)) * 100}vh`,
            }}
            transition={{
              type: "tween",
              bounceStifafness: 260,
              bounceDamping: 20,
            }}
            style={{
              height: "max-content",
              maxHeight: "calc(100vh - 74px)",
              width: "100%",
              overflowY: "scroll",
            }}
          >
            <TypesOfOutlets
              item={page?.item}
              value={(position + 1 || 0) + "/" + (Items?.length || 0)}
              organization={organization}
            />
  
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ContentWrapper;
