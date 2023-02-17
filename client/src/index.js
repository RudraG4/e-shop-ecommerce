import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'react-data-grid/lib/styles.css';
import 'react-toastify/dist/ReactToastify.css';
import './styles.scss';
import { config } from 'dotenv';
import { BrowserRouter } from 'react-router-dom';
import { useScrollToTop as ScrollToTop } from 'hooks';
import { Provider } from 'context/AuthContext';
import App from './App';
import { ToastContainer } from 'react-toastify';

config();

function EShop() {
	return (
		<BrowserRouter basename="/">
			<Provider>
				<ScrollToTop />
				<ToastContainer />
				<App />
			</Provider>
		</BrowserRouter>
	);
}

const root = createRoot(document.getElementById('root'));
root.render(<EShop />);
