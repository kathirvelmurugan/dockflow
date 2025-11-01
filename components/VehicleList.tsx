import React from 'react';
import { Vehicle, VehicleStatus, StatusTextConfig, UserRole } from '../types';
import VehicleCard from './VehicleCard';

interface VehicleListProps {
  title: string;
  vehicles: Vehicle[];
  supplierMap: Record<string, string>;
  statusTexts: StatusTextConfig;
  currentUserRole: UserRole;
  onDeleteVehicle: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: VehicleStatus) => void;
  onAssignResources: (id: string, details: { driverName: string, assignedDock: string, loadmenCount: number, cleaningCrewAvailable: boolean }) => void;
  onAddDelayRemark: (id: string, remarks: string) => void;
}

const VehicleList: React.FC<VehicleListProps> = (props) => {
  const { title, vehicles } = props;
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">{title} ({vehicles.length})</h3>
      <div className="space-y-4">
        {vehicles.length > 0 ? (
          vehicles.map(vehicle => (
            <VehicleCard 
              key={vehicle.id} 
              vehicle={vehicle} 
              {...props} 
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center py-4">No vehicles in this section.</p>
        )}
      </div>
    </div>
  );
};

export default VehicleList;