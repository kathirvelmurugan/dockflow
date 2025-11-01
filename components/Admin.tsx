
import React, { useState } from 'react';
import { Supplier, Shift, StatusTextConfig } from '../types';
import { PlusIcon } from './icons/PlusIcon';
import { TrashIcon } from './icons/TrashIcon';
import { WrenchIcon } from './icons/WrenchIcon';

interface AdminProps {
  suppliers: Supplier[];
  setSuppliers: React.Dispatch<React.SetStateAction<Supplier[]>>;
  shifts: Shift[];
  setShifts: React.Dispatch<React.SetStateAction<Shift[]>>;
  statusTexts: StatusTextConfig;
  setStatusTexts: React.Dispatch<React.SetStateAction<StatusTextConfig>>;
  maintenanceDocks: string[];
  setMaintenanceDocks: React.Dispatch<React.SetStateAction<string[]>>;
}

const TOTAL_DOCKS = 10;

const Admin: React.FC<AdminProps> = ({ suppliers, setSuppliers, shifts, setShifts, statusTexts, setStatusTexts, maintenanceDocks, setMaintenanceDocks }) => {
    const [newSupplierName, setNewSupplierName] = useState('');
    const docks = Array.from({ length: TOTAL_DOCKS }, (_, i) => String(i + 1));
    
    const handleAddSupplier = () => {
        if (newSupplierName.trim() === '') return;
        const newSupplier = {
            id: `S${String(suppliers.length + 1).padStart(2, '0')}`,
            name: newSupplierName,
        };
        setSuppliers([...suppliers, newSupplier]);
        setNewSupplierName('');
    };
    
    const handleDeleteSupplier = (id: string) => {
        setSuppliers(suppliers.filter(s => s.id !== id));
    };

    const handleStatusTextChange = (key: string, value: string) => {
        setStatusTexts(prev => ({ ...prev, [key]: value }));
    };
    
    const handleMaintenanceToggle = (dockId: string) => {
        setMaintenanceDocks(prev => 
            prev.includes(dockId) 
            ? prev.filter(d => d !== dockId)
            : [...prev, dockId]
        );
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Supplier Management */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Supplier Management</h3>
                <div className="space-y-2 mb-4 max-h-60 overflow-y-auto">
                    {suppliers.map(supplier => (
                        <div key={supplier.id} className="flex justify-between items-center p-2 bg-gray-100 dark:bg-gray-700 rounded">
                            <span>{supplier.id} - {supplier.name}</span>
                            <button onClick={() => handleDeleteSupplier(supplier.id)} className="text-gray-500 hover:text-red-500">
                                <TrashIcon className="w-5 h-5"/>
                            </button>
                        </div>
                    ))}
                </div>
                <div className="flex space-x-2">
                    <input 
                        type="text" 
                        value={newSupplierName}
                        onChange={e => setNewSupplierName(e.target.value)}
                        placeholder="New Supplier Name"
                        className="flex-grow px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                    />
                    <button onClick={handleAddSupplier} className="p-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
                        <PlusIcon className="w-5 h-5"/>
                    </button>
                </div>
            </div>

            {/* Dock Maintenance */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Dock Maintenance</h3>
                <div className="grid grid-cols-2 gap-3">
                    {docks.map(dockId => {
                        const isInMaintenance = maintenanceDocks.includes(dockId);
                        return (
                             <label key={dockId} className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                                <input 
                                    type="checkbox"
                                    checked={isInMaintenance}
                                    onChange={() => handleMaintenanceToggle(dockId)}
                                    className="h-5 w-5 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                />
                                <WrenchIcon className={`w-5 h-5 ${isInMaintenance ? 'text-red-500' : 'text-gray-400'}`} />
                                <span className={`font-medium ${isInMaintenance ? 'text-red-600 dark:text-red-400' : 'text-gray-700 dark:text-gray-300'}`}>
                                    Dock {dockId}
                                </span>
                            </label>
                        )
                    })}
                </div>
            </div>

            {/* Status Text Customization */}
            <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold mb-4">Status Text Customization</h3>
                <div className="space-y-4">
                    {Object.keys(statusTexts).map(key => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">{key}</label>
                            <input
                                type="text"
                                value={statusTexts[key]}
                                onChange={(e) => handleStatusTextChange(key, e.target.value)}
                                className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md"
                            />
                        </div>
                    ))}
                </div>
            </div>

             {/* Shift Management */}
             <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg md:col-span-2 lg:col-span-1">
                <h3 className="text-xl font-bold mb-4">Shift Management</h3>
                 <div className="space-y-2">
                    {shifts.map(shift => (
                        <div key={shift.id} className="p-2 bg-gray-100 dark:bg-gray-700 rounded">
                            <p className="font-semibold">{shift.name}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{shift.startTime} - {shift.endTime}</p>
                        </div>
                    ))}
                 </div>
            </div>

        </div>
    );
};

export default Admin;
