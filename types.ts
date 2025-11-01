export enum VehicleStatus {
  STAGING = 'Staging',
  CALLED_IN = 'Called In',
  UNLOADING = 'Unloading',
  COMPLETED = 'Completed',
  DEPARTED = 'Departed',
}

export type UserRole = 'Admin' | 'Operator' | 'Security';

export interface Vehicle {
  id: string;
  registrationNumber: string;
  supplierId: string;
  asn?: string;
  status: VehicleStatus;
  timestamps: {
    arrival: number;
    calledIn?: number;
    unloadingStart?: number;
    unloadingEnd?: number;
    departed?: number;
  };
  assignedDock?: string;
  driverName?: string;
  loadmenCount?: number;
  cleaningCrewAvailable?: boolean;
  delayRemarks?: string;
}

export interface Supplier {
  id: string;
  name: string;
}

export interface Shift {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
}

export interface StatusTextConfig {
  [key: string]: string;
}
