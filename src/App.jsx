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
import PaymentVerify from './components/PaymentVerify';
import ExpensePage from './Expense';
import RecurringInvoicePage from './RecurringInvoice';
import TrackDelivery from './Trackdelivery';
import SettingsPage from './SettingsPage';
import TaxPage from './taxpage';
import AuditPage from './AuditPage';
import ReportPage from './ReportPage';




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
          <Route path="/paymentverify" element={<PaymentVerify  />} /> {/* Redirect all other paths to Home */}
          <Route path="/expense" element={<ExpensePage  />} /> {/* Redirect all other paths to Home */}
          <Route path="/recurringInvoice" element={<RecurringInvoicePage  />} /> {/* Redirect all other paths to Home */}
          <Route path="/trackDelivery" element={<TrackDelivery />} /> 
          <Route path="/Settings" element={<SettingsPage />} /> {/* Redirect all other paths to Home */}
          <Route path="/Taxpage" element={<TaxPage />} /> {/* Redirect all other paths to Home */}
          <Route path="/AuditPage" element={<AuditPage />} /> {/* Redirect all other paths to Home */}
          <Route path="ReportPage" element={<ReportPage />} /> {/* Redirect all other paths to Home */}
        </Routes>
        
      </Router>
      
    
  );
}

export default App;
