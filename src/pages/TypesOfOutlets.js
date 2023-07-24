import React, { useCallback, useEffect, useMemo, useState } from "react"

import { motion } from "framer-motion"

import { useSwipeable } from "react-swipeable"
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos"
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos"
import axios from "axios"
const TypesOfOutlets = ({ item, value, organization }) => {
	const [position, setPosition] = useState(0)

	const [width, setWidth] = useState(null)
	const parentElement = useCallback(node => {
		if (node !== null) {
			setWidth(node.getBoundingClientRect().width)
		}
	}, [])
	const pages = useMemo(
		() =>
			item?.image_keys
				?.sort((a, b) => a.sort_order - b.sort_order)
				?.map((a, i) => ({ index: i, src: `${axios.defaults.baseURL}s3/object_url/${a.key}` })) || [],
		[item?.image_keys]
	)
	useEffect(() => {
		setPosition(pages[0])
	}, [pages])

	const handlers = useSwipeable({
		onSwipedLeft: () => {
			setPosition(prev => (prev.index === pages.length - 1 ? prev : pages.find(a => a?.index === position?.index + 1)))
			console.log("swipeup")
		},
		onSwipedRight: () => {
			setPosition(prev => (prev.index === 0 ? prev : pages.find(a => a?.index === prev?.index - 1)))
			console.log("swipedown")
		},
		delta: 60, // min distance(px) before a swipe starts. *See Notes*
		preventScrollOnSwipe: true, // prevents scroll during swipe (*See Details*)
		trackTouch: true, // track touch input
		trackMouse: true, // track mouse input
		rotationAngle: 0, // set a rotation angle
		swipeDuration: Infinity, // allowable duration of a swipe (ms). *See Notes*
		touchEventOptions: { passive: true }
	})
	return (
		<div
			{...handlers}
			style={{
				position: "relative",
				width: "100%",
				height: "fit-content",
				borderRadius: "30px",
				// padding: "10px",
				marginTop: "10px"
			}}
			ref={parentElement}
		>
			<div
				style={{
					position: "relative",
					objectFit: "contain",
					width: "100%",
					height: width
				}}
			>
				{pages.map((page, i) => (
					<motion.div
						key={i}
						className="container_main"
						initial={{ rotate: 1 }}
						animate={{
							rotate: 0,
							left: `${(page.index - (position.index || 0)) * 100}vw`
						}}
						transition={{
							type: "tween",
							bounceStifafness: 260,
							bounceDamping: 20
						}}
						style={{
							objectFit: "contain",
							width: "100%",
							height: width
						}}
					>
						<div
							className="navigation_btn"
							style={{ left: "15px", opacity: position.index === 0 ? 0.2 : 1 }}
							onClick={() => {
								setPosition(prev => (prev.index === 0 ? prev : pages.find(a => a?.index === prev?.index - 1)))
							}}
						>
							<ArrowBackIosIcon fontSize="30" />
						</div>
						<div
							className="navigation_btn"
							style={{
								right: "10px",
								opacity: position.index === pages.length - 1 ? 0.2 : 1
							}}
							onClick={() => {
								setPosition(prev =>
									prev.index === pages.length - 1 ? prev : pages.find(a => a?.index === position?.index + 1)
								)
							}}
						>
							<ArrowForwardIosIcon fontSize="30" />
						</div>

						<img src={page?.src} style={{ objectFit: "fill", width: "100%", height: width }} alt="abc" />
					</motion.div>
				))}
			</div>
			<div
				className="flex"
				style={{
					zIndex: 99999999,
					padding: "0 10px",
					width: "100%",
					flexDirection: "column"
				}}
			>
				<h1
					style={{
						width: "100%",
						textAlign: "left",
						color: organization?.theme_color || "#000"
					}}
				>
					{item.item_title || ""}
				</h1>
				{item?.description ? (
					<p style={{ width: "100%", textAlign: "left", wordWrap: "break-word" }}>
						Description...
						<br />
						{item?.description?.split("\n")?.map(function (itemDes, idx) {
							return (
								<span key={idx}>
									{itemDes}
									<br />
								</span>
							)
						}) || ""}
					</p>
				) : (
					""
				)}
				{item?.strip_price ? (
					<h3
						style={{
							width: "100%",
							textAlign: "right",
							margin: "0",
							padding: 0,
							color: "red",
							textDecorationLine: "line-through"
						}}
					>
						Rs. {item?.strip_price}
					</h3>
				) : (
					""
				)}
				<h1
					style={{
						width: "100%",
						textAlign: "right",
						marginTop: 0,
						paddingTop: "0"
					}}
				>
					{item?.price ? "Rs." + item?.price : ""}
				</h1>
			</div>
			<div
				style={{
					position: "fixed",
					bottom: "2vh",
					left: "calc(50% - 20px)"
				}}
			>
				<h2>{value || 0}</h2>
			</div>
		</div>
	)
}

export default TypesOfOutlets
