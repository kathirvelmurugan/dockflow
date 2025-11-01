
import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus } from '../types';
import { WrenchIcon } from './icons/WrenchIcon';
import { ClockIcon } from './icons/ClockIcon';


interface WarehouseLayoutProps {
  vehicles: Vehicle[];
  totalDocks: number;
  maintenanceDocks: string[];
}

const getDockStatus = (vehicle: Vehicle | undefined, isInMaintenance: boolean) => {
    if (isInMaintenance) {
        return { 
            status: 'Maintenance', 
            bgColor: 'bg-red-100 dark:bg-red-900', 
            borderColor: 'border-red-400 dark:border-red-600',
            textColor: 'text-red-800 dark:text-red-200' 
        };
    }
    if (!vehicle) {
        return { 
            status: 'Available', 
            bgColor: 'bg-green-100 dark:bg-green-900', 
            borderColor: 'border-green-400 dark:border-green-600',
            textColor: 'text-green-800 dark:text-green-200' 
        };
    }
    switch (vehicle.status) {
        case VehicleStatus.CALLED_IN:
            return { 
                status: 'Assigned', 
                bgColor: 'bg-yellow-100 dark:bg-yellow-900', 
                borderColor: 'border-yellow-400 dark:border-yellow-600',
                textColor: 'text-yellow-800 dark:text-yellow-200' 
            };
        case VehicleStatus.UNLOADING:
            return { 
                status: 'Unloading', 
                bgColor: 'bg-blue-100 dark:bg-blue-900',
                borderColor: 'border-blue-400 dark:border-blue-700',
                textColor: 'text-blue-800 dark:text-blue-200'
            };
        default:
             return { 
                status: 'Available', 
                bgColor: 'bg-green-100 dark:bg-green-900', 
                borderColor: 'border-green-400 dark:border-green-600',
                textColor: 'text-green-800 dark:text-green-200' 
            };
    }
}

const UnloadingTimer: React.FC<{startTime: number}> = ({ startTime }) => {
    const [duration, setDuration] = useState('');
    const [isOvertime, setIsOvertime] = useState(false);

    useEffect(() => {
        const calculateDuration = () => {
            const now = Date.now();
            const diff = now - startTime;
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            setDuration(`${hours}h ${minutes}m`);
            setIsOvertime(diff > 2 * 60 * 60 * 1000); // 2 hours
        };

        calculateDuration();
        const interval = setInterval(calculateDuration, 60000);
        return () => clearInterval(interval);
    }, [startTime]);

    return (
        <span className={`flex items-center justify-end ${isOvertime ? 'text-red-500 font-bold' : ''}`}>
             {isOvertime && <ClockIcon className="w-3 h-3 mr-1 animate-pulse"/>}
             {duration}
        </span>
    );
};


const WarehouseLayout: React.FC<WarehouseLayoutProps> = ({ vehicles, totalDocks, maintenanceDocks }) => {
  const docks = Array.from({ length: totalDocks }, (_, i) => String(i + 1));
  const vehicleMap = vehicles.reduce((acc, v) => {
      if (v.assignedDock && [VehicleStatus.CALLED_IN, VehicleStatus.UNLOADING].includes(v.status)) {
          acc[v.assignedDock] = v;
      }
      return acc;
  }, {} as Record<string, Vehicle>);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Warehouse Layout</h2>
        <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-md">
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {docks.map(dockNum => {
                    const vehicle = vehicleMap[dockNum];
                    const isInMaintenance = maintenanceDocks.includes(dockNum);
                    const dockInfo = getDockStatus(vehicle, isInMaintenance);
                    return (
                        <div key={dockNum} className={`border-2 ${dockInfo.borderColor} rounded-lg p-3 flex flex-col justify-between h-32 ${dockInfo.bgColor}`}>
                           <div>
                             <div className="flex justify-between items-center">
                                 <h4 className="font-bold text-gray-800 dark:text-white">Dock {dockNum}</h4>
                                 {isInMaintenance ? <WrenchIcon className="w-5 h-5 text-red-500" /> : (
                                     <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${dockInfo.textColor}`}>
                                         {dockInfo.status}
                                     </span>
                                 )}
                             </div>
                             {vehicle && !isInMaintenance && (
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mt-2 truncate">{vehicle.registrationNumber}</p>
                             )}
                              {isInMaintenance && (
                                <p className="text-sm font-semibold text-red-700 dark:text-red-300 mt-2">Maintenance</p>
                             )}
                           </div>
                           <div className="text-right text-xs text-gray-500 dark:text-gray-400">
                                {vehicle?.status === VehicleStatus.CALLED_IN && 'Awaiting Arrival'}
                                {vehicle?.status === VehicleStatus.UNLOADING && vehicle.timestamps.unloadingStart && <UnloadingTimer startTime={vehicle.timestamps.unloadingStart} />}
                           </div>
                        </div>
                    )
                })}
            </div>
        </div>
    </div>
  );
};

export default WarehouseLayout;
