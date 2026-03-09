import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import Dashboard from './pages/dashboard';
import Rooms from './pages/rooms';
import Tenants from './pages/tenants';
import Contracts from './pages/contracts';
import Payments from './pages/payments';
import Reports from './pages/reports';
import Settings from './pages/settings';

const queryClient = new QueryClient();

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Navigate to="/dashboard" replace />} />
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/tenants" element={<Tenants />} />
                    <Route path="/contracts" element={<Contracts />} />
                    <Route path="/payments" element={<Payments />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    );
}

export default App;
