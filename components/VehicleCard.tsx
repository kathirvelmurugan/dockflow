
import React, { useState, useEffect } from 'react';
import { Vehicle, VehicleStatus, StatusTextConfig, UserRole } from '../types';
import { TrashIcon } from './icons/TrashIcon';
import { ClockIcon } from './icons/ClockIcon';
import ResourceAssignmentModal from './ResourceAssignmentModal';

interface VehicleCardProps {
  vehicle: Vehicle;
  supplierMap: Record<string, string>;
  statusTexts: StatusTextConfig;
  currentUserRole: UserRole;
  onDeleteVehicle?: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: VehicleStatus) => void;
  onAssignResources: (id: string, details: { driverName: string, assignedDock: string, loadmenCount: number, cleaningCrewAvailable: boolean }) => void;
  onAddDelayRemark: (id:string, remarks: string) => void;
  onAssignVehicleToDock?: (vehicleId: string, dockId: string) => void;
  availableDocks?: string[];
}

const getStatusStyles = (status: VehicleStatus) => {
  switch (status) {
    case VehicleStatus.STAGING:
      return { bg: 'bg-yellow-100 dark:bg-yellow-900', text: 'text-yellow-800 dark:text-yellow-200', dot: 'bg-yellow-500' };
    case VehicleStatus.CALLED_IN:
      return { bg: 'bg-green-100 dark:bg-green-900', text: 'text-green-800 dark:text-green-200', dot: 'bg-green-500 animate-ping' };
    case VehicleStatus.UNLOADING:
      return { bg: 'bg-blue-100 dark:bg-blue-900', text: 'text-blue-800 dark:text-blue-200', dot: 'bg-blue-500' };
    case VehicleStatus.COMPLETED:
      return { bg: 'bg-purple-100 dark:bg-purple-900', text: 'text-purple-800 dark:text-purple-200', dot: 'bg-purple-500' };
    default:
      return { bg: 'bg-gray-100 dark:bg-gray-700', text: 'text-gray-800 dark:text-gray-200', dot: 'bg-gray-500' };
  }
};

const VehicleCard: React.FC<VehicleCardProps> = ({ 
    vehicle, supplierMap, statusTexts, currentUserRole, onDeleteVehicle, onUpdateStatus, 
    onAssignResources, onAddDelayRemark, onAssignVehicleToDock, availableDocks
}) => {
    const [elapsedTime, setElapsedTime] = useState('');
    const [isResourceModalOpen, setResourceModalOpen] = useState(false);
    const [selectedDock, setSelectedDock] = useState<string>('');
    const [waitHours, setWaitHours] = useState(0);
    
    useEffect(() => {
        const calculateTime = () => {
            let startTime = vehicle.timestamps.arrival;
            if (vehicle.status === VehicleStatus.UNLOADING && vehicle.timestamps.unloadingStart) {
                startTime = vehicle.timestamps.unloadingStart;
            } else if (vehicle.status === VehicleStatus.COMPLETED && vehicle.timestamps.unloadingStart && vehicle.timestamps.unloadingEnd) {
                const duration = vehicle.timestamps.unloadingEnd - vehicle.timestamps.unloadingStart;
                const hours = Math.floor(duration / 3600000);
                const minutes = Math.floor((duration % 3600000) / 60000);
                return `Unloaded in ${hours}h ${minutes}m`;
            }

            if(!startTime) return '';
            
            const now = Date.now();
            const diff = now - startTime;
            const hours = Math.floor(diff / 3600000);
            const minutes = Math.floor((diff % 3600000) / 60000);
            
            if (vehicle.status === VehicleStatus.STAGING) {
                setWaitHours(hours);
            }

            return `${hours}h ${minutes}m ago`;
        };

        setElapsedTime(calculateTime());
        const interval = setInterval(() => setElapsedTime(calculateTime()), 60000); // update every minute
        return () => clearInterval(interval);
    }, [vehicle]);

  const statusStyle = getStatusStyles(vehicle.status);

  const getBorderColor = () => {
    if (vehicle.status !== VehicleStatus.STAGING) return 'border-gray-200 dark:border-gray-700';
    if (waitHours >= 4) return 'border-red-500 dark:border-red-400';
    if (waitHours >= 2) return 'border-yellow-500 dark:border-yellow-400';
    return 'border-gray-200 dark:border-gray-700';
  }

  const handleStatusClick = () => {
    if (vehicle.status === VehicleStatus.CALLED_IN) {
        setResourceModalOpen(true);
    } else if (vehicle.status === VehicleStatus.UNLOADING) {
        onUpdateStatus(vehicle.id, VehicleStatus.COMPLETED);
    }
  };

  const handleAssignDock = () => {
    if (onAssignVehicleToDock && selectedDock) {
      onAssignVehicleToDock(vehicle.id, selectedDock);
    }
  };

  return (
    <>
    <div className={`border-2 ${getBorderColor()} rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow bg-gray-50 dark:bg-gray-800/50`}>
      <div className="flex justify-between items-start">
        <div>
          <p className="font-bold text-lg text-gray-800 dark:text-white">{vehicle.registrationNumber}</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{supplierMap[vehicle.supplierId] || 'Unknown Supplier'}</p>
        </div>
        <div className="flex items-center space-x-3">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.bg} ${statusStyle.text}`}>
                <span className={`relative flex h-3 w-3 mr-2`}>
                    <span className={`absolute inline-flex h-full w-full rounded-full ${statusStyle.dot.replace(' animate-ping', '')}`}></span>
                    {vehicle.status === VehicleStatus.CALLED_IN && <span className={`relative inline-flex rounded-full h-3 w-3 ${statusStyle.dot}`}></span>}
                </span>
                {statusTexts[vehicle.status] || vehicle.status}
            </span>
            {currentUserRole === 'Admin' && onDeleteVehicle && (
              <button onClick={() => onDeleteVehicle(vehicle.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                  <TrashIcon className="w-5 h-5" />
              </button>
            )}
        </div>
      </div>

      <div className="mt-4 text-sm text-gray-700 dark:text-gray-400 space-y-2">
        <div className="flex items-center">
            <ClockIcon className="w-4 h-4 mr-2 text-gray-500"/>
            <span>Arrived: {new Date(vehicle.timestamps.arrival).toLocaleTimeString()} ({elapsedTime})</span>
        </div>
        {vehicle.assignedDock && <div><strong>Dock:</strong> {vehicle.assignedDock}</div>}
        {vehicle.driverName && <div><strong>Driver:</strong> {vehicle.driverName}</div>}
        {vehicle.delayRemarks && <div className="p-2 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded"><strong>Remarks:</strong> {vehicle.delayRemarks}</div>}

      </div>
      
      <div className="mt-4 pt-3 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end space-x-2">
        {currentUserRole === 'Admin' && vehicle.status === VehicleStatus.STAGING && (
             <button onClick={() => onUpdateStatus(vehicle.id, VehicleStatus.CALLED_IN)} className="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition-colors">
                Call In
             </button>
        )}
        {currentUserRole === 'Security' && vehicle.status === VehicleStatus.STAGING && availableDocks && onAssignVehicleToDock && (
          <div className="flex items-center space-x-2">
            <select
              value={selectedDock}
              onChange={(e) => setSelectedDock(e.target.value)}
              className="pl-3 pr-8 py-1 text-sm bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            >
              <option value="" disabled>Select Dock</option>
              {availableDocks.map(d => <option key={d} value={d}>Dock {d}</option>)}
            </select>
            <button onClick={handleAssignDock} disabled={!selectedDock} className="px-3 py-1 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-md shadow-sm transition-colors disabled:bg-gray-400">
                Assign
            </button>
          </div>
        )}
        {(vehicle.status === VehicleStatus.CALLED_IN || vehicle.status === VehicleStatus.UNLOADING) && (
            <button onClick={handleStatusClick} className="px-3 py-1 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow-sm transition-colors">
                {vehicle.status === VehicleStatus.CALLED_IN ? 'Assign Resources' : 'Complete Unloading'}
            </button>
        )}
      </div>
    </div>
    {isResourceModalOpen && (
        <ResourceAssignmentModal
            vehicle={vehicle}
            onClose={() => setResourceModalOpen(false)}
            onAssign={onAssignResources}
        />
    )}
    </>
  );
};

export default VehicleCard;
