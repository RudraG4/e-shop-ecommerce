import { useState, createRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleCheck } from '@fortawesome/free-regular-svg-icons';
import { Button, Form, Stack } from 'react-bootstrap';
import { Divider, Loader, CountdownTimer, ErrorAlert } from 'components';
import { useAuthContext } from 'hooks';
import AuthService from 'services/AuthService';

export default function Register() {
	const navigate = useNavigate();
	const _initFields = {
		name: '',
		mobile: '',
		email: '',
		password: '',
		cpassword: '',
		otp: ''
	};
	const [verifyMode, setVerifyMode] = useState();
	const [step, setStep] = useState('basic-info');
	const [formData, setFormData] = useState(_initFields);
	const [errorMessage, setErrorMessage] = useState({});
	const [alertMessage, setAlertMessage] = useState();
	const [startTime, setStartTime] = useState();
	const [isPending, setIsPending] = useState(false);
	const inputRef = createRef();
	const { signIn } = useAuthContext();

	const clearErrorMessage = () => {
		setAlertMessage();
		setErrorMessage({});
	};

	const isFormValid = () => {
		let isValid = true;
		if (!formData.name) {
			isValid = false;
			setErrorMessage((oldError) => {
				return { ...oldError, name: 'Enter your name' };
			});
		}
		if (!formData.email) {
			isValid = false;
			setErrorMessage((oldError) => {
				return {
					...oldError,
					email: 'Enter your email address'
				};
			});
		}
		if (!formData.password) {
			isValid = false;
			setErrorMessage((oldError) => {
				return { ...oldError, password: 'Minimum 6 characters required' };
			});
		} else if (formData.password.length < 6) {
			isValid = false;
			setErrorMessage((oldError) => {
				return { ...oldError, password: 'Minimum 6 characters required' };
			});
		}
		if (formData.cpassword !== formData.password) {
			isValid = false;
			setErrorMessage((oldError) => {
				return { ...oldError, cpassword: 'Type your password again' };
			});
		}
		return isValid;
	};

	const verifyCode = async () => {
		clearErrorMessage();
		setIsPending(true);
		setFormData((_old) => {
			return { ..._old, otp: '' };
		});
		try {
			await AuthService.verify({ email: formData.email, action: 'resend' });
			setStartTime(Date.now() + 60000);
		} catch (error) {
			setAlertMessage(error.error);
		}
		setIsPending(false);
	};

	const verifyAndSignIn = async (event) => {
		event.preventDefault();
		if (formData.otp) {
			clearErrorMessage();
			setIsPending(true);
			try {
				const response = await AuthService.verify({
					email: formData.email,
					code: formData.otp,
					action: 'code'
				});
				if (response.success) {
					const signInResp = await signIn(formData);
					if (signInResp.success) {
						setIsPending(false);
						return navigate('/');
					}
					setIsPending(false);
					setStep('success');
					return setTimeout(() => navigate('/auth/signin'), 2000);
				}
				setErrorMessage({ otp: response.error });
			} catch (error) {
				setAlertMessage(error.message);
			}
			setIsPending(false);
		} else {
			setErrorMessage({ otp: 'Enter your OTP' });
		}
	};

	const verifyCreateFormData = async (event) => {
		event.preventDefault();
		if (isFormValid()) {
			clearErrorMessage();
			setIsPending(true);
			try {
				const { name, mobile, email, password, cpassword } = formData;
				const body = { name, mobile, email, password, cpassword };
				const response = await AuthService.register(body);
				if (response.success) {
					setStep('verify-info');
				} else {
					setErrorMessage({ email: response.error });
				}
			} catch (error) {
				setAlertMessage(error.message);
			}
			setIsPending(false);
		}
	};

	const onChangeClick = (event) => {
		event.preventDefault();
		clearErrorMessage();
		setFormData(_initFields);
		setStep('basic-info');
	};

	const onValueChange = (event) => {
		const { name, value } = event.target;
		clearErrorMessage();
		setFormData((_old) => {
			return { ..._old, [name]: value };
		});
		if (name === 'email') {
			setVerifyMode(value ? 'email' : undefined);
		}
	};

	function renderBasicInfoView() {
		return (
			<div className="bg-white">
				<h3>Create account</h3>
				<Form className="register-form" noValidate>
					<Form.Group className="mb-3" controlId="name">
						<Form.Label className="fw-semibold">Your name</Form.Label>
						<Form.Control
							type="text"
							name="name"
							placeholder="First and last name"
							isInvalid={errorMessage.name ? true : false}
							onChange={onValueChange}
							value={formData.name}
							ref={inputRef}
							tabIndex="1"
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessage.name}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="email">
						<Form.Label className="fw-semibold">Your Email</Form.Label>
						<Form.Control
							type="email"
							name="email"
							placeholder="johndoe@gmail.com"
							isInvalid={errorMessage.email ? true : false}
							onChange={onValueChange}
							value={formData.email}
							tabIndex="2"
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessage.email}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="password">
						<Form.Label className="fw-semibold">Password</Form.Label>
						<Form.Control
							type="password"
							name="password"
							placeholder="At least 6 characters"
							isInvalid={errorMessage.password ? true : false}
							onChange={onValueChange}
							value={formData.password}
							tabIndex="3"
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessage.password}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="mb-3" controlId="cpassword">
						<Form.Label className="fw-semibold">Confirm Password</Form.Label>
						<Form.Control
							type="password"
							name="cpassword"
							placeholder="At least 6 characters"
							isInvalid={errorMessage.cpassword ? true : false}
							onChange={onValueChange}
							value={formData.cpassword}
							tabIndex="4"
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessage.cpassword}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="d-grid">
						<Button
							variant="warning"
							onClick={verifyCreateFormData}
							tabIndex="5"
							type="submit"
						>
							{verifyMode === 'email' ? 'Verify email' : 'Continue'}
						</Button>
					</Form.Group>
				</Form>
			</div>
		);
	}

	function renderVerificationView() {
		return (
			<div className="bg-white">
				<h3>{`Verify email address`}</h3>
				<Form className="needs-validation" noValidate>
					<Form.Group className="mb-3">
						{!isPending && (
							<>
								<Form.Text className="me-1">{`To verify your email, we've sent a One Time Password (OTP) to ${formData.email}`}</Form.Text>
								<Form.Text className="text-dark">
									<Link
										className="ms-2 text-underline-hover"
										to="/auth/register"
										onClick={onChangeClick}
										tabIndex="1"
									>
										Change
									</Link>
								</Form.Text>
							</>
						)}
					</Form.Group>

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
							isInvalid={errorMessage.otp ? true : false}
							onChange={onValueChange}
							value={formData.otp}
							tabIndex="2"
							ref={inputRef}
						/>
						<Form.Control.Feedback type="invalid">
							{errorMessage.otp}
						</Form.Control.Feedback>
					</Form.Group>

					<Form.Group className="d-grid gap-2">
						<Button variant="warning" onClick={verifyAndSignIn} tabIndex="3">
							Create your E-Shop Account
						</Button>
						<Button
							variant="light"
							onClick={(event) => {
								event.preventDefault();
								verifyCode();
							}}
							tabIndex="4"
						>
							Resend OTP
						</Button>
					</Form.Group>
				</Form>
			</div>
		);
	}

	function renderSuccessView() {
		return (
			<div
				className="vstack align-items-center justify-content-center w-100"
				style={{ height: '250px' }}
			>
				<FontAwesomeIcon icon={faCircleCheck} className="text-warning fs-2 mb-2" />
				<div className="fw-bold fs-5 ">Created Successfully</div>
			</div>
		);
	}

	useEffect(() => {
		document.title = 'E-Shop Create Account';
		inputRef.current && inputRef.current.focus();
	}, [step]);

	return (
		<div style={{ width: '350px' }} className="m-auto">
			<div className="mb-3">
				<div className="mb-3">
					{alertMessage && <ErrorAlert>{alertMessage}</ErrorAlert>}
				</div>
				<div className="position-relative border rounded p-4 h-100 mb-3 bg-white">
					{step === 'basic-info' && renderBasicInfoView()}
					{step === 'verify-info' && renderVerificationView()}
					{step === 'success' && renderSuccessView()}
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
