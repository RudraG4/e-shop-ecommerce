import { useState, createRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from 'hooks';
import { Button, Form, Stack, InputGroup } from 'react-bootstrap';
import { Divider, Loader, ErrorAlert } from 'components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import UserService from 'services/UserService';

export default function SignIn() {
	const location = useLocation();
	const navigate = useNavigate();

	const _initFields = { email: location.state?.email || '', password: '' };
	const [step, setStep] = useState('step-email');
	const [formData, setFormData] = useState(_initFields);
	const [errorMessage, setErrorMessage] = useState({});
	const [alertMessage, setAlertMessage] = useState();
	const [isPending, setIsPending] = useState(false);
	const [showPassword, setshowPassword] = useState(false);
	const inputRef = createRef();
	const { signIn } = useAuthContext();

	const showHidePassword = () => {
		setshowPassword(!showPassword);
	};

	const clearErrorMessage = () => {
		setAlertMessage();
		setErrorMessage({});
	};

	const verifyEmail = async (event) => {
		event.preventDefault();
		if (formData.email) {
			clearErrorMessage();
			setIsPending(true);
			try {
				const response = await UserService.findUser(formData.email);
				if (response.success) {
					setStep('step-password');
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

	const handleSignIn = async (event) => {
		event.preventDefault();
		if (formData.email && formData.password) {
			clearErrorMessage();
			setIsPending(true);
			try {
				const data = await signIn(formData);
				if (data.success) {
					navigate(location.state?.redirect || '/');
				} else {
					setErrorMessage({ password: data.error });
				}
			} catch (error) {
				setErrorMessage({ password: error?.response?.data?.error || error.message });
			}
			setIsPending(false);
		} else {
			setErrorMessage({ password: 'Enter your password' });
		}
	};

	const onChangeClick = (event) => {
		event.preventDefault();
		clearErrorMessage();
		setFormData(_initFields);
		setStep('step-email');
	};

	const onValueChange = (event) => {
		const { name, value } = event.target;
		clearErrorMessage();
		setFormData((_old) => {
			return { ..._old, [name]: value };
		});
	};

	function renderSignInEmail() {
		return (
			<Form className="signin-form" noValidate>
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
				<Form.Group className="d-grid mb-3">
					<Button type="submit" variant="warning" onClick={verifyEmail} tabIndex="2">
						Continue
					</Button>
				</Form.Group>
				<Form.Text className="text-dark m-0">
					<Link
						className="text-underline-hover"
						to="/auth/forgotpassword"
						replace
						state={{ email: formData.email }}
						tabIndex="3"
					>
						Forgot Password?
					</Link>
				</Form.Text>
			</Form>
		);
	}

	function renderSignInPassword() {
		return (
			<Form className="signin-form" noValidate>
				<Form.Group className="mb-3">
					<Stack direction="horizontal" className="justify-content-between">
						<Form.Control plaintext readOnly value={formData.email} />
						<Form.Text className="text-dark mt-0">
							<Link
								className="text-underline-hover"
								to="/auth/login"
								onClick={onChangeClick}
								tabIndex="1"
							>
								Change
							</Link>
						</Form.Text>
					</Stack>
				</Form.Group>

				<Form.Group className="mb-3" controlId="password">
					<Stack direction="horizontal" className="justify-content-between">
						<Form.Label className="fw-semibold">Password</Form.Label>
						<Form.Text className="text-dark mt-0 mb-2">
							<Link
								className="text-underline-hover"
								to="/auth/forgotpassword"
								replace
								state={{ email: formData.email }}
								tabIndex="2"
							>
								Forgot Password?
							</Link>
						</Form.Text>
					</Stack>
					<InputGroup className="mb-3" hasValidation>
						<Form.Control
							type={showPassword ? 'text' : 'password'}
							name="password"
							tabIndex="3"
							isInvalid={errorMessage.password ? true : false}
							value={formData.password}
							onChange={onValueChange}
							ref={inputRef}
						/>
						<InputGroup.Text onClick={showHidePassword}>
							<FontAwesomeIcon icon={showPassword ? faEye : faEyeSlash} />
						</InputGroup.Text>
						<Form.Control.Feedback type="invalid">
							{errorMessage.password}
						</Form.Control.Feedback>
					</InputGroup>
				</Form.Group>

				<Form.Group className="d-grid">
					<Button type="submit" variant="warning" onClick={handleSignIn} tabIndex="4">
						Sign In
					</Button>
				</Form.Group>
			</Form>
		);
	}

	useEffect(() => {
		document.title = 'E-Shop Sign In';
		inputRef.current && inputRef.current.focus();
	}, [step]);

	return (
		<div style={{ width: '350px' }} className="m-auto">
			<div className="mb-3">
				<div className="mb-3">
					{alertMessage && <ErrorAlert>{alertMessage}</ErrorAlert>}
				</div>
				<div className="position-relative border rounded p-4 h-100 mb-3 bg-white">
					<h3 className="mb-3">Sign in</h3>
					{step === 'step-email' && renderSignInEmail()}
					{step === 'step-password' && renderSignInPassword()}
					{isPending && <Loader />}
				</div>
				<Divider message="New to E-Shop?" />
				<div className="d-grid">
					<Link className="btn btn-secondary text-white" to="/auth/register" tabIndex="4">
						Create your E-Shop account
					</Link>
				</div>
			</div>
		</div>
	);
}
