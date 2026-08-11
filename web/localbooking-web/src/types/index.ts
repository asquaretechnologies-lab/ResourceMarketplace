export interface User {
  userId: string;
  name: string;
  email: string;
  mobile: string;
  userType: 'CUSTOMER' | 'OWNER' | 'ADMIN' | 'STAFF';
  status: string;
}

export interface ParkingArea {
  parkingAreaId: string;
  vehicleTypeId: number;
  vehicleTypeCode: string;
  vehicleTypeName: string;
  totalCapacity: number;
  availableCapacity: number;
  pricePerHour: number;
  pricePerDay: number;
  pricePerOvernight: number;
  pricePerMonth: number;
}

export interface Resource {
  resourceId: string;
  name: string;
  description: string;
  sportsTypeId?: number;
  sportsTypeName?: string;
  capacity: number;
  slotDurationMinutes: number;
  pricePerHour: number;
  isAvailable: boolean;
}

export interface Facility {
  facilityId: string;
  name: string;
  description: string;
  address: string;
  district: string;
  state: string;
  postalCode: string;
  latitude: number;
  longitude: number;
  landmark: string;
  distanceKm: number;
  is24Hours: boolean;
  openingTime: string;
  closingTime: string;
  facilityType: 'SPORTS' | 'PARKING';
  status: string;
  rating: number;
  reviewCount: number;
  photos: string[];
  features: string[];
  parkingAreas: ParkingArea[];
  resources: Resource[];
}

export interface Booking {
  bookingId: string;
  bookingNumber: string;
  facilityId: string;
  facilityName: string;
  facilityAddress: string;
  bookingType: 'SPORTS' | 'PARKING';
  startDateTime: string;
  endDateTime: string;
  bookingStatus: string;
  paymentStatus: string;
  baseAmount: number;
  taxAmount: number;
  platformFee: number;
  discountAmount: number;
  totalAmount: number;
  qrCodeToken: string;
  vehicleNumber: string;
  resourceName: string;
  createdDate: string;
}

export interface CheckInResult {
  success: boolean;
  message: string;
  action: 'CHECKED_IN' | 'CHECKED_OUT' | 'INVALID' | 'ALREADY_COMPLETED';
  booking?: Booking;
}
