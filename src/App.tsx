import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import LandingPage from './pages/landing';
import Dashboard from './pages/dashboard';
import Rooms from './pages/rooms';
import Tenants from './pages/tenants';
import Contracts from './pages/contracts';
import Payments from './pages/payments';
import Reports from './pages/reports';
import Settings from './pages/settings';
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
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/rooms" element={<Rooms />} />
                        <Route path="/tenants" element={<Tenants />} />
                        <Route path="/contracts" element={<Contracts />} />
                        <Route path="/payments" element={<Payments />} />
                        <Route path="/reports" element={<Reports />} />
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
