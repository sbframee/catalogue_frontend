/* eslint-disable react-hooks/exhaustive-deps */
import { Add, Delete, Image } from "@mui/icons-material"
import axios from "axios"
import { useEffect, useMemo, useState } from "react"
import Header from "../../components/Header"
import Sidebar from "../../components/Sidebar"
import "./index.css"

let initials = {
	organization_whatsapp_number: "",
	organization_call_number: "",
	organization_whatsapp_message: "",
	organization_logo: "",
	organization_new_Logo: "",
	organization_title: ""
}
export default function Credentials() {
	const [organization, setOrganization] = useState(initials)
	const [image, setImage] = useState()
	const [done, setDone] = useState()
	const GetData = async () => {
		const response = await axios({
			method: "get",
			url: "/Organization/getOrganizationData/" + localStorage.getItem("organization_uuid"),
			headers: {
				"Content-Type": "application/json"
			}
		})
		if (response.data.success) {
			let data = response.data.result
			data = {
				...data,
				org_call_number: data?.org_call_number.map(a => ({
					uuid: Math.random(),
					...a
				})),
				org_whatsapp_number: data?.org_whatsapp_number.map(a => ({
					uuid: Math.random(),
					...a
				}))
			}
			setDone(true)
			setTimeout(() => setDone(true), 3000)
			setOrganization(data)
		}
	}
	useEffect(() => {
		GetData()
	}, [])
	// console.log(organization);
	const onSubmit = async () => {
		const response = await axios({
			method: "put",
			url: "/Organization/putOrganization",
			data: {
				...organization,
				organization_uuid: localStorage.getItem("organization_uuid")
			},
			headers: {
				"Content-Type": "application/json"
			}
		})
		if (response.data.success) {
			GetData()
			setImage(false)
		}
	}
	const onSubmitImage = async () => {
		let itemData = organization
		let url = await axios.post("s3/upload_url", { filename: image?.name, type: image?.type })
		url = url.data.url

		const result = await axios({
			url,
			method: "put",
			headers: { "Content-Type": "multipart/form-data" },
			data: image
		})
		if (result.status === 200) {
			let image_url = url?.split("?")[0]
			itemData = {
				organization_uuid: localStorage.getItem("organization_uuid"),
				organization_logo: image_url
			}
		}

		const response = await axios({
			method: "put",
			url: "/Organization/putOrganization",
			data: itemData,
			headers: {
				"Content-Type": "application/json"
			}
		})
		if (response.data.success) {
			GetData()
			setImage(false)
		}
	}

	return (
		<>
			<Sidebar />
			<div className="right-side">
				<Header />
				<div className="inventory">
					<div className="accountGroup" id="voucherForm" action="">
						<div className="inventory_header">
							<h2>Organization Data </h2>
						</div>
						<div className="main_data_container">
							<div className="formGroup" style={{ height: "80vh", overflowY: "scroll" }}>
								<div className="row">
									<label className="selectLabel">
										Organization title
										<input
											type="text"
											name="route_title"
											className="numberInput"
											value={organization.organization_title}
											onChange={e =>
												setOrganization(prev => ({
													...prev,
													organization_title: e.target.value.length < 20 ? e.target.value : prev.organization_title
												}))
											}
										/>
									</label>
								</div>
								<div className="flex" style={{ justifyContent: "flex-start" }}>
									<h2 style={{ paddingRight: "10px" }}>Organization Call Numbers</h2>
									<div
										style={{
											color: "#fff",
											backgroundColor: organization.theme_color || "#000",
											borderRadius: "50%"
										}}
										className="flex"
										onClick={() =>
											setOrganization(prev => ({
												...prev,
												org_call_number: [
													...(prev?.org_call_number || []),
													{ uuid: Math.random(), tag: "", mobile: "" }
												]
											}))
										}
									>
										<Add />
									</div>
								</div>
								{organization?.org_call_number?.map(item => (
									<div className="row">
										<label className="selectLabel">
											Tag
											<input
												type="text"
												name="route_title"
												className="numberInput"
												value={item?.tag}
												onChange={e =>
													setOrganization(prev => ({
														...prev,
														org_call_number: prev?.org_call_number.map(a =>
															a.uuid === item.uuid ? { ...a, tag: e.target.value } : a
														)
													}))
												}
											/>
										</label>
										<label className="selectLabel">
											Call Number
											<input
												type="number"
												name="route_title"
												className="numberInput"
												value={item?.mobile}
												onChange={e =>
													setOrganization(prev => ({
														...prev,
														org_call_number: prev?.org_call_number.map(a =>
															a.uuid === item.uuid
																? {
																		...a,
																		mobile: e.target.value.length > 10 ? a?.mobile : e.target.value
																  }
																: a
														)
													}))
												}
											/>
										</label>
										<div
											onClick={() =>
												setOrganization(prev => ({
													...prev,
													org_call_number: prev?.org_call_number.filter(a => a.uuid !== item.uuid)
												}))
											}
										>
											<Delete />
										</div>
									</div>
								))}
								<div className="flex" style={{ justifyContent: "flex-start" }}>
									<h2 style={{ paddingRight: "10px" }}>Organization WhatsApp Numbers</h2>
									<div
										style={{
											color: "#fff",
											backgroundColor: organization.theme_color || "#000",
											borderRadius: "50%"
										}}
										className="flex"
										onClick={() =>
											setOrganization(prev => ({
												...prev,
												org_whatsapp_number: [
													...(prev?.org_whatsapp_number || []),
													{ uuid: Math.random(), tag: "", mobile: "" }
												]
											}))
										}
									>
										<Add />
									</div>
								</div>
								{organization?.org_whatsapp_number?.map(item => (
									<>
										<div className="row">
											<label className="selectLabel">
												Tag
												<input
													type="text"
													name="route_title"
													className="numberInput"
													value={item?.tag}
													onChange={e =>
														setOrganization(prev => ({
															...prev,
															org_whatsapp_number: prev?.org_whatsapp_number.map(a =>
																a.uuid === item.uuid ? { ...a, tag: e.target.value } : a
															)
														}))
													}
												/>
											</label>
											<label className="selectLabel">
												WhatsApp Number
												<input
													type="number"
													name="route_title"
													className="numberInput"
													value={item?.mobile}
													onChange={e =>
														setOrganization(prev => ({
															...prev,
															org_whatsapp_number: prev?.org_whatsapp_number.map(a =>
																a.uuid === item.uuid
																	? {
																			...a,
																			mobile: e.target.value.length > 10 ? a?.mobile : e.target.value
																	  }
																	: a
															)
														}))
													}
												/>
											</label>
											<div
												onClick={() =>
													setOrganization(prev => ({
														...prev,
														org_whatsapp_number: prev?.org_whatsapp_number?.filter(a => a.uuid !== item.uuid)
													}))
												}
											>
												<Delete />
											</div>
										</div>
										<div className="row">
											<label className="selectLabel">
												WhatsApp Message
												<textarea
													name="route_title"
													className="numberInput"
													style={{ height: "100px" }}
													value={item.message}
													onChange={e =>
														setOrganization(prev => ({
															...prev,
															org_whatsapp_number: prev?.org_whatsapp_number.map(a =>
																a.uuid === item.uuid
																	? {
																			...a,
																			message: e.target.value
																	  }
																	: a
															)
														}))
													}
												/>
											</label>
										</div>
									</>
								))}

								<div className="bottomContent" style={{ marginTop: "40px" }}>
									<button type="button" onClick={onSubmit}>
										Save
									</button>
								</div>
							</div>
							<div className="formGroup logo_image_container">
								{organization?.organization_logo ? (
									<img src={organization.organization_logo} alt="NoImage" />
								) : (
									<h1>NO Logo</h1>
								)}
								<div className="row"></div>

								<div
									className="bottomContent"
									style={{
										marginTop: "40px",
										display: "flex",
										flexDirection: "column"
									}}
								>
									<label className="selectLabel file_upload" htmlFor="upload_logo">
										<h1>
											Upload Image <Image />
										</h1>
										<input
											type="file"
											id="upload_logo"
											name="route_title"
											className="numberInput"
											onChange={e => setImage(e.target.files[0])}
											maxLength={9}
											style={{ display: "none" }}
										/>
									</label>
									{image ? (
										<>
											<div className="imageContainer" style={{ width: "fit-content" }}>
												<img src={URL.createObjectURL(image)} className="previwImages" alt="yourimage" />
												<button
													onClick={() => setImage(false)}
													className="closeButton"
													style={{
														fontSize: "20px",
														right: "5px",
														padding: "0 10px",
														width: "20px",
														height: "20px"
													}}
												>
													x
												</button>
											</div>
											<button type="button" onClick={onSubmitImage}>
												Upload
											</button>
										</>
									) : (
										""
									)}
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</>
	)
}
