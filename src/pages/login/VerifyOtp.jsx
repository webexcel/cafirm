import React, { Fragment, useState } from "react";
import { Alert, Button, Card, Col, Form, InputGroup } from "react-bootstrap";
import { useLocation, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import * as yup from "yup";
import logo from "../../assets/images/brand-logos/desktop-dark.png";
import { ResetPasswordService } from "../../service/authServices";

const VerifyOtp = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const correctOtp = location.state?.otp || "";
	const email = location.state?.email || "";

	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");
	const [passwordShow, setPasswordShow] = useState(false);
	const [confirmPasswordShow, setConfirmPasswordShow] = useState(false);

	const otpSchema = yup.object().shape({
		otp: yup.string().required("OTP is required"),
		newPassword: yup.string().min(6, "Password must be at least 6 characters").required("New password is required"),
		confirmPassword: yup
			.string()
			.oneOf([yup.ref("newPassword"), null], "Passwords must match")
			.required("Confirm password is required"),
	});

	const otpForm = useFormik({
		initialValues: {
			otp: "",
			newPassword: "",
			confirmPassword: "",
		},
		validationSchema: otpSchema,
		onSubmit: async (values) => {
			setError("");
			setSuccess("");

			if (Number(values.otp) !== Number(correctOtp)) {
				setError("Invalid OTP.");
				return;
			}

			try {
				const response = await ResetPasswordService({ email, newPassword: values.newPassword });
				if (response.data.status) {
					setSuccess("Password reset successfully.");
					setTimeout(() => navigate("/login"), 2000);
				} else {
					setError("Something went wrong.");
				}
			} catch (err) {
				setError("Something went wrong.");
			}
		},
	});

	return (
		<Fragment>
			<div className="container">
				<div className="row justify-content-center align-items-center authentication authentication-basic h-100">
					<Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
						<Card>
							<div className="my-4 d-flex justify-content-center">
								{/* <img src={logo} alt="logo" style={{ height: "3rem" }} className="desktop-logo" /> */}
							</div>
							<div className="card-body p-5 pt-1 rectangle3">
								<p className="h4 fw-semibold mb-2 text-center">Verify OTP</p>

								<form className="row g-3" onSubmit={otpForm.handleSubmit}>
									{error && <Alert style={{ margin: "0", marginTop: "10%" }} variant="danger">{error}</Alert>}
									{success && <Alert style={{ margin: "0", marginTop: "10%" }} variant="success">{success}</Alert>}

									{/* OTP Field */}
									<div className="col-xl-12 p-1">
										<Form.Label className="form-label text-default">OTP Code</Form.Label>
										<Form.Control
											type="text"
											className="form-control form-control-lg"
											placeholder="Enter OTP"
											name="otp"
											value={otpForm.values.otp}
											onChange={otpForm.handleChange}
											onBlur={otpForm.handleBlur}
											isInvalid={!!(otpForm.errors.otp && otpForm.touched.otp)}
										/>
									</div>
									{otpForm.errors.otp && otpForm.touched.otp && (
										<div style={{ color: "red", margin: "0", padding: "1% 2%" }}>{otpForm.errors.otp}!</div>
									)}

									{/* New Password Field */}
									<div className="col-xl-12 mb-2 p-1">
										<Form.Label className="form-label text-default">New Password</Form.Label>
										<InputGroup>
											<Form.Control
												className="form-control-lg"
												placeholder="Enter new password"
												name="newPassword"
												type={passwordShow ? "text" : "password"}
												value={otpForm.values.newPassword}
												onChange={otpForm.handleChange}
												onBlur={otpForm.handleBlur}
												isInvalid={!!(otpForm.errors.newPassword && otpForm.touched.newPassword)}
											/>
											<Button
												variant=""
												className={`btn ${
													!!(otpForm.errors.newPassword && otpForm.touched.newPassword)
														? "border-danger"
														: "btn-light bg-transparent "
												}`}
												type="button"
												onClick={() => setPasswordShow(!passwordShow)}
											>
												<i className={`${passwordShow ? "ri-eye-line" : "ri-eye-off-line"} align-middle`}></i>
											</Button>
										</InputGroup>
									</div>
									{otpForm.errors.newPassword && otpForm.touched.newPassword && (
										<div style={{ color: "red", margin: "0", padding: "1% 2%" }}>{otpForm.errors.newPassword}!</div>
									)}

									{/* Confirm Password Field */}
									<div className="col-xl-12 mb-2 p-1">
										<Form.Label className="form-label text-default">Confirm Password</Form.Label>
										<InputGroup>
											<Form.Control
												className="form-control-lg"
												placeholder="Confirm new password"
												name="confirmPassword"
												type={confirmPasswordShow ? "text" : "password"}
												value={otpForm.values.confirmPassword}
												onChange={otpForm.handleChange}
												onBlur={otpForm.handleBlur}
												isInvalid={!!(otpForm.errors.confirmPassword && otpForm.touched.confirmPassword)}
											/>
											<Button
												variant=""
												className={`btn ${
													!!(otpForm.errors.confirmPassword && otpForm.touched.confirmPassword)
														? "border-danger"
														: "btn-light bg-transparent "
												}`}
												type="button"
												onClick={() => setConfirmPasswordShow(!confirmPasswordShow)}
											>
												<i className={`${confirmPasswordShow ? "ri-eye-line" : "ri-eye-off-line"} align-middle`}></i>
											</Button>
										</InputGroup>
									</div>
									{otpForm.errors.confirmPassword && otpForm.touched.confirmPassword && (
										<div style={{ color: "red", margin: "0", padding: "1% 2%" }}>{otpForm.errors.confirmPassword}!</div>
									)}

									{/* Submit Button */}
									<div className="col-xl-12 d-grid mt-3 p-0">
										<Button type="submit" variant="primary" className="btn btn-lg">Reset Password</Button>
									</div>

								</form>
							</div>
						</Card>
					</Col>
				</div>
			</div>
		</Fragment>
	);
};

export default VerifyOtp;
