// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Your current content moved here
import Register from './Register'; // New signup page
import Login from './login'; // New login page
import Dashboard from './Dashboard'; // New dashboard page
import CreateInvoice from './Create-invoice'; // New create invoice page
import InvoiceDashboardPage from './InvoicedashboardPage'; // New invoice dashboard page
import DashboardLayout from './components/DashboardLayout'; // New dashboard layout component
import CustomerRegistrationForm from './CustomerRegistrationPage';
import GenerateInvoicePage from './GenerateInvoicePage'; // New create invoice page
import PaymentPage from './PaymentPage';
import CompleteSetup from './CompleteSetup'; // New complete setup page
import ProductItemPage from './ProductItemPage'; // New inventory management page
import UpgradePage from './UpgradePage';


function App() {
  return (
    <Router basename="/InvoiceAPI_LandingPage">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/registration" element={<Register />} />
        <Route path="/login" element={<Login />} /> 
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/invoicedashboard" element={<InvoiceDashboardPage />} /> {/* Redirect to Dashboard for /invoicedashboard */}
        <Route path="/create-invoice" element={<CreateInvoice />} /> {/* Redirect all other paths to Home */}
        <Route path="/DashboardLayout" element={<DashboardLayout />} />
        <Route path="/customer" element={<CustomerRegistrationForm />} /> {/* Redirect all other paths to Home */}
        <Route path="/invoices" element={<GenerateInvoicePage />} /> {/* Redirect to Create Invoice*/}
        <Route path="/payment" element={<PaymentPage/>}/>
        <Route path="/complete-setup" element={<CompleteSetup/>} /> {/* Redirect all other paths to Home */}
        <Route path="/ProductItemPage" element={<ProductItemPage />} /> {/* New inventory management page */}
        <Route path="/UpgradePage" element={<UpgradePage />} /> {/* New inventory management page */}
        
        

        
      </Routes>
    </Router>
  );
}

export default App;
