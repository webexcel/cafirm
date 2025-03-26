import React, { useState } from 'react';
import { Button, Card, Col, Form, Container, Spinner } from 'react-bootstrap';
import { ForgotPasswordService } from "../../service/authServices";
import { useNavigate } from "react-router-dom";

const ResetPassword = () => {
	const [email, setEmail] = useState('');
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');
	const [loading, setLoading] = useState(false);
	const navigate = useNavigate();

	const handleSubmit = async (e) => {
		e.preventDefault();
		setLoading(true); // Start loader
		setError('');
		setSuccess('');
		try {
			const response = await ForgotPasswordService({ email });
			if (response.data.status) {
				setSuccess("Verification code sent to your email.");
				navigate('/verify-otp', { state: { otp: response.data.otp, email } }); // Pass OTP and email
			} else {
				setError("Invalid Email");
			}
		} catch (err) {
			setError("Something went wrong.");
		} finally {
			setLoading(false); // Stop loader
		}
	};

	return (
		<Container fluid className="vh-100 d-flex justify-content-center align-items-center">
			<Col xxl={4} xl={5} lg={5} md={6} sm={8} className="col-12">
				<Card>
					<div className="card-body p-5">
						<p className="h4 fw-semibold mb-4 text-center">Reset Password</p>
						{error && <p className="text-danger">{error}</p>}
						{success && <p className="text-success">{success}</p>}
						<Form onSubmit={handleSubmit}>
							<Form.Group className="mb-4">
								<Form.Label>Email Address</Form.Label>
								<Form.Control
									type="email"
									placeholder="Enter your email"
									value={email}
									onChange={(e) => setEmail(e.target.value)}
									required
								/>
							</Form.Group>
							<Button variant="primary" type="submit" className="w-100" disabled={loading}>
								{loading ? <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" /> : "Send Verification Code"}
							</Button>
						</Form>
					</div>
				</Card>
			</Col>
		</Container>
	);
};

export default ResetPassword;
