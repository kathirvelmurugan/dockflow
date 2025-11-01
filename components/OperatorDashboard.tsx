
import React, { useState, useMemo } from 'react';
import { Vehicle, VehicleStatus, StatusTextConfig } from '../types';
import VehicleCard from './VehicleCard';

interface OperatorDashboardProps {
  vehicles: Vehicle[];
  supplierMap: Record<string, string>;
  statusTexts: StatusTextConfig;
  onUpdateStatus: (id: string, newStatus: VehicleStatus) => void;
  onAssignResources: (id: string, details: { driverName: string, assignedDock: string, loadmenCount: number, cleaningCrewAvailable: boolean }) => void;
  onAddDelayRemark: (id: string, remarks: string) => void;
}

const TOTAL_DOCKS = 10;

const OperatorDashboard: React.FC<OperatorDashboardProps> = (props) => {
  const [selectedDock, setSelectedDock] = useState<string>('1');
  const docks = Array.from({ length: TOTAL_DOCKS }, (_, i) => String(i + 1));

  const vehiclesForDock = useMemo(() => {
    return props.vehicles.filter(v => v.assignedDock === selectedDock && (v.status === VehicleStatus.CALLED_IN || v.status === VehicleStatus.UNLOADING));
  }, [props.vehicles, selectedDock]);

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg flex items-center space-x-4">
        <label htmlFor="dock-selector" className="text-lg font-bold text-gray-800 dark:text-white">
          Managing Dock:
        </label>
        <select
          id="dock-selector"
          value={selectedDock}
          onChange={(e) => setSelectedDock(e.target.value)}
          className="pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
        >
          {docks.map(dock => (
            <option key={dock} value={dock}>Dock {dock}</option>
          ))}
        </select>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Vehicles for Dock {selectedDock} ({vehiclesForDock.length})</h3>
        <div className="space-y-4">
            {vehiclesForDock.length > 0 ? (
                vehiclesForDock.map(vehicle => (
                    <VehicleCard
                        key={vehicle.id}
                        vehicle={vehicle}
                        supplierMap={props.supplierMap}
                        statusTexts={props.statusTexts}
                        currentUserRole='Operator'
                        onUpdateStatus={props.onUpdateStatus}
                        onAssignResources={props.onAssignResources}
                        onAddDelayRemark={props.onAddDelayRemark}
                    />
                ))
            ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center py-8">No vehicles assigned to this dock.</p>
            )}
        </div>
      </div>
    </div>
  );
};

export default OperatorDashboard;
