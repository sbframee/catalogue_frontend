import axios from "axios"
import { useState } from "react"

import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import Home from "./pages/Home"
import LoginPage from "./pages/LoginPage"
import MainAdmin from "./pages/MainAdmin/MainAdmin"
import ItemCategories from "./pages/Master/ItemCategories"
import Items from "./pages/Master/Items"
import Credentials from "./pages/Setup/Credentials"
function App() {
	const [userUuid, setUserUuid] = useState(localStorage.getItem("organization_uuid"))
	axios.defaults.baseURL = "http://13.53.69.186:9000/"
	// axios.defaults.baseURL = "http://localhost:9000"
	// axios.defaults.baseURL = "https://api.sanjusk.com/";

	return (
		<div className="App">
			<Router>
				<Routes>
					<Route path={`/catalogue`} element={<Home />} />
					<Route path="*" element={<Navigate replace to={"/catalogue"} />} />
					{userUuid ? (
						<>
							<Route path={`/admin`} element={<MainAdmin />} />
							<Route path={`/admin/itemCategory`} element={<ItemCategories />} />
							<Route path={`/admin/item`} element={<Items />} />
							<Route path={`/admin/credentials`} element={<Credentials />} />
							<Route path="/admin" element={<Navigate replace to={"/admin"} />} />
						</>
					) : (
						<>
							<Route path={`/admin-login`} element={<LoginPage setUserUuid={setUserUuid} />} />
							<Route path="/admin" element={<Navigate replace to={"/admin-login"} />} />
						</>
					)}
				</Routes>
			</Router>
		</div>
	)
}

export default App
