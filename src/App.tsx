import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landing';
import Dashboard from './pages/dashboard';
import Buildings from './pages/buildings';
import Rooms from './pages/rooms';
import PublicRooms from './pages/public/rooms';
import RoomDetail from './pages/public/room-detail';
import Tenants from './pages/tenants';
import Invoices from './pages/invoices';
import Contracts from './pages/contracts';
import Payments from './pages/payments';
import Reports from './pages/reports';
import Settings from './pages/settings';
import Services from './pages/services';
import MeterReadings from './pages/meter-readings';
import Users from './pages/users';
import Profile from './pages/profile';
import Login from './pages/auth/login';
import Register from './pages/auth/register';
import { ThemeProvider } from './contexts/ThemeContext';

const queryClient = new QueryClient();

function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<LandingPage />} />
                        <Route path="/phong-tro" element={<PublicRooms />} />
                        <Route path="/phong-tro/:id" element={<RoomDetail />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/buildings" element={<Buildings />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/tenants" element={<Tenants />} />
                        <Route path="/invoices" element={<Invoices />} />
                        <Route path="/contracts" element={<Contracts />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/reports" element={<Reports />} />
                        <Route path="/services" element={<Services />} />
                        <Route path="/meter-readings" element={<MeterReadings />} />
                        <Route path="/users" element={<Users />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
