import * as React from "react"
import { AppBar, Container, Toolbar } from "@mui/material"
import { HiBars3 } from "react-icons/hi2"
import { ShoppingCart, WhatsApp } from "@mui/icons-material"
import { Box } from "@mui/material"
import { motion } from "framer-motion"

import { BsTelephoneFill } from "react-icons/bs"
import axios from "axios"

const ResponsiveAppBar = ({ organization }) => {
	const [dropdown, setDropDown] = React.useState(false)
	return (
		<AppBar position="static" style={{ background: organization?.theme_color || "#000" }}>
			<Container maxWidth="xl">
				<Toolbar
					disableGutters
					style={{
						minWidth: "300px",
						flex: "1",
						justifyContent: "space-between"
					}}
				>
					<div style={{ width: "30px", height: "20px", objectFit: "contain" }} className="flex">
						<HiBars3 style={{ fontSize: "30px", fontWeight: "bold" }} />
					</div>

					{organization?.organization_logo ? (
						<img
							src={`${axios.defaults.baseURL}s3/object_url/${organization.organization_logo}`}
							alt="NoImage"
							style={{ width: "200px", objectFit: "contain" }}
						/>
					) : (
						""
					)}
					{organization?.organization_title ? (
						<h4 style={{ width: "200px" }}>{organization?.organization_title || ""}</h4>
					) : (
						""
					)}
					<>
						{dropdown && (
							<div
								className="overlay"
								style={{
									zIndex: "99999"
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
													top: "50px",

													right: "10%",
													flexDirection: "column",
													zIndex: "200",
													width: "max-content",
													height: "max-content"
											  }
											: {
													top: "50px",
													right: "10%",
													flexDirection: "column",
													zIndex: "200",
													width: "max-content",
													height: "max-content"
											  }
									}
									onMouseLeave={() => setDropDown(false)}
								>
									{dropdown === "mobile"
										? organization?.org_call_number.map(a => (
												<button
													style={{
														padding: "10px",
														backgroundColor: "#01a0e2"
													}}
													className="simple_Logout_button"
													type="button"
													onClick={() => {
														window.open(`tel:+${a?.mobile}`)
														setDropDown(false)
													}}
												>
													{a.tag}
												</button>
										  ))
										: organization?.org_whatsapp_number?.map(a => (
												<button
													style={{
														padding: "10px",
														backgroundColor: "#0f9d15"
													}}
													className="simple_Logout_button"
													type="button"
													onClick={() => {
														window.open(`http://api.whatsapp.com/send?phone=${a?.mobile}&text=${encodeURI(a?.message)}`)
														setDropDown(false)
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
								width: "35px",
								height: "35px",
								fontWeight: "600",

								letterSpacing: "2px",
								padding: "5px",
								border: "2px solid #fff",
								fontSize: "22px",

								zIndex: dropdown === "mobile" ? "999999" : "9999"
							}}
							variant="extended"
							onClick={() => setDropDown(prev => (prev ? "" : "mobile"))}
						>
							<BsTelephoneFill style={{ color: "#fff" }} />
						</motion.div>
						<motion.div
							className="flex"
							style={{
								borderRadius: "50%",
								width: "35px",
								height: "35px",
								fontWeight: "600",

								fontSize: "55px",
								zIndex: dropdown === "whatsapp" ? "999999" : "9999"
							}}
							variant="extended"
							onClick={() => setDropDown(prev => (prev ? "" : "whatsapp"))}
						>
							<WhatsApp style={{ color: "#fff", fontSize: "40px" }} />
						</motion.div>
					</>
					{/* <div>
            <ShoppingCart />
          </div> */}
				</Toolbar>
			</Container>
		</AppBar>
	)
}
export default ResponsiveAppBar
