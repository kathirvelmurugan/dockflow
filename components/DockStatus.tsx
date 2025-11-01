import React from 'react';
import { Vehicle, VehicleStatus } from '../types';

interface DockStatusProps {
  vehicles: Vehicle[];
}

const TOTAL_DOCKS = 10;

const DockStatus: React.FC<DockStatusProps> = ({ vehicles }) => {
  const occupiedDocks = vehicles
    .filter(v => v.status === VehicleStatus.UNLOADING && v.assignedDock)
    .reduce((acc, v) => {
      acc[v.assignedDock!] = v.registrationNumber;
      return acc;
    }, {} as Record<string, string>);
  
  const docks = Array.from({ length: TOTAL_DOCKS }, (_, i) => i + 1);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Dock Status</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {docks.map(dockNumber => {
          const dockStr = String(dockNumber);
          const isOccupied = occupiedDocks.hasOwnProperty(dockStr);
          const vehicleReg = occupiedDocks[dockStr];

          return (
            <div 
              key={dockNumber} 
              className={`p-3 rounded-md text-center transition-colors ${
                isOccupied 
                  ? 'bg-blue-200 dark:bg-blue-900 border border-blue-400 dark:border-blue-700' 
                  : 'bg-green-200 dark:bg-green-900 border border-green-400 dark:border-green-700'
              }`}
            >
              <div className="font-bold text-lg text-gray-800 dark:text-white">
                Dock {dockNumber}
              </div>
              <div className="text-xs font-semibold truncate text-gray-600 dark:text-gray-300">
                {isOccupied ? vehicleReg : 'Available'}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default DockStatus;