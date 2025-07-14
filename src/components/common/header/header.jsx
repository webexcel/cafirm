
import React, { FC, Fragment, useEffect, useRef, useState } from "react";
import { Button, Card, Dropdown, InputGroup, ListGroup, Modal, Nav, Offcanvas, Tab } from "react-bootstrap";
import { MENUITEMS } from "../sidebar/sidemenu";
import DatePicker from "react-datepicker";
import store from "../../../redux/store";
import { Link, useNavigate } from "react-router-dom";
import { connect } from "react-redux";
import { ThemeChanger } from "../../../redux/action";
import Cookies from 'js-cookie';
//IMAGES
import desktoplogo from "../../../assets/images/brand-logos/desktop-logo.jpg";
import togglelogo from "../../../assets/images/brand-logos/toggle-logo.png";
import desktopdark from "../../../assets/images/brand-logos/desktop-dark.jpg";
import toggledark from "../../../assets/images/brand-logos/toggle-dark.png";
import faces1 from "../../../assets/images/faces/1.jpg";
import { usePermission } from "../../../contexts";
import UserAvatar from "./getBackgroundColor";

const Header = ({ local_varaiable, ThemeChanger, headerTitle }) => {

	const [startDatei, setStartDatei] = useState(new Date());

	const [show1, setShow1] = useState(false);

	const handleClose1 = () => setShow1(false);
	const { fetchPermissions, resetPermissions } = usePermission();
	const searchRef = useRef(null)
	const [userdata] = useState(() => {
		const userData = Cookies.get('user');
		return userData ? JSON.parse(userData) : null;
	});
	const navigate = useNavigate()

	const [show3, setShow3] = useState(false);

	const handleClose3 = () => setShow3(false);
	const handleShow3 = () => setShow3(true);

	function menuClose() {
		const theme = store.getState();
		if (window.innerWidth <= 992) {
			ThemeChanger({ ...theme, toggled: "close" });
		}
		if (window.innerWidth >= 992) {
			ThemeChanger({ ...theme, toggled: local_varaiable.toggled ? local_varaiable.toggled : "" });
		}
	}

	function closeMenuFn() {
		const closeMenuRecursively = (items) => {
			items?.forEach((item) => {
				item.active = false;
				closeMenuRecursively(item.children);
			});
		};
		closeMenuRecursively(MENUITEMS);
		setMenuitems((arr) => [...arr]);
	}
	///
	const toggleSidebar = () => {
		const theme = store.getState();
		// let html = document.documentElement;
		const sidemenuType = theme.dataNavLayout;
		if (window.innerWidth >= 992) {
			if (sidemenuType === "vertical") {
				const verticalStyle = theme.dataVerticalStyle;
				const navStyle = theme.dataNavStyle;
				switch (verticalStyle) {
					// closed
					case "closed":
						ThemeChanger({ ...theme, "dataNavStyle": "" });
						if (theme.toggled === "close-menu-close") {
							ThemeChanger({ ...theme, "toggled": "" });
						} else {
							ThemeChanger({ ...theme, "toggled": "close-menu-close" });
						}
						break;
					// icon-overlay
					case "overlay":
						ThemeChanger({ ...theme, "dataNavStyle": "" });
						if (theme.toggled === "icon-overlay-close") {
							ThemeChanger({ ...theme, "toggled": "" });
						} else {
							if (window.innerWidth >= 992) {
								ThemeChanger({ ...theme, "toggled": "icon-overlay-close" });
							}
						}
						break;
					// icon-text
					case "icontext":
						ThemeChanger({ ...theme, "dataNavStyle": "" });
						if (theme.toggled === "icon-text-close") {
							ThemeChanger({ ...theme, "toggled": "" });
						} else {
							ThemeChanger({ ...theme, "toggled": "icon-text-close" });
						}
						break;
					// doublemenu
					case "doublemenu":
						ThemeChanger({ ...theme, "dataNavStyle": "" });
						if (theme.toggled === "double-menu-open") {
							ThemeChanger({ ...theme, "toggled": "double-menu-close" });
						} else {
							const sidemenu = document.querySelector(".side-menu__item.active");
							if (sidemenu) {
								if (sidemenu.nextElementSibling) {
									sidemenu.nextElementSibling.classList.add("double-menu-active");
									ThemeChanger({ ...theme, "toggled": "double-menu-open" });
								} else {

									ThemeChanger({ ...theme, "toggled": "double-menu-close" });
								}
							}
						}

						break;
					// detached
					case "detached":
						if (theme.toggled === "detached-close") {
							ThemeChanger({ ...theme, "toggled": "" });

						} else {
							ThemeChanger({ ...theme, "toggled": "detached-close" });
						}
						break;
					// default
					case "default":
						ThemeChanger({ ...theme, "toggled": "" });

				}
				switch (navStyle) {
					case "menu-click":
						if (theme.toggled === "menu-click-closed") {
							ThemeChanger({ ...theme, "toggled": "" });
						}
						else {
							ThemeChanger({ ...theme, "toggled": "menu-click-closed" });
						}
						break;
					// icon-overlay
					case "menu-hover":
						if (theme.toggled === "menu-hover-closed") {
							ThemeChanger({ ...theme, "toggled": "" });
							closeMenuFn();
						} else {
							ThemeChanger({ ...theme, "toggled": "menu-hover-closed" });
							// setMenuUsingUrl();
						}
						break;
					case "icon-click":
						if (theme.toggled === "icon-click-closed") {
							ThemeChanger({ ...theme, "toggled": "" });
						} else {
							ThemeChanger({ ...theme, "toggled": "icon-click-closed" });

						}
						break;
					case "icon-hover":
						if (theme.toggled === "icon-hover-closed") {
							ThemeChanger({ ...theme, "toggled": "" });
							closeMenuFn();
						} else {
							ThemeChanger({ ...theme, "toggled": "icon-hover-closed" });
							// setMenuUsingUrl();

						}
						break;
				}
			}
		}
		else {
			if (theme.toggled === "close") {
				ThemeChanger({ ...theme, "toggled": "open" });

				setTimeout(() => {
					if (theme.toggled == "open") {
						const overlay = document.querySelector("#responsive-overlay");

						if (overlay) {
							overlay.classList.add("active");
							overlay.addEventListener("click", () => {
								const overlay = document.querySelector("#responsive-overlay");

								if (overlay) {
									overlay.classList.remove("active");
									menuClose();
								}
							});
						}
					}

					window.addEventListener("resize", () => {
						if (window.screen.width >= 992) {
							const overlay = document.querySelector("#responsive-overlay");

							if (overlay) {
								overlay.classList.remove("active");
							}
						}
					});
				}, 100);
			} else {
				ThemeChanger({ ...theme, "toggled": "close" });
			}
		}
	};


	const handleClick = (event) => {
		const searchInput = searchRef?.current;

		if (searchInput && (searchInput === event.target || searchInput.contains(event.target))) {
			document.querySelector(".header-search")?.classList.add("searchdrop");
		} else {
			document.querySelector(".header-search")?.classList.remove("searchdrop");
		}
	};

	useEffect(() => {
		document.body.addEventListener("click", handleClick);

		return () => {
			document.body.removeEventListener("click", handleClick);
		};
	}, []);


	//   sticky-pin
	const Topup = () => {
		if (window.scrollY > 30 && document.querySelector(".app-header")) {
			const Scolls = document.querySelectorAll(".app-header");
			Scolls.forEach((e) => {
				e.classList.add("sticky-pin");
			});
		} else {
			const Scolls = document.querySelectorAll(".app-header");
			Scolls.forEach((e) => {
				e.classList.remove("sticky-pin");
			});
		}
	};

	if (typeof window !== "undefined") {
		window.addEventListener("scroll", Topup);
	}

	useEffect(() => {
		if (userdata) {
			fetchPermissions(userdata.userId);
		}
	}, [userdata]);

	const logout = async () => {
		console.log("logout successfully")

		const logoutFiter = await Object.keys(localStorage).forEach((key) => {
			if (key !== "time") {
				localStorage.removeItem(key);
			}

			console.log("keys", key)
		});
		resetPermissions();
		Cookies.remove();
		navigate('/login');

	}

	const getUserData = () => {
		try {
			const userData = JSON.parse(Cookies.get('user'));
			if (userData?.employee_id) {
				navigate(`/vieweditprofile?id=${userData.employee_id}`);
			} else {
				navigate("/vieweditprofile");
			}
		} catch (error) {
			console.log("Error occurs while getting userdata:", error.stack);
		}
	};

	return (
		<Fragment>
			<header className="app-header">

				<div className="main-header-container container-fluid">

					<div className="header-content-left">

						<div className="header-element">
							<div className="horizontal-logo">
								<Link to={`${import.meta.env.BASE_URL}dashboards/sales/`} className="header-logo">
									<img src={desktoplogo} alt="logo" className="desktop-logo" />
									<img src={togglelogo} alt="logo" className="toggle-logo" />
									<img src={desktopdark} alt="logo" className="desktop-dark" />
									<img src={toggledark} alt="logo" className="toggle-dark" />
								</Link>
							</div>
						</div>

						<div className="header-element">
							<Link aria-label="anchor" to="#" className="sidemenu-toggle header-link" data-bs-toggle="sidebar" onClick={() => toggleSidebar()}>
								<span className="open-toggle me-2">
									<i className="bx bx-menu header-link-icon"></i>
								</span>
							</Link>

							<div className="d-flex align-items-center justify-content-center px-2 header-title-container">
								<h5 className="fw-medium mb-0" style={{ color: '#fff' }}>
									{headerTitle}
								</h5>
							</div>

						</div>
						<div className="header-element header-search d-lg-none d-block" onClick={handleShow3}>
							<Link aria-label="anchor" to="#" className="header-link" data-bs-toggle="modal" data-bs-target="#searchModal">
								<i className="bx bx-search-alt-2 header-link-icon"></i>
							</Link>
						</div>
					</div>

					<div className="header-content-right">

						<Dropdown className="header-element mainuserProfile">
							<Dropdown.Toggle variant='' as="a" className="header-link dropdown-toggle" id="mainHeaderProfile" data-bs-toggle="dropdown" data-bs-auto-close="outside" aria-expanded="false">
								<div className="d-flex align-items-center">
									<div className="d-sm-flex wd-100p">
										{/* <div className="avatar avatar-sm"><img
											alt="avatar"
											className="rounded-circle"
											src={
												userdata?.photo &&
													userdata.photo.trim() !== '' &&
													userdata.photo !== 'null' &&
													userdata.photo !== 'undefined'
													? userdata.photo
													: faces1
											}
											onError={(e) => {
												e.target.onerror = null; // prevent infinite loop
												e.target.src = faces1;   // fallback image
											}}
										/></div> */}
										<div>
											<UserAvatar user={userdata} />
										</div>

										<div className="ms-2 my-auto d-none d-xl-flex">
											<h6 className=" font-weight-semibold mb-0 fs-13 user-name d-sm-block d-none">{userdata?.name || 'UnKnown User'}</h6>
										</div>
									</div>
								</div>
							</Dropdown.Toggle>
							<Dropdown.Menu as="ul" className="dropdown-menu  border-0 main-header-dropdown  overflow-hidden header-profile-dropdown" aria-labelledby="mainHeaderProfile">
								<Dropdown.Item as="li" className="border-0" onClick={() => { getUserData() }}>
									<Link to="#"><i className="fs-13 me-2 bx bx-user"></i>Profile</Link></Dropdown.Item>
								<Dropdown.Item as="li" className="border-0" onClick={() => { logout() }}>
									<Link to="#">
										<i className="fs-13 me-2 bx bx-arrow-to-right"></i>Log Out
									</Link>
								</Dropdown.Item>
							</Dropdown.Menu>
						</Dropdown>

					</div>

				</div>

			</header>
		</Fragment>
	);
};

const mapStateToProps = (state) => ({
	local_varaiable: state
});
export default connect(mapStateToProps, { ThemeChanger })(Header);
