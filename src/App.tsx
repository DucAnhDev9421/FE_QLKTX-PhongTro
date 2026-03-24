import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import React, { Suspense } from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

// Lazy load pages for performance
const LandingPage = React.lazy(() => import('./pages/landing'));
const Dashboard = React.lazy(() => import('./pages/dashboard'));
const Buildings = React.lazy(() => import('./pages/buildings'));
const Rooms = React.lazy(() => import('./pages/rooms'));
const PublicRooms = React.lazy(() => import('./pages/public/rooms'));
const RoomDetail = React.lazy(() => import('./pages/public/room-detail'));
const Tenants = React.lazy(() => import('./pages/tenants'));
const Invoices = React.lazy(() => import('./pages/invoices'));
const Contracts = React.lazy(() => import('./pages/contracts'));
const Payments = React.lazy(() => import('./pages/payments'));
const Reports = React.lazy(() => import('./pages/reports'));
const Incidents = React.lazy(() => import('./pages/incidents'));
const Settings = React.lazy(() => import('./pages/settings'));
const Services = React.lazy(() => import('./pages/services'));
const MeterReadings = React.lazy(() => import('./pages/meter-readings'));
const Users = React.lazy(() => import('./pages/users'));
const Profile = React.lazy(() => import('./pages/profile'));
const Login = React.lazy(() => import('./pages/auth/login'));
const Register = React.lazy(() => import('./pages/auth/register'));
const MyProfile = React.lazy(() => import('./pages/my-profile'));
const Assets = React.lazy(() => import('./pages/assets'));

const queryClient = new QueryClient();

function App() {
    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <BrowserRouter>
                    <Suspense fallback={
                        <div className="flex justify-center items-center h-screen bg-slate-900">
                            <div className="relative">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
                                </div>
                            </div>
                        </div>
                    }>
                        <Routes>
                            <Route path="/" element={<LandingPage />} />
                            <Route path="/phong-tro" element={<PublicRooms />} />
                            <Route path="/phong-tro/:id" element={<RoomDetail />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/my-profile" element={<MyProfile />} />
                            </Route>
                            
                            {/* Protect management routes */}
                            <Route path="/manage" element={<ProtectedRoute allowedRoles={['ADMIN', 'OWNER']} />}>
                                {/* Redirect /manage to /manage/dashboard */}
                                <Route index element={<Navigate to="/manage/dashboard" replace />} />
                                
                                <Route path="dashboard" element={<Dashboard />} />
                                <Route path="buildings" element={<Buildings />} />
                                <Route path="rooms" element={<Rooms />} />
                                <Route path="tenants" element={<Tenants />} />
                                <Route path="assets" element={<Assets />} />
                                <Route path="invoices" element={<Invoices />} />
                                <Route path="contracts" element={<Contracts />} />
                                <Route path="payments" element={<Payments />} />
                                <Route path="reports" element={<Reports />} />
                                <Route path="incidents" element={<Incidents />} />
                                <Route path="services" element={<Services />} />
                                <Route path="meter-readings" element={<MeterReadings />} />
                                <Route path="users" element={<Users />} />
                                <Route path="profile" element={<Profile />} />
                                <Route path="settings" element={<Settings />} />
                            </Route>

                            {/* Legacy redirects - optional but good for UX if they used old bookmarks */}
                            <Route path="/dashboard" element={<Navigate to="/manage/dashboard" replace />} />
                        </Routes>
                    </Suspense>
                </BrowserRouter>
            </QueryClientProvider>
        </ThemeProvider>
    );
}

export default App;
