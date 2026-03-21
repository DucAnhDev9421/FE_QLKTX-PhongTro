import { Zap, Droplets, Wifi, Trash, Settings2, Flame, Wind, Shield, Monitor, Tv, Video, Phone, Battery, Home, Building, Car, Wrench, Briefcase, Camera, Key } from 'lucide-react';

export const getServiceIcon = (iconName: string | undefined, size = 20, className = '') => {
    switch (iconName) {
        case 'Zap': return <Zap size={size} className={className} />;
        case 'Droplets': return <Droplets size={size} className={className} />;
        case 'Wifi': return <Wifi size={size} className={className} />;
        case 'Trash': return <Trash size={size} className={className} />;
        case 'Flame': return <Flame size={size} className={className} />;
        case 'Wind': return <Wind size={size} className={className} />;
        case 'Shield': return <Shield size={size} className={className} />;
        case 'Monitor': return <Monitor size={size} className={className} />;
        case 'Tv': return <Tv size={size} className={className} />;
        case 'Video': return <Video size={size} className={className} />;
        case 'Phone': return <Phone size={size} className={className} />;
        case 'Battery': return <Battery size={size} className={className} />;
        case 'Home': return <Home size={size} className={className} />;
        case 'Building': return <Building size={size} className={className} />;
        case 'Car': return <Car size={size} className={className} />;
        case 'Wrench': return <Wrench size={size} className={className} />;
        case 'Briefcase': return <Briefcase size={size} className={className} />;
        case 'Camera': return <Camera size={size} className={className} />;
        case 'Key': return <Key size={size} className={className} />;
        default: return <Settings2 size={size} className={className} />;
    }
};
