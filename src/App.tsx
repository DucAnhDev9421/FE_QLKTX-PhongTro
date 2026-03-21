import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
import React, { Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

const MyProfile = React.lazy(() => import('./pages/my-profile'));

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
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route element={<ProtectedRoute />}>
                            <Route path="/my-profile" element={
                                <Suspense fallback={
                                    <div className="flex justify-center items-center h-screen bg-neutral-900">
                                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-r-2 border-[#D4AF37]"></div>
                                    </div>
                                }>
                                    <MyProfile />
                                </Suspense>
                            } />
                        </Route>
                        
                        {/* Protect management routes */}
                        <Route path="/manage" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']} />}>
                            {/* Redirect /manage to /manage/dashboard */}
                            <Route index element={<Navigate to="/manage/dashboard" replace />} />
                            
                            <Route path="dashboard" element={<Dashboard />} />
                            <Route path="buildings" element={<Buildings />} />
                            <Route path="rooms" element={<Rooms />} />
                            <Route path="tenants" element={<Tenants />} />
                            <Route path="invoices" element={<Invoices />} />
                            <Route path="contracts" element={<Contracts />} />
                            <Route path="payments" element={<Payments />} />
                            <Route path="reports" element={<Reports />} />
                            <Route path="services" element={<Services />} />
                            <Route path="meter-readings" element={<MeterReadings />} />
                            <Route path="users" element={<Users />} />
                            <Route path="profile" element={<Profile />} />
                            <Route path="settings" element={<Settings />} />
                        </Route>

                        {/* Legacy redirects - optional but good for UX if they used old bookmarks */}
                        <Route path="/dashboard" element={<Navigate to="/manage/dashboard" replace />} />
                    </Routes>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
