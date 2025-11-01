
import React from 'react';
import { Vehicle, StatusTextConfig } from '../types';
import { DownloadIcon } from './icons/DownloadIcon';

interface ReportingProps {
  vehicles: Vehicle[];
  supplierMap: Record<string, string>;
  statusTexts: StatusTextConfig;
}

const Reporting: React.FC<ReportingProps> = ({ vehicles, supplierMap, statusTexts }) => {
  const formatTimestamp = (ts?: number) => ts ? new Date(ts).toLocaleString() : 'N/A';
  
  const calculateDuration = (start?: number, end?: number) => {
      if (!start || !end) return 'N/A';
      const diff = end - start;
      const minutes = Math.floor(diff / 60000);
      return `${minutes} min`;
  };

  const handleExport = () => {
    const headers = [
      'VehicleReg', 'Supplier', 'Status', 'Arrival', 'CalledIn', 'UnloadStart', 'UnloadEnd', 'Departed', 'WaitTime(min)', 'UnloadDuration(min)', 'Dock', 'Driver', 'ASN'
    ];
    
    const rows = vehicles.map(v => {
      const waitTime = v.timestamps.arrival && v.timestamps.unloadingStart 
        ? Math.floor((v.timestamps.unloadingStart - v.timestamps.arrival) / 60000)
        : 'N/A';
      
      const unloadDuration = v.timestamps.unloadingStart && v.timestamps.unloadingEnd
        ? Math.floor((v.timestamps.unloadingEnd - v.timestamps.unloadingStart) / 60000)
        : 'N/A';

      // Function to safely format values for CSV, handling commas
      const escapeCsv = (val: string | number | undefined | null) => {
        if (val === undefined || val === null) return '';
        const str = String(val);
        if (str.includes(',') || str.includes('"') || str.includes('\n')) {
          return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
      }
      
      return [
        escapeCsv(v.registrationNumber),
        escapeCsv(supplierMap[v.supplierId]),
        escapeCsv(statusTexts[v.status]),
        escapeCsv(formatTimestamp(v.timestamps.arrival)),
        escapeCsv(formatTimestamp(v.timestamps.calledIn)),
        escapeCsv(formatTimestamp(v.timestamps.unloadingStart)),
        escapeCsv(formatTimestamp(v.timestamps.unloadingEnd)),
        escapeCsv(formatTimestamp(v.timestamps.departed)),
        escapeCsv(waitTime),
        escapeCsv(unloadDuration),
        escapeCsv(v.assignedDock),
        escapeCsv(v.driverName),
        escapeCsv(v.asn)
      ].join(',');
    });

    const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `dockflow_report_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
       <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Historical Vehicle Log</h2>
        <button 
          onClick={handleExport}
          className="flex items-center space-x-2 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          <DownloadIcon className="w-5 h-5" />
          <span>Export CSV</span>
        </button>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Vehicle Reg.</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Supplier</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Arrival</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unload Start</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unload End</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Wait Time</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Unload Duration</th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Dock</th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{v.registrationNumber}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{supplierMap[v.supplierId]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{statusTexts[v.status]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatTimestamp(v.timestamps.arrival)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatTimestamp(v.timestamps.unloadingStart)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{formatTimestamp(v.timestamps.unloadingEnd)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{calculateDuration(v.timestamps.arrival, v.timestamps.unloadingStart)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{calculateDuration(v.timestamps.unloadingStart, v.timestamps.unloadingEnd)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{v.assignedDock || 'N/A'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Reporting;
