import React, { useState } from 'react';
import { Button, Card, Col, Form, Container } from 'react-bootstrap';
import { useLocation, useNavigate } from 'react-router-dom';
import { ResetPasswordService } from "../../service/authServices"; // Create this API call

const VerifyOtp = () => {
	const location = useLocation();
	const navigate = useNavigate();
	const correctOtp = location.state?.otp || ''; // OTP received from backend
	const email = location.state?.email || ''; // Email for password reset

	const [otp, setOtp] = useState('');
	const [newPassword, setNewPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const handleVerify = async (e) => {
		e.preventDefault();

		console.log(otp,'--correctOtp');
		

		// Check if OTP matches
		if (Number(otp) !== Number(correctOtp)) {
			setError("Invalid OTP.");
			return;
		}

		// Check if passwords match
		if (newPassword !== confirmPassword) {
			setError("Passwords do not match.");
			return;
		}

		try {
			// Now call the API since OTP is verified
			const response = await ResetPasswordService({ email, newPassword });
			if (response.data.status) {
				setSuccess("Password reset successfully.");
				navigate('/login'); // Redirect to login page
			} else {
				setError("Something went wrong.");
			}
		} catch (err) {
			setError("Something went wrong.");
		}
	};

	return (
		<Container fluid className="vh-100 d-flex justify-content-center align-items-center">
			<Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
				<Card>
					<div className="card-body p-5">
						<p className="h4 fw-semibold mb-4 text-center">Verify OTP</p>
						{error && <p className="text-danger">{error}</p>}
						{success && <p className="text-success">{success}</p>}
						<Form onSubmit={handleVerify}>
							<Form.Group className="mb-3">
								<Form.Label>OTP Code</Form.Label>
								<Form.Control
									type="text"
									placeholder="Enter OTP"
									value={otp}
									onChange={(e) => setOtp(e.target.value)}
									required
								/>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>New Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Enter new password"
									value={newPassword}
									onChange={(e) => setNewPassword(e.target.value)}
									required
								/>
							</Form.Group>
							<Form.Group className="mb-3">
								<Form.Label>Confirm Password</Form.Label>
								<Form.Control
									type="password"
									placeholder="Confirm new password"
									value={confirmPassword}
									onChange={(e) => setConfirmPassword(e.target.value)}
									required
								/>
							</Form.Group>
							<Button variant="primary" type="submit" className="w-100">
								Reset Password
							</Button>
						</Form>
					</div>
				</Card>
			</Col>
		</Container>
	);
};

export default VerifyOtp;
