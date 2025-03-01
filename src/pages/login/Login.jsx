import React, { Fragment, useState } from "react";
import { Alert, Button, Card, Col, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from 'formik'
import * as yup from 'yup'
import logo from '../../assets/images/brand-logos/desktop-dark.png'
import Cookies from 'js-cookie';
import { setToken } from "../../utils/authUtils";
import useDocumentTitle from "../../hooks/useDocumentTitle";
import { loginService } from "../../service/authServices";
const Login = () => {
	const navigate = useNavigate()
	const [passwordshow1, setpasswordshow1] = useState(false);
	const [err, setError] = useState("");

	const loginSubmit = async () => {
		try {
			const user_data = {
				email: loginForm?.values?.gmail,
				password: loginForm?.values?.password,
			};
			const logResponse = await loginService(user_data);
			console.log("Login response:", logResponse);
			if (logResponse.data.status) {
				const setSessToken = await setToken(logResponse.data.token)
				console.log('userrrr', logResponse.data.userdata)
				Cookies.set('user', JSON.stringify(logResponse.data.userdata), { expires: 30 });
				navigate('/dashboard', { replace: true });
			} else {
				throw new Error("Unexpected response status");
			}
		} catch (err) {
			console.error("Login error:", err);

			setTimeout(() => {
				if (err.response) {
					setError(err.response.data.message);
				} else {
					setError("Connection Error!");
				}
			}, 300);
		} finally {
			//   setLoaderHandle(false);
		}
	};

	useDocumentTitle("CA Firm - Login");

	//validation
	const loginSchema = yup.object().shape({
		gmail: yup.string()
			// .email("Invalid email address")
			.required("Email is required"),
		password: yup.string()
			// .min(6, "Password must be at least 6 characters")
			.required("Password is required"),
	});

	//form value
	const loginForm = useFormik({
		initialValues: {
			gmail: '',
			password: ''
		},
		onSubmit: loginSubmit,
		validationSchema: loginSchema
	})

	// console.log('errrrrrrr', loginForm.errors)
	return (
		<Fragment>
			<div className="container">
				<div className="row justify-content-center align-items-center authentication authentication-basic h-100">
					<Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
						<Card>
							<div className="my-4 d-flex justify-content-center">
								{/* <Link to={`${import.meta.env.BASE_URL}dashboards/sales`}> */}
								<img src={logo} alt="logo" style={{ height: '3rem' }} className="desktop-logo" />
								{/* <img src={logo} alt="logo" className="desktop-dark" /> */}
								{/* </Link> */}
							</div>
							<div className="card-body p-5 pt-1 rectangle3">
								<p className="h4 fw-semibold mb-2 text-center">Sign In</p>
								{/* <p className="mb-4 text-muted op-7 fw-normal text-center">Welcome back Jhon !</p> */}

								<form className="row g-3" onSubmit={loginForm.handleSubmit}>
									{err && <Alert style={{ margin: '0', marginTop: '10%' }} variant="danger">{err}</Alert>}
									<div className="col-xl-12 p-1">
										<Form.Label htmlFor="signin-username" className="form-label text-default">Email Address</Form.Label>
										<Form.Control type="text" className="form-control form-control-lg" id="signin-username"
											placeholder="Enter Email"
											name="gmail"
											value={loginForm.values.gmail}
											onChange={loginForm.handleChange}
											onBlur={loginForm.handleBlur}
											isInvalid={!!(loginForm.errors.gmail && loginForm.touched.gmail)}
										/>
									</div>
									{loginForm.errors.gmail && loginForm.touched.gmail && <div style={{ color: 'red', margin: '0', padding: '1% 2%' }}>{loginForm.errors.gmail}!</div>}
									<div className="col-xl-12 mb-2 p-1">
										<Form.Label htmlFor="signin-password" className="form-label text-default d-block"

										>Password
											{/* <Link to="#" className="float-end text-primary">Forget password ?</Link> */}
										</Form.Label>
										<div className="input-group">
											<Form.Control
												className="form-control-lg"
												id="signin-password"
												placeholder="Password"
												name="password"
												type={passwordshow1 ? "text" : "password"}
												value={loginForm.values.password}
												onChange={loginForm.handleChange}
												onBlur={loginForm.handleBlur}
												isInvalid={!!(loginForm.errors.password && loginForm.touched.password)}
											/>
											<Button variant="" className={`btn ${!!(loginForm.errors.password && loginForm.touched.password) ? "border-danger" : "btn-light bg-transparent "}`} type="button" onClick={() => setpasswordshow1(!passwordshow1)}
												id="button-addon2"><i className={`${passwordshow1 ? "ri-eye-line" : "ri-eye-off-line"} align-middle`}></i></Button>
										</div>

										{/* <div className="mt-2">
											<div className="form-check">
												<input className="form-check-input" type="checkbox" value="" id="defaultCheck1" />
												<label className="form-check-label text-muted fw-normal" htmlFor="defaultCheck1">
													Remember password ?
												</label>
											</div>
										</div> */}
										{loginForm.errors.password && loginForm.touched.password && <div style={{ color: 'red', margin: '0', padding: '1% 2%' }}>{loginForm.errors.password}!</div>}

									</div>

									<div className="col-xl-12 d-grid mt-3 p-0">
										<Button type='submit' variant="primary" className="btn btn-lg">Sign In</Button>
									</div>
								</form>

								<div className="text-center">
									<p className="fs-12 text-muted mt-4">Dont have an account? <Link to="#" className="text-primary">Sign Up</Link></p>
								</div>
							</div>
						</Card>
					</Col>
				</div>
			</div>
		</Fragment>
	)
}

export default Login