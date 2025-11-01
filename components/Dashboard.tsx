import React from 'react';
import { Vehicle, Supplier, VehicleStatus, StatusTextConfig, UserRole } from '../types';
import ArrivalForm from './ArrivalForm';
import VehicleList from './VehicleList';
import DockStatus from './DockStatus';
import { ClockIcon } from './icons/ClockIcon';

interface DashboardProps {
  vehicles: Vehicle[];
  suppliers: Supplier[];
  supplierMap: Record<string, string>;
  statusTexts: StatusTextConfig;
  currentUserRole: UserRole;
  onAddVehicle: (newVehicle: Omit<Vehicle, 'id' | 'status' | 'timestamps'>) => void;
  onDeleteVehicle: (id: string) => void;
  onUpdateStatus: (id: string, newStatus: VehicleStatus) => void;
  onAssignResources: (id: string, details: { driverName: string, assignedDock: string, loadmenCount: number, cleaningCrewAvailable: boolean }) => void;
  onAddDelayRemark: (id: string, remarks: string) => void;
}

const Dashboard: React.FC<DashboardProps> = (props) => {
  const stagingVehicles = props.vehicles.filter(v => v.status === VehicleStatus.STAGING);
  const processingVehicles = props.vehicles.filter(v => [VehicleStatus.CALLED_IN, VehicleStatus.UNLOADING].includes(v.status));
  const completedVehicles = props.vehicles.filter(v => v.status === VehicleStatus.COMPLETED);

  const avgWaitTime = () => {
      const completedWithWait = props.vehicles.filter(v => v.timestamps.arrival && v.timestamps.unloadingStart);
      if (completedWithWait.length === 0) return 'N/A';
      const totalWait = completedWithWait.reduce((acc, v) => acc + (v.timestamps.unloadingStart! - v.timestamps.arrival), 0);
      const avgMs = totalWait / completedWithWait.length;
      return `${Math.round(avgMs / 60000)} min`;
  };

  const avgUnloadingTime = () => {
      const completedWithUnload = props.vehicles.filter(v => v.timestamps.unloadingStart && v.timestamps.unloadingEnd);
      if (completedWithUnload.length === 0) return 'N/A';
      const totalUnload = completedWithUnload.reduce((acc, v) => acc + (v.timestamps.unloadingEnd! - v.timestamps.unloadingStart!), 0);
      const avgMs = totalUnload / completedWithUnload.length;
      return `${Math.round(avgMs / 60000)} min`;
  };

  const kpiData = [
      { label: 'Vehicles in Staging', value: stagingVehicles.length, icon: <ClockIcon className="w-6 h-6 text-yellow-500" /> },
      { label: 'Vehicles Processing', value: processingVehicles.length, icon: <ClockIcon className="w-6 h-6 text-blue-500" /> },
      { label: 'Vehicles Completed Today', value: completedVehicles.length, icon: <ClockIcon className="w-6 h-6 text-green-500" /> },
      { label: 'Avg. Wait Time', value: avgWaitTime(), icon: <ClockIcon className="w-6 h-6 text-red-500" /> },
      { label: 'Avg. Unloading Time', value: avgUnloadingTime(), icon: <ClockIcon className="w-6 h-6 text-purple-500" /> },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {kpiData.map(kpi => (
              <div key={kpi.label} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow flex items-center">
                  <div className="p-3 rounded-full bg-gray-200 dark:bg-gray-700 mr-4">
                      {kpi.icon}
                  </div>
                  <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{kpi.label}</p>
                      <p className="text-2xl font-bold text-gray-800 dark:text-white">{kpi.value}</p>
                  </div>
              </div>
          ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <ArrivalForm suppliers={props.suppliers} onAddVehicle={props.onAddVehicle} />
          <DockStatus vehicles={props.vehicles} />
        </div>
        <div className="lg:col-span-2 space-y-8">
          <VehicleList
            title="Staging Area"
            vehicles={stagingVehicles}
            {...props}
          />
          <VehicleList
            title="Processing & Unloading"
            vehicles={processingVehicles}
            {...props}
          />
          <VehicleList
            title="Completed"
            vehicles={completedVehicles}
            {...props}
          />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;