import React, { useEffect } from "react";
import { Fragment } from "react";
import Themeprimarycolor, * as switcherdata from "./switcherdata";
import { ThemeChanger } from "../../../redux/action";
import { Helmet, HelmetProvider } from "react-helmet-async";
import { connect } from "react-redux";
import { Button } from "react-bootstrap";
import store from "../../../redux/store";

function Landingswitcher({ local_varaiable, ThemeChanger }) {

	useEffect(() => {
		switcherdata.LocalStorageBackup(ThemeChanger);

	}, []);
	const Switcherclose = () => {

		if (document.querySelector(".offcanvas-end")?.classList.contains("show")) {
			document.querySelector(".offcanvas-end")?.classList.remove("show");
			document.querySelector(".switcher-backdrop")?.classList.remove("d-block");
			document.querySelector(".switcher-backdrop")?.classList.add("d-none");
		}
	};
	const customStyles = ` ${local_varaiable.colorPrimaryRgb != "" ? `--primary-rgb:${local_varaiable.colorPrimaryRgb}` : ""}`;

	useEffect(() => {
		const theme = store.getState();
		ThemeChanger({
			...theme,
			"dataNavStyle": "menu-click",
			"dataNavLayout": "horizontal",
		});
		return () => {
			ThemeChanger({
				...theme,
				"dataNavStyle": "",
				"dataNavLayout": `${localStorage.velvetlayout == "horizontal" ? "horizontal" : "vertical"}`
			});
		};
	}, []);
	return (
		<Fragment>
			<HelmetProvider>
				<Helmet>
					<html dir={local_varaiable.dir}
						data-theme-mode={local_varaiable.dataThemeMode}
						data-menu-position={local_varaiable.dataMenuPosition}
						data-nav-layout={local_varaiable.dataNavLayout}
						data-nav-style={local_varaiable.dataNavStyle}
						data-toggled={local_varaiable.toggled}
						style={customStyles}>
					</html>

				</Helmet>
			</HelmetProvider>
			<div className="switcher-backdrop d-none" onClick={() => {
				Switcherclose();
			}}></div>
			<div className="offcanvas offcanvas-end" tabIndex={-1} id="switcher-canvas" aria-labelledby="offcanvasRightLabel">
				<div className="offcanvas-header border-bottom">
					<h5 className="offcanvas-title" id="offcanvasRightLabel">Switcher</h5>
					<Button variant='' onClick={() => { Switcherclose(); }} type="button" className="btn-close" data-bs-dismiss="offcanvas" aria-label="Close"></Button>
				</div>
				<div className="offcanvas-body">
					<div className="">
						<p className="switcher-style-head">Theme Color Mode:</p>
						<div className="row switcher-style">
							<div className="col-4">
								<div className="form-check switch-select">
									<label className="form-check-label" htmlFor="switcher-light-theme">
										Light
									</label>
									<input className="form-check-input" type="radio" name="theme-style" id="switcher-light-theme"
										checked={local_varaiable.dataThemeMode !== "dark"} onChange={(_e) => { }}
										onClick={() => switcherdata.Light(ThemeChanger)}
									/>
								</div>
							</div>
							<div className="col-4">
								<div className="form-check switch-select">
									<label className="form-check-label" htmlFor="switcher-dark-theme">
										Dark
									</label>
									<input className="form-check-input" type="radio" name="theme-style" id="switcher-dark-theme"
										checked={local_varaiable.dataThemeMode == "dark"} onChange={(_e) => { }}
										onClick={() => switcherdata.Dark(ThemeChanger)}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="">
						<p className="switcher-style-head">Directions:</p>
						<div className="row switcher-style">
							<div className="col-4">
								<div className="form-check switch-select">
									<label className="form-check-label" htmlFor="switcher-ltr">
										LTR
									</label>
									<input className="form-check-input" type="radio" name="direction" id="switcher-ltr" checked={local_varaiable.dir == "ltr"} onChange={(_e) => { }}
										onClick={() => { switcherdata.Ltr(ThemeChanger); }} />
								</div>
							</div>
							<div className="col-4">
								<div className="form-check switch-select">
									<label className="form-check-label" htmlFor="switcher-rtl">
										RTL
									</label>
									<input className="form-check-input" type="radio" name="direction" id="switcher-rtl"
										checked={local_varaiable.dir == "rtl"} onChange={(_e) => { }}
										onClick={() => { switcherdata.Rtl(ThemeChanger); }}
									/>
								</div>
							</div>
						</div>
					</div>
					<div className="theme-colors">
						<p className="switcher-style-head">Theme Primary:</p>
						<div className="d-flex align-items-center switcher-style flex-wrap">
							<div className="form-check switch-select me-3">
								<input className="form-check-input color-input color-primary-1" type="radio"
									checked={local_varaiable.colorPrimaryRgb == "13, 73, 159"} onChange={(_e) => { }}
									onClick={() => switcherdata.primaryColor1(ThemeChanger)}
									name="theme-primary" id="switcher-primary" />
							</div>
							<div className="form-check switch-select me-3">
								<input className="form-check-input color-input color-primary-2" type="radio"
									checked={local_varaiable.colorPrimaryRgb == "0, 128, 172"} onChange={(_e) => { }}
									onClick={() => switcherdata.primaryColor2(ThemeChanger)}
									name="theme-primary" id="switcher-primary1" />
							</div>
							<div className="form-check switch-select me-3">
								<input className="form-check-input color-input color-primary-3" type="radio" name="theme-primary"
									checked={local_varaiable.colorPrimaryRgb == "100, 48, 124"} onChange={(_e) => { }}
									onClick={() => switcherdata.primaryColor3(ThemeChanger)}
									id="switcher-primary2" />
							</div>
							<div className="form-check switch-select me-3">
								<input className="form-check-input color-input color-primary-4" type="radio" name="theme-primary"
									checked={local_varaiable.colorPrimaryRgb == "5, 154, 114"} onChange={(_e) => { }}
									onClick={() => switcherdata.primaryColor4(ThemeChanger)}
									id="switcher-primary3" />
							</div>
							<div className="form-check switch-select me-3">
								<input className="form-check-input color-input color-primary-5" type="radio" name="theme-primary"
									checked={local_varaiable.colorPrimaryRgb == "177, 90, 17"} onChange={(_e) => { }}
									onClick={() => switcherdata.primaryColor5(ThemeChanger)}
									id="switcher-primary4" />
							</div>
							<div className="form-check switch-select ps-0 mt-1 color-primary-light">
								<div className='theme-container-primary'>
									<button className="">nano</button>
								</div>
								<div className='pickr-container-primary'>
									<div className='pickr'>
										<Button className='pcr-button' onClick={(ele) => {
											if (ele.target.querySelector("input")) {
												ele.target.querySelector("input").click();
											}
										}}>
											<Themeprimarycolor theme={local_varaiable} actionfunction={ThemeChanger} />
										</Button>

									</div>
								</div>
							</div>
						</div>
					</div>
					<div>
						<p className="switcher-style-head">reset:</p>
						<div className="text-center">
							<Button variant='' onClick={() => switcherdata.Reset1(ThemeChanger)} type="button" id="reset-all" className="btn btn-danger mt-3">Reset</Button>
						</div>
					</div>
				</div>
			</div>
		</Fragment>
	);
}

Landingswitcher.defaultProps = {};

const mapStateToProps = (state) => ({
	local_varaiable: state
});

export default connect(mapStateToProps, { ThemeChanger })(Landingswitcher);
