
import React from 'react';
import { Vehicle, Supplier, VehicleStatus, StatusTextConfig } from '../types';
import ArrivalForm from './ArrivalForm';
import WarehouseLayout from './WarehouseLayout';
import VehicleCard from './VehicleCard';

interface SecurityDashboardProps {
  vehicles: Vehicle[];
  suppliers: Supplier[];
  supplierMap: Record<string, string>;
  statusTexts: StatusTextConfig;
  maintenanceDocks: string[];
  onAddVehicle: (newVehicle: Omit<Vehicle, 'id' | 'status' | 'timestamps'>) => void;
  onAssignVehicleToDock: (vehicleId: string, dockId: string) => void;
}

const TOTAL_DOCKS = 10;

const SecurityDashboard: React.FC<SecurityDashboardProps> = (props) => {
    const stagingVehicles = props.vehicles.filter(v => v.status === VehicleStatus.STAGING);

    const occupiedDocks = props.vehicles
        .filter(v => v.assignedDock)
        .map(v => v.assignedDock!);
    
    const availableDocks = Array.from({ length: TOTAL_DOCKS }, (_, i) => String(i + 1))
        .filter(d => !occupiedDocks.includes(d) && !props.maintenanceDocks.includes(d));

    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
                <WarehouseLayout 
                    vehicles={props.vehicles} 
                    totalDocks={TOTAL_DOCKS} 
                    maintenanceDocks={props.maintenanceDocks}
                />
            </div>
            <div className="lg:col-span-1 space-y-8">
                <ArrivalForm suppliers={props.suppliers} onAddVehicle={props.onAddVehicle} />
                <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                    <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Staging Area ({stagingVehicles.length})</h3>
                    <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {stagingVehicles.length > 0 ? (
                            stagingVehicles.map(vehicle => (
                                <VehicleCard 
                                    key={vehicle.id} 
                                    vehicle={vehicle}
                                    supplierMap={props.supplierMap}
                                    statusTexts={props.statusTexts}
                                    currentUserRole='Security'
                                    onUpdateStatus={() => {}} // Not used by security
                                    onAssignResources={() => {}} // Not used by security
                                    onAddDelayRemark={() => {}} // Not used by security
                                    onAssignVehicleToDock={props.onAssignVehicleToDock}
                                    availableDocks={availableDocks}
                                />
                            ))
                        ) : (
                            <p className="text-gray-500 dark:text-gray-400 text-center py-4">No vehicles in staging.</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SecurityDashboard;
