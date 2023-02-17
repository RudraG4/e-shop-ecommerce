import { useState, useEffect, createRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Button, Form, Stack } from 'react-bootstrap';
import { Loader, CountdownTimer, ErrorAlert, Divider } from 'components';
import { useAuthContext } from 'hooks';
import AuthService from 'services/AuthService';

export default function ForgotPassword() {
	const location = useLocation();
	const navigate = useNavigate();
	const { signIn } = useAuthContext();
	const _initFields = {
		email: location.state?.email || '',
		password: '',
		cpassword: '',
		otp: ''
	};
	const [step, setStep] = useState('basic-info');
	const [formData, setFormData] = useState(_initFields);
	const [errorMessage, setErrorMessage] = useState({});
	const [alertMessage, setAlertMessage] = useState();
	const [startTime, setStartTime] = useState();
	const [isPending, setIsPending] = useState(false);
	const inputRef = createRef();

	const clearErrorMessage = () => {
		setAlertMessage();
		setErrorMessage({});
	};

	const resendOTP = async () => {
		clearErrorMessage();
		setIsPending(true);
		setFormData((_old) => {
			return { ..._old, otp: '' };
		});
		try {
			await AuthService.verify({ email: formData.email, action: 'resend' });
			setStartTime(Date.now() + 60000);
		} catch (error) {}
		setIsPending(false);
	};

	const resetAndSignIn = async (event) => {
		event.preventDefault();
		if (formData.password === formData.cpassword) {
			clearErrorMessage();
			setIsPending(true);
			try {
				const data = {
					email: formData.email,
					password: formData.password,
					verify_token: formData.verify_token
				};
				const response = await AuthService.resetPassword(data);
				if (response.success) {
					const signInResp = await signIn(formData);
					if (signInResp.success) {
						setIsPending(false);
						navigate('/');
						return;
					}
					setTimeout(() => navigate('/auth/signin'), 2000);
					return;
				}
				setErrorMessage({ password: response.error });
			} catch (error) {
				setAlertMessage(error.message);
			}
			setIsPending(false);
		} else {
			setErrorMessage({ cpassword: 'Passwords must match' });
		}
	};

	const verifyCode = async (event) => {
		event.preventDefault();
		if (formData.otp) {
			clearErrorMessage();
			setIsPending(true);
			try {
				const data = { email: formData.email, code: formData.otp, action: 'code' };
				const response = await AuthService.verify(data);
				if (response.success) {
					setIsPending(false);
					setStep('set-password');
				}
				setErrorMessage({ otp: response.error });
			} catch (error) {
				setAlertMessage(error.error);
			}
			setIsPending(false);
		} else {
			setErrorMessage({ otp: 'Enter your OTP' });
		}
	};

	const verifyAccount = async (event) => {
		event.preventDefault();
		if (formData.email) {
			clearErrorMessage();
			setIsPending(true);
			try {
				const response = await AuthService.forgotPassword(formData.email);
				if (response.success) {
					setFormData((_old) => {
						return { ..._old, verify_token: response.verify_token };
					});
					setStep('verify-info');
				} else {
					setErrorMessage({ email: response.error });
				}
			} catch (error) {
				setErrorMessage({ email: error?.response?.data?.error || error.message });
			}
			setIsPending(false);
		} else {
			setErrorMessage({ email: 'Enter your email address' });
		}
	};

	const onValueChange = (event) => {
		const { name, value } = event.target;
		clearErrorMessage();
		setFormData((_old) => {
			return { ..._old, [name]: value };
		});
	};

	function renderAssitanceView() {
		return (
			<div className="bg-white">
				<h3 className="mb-3">Password assistance</h3>
				<Form className="password-assistance-form" noValidate>
					<Form.Text as="p" className="lh-sm mb-3 text-dark">
						Enter the email address associated with your E-Shop account, then click
						Continue.
					</Form.Text>

					<Form.Group className="mb-3" controlId="email">
						<Form.Label className="fw-semibold">Email</Form.Label>
						<Form.Control
							type="email"
							name="email"
							tabIndex="1"
							isInvalid={errorMessage.email ? true : false}
							onChange={onValueChange}
							value={formData.email}
							ref={inputRef}
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessage.email}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="d-grid">
						<Button
							type="submit"
							variant="warning"
							onClick={verifyAccount}
							tabIndex="2"
						>
							Continue
						</Button>
					</Form.Group>
				</Form>
			</div>
		);
	}

	function renderVerificationView() {
		return (
			<div className="bg-white">
				<h3 className="mb-3">Verification required</h3>
				<Form className="needs-validation" noValidate>
					<Form.Text as="p" className="lh-sm mb-3 text-dark">
						<span>{`To continue, complete this verification step. We've sent a One Time Password (OTP) to the email `}</span>
						<span className="fw-bold">{formData.email}</span>
						<span>{`. Please enter it below.`}</span>
					</Form.Text>

					<Form.Group className="mb-3" controlId="otp">
						<Stack direction="horizontal" className="justify-content-between">
							<Form.Label className="fw-semibold">Enter OTP</Form.Label>
							{startTime && (
								<CountdownTimer
									className="text-danger mt-0 mb-2"
									startTime={startTime}
								/>
							)}
						</Stack>
						<Form.Control
							type="text"
							name="otp"
							tabIndex="1"
							isInvalid={errorMessage.otp ? true : false}
							value={formData.otp}
							onChange={onValueChange}
							ref={inputRef}
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessage.otp}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="d-grid gap-2">
						<Button variant="warning" onClick={verifyCode} tabIndex="2">
							Continue
						</Button>
						<Button
							variant="light"
							onClick={(event) => {
								event.preventDefault();
								resendOTP();
							}}
							tabIndex="3"
						>
							Resend OTP
						</Button>
					</Form.Group>
				</Form>
			</div>
		);
	}

	function renderSetPasswordView() {
		return (
			<div className="bg-white">
				<h3 className="mb-3">Create new password</h3>
				<Form className="newpassword-form" noValidate>
					<Form.Text as="p" className="lh-sm mb-3 text-dark">
						We'll ask for this password whenever you Sign-In.
					</Form.Text>

					<Form.Group className="mb-3" controlId="password">
						<Form.Label className="fw-semibold">New password</Form.Label>
						<Form.Control
							type="password"
							name="password"
							tabIndex="1"
							isInvalid={errorMessage.password ? true : false}
							value={formData.password}
							onChange={onValueChange}
							ref={inputRef}
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessage.password}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="cpassword">
						<Form.Label className="fw-semibold">Re-enter password</Form.Label>
						<Form.Control
							type="password"
							name="cpassword"
							tabIndex="2"
							isInvalid={errorMessage.cpassword ? true : false}
							value={formData.cpassword}
							onChange={onValueChange}
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessage.cpassword}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="d-grid">
						<Button variant="warning" onClick={resetAndSignIn} tabIndex="3">
							Save and Sign-In
						</Button>
					</Form.Group>
				</Form>
			</div>
		);
	}

	useEffect(() => {
		inputRef && inputRef.current.focus();
		document.title = 'E-Shop Password Assistance';
		if (step === 'verify-info') {
			setStartTime(Date.now() + 60000);
		}
	}, [step]);

	return (
		<div style={{ width: '350px' }} className="m-auto">
			<div className="mb-3">
				<div className="mb-3">
					{alertMessage && <ErrorAlert>{alertMessage}</ErrorAlert>}
				</div>
				<div className="position-relative border rounded p-4 h-100 mb-3 bg-white">
					{step === 'basic-info' && renderAssitanceView()}
					{step === 'verify-info' && renderVerificationView()}
					{step === 'set-password' && renderSetPasswordView()}
					{isPending && <Loader />}
				</div>
				<Divider message="Existing E-Shop User?" />
				<div className="d-grid">
					<Link className="btn btn-secondary text-white" to="/auth/signin" tabIndex="6">
						Sign In to your account
					</Link>
				</div>
			</div>
		</div>
	);
}
