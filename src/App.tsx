import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AuthGuard from './components/auth/AuthGuard';
import AdminGuard from './components/auth/AdminGuard';
import EmployeePageGuard from './components/auth/EmployeePageGuard';
import VehicleRouteGuard from './components/auth/VehicleRouteGuard';
import BrokerGuard from './components/auth/BrokerGuard';
import Login from './pages/auth/Login';
import ResetPassword from './pages/auth/ResetPassword';
import { useAuthStore } from './store/authStore';

// Import verification and registration pages
const EmployerVerification = React.lazy(() => import('./pages/verify/EmployerVerification'));
const VerifyCompany = React.lazy(() => import('./pages/verify/VerifyCompany'));
const EmployeeVerification = React.lazy(() => import('./pages/verify/EmployeeVerification'));
const BrokerVerification = React.lazy(() => import('./pages/verify/BrokerVerification'));
const EmployeeRegistration = React.lazy(() => import('./pages/register/EmployeeRegistration'));
const CustomerRegistration = React.lazy(() => import('./pages/register/CustomerRegistration'));
const EmployerRegistration = React.lazy(() => import('./pages/employer-registration'));
const BrokerCustomers = React.lazy(() => import('./pages/broker-customers/BrokerCustomers'));

// Import EmailVerification page
const EmailVerification = React.lazy(() => import('./pages/verify/EmailVerification'));

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Companies = React.lazy(() => import('./pages/companies/Companies'));
const BrokerList = React.lazy(() => import('./pages/brokers/BrokerList'));
const BrokerInvite = React.lazy(() => import('./pages/brokers/BrokerInvite'));
const Vehicles = React.lazy(() => import('./pages/vehicles'));
const PrivateVehicles = React.lazy(() => import('./pages/vehicles/PrivateVehicles'));
const CompanyVehicles = React.lazy(() => import('./pages/vehicles/CompanyVehicles'));
const SalaryVehicles = React.lazy(() => import('./pages/vehicles/SalaryVehicles'));
const VehicleForm = React.lazy(() => import('./pages/vehicles/VehicleForm'));
const VehicleDetail = React.lazy(() => import('./pages/vehicles/VehicleDetail'));
const Users = React.lazy(() => import('./pages/Users'));
const Requests = React.lazy(() => import('./pages/requests/Requests'));
const Orders = React.lazy(() => import('./pages/orders/Orders'));
const News = React.lazy(() => import('./pages/news/News'));
const FAQs = React.lazy(() => import('./pages/faqs/FAQs'));
const Support = React.lazy(() => import('./pages/support/Support'));
const TicketDetail = React.lazy(() => import('./pages/support/TicketDetail'));
const Settings = React.lazy(() => import('./pages/Settings'));
const Profile = React.lazy(() => import('./pages/profile/Profile'));
const CompanyData = React.lazy(() => import('./pages/profile/CompanyData'));
const Employees = React.lazy(() => import('./pages/employees/Employees'));
const Recommend = React.lazy(() => import('./pages/recommend/Recommend'));
const HowItWorks = React.lazy(() => import('./pages/how-it-works/HowItWorks'));
const BrokerCompanies = React.lazy(() => import('./pages/broker-companies/BrokerCompanies'));
const BenefitsCalculator = React.lazy(() => import('./pages/benefits/BenefitsCalculator'));
const SalaryConversionInfo = React.lazy(() => import('./pages/salary-conversion/SalaryConversionInfo'));
const OrderDetail = React.lazy(() => import('./pages/orders/OrderDetail'));
const BrokerOrders = React.lazy(() => import('./pages/orders/BrokerOrders'));

const LazyComponent = ({ component: Component }: { component: React.ComponentType }) => (
  <React.Suspense fallback={<div>Loading...</div>}>
    <Component />
  </React.Suspense>
);

function App() {
  const { initialize } = useAuthStore();

  // Initialize auth store
  useEffect(() => {
    initialize();
  }, [initialize]);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* Verification and registration routes - must be outside AuthGuard */}
        <Route path="/verify/company/:verificationId" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <VerifyCompany />
          </React.Suspense>
        } />
        <Route path="/verify/employer/:verificationId" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <EmployerVerification />
          </React.Suspense>
        } />
        <Route path="/verify/employee/:verificationId" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <EmployeeVerification />
          </React.Suspense>
        } />
        <Route path="/verify/employee/:type" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <EmployeeVerification />
          </React.Suspense>
        } />
        <Route path="/verify/broker/:verificationId" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <BrokerVerification />
          </React.Suspense>
        } />
        <Route path="/register/employee/:inviteId" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <EmployeeRegistration />
          </React.Suspense>
        } />
        <Route path="/register/customer/:inviteId?" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <CustomerRegistration />
          </React.Suspense>
        } />
        <Route path="/employer-registration" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <EmployerRegistration />
          </React.Suspense>
        } />

        {/* Add EmailVerification route */}
        <Route path="/verify-email" element={
          <React.Suspense fallback={<div>Loading...</div>}>
            <EmailVerification />
          </React.Suspense>
        } />

        {/* Protected routes */}
        <Route element={<AuthGuard><Layout /></AuthGuard>}>
          <Route index element={<LazyComponent component={Dashboard} />} />
          <Route path="companies" element={<AdminGuard><LazyComponent component={Companies} /></AdminGuard>} />
          <Route path="broker-companies" element={<BrokerGuard><LazyComponent component={BrokerCompanies} /></BrokerGuard>} />
          <Route path="broker-customers" element={<BrokerGuard><LazyComponent component={BrokerCustomers} /></BrokerGuard>} />
          
          {/* Broker routes */}
          <Route path="brokers">
            <Route index element={<BrokerGuard><LazyComponent component={BrokerList} /></BrokerGuard>} />
            <Route path="invite" element={<BrokerGuard><LazyComponent component={BrokerInvite} /></BrokerGuard>} />
          </Route>
          
          {/* Vehicle routes - all protected by VehicleRouteGuard */}
          <Route path="vehicles">
            <Route index element={
              <VehicleRouteGuard>
                <LazyComponent component={Vehicles} />
              </VehicleRouteGuard>
            } />
            <Route path="private" element={
              <VehicleRouteGuard>
                <LazyComponent component={PrivateVehicles} />
              </VehicleRouteGuard>
            } />
            <Route path="company" element={
              <VehicleRouteGuard>
                <LazyComponent component={CompanyVehicles} />
              </VehicleRouteGuard>
            } />
            <Route path="salary" element={
              <VehicleRouteGuard>
                <LazyComponent component={SalaryVehicles} />
              </VehicleRouteGuard>
            } />
            <Route path="new" element={
              <VehicleRouteGuard>
                <AdminGuard>
                  <LazyComponent component={VehicleForm} />
                </AdminGuard>
              </VehicleRouteGuard>
            } />
            <Route path=":id" element={
              <VehicleRouteGuard>
                <AdminGuard>
                  <LazyComponent component={VehicleForm} />
                </AdminGuard>
              </VehicleRouteGuard>
            } />
            <Route path=":id/detail" element={
              <VehicleRouteGuard>
                <LazyComponent component={VehicleDetail} />
              </VehicleRouteGuard>
            } />
          </Route>

          <Route path="employees" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <EmployeePageGuard>
                <Employees />
              </EmployeePageGuard>
            </React.Suspense>
          } />
          <Route path="salary-conversion" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <EmployeePageGuard>
                <SalaryConversionInfo />
              </EmployeePageGuard>
            </React.Suspense>
          } />
          <Route path="benefits" element={
            <React.Suspense fallback={<div>Loading...</div>}>
              <EmployeePageGuard>
                <BenefitsCalculator />
              </EmployeePageGuard>
            </React.Suspense>
          } />
          <Route path="requests" element={<LazyComponent component={Requests} />} />
          {/* Orders routes */}
          <Route path="orders">
            <Route index element={<LazyComponent component={Orders} />} />
            <Route path=":id" element={<LazyComponent component={OrderDetail} />} />
          </Route>
          <Route path="broker-orders" element={
            <BrokerGuard>
              <React.Suspense fallback={<div>Loading...</div>}>
                <BrokerOrders />
              </React.Suspense>
            </BrokerGuard>
          } />
          <Route path="users" element={<LazyComponent component={Users} />} />
          <Route path="how-it-works" element={<LazyComponent component={HowItWorks} />} />
          <Route path="news" element={<LazyComponent component={News} />} />
          <Route path="faqs" element={<LazyComponent component={FAQs} />} />
          <Route path="support">
            <Route index element={<LazyComponent component={Support} />} />
            <Route path="tickets/:ticketId" element={<LazyComponent component={TicketDetail} />} />
          </Route>
          <Route path="settings" element={<LazyComponent component={Settings} />} />
          <Route path="recommend" element={<LazyComponent component={Recommend} />} />
          <Route path="profile">
            <Route index element={<LazyComponent component={Profile} />} />
            <Route path="company" element={<LazyComponent component={CompanyData} />} />
          </Route>
        </Route>

        {/* Catch all route */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
