
import React, { useState } from 'react';
import { Vehicle, Supplier } from '../types';

interface ArrivalFormProps {
  suppliers: Supplier[];
  onAddVehicle: (newVehicle: Omit<Vehicle, 'id' | 'status' | 'timestamps'>) => void;
}

const ArrivalForm: React.FC<ArrivalFormProps> = ({ suppliers, onAddVehicle }) => {
  const [registrationNumber, setRegistrationNumber] = useState('');
  const [supplierId, setSupplierId] = useState('');
  const [asn, setAsn] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!registrationNumber || !supplierId) {
      alert('Please fill in Vehicle Registration and Supplier ID.');
      return;
    }
    onAddVehicle({
      registrationNumber,
      supplierId,
      asn,
    });
    // Reset form
    setRegistrationNumber('');
    setSupplierId('');
    setAsn('');
  };

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-700">Vehicle Arrival Registration</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="registrationNumber" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Vehicle Registration No.
          </label>
          <input
            type="text"
            id="registrationNumber"
            value={registrationNumber}
            onChange={(e) => setRegistrationNumber(e.target.value.toUpperCase())}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., AB-123-CD"
            required
          />
        </div>
        <div>
          <label htmlFor="supplierId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            Supplier ID
          </label>
          <select
            id="supplierId"
            value={supplierId}
            onChange={(e) => setSupplierId(e.target.value)}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 rounded-md"
            required
          >
            <option value="" disabled>Select a supplier</option>
            {suppliers.map(s => (
              <option key={s.id} value={s.id}>{s.id} - {s.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="asn" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            ASN Barcode (Optional)
          </label>
          <input
            type="text"
            id="asn"
            value={asn}
            onChange={(e) => setAsn(e.target.value)}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="Scan or enter ASN"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
        >
          Register Arrival
        </button>
      </form>
    </div>
  );
};

export default ArrivalForm;
