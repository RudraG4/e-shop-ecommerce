import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-regular-svg-icons';
import { useState } from 'react';
import { Button, Form, InputGroup } from 'react-bootstrap';
import styled from 'styled-components';

const SubscribeBoxContainer = styled.div`
	max-width: 550px;
	padding: 0;
	margin: auto;
`;

SubscribeBoxContainer.displayName = 'SubscribeBoxContainer';

export default function SubscribeBox() {
	const navigate = useNavigate();
	const [email, setEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState();

	const onChange = (event) => {
		const { value } = event.target;
		setEmail(value);
		setErrorMessage();
	};

	const onSubmit = (event) => {
		event.preventDefault();
		if (email) {
			navigate('/auth/signin', { state: { email } });
		} else {
			setErrorMessage('Invalid email address. Please check your input');
		}
	};

	return (
		<SubscribeBoxContainer>
			<Form className="subscribebox-form" noValidate>
				<h4 className="fw-bold">Subscribe to get amazing deals</h4>
				<p>Enter your email and click on sign me up! to avail amazing deals and offers</p>
				<InputGroup className="gap-2" hasValidation>
					<Form.Control
						type="email"
						name="email"
						placeholder="Enter your email address"
						isInvalid={errorMessage ? true : false}
						value={email || ''}
						onChange={onChange}
						className="rounded-2"
					/>

					<Button
						type="submit"
						variant="warning"
						onClick={onSubmit}
						tabIndex="2"
						className="rounded-2"
					>
						Sign me up!
						<FontAwesomeIcon icon={faPaperPlane} className="ps-2" />
					</Button>
					<Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
				</InputGroup>
			</Form>
		</SubscribeBoxContainer>
	);
}
