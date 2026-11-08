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
  facilityType: 'SPORTS' | 'PARKING' | 'RENTAL';
  status: string;
  rating: number;
  reviewCount: number;
  photos: string[];
  features: string[];
  parkingAreas: ParkingArea[];
  resources: Resource[];
  // Rental specific settings
  upiVpa?: string;
  upiPayeeName?: string;
  acceptsDirectUpi?: boolean;
  acceptsCash?: boolean;
  offersDriver?: boolean;
  offersDelivery?: boolean;
  deliveryFeeFlat?: number;
  deliveryFeePerKm?: number;
  contactPhone?: string;
}

export interface Booking {
  bookingId: string;
  bookingNumber: string;
  facilityId: string;
  facilityName: string;
  facilityAddress: string;
  bookingType: 'SPORTS' | 'PARKING' | 'RENTAL';
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

// ---------- Vehicle Rentals Types ----------

export interface VehicleModel {
  vehicleModelId: number;
  category: 'SCOOTER' | 'BIKE' | 'HATCHBACK' | 'SEDAN' | 'SUV' | 'MUV';
  make: string;
  model: string;
  seats: number;
  fuelType: string;
  transmission: string;
  engineCc?: number;
}

export interface RentalPlan {
  rentalPlanId: string;
  facilityId: string;
  name: string;
  pricePerHour?: number;
  pricePerDay: number;
  pricePerWeek?: number;
  minHours: number;
  freeKmPerDay?: number;
  extraKmCharge: number;
  lateFeePerHour: number;
  graceMinutes: number;
  securityDepositAmount: number;
  helmetIncluded: boolean;
  fuelPolicy: string;
  isActive: boolean;
}

export interface Vehicle {
  vehicleId: string;
  facilityId: string;
  vehicleModelId: number;
  make: string;
  model: string;
  category: string;
  transmission: string;
  fuelType: string;
  seats: number;
  rentalPlanId: string;
  rentalPlanName: string;
  pricePerDay: number;
  pricePerHour?: number;
  securityDepositAmount: number;
  registrationNumber: string;
  color: string;
  year?: number;
  odometerKm: number;
  fuelLevelPercent: number;
  status: 'AVAILABLE' | 'ON_RENT' | 'MAINTENANCE' | 'INACTIVE';
  insuranceExpiry?: string;
  pollutionExpiry?: string;
  permitExpiry?: string;
  isListedOnline: boolean;
  photos: string[];
}

export interface Driver {
  driverId: string;
  facilityId: string;
  name: string;
  phone: string;
  licenceNumber: string;
  licenceExpiry?: string;
  languages: string;
  chargePerDay: number;
  nightAllowance: number;
  status: 'AVAILABLE' | 'ON_DUTY' | 'OFF';
  photoUrl: string;
  isActive: boolean;
}

export interface RenterLookup {
  renterProfileId?: string;
  phone: string;
  fullName: string;
  alternatePhone: string;
  email: string;
  nationality: string;
  homeAddress: string;
  localStayAddress: string;
  isBlacklisted: boolean;
  blacklistReason: string;
  totalPreviousRentals: number;
}

export interface RentalBoardItem {
  bookingId: string;
  rentalAgreementId: string;
  bookingNumber: string;
  vehicleId: string;
  vehicleName: string;
  registrationNumber: string;
  category: string;
  customerName: string;
  customerPhone: string;
  scheduledPickup: string;
  scheduledReturn: string;
  actualPickup?: string;
  actualReturn?: string;
  bookingStatus: string;
  paymentStatus: string;
  totalAmount: number;
  depositAmount: number;
  withDriver: boolean;
  driverName?: string;
  overdueMinutes?: number;
}

export interface TodayBoard {
  totalFleetCount: number;
  availableCount: number;
  onRentCount: number;
  maintenanceCount: number;
  pickupsDue: RentalBoardItem[];
  activeOnRent: RentalBoardItem[];
  returnsDue: RentalBoardItem[];
  overdue: RentalBoardItem[];
}

export interface ReturnEstimate {
  rentalAgreementId: string;
  startOdometer: number;
  endOdometer: number;
  totalKmDriven: number;
  freeKmAllowed?: number;
  extraKm: number;
  extraKmCharge: number;
  scheduledHours: number;
  actualHours: number;
  overtimeHours: number;
  lateFee: number;
  fuelPenaltyCharge: number;
  damageCharge: number;
  totalExtraCharges: number;
  depositHeld: number;
  netRefundOrDue: number;
  isRefundDue: boolean;
}

export interface DailyRentalReport {
  date: string;
  totalBookings: number;
  totalPickups: number;
  totalReturns: number;
  totalRentCollected: number;
  totalCashCollected: number;
  totalUpiCollected: number;
  totalDepositsHeld: number;
  totalDepositsRefunded: number;
}

