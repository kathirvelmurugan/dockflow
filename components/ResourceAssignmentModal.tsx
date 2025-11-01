
import React, { useState, useEffect } from 'react';
import { Vehicle } from '../types';
import Modal from './Modal';

interface ResourceAssignmentModalProps {
  vehicle: Vehicle;
  onClose: () => void;
  onAssign: (id: string, details: { driverName: string, assignedDock: string, loadmenCount: number, cleaningCrewAvailable: boolean }) => void;
}

const ResourceAssignmentModal: React.FC<ResourceAssignmentModalProps> = ({ vehicle, onClose, onAssign }) => {
  const [driverName, setDriverName] = useState('');
  const [assignedDock, setAssignedDock] = useState(vehicle.assignedDock || '');
  const [loadmenCount, setLoadmenCount] = useState(1);
  const [cleaningCrewAvailable, setCleaningCrewAvailable] = useState(false);
  
  useEffect(() => {
    // Ensure dock number is always synced if the prop changes
    setAssignedDock(vehicle.assignedDock || '');
  }, [vehicle.assignedDock]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!driverName || !assignedDock) {
        alert('Please fill all required fields');
        return;
    }
    onAssign(vehicle.id, {
        driverName,
        assignedDock,
        loadmenCount,
        cleaningCrewAvailable,
    });
    onClose();
  };

  return (
    <Modal isOpen={true} onClose={onClose} title={`Assign Resources for ${vehicle.registrationNumber}`}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="assignedDock" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Dock Number
          </label>
          <input
            type="text"
            id="assignedDock"
            value={assignedDock}
            readOnly
            className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md shadow-sm"
          />
        </div>
        <div>
          <label htmlFor="driverName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Driver Name
          </label>
          <input
            type="text"
            id="driverName"
            value={driverName}
            onChange={(e) => setDriverName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            required
          />
        </div>
        
        <div>
          <label htmlFor="loadmenCount" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Number of Resource Personnel
          </label>
          <input
            type="number"
            id="loadmenCount"
            value={loadmenCount}
            onChange={(e) => setLoadmenCount(parseInt(e.target.value, 10))}
            min="1"
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            id="cleaningCrewAvailable"
            type="checkbox"
            checked={cleaningCrewAvailable}
            onChange={(e) => setCleaningCrewAvailable(e.target.checked)}
            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
          />
          <label htmlFor="cleaningCrewAvailable" className="ml-2 block text-sm text-gray-900 dark:text-gray-300">
            Cleaning Crew Available
          </label>
        </div>
        <div className="pt-4 flex justify-end space-x-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-600 border border-gray-300 dark:border-gray-500 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700">
                Cancel
            </button>
            <button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-md shadow-sm">
                Assign and Start Unloading
            </button>
        </div>
      </form>
    </Modal>
  );
};

export default ResourceAssignmentModal;
