
import React, { useState, useEffect } from 'react';
import { Vehicle, Supplier, Shift, VehicleStatus, StatusTextConfig, UserRole } from './types';
import Header from './components/Header';
import Dashboard from './components/Dashboard';
import Reporting from './components/Reporting';
import Admin from './components/Admin';
import SecurityDashboard from './components/SecurityDashboard';
import OperatorDashboard from './components/OperatorDashboard';

export type Page = 'Dashboard' | 'Reporting' | 'Admin';

// Mock Data
const initialSuppliers: Supplier[] = [
  { id: 'S01', name: 'Global Foods Inc.' },
  { id: 'S02', name: 'Fresh Produce Co.' },
  { id: 'S03', name: 'Beverage Masters' },
  { id: 'S04', name: 'Pantry Essentials' },
  { id: 'S05', name: 'Delhivery Logistics' },
  { id: 'S06', name: 'Blue Dart Express' },
  { id: 'S07', name: 'Gati Ltd.' },
  { id: 'S08', name: 'Ecom Express' },
  { id: 'S09', name: 'Future Supply Chains' },
];

const initialShifts: Shift[] = [
    { id: 'shift1', name: 'Morning Shift', startTime: '06:00', endTime: '14:00' },
    { id: 'shift2', name: 'Afternoon Shift', startTime: '14:00', endTime: '22:00' },
    { id: 'shift3', name: 'Night Shift', startTime: '22:00', endTime: '06:00' },
];

const initialStatusTexts: StatusTextConfig = {
    [VehicleStatus.STAGING]: 'In Staging Area',
    [VehicleStatus.CALLED_IN]: 'Called In',
    [VehicleStatus.UNLOADING]: 'Unloading',
    [VehicleStatus.COMPLETED]: 'Unloading Completed',
    [VehicleStatus.DEPARTED]: 'Departed',
};

const generateInitialVehicles = (): Vehicle[] => {
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  return [
    // --- STAGING VEHICLES ---
    { id: 'V01', registrationNumber: 'MH 12 AB 1234', supplierId: 'S05', status: VehicleStatus.STAGING, timestamps: { arrival: now - oneHour * 5 } }, // Long wait > 4h (red)
    { id: 'V02', registrationNumber: 'DL 03 BC 5678', supplierId: 'S06', status: VehicleStatus.STAGING, timestamps: { arrival: now - oneHour * 3 } }, // Medium wait > 2h (yellow)
    { id: 'V03', registrationNumber: 'KA 05 CD 9012', supplierId: 'S07', status: VehicleStatus.STAGING, timestamps: { arrival: now - oneHour * 1.5 } },
    { id: 'V04', registrationNumber: 'TN 22 DE 3456', supplierId: 'S08', status: VehicleStatus.STAGING, timestamps: { arrival: now - oneHour * 0.5 } },
    { id: 'V12', registrationNumber: 'GJ 01 FA 7890', supplierId: 'S01', status: VehicleStatus.STAGING, timestamps: { arrival: now - oneHour * 0.2 } },


    // --- CALLED IN / ASSIGNED VEHICLES ---
    { id: 'V05', registrationNumber: 'AP 39 EF 7890', supplierId: 'S02', status: VehicleStatus.CALLED_IN, assignedDock: '2', timestamps: { arrival: now - oneHour * 2.2, calledIn: now - oneHour * 0.1 } },

    // --- UNLOADING VEHICLES ---
    { id: 'V06', registrationNumber: 'PB 65 FG 1234', supplierId: 'S03', status: VehicleStatus.UNLOADING, assignedDock: '1', driverName: 'Ramesh Singh', loadmenCount: 4, timestamps: { arrival: now - oneHour * 4, calledIn: now - oneHour * 3.2, unloadingStart: now - oneHour * 3 } }, // Long unload > 2h
    { id: 'V07', registrationNumber: 'HR 26 GH 5678', supplierId: 'S09', status: VehicleStatus.UNLOADING, assignedDock: '4', driverName: 'Sunita Devi', loadmenCount: 3, timestamps: { arrival: now - oneHour * 1, calledIn: now - oneHour * 0.6, unloadingStart: now - oneHour * 0.5 } }, // Normal unload
    
    // --- COMPLETED VEHICLES ---
    { id: 'V08', registrationNumber: 'WB 11 IJ 9012', supplierId: 'S05', status: VehicleStatus.COMPLETED, assignedDock: '5', driverName: 'Amit Kumar', timestamps: { arrival: now - oneHour * 6, calledIn: now - oneHour * 5, unloadingStart: now - oneHour * 4.8, unloadingEnd: now - oneHour * 3.5 }, delayRemarks: 'Heavy traffic at gate.' },
    { id: 'V09', registrationNumber: 'RJ 14 KL 3456', supplierId: 'S06', status: VehicleStatus.COMPLETED, assignedDock: '3', driverName: 'Priya Sharma', timestamps: { arrival: now - oneHour * 8, calledIn: now - oneHour * 7, unloadingStart: now - oneHour * 6.9, unloadingEnd: now - oneHour * 5 } },
    { id: 'V10', registrationNumber: 'MP 09 MN 7890', supplierId: 'S01', status: VehicleStatus.COMPLETED, assignedDock: '6', driverName: 'Suresh Patil', timestamps: { arrival: now - oneHour * 10, calledIn: now - oneHour * 9, unloadingStart: now - oneHour * 8.5, unloadingEnd: now - oneHour * 7 } },
    { id: 'V11', registrationNumber: 'UP 78 OP 1234', supplierId: 'S04', status: VehicleStatus.COMPLETED, assignedDock: '8', driverName: 'Anjali Gupta', timestamps: { arrival: now - oneHour * 12, calledIn: now - oneHour * 11, unloadingStart: now - oneHour * 10.5, unloadingEnd: now - oneHour * 9.2 } },
  ];
};


const App: React.FC = () => {
    // State management
    const [vehicles, setVehicles] = useState<Vehicle[]>(() => {
        const savedVehicles = localStorage.getItem('dockflow-vehicles');
        return savedVehicles ? JSON.parse(savedVehicles) : generateInitialVehicles();
    });
    const [suppliers, setSuppliers] = useState<Supplier[]>(() => {
        const savedSuppliers = localStorage.getItem('dockflow-suppliers');
        return savedSuppliers ? JSON.parse(savedSuppliers) : initialSuppliers;
    });
    const [shifts, setShifts] = useState<Shift[]>(initialShifts);
    const [statusTexts, setStatusTexts] = useState<StatusTextConfig>(() => {
        const savedStatusTexts = localStorage.getItem('dockflow-statusTexts');
        return savedStatusTexts ? JSON.parse(savedStatusTexts) : initialStatusTexts;
    });
    const [currentPage, setCurrentPage] = useState<Page>('Dashboard');
    const [currentUserRole, setCurrentUserRole] = useState<UserRole>('Admin');
    const [maintenanceDocks, setMaintenanceDocks] = useState<string[]>(['7']); // Dock 7 is in maintenance by default for demo
    
    // Persist state to localStorage
    useEffect(() => {
        localStorage.setItem('dockflow-vehicles', JSON.stringify(vehicles));
    }, [vehicles]);
    
    useEffect(() => {
        localStorage.setItem('dockflow-suppliers', JSON.stringify(suppliers));
    }, [suppliers]);
    
    useEffect(() => {
        localStorage.setItem('dockflow-statusTexts', JSON.stringify(statusTexts));
    }, [statusTexts]);


    const supplierMap = suppliers.reduce((acc, s) => ({ ...acc, [s.id]: s.name }), {});

    // Handlers
    const handleAddVehicle = (newVehicleData: Omit<Vehicle, 'id' | 'status' | 'timestamps'>) => {
        const newVehicle: Vehicle = {
            id: `V-${Date.now()}`,
            ...newVehicleData,
            status: VehicleStatus.STAGING,
            timestamps: {
                arrival: Date.now(),
            },
        };
        setVehicles(prev => [newVehicle, ...prev]);
    };

    const handleDeleteVehicle = (id: string) => {
        setVehicles(prev => prev.filter(v => v.id !== id));
    };

    const handleUpdateStatus = (id: string, newStatus: VehicleStatus) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === id) {
                const newTimestamps = { ...v.timestamps };
                if (newStatus === VehicleStatus.CALLED_IN) newTimestamps.calledIn = Date.now();
                if (newStatus === VehicleStatus.UNLOADING) newTimestamps.unloadingStart = Date.now();
                if (newStatus === VehicleStatus.COMPLETED) newTimestamps.unloadingEnd = Date.now();
                if (newStatus === VehicleStatus.DEPARTED) newTimestamps.departed = Date.now();
                return { ...v, status: newStatus, timestamps: newTimestamps, assignedDock: newStatus === VehicleStatus.COMPLETED ? v.assignedDock : undefined };
            }
            return v;
        }));
    };
    
    const handleAssignResources = (id: string, details: { driverName: string, assignedDock: string, loadmenCount: number, cleaningCrewAvailable: boolean }) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === id) {
                return {
                    ...v,
                    ...details,
                    status: VehicleStatus.UNLOADING,
                    timestamps: {
                        ...v.timestamps,
                        unloadingStart: Date.now(),
                    }
                }
            }
            return v;
        }));
    };

    const handleAddDelayRemark = (id: string, remarks: string) => {
         setVehicles(prev => prev.map(v => v.id === id ? { ...v, delayRemarks: remarks } : v));
    };
    
    const handleAssignVehicleToDock = (vehicleId: string, dockId: string) => {
        setVehicles(prev => prev.map(v => {
            if (v.id === vehicleId) {
                return { 
                    ...v, 
                    assignedDock: dockId,
                    status: VehicleStatus.CALLED_IN,
                    timestamps: {
                        ...v.timestamps,
                        calledIn: Date.now()
                    }
                };
            }
            return v;
        }))
    };
    

    const renderContent = () => {
        if (currentUserRole === 'Security') {
            return <SecurityDashboard 
                vehicles={vehicles}
                suppliers={suppliers}
                supplierMap={supplierMap}
                statusTexts={statusTexts}
                maintenanceDocks={maintenanceDocks}
                onAddVehicle={handleAddVehicle}
                onAssignVehicleToDock={handleAssignVehicleToDock}
            />;
        }
        if (currentUserRole === 'Operator') {
             return <OperatorDashboard 
                vehicles={vehicles}
                supplierMap={supplierMap}
                statusTexts={statusTexts}
                onUpdateStatus={handleUpdateStatus}
                onAssignResources={handleAssignResources}
                onAddDelayRemark={handleAddDelayRemark}
            />
        }

        switch(currentPage) {
            case 'Dashboard':
                return <Dashboard 
                    vehicles={vehicles} 
                    suppliers={suppliers}
                    supplierMap={supplierMap}
                    statusTexts={statusTexts}
                    currentUserRole={currentUserRole}
                    onAddVehicle={handleAddVehicle}
                    onDeleteVehicle={handleDeleteVehicle}
                    onUpdateStatus={handleUpdateStatus}
                    onAssignResources={handleAssignResources}
                    onAddDelayRemark={handleAddDelayRemark}
                />;
            case 'Reporting':
                return <Reporting vehicles={vehicles} supplierMap={supplierMap} statusTexts={statusTexts} />;
            case 'Admin':
                return <Admin 
                    suppliers={suppliers}
                    setSuppliers={setSuppliers}
                    shifts={shifts}
                    setShifts={setShifts}
                    statusTexts={statusTexts}
                    setStatusTexts={setStatusTexts}
                    maintenanceDocks={maintenanceDocks}
                    setMaintenanceDocks={setMaintenanceDocks}
                />;
            default:
                return <div>Page not found</div>;
        }
    };

    return (
        <div className="bg-gray-100 dark:bg-gray-900 min-h-screen font-sans">
            <Header 
                currentPage={currentPage} 
                setCurrentPage={setCurrentPage} 
                currentUserRole={currentUserRole}
                setCurrentUserRole={setCurrentUserRole}
            />
            <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                {renderContent()}
            </main>
        </div>
    );
}

export default App;
