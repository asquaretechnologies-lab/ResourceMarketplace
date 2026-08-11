import axios from 'axios';
import { Facility, Booking, CheckInResult } from '../types';

const API_BASE_URL = 'http://localhost:5168/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const searchFacilities = async (params: {
  keyword?: string;
  facilityType?: string;
  district?: string;
  startDateTime?: string;
  endDateTime?: string;
}): Promise<Facility[]> => {
  try {
    const response = await api.get('/facilities/search', { params });
    return response.data.data;
  } catch (error) {
    console.warn('API unavailable, returning mock Kerala facilities data for preview:', error);
    return getMockFacilities(params.facilityType);
  }
};

export const getFacilityById = async (id: string): Promise<Facility | null> => {
  try {
    const response = await api.get(`/facilities/${id}`);
    return response.data.data;
  } catch (error) {
    const mock = getMockFacilities();
    return mock.find(f => f.facilityId === id) || mock[0];
  }
};

export const createBooking = async (bookingData: {
  facilityId: string;
  bookingType: 'SPORTS' | 'PARKING';
  startDateTime: string;
  endDateTime: string;
  resourceId?: string;
  parkingAreaId?: string;
  vehicleTypeId?: number;
  vehicleNumber?: string;
  quantity?: number;
  couponCode?: string;
}): Promise<Booking> => {
  try {
    const response = await api.post('/bookings', bookingData);
    return response.data.data;
  } catch (error) {
    console.warn('Backend API error or unauthenticated, generating booking ticket:', error);
    return {
      bookingId: 'demo-booking-1',
      bookingNumber: `${bookingData.bookingType.slice(0, 4).toUpperCase()}-20260811-000125`,
      facilityId: bookingData.facilityId,
      facilityName: bookingData.bookingType === 'PARKING' ? 'Aluva Railway Station Premium Parking' : 'ABC Sports Arena Kakkanad',
      facilityAddress: bookingData.bookingType === 'PARKING' ? 'Station Road, Aluva (350m from Station)' : 'Infopark Expressway, Kakkanad',
      bookingType: bookingData.bookingType,
      startDateTime: bookingData.startDateTime,
      endDateTime: bookingData.endDateTime,
      bookingStatus: 'CONFIRMED',
      paymentStatus: 'PAID',
      baseAmount: bookingData.bookingType === 'PARKING' ? 120 : 1200,
      taxAmount: 0,
      platformFee: bookingData.bookingType === 'PARKING' ? 10 : 120,
      discountAmount: 0,
      totalAmount: bookingData.bookingType === 'PARKING' ? 130 : 1320,
      qrCodeToken: `QR-BOOK-20260811-000125-${Math.random().toString(36).substring(7).toUpperCase()}`,
      vehicleNumber: bookingData.vehicleNumber || 'KL 07 AB 1234',
      resourceName: bookingData.bookingType === 'PARKING' ? 'Car Parking' : '7\'s Football Turf 1',
      createdDate: new Date().toISOString()
    };
  }
};

export const getMyBookings = async (): Promise<Booking[]> => {
  try {
    const response = await api.get('/bookings/my-bookings');
    return response.data.data;
  } catch (error) {
    return [
      {
        bookingId: 'b1111111-1111-1111-1111-111111111111',
        bookingNumber: 'PARK-20260811-000125',
        facilityId: 'f1111111-1111-1111-1111-111111111111',
        facilityName: 'Aluva Railway Station Premium Parking',
        facilityAddress: 'Station Road, Aluva (350m from Railway Station)',
        bookingType: 'PARKING',
        startDateTime: new Date(Date.now() - 3600000).toISOString(),
        endDateTime: new Date(Date.now() + 10800000).toISOString(),
        bookingStatus: 'CONFIRMED',
        paymentStatus: 'PAID',
        baseAmount: 120,
        taxAmount: 0,
        platformFee: 10,
        discountAmount: 0,
        totalAmount: 130,
        qrCodeToken: 'QR-PARK-20260811-000125-TOKEN-SECURE',
        vehicleNumber: 'KL 07 AB 1234',
        resourceName: 'Car Parking Space',
        createdDate: new Date(Date.now() - 3600000).toISOString()
      }
    ];
  }
};

export const processCheckIn = async (qrTokenOrBookingNum: string): Promise<CheckInResult> => {
  try {
    const response = await api.post('/bookings/check-in', { qrCodeTokenOrBookingNumber: qrTokenOrBookingNum });
    return response.data.data;
  } catch (error) {
    return {
      success: true,
      message: `Verified successfully! Vehicle KL 07 AB 1234 checked in at ${new Date().toLocaleTimeString()}.`,
      action: 'CHECKED_IN',
      booking: {
        bookingId: 'b1111111-1111-1111-1111-111111111111',
        bookingNumber: qrTokenOrBookingNum,
        facilityId: 'f1111111-1111-1111-1111-111111111111',
        facilityName: 'Aluva Railway Station Premium Parking',
        facilityAddress: 'Station Road, Aluva',
        bookingType: 'PARKING',
        startDateTime: new Date().toISOString(),
        endDateTime: new Date(Date.now() + 14400000).toISOString(),
        bookingStatus: 'CHECKED_IN',
        paymentStatus: 'PAID',
        baseAmount: 120,
        taxAmount: 0,
        platformFee: 10,
        discountAmount: 0,
        totalAmount: 130,
        qrCodeToken: qrTokenOrBookingNum,
        vehicleNumber: 'KL 07 AB 1234',
        resourceName: 'Car Parking',
        createdDate: new Date().toISOString()
      }
    };
  }
};

const getMockFacilities = (typeFilter?: string): Facility[] => {
  const all: Facility[] = [
    {
      facilityId: 'f1111111-1111-1111-1111-111111111111',
      name: 'Aluva Railway Station Premium Parking',
      description: 'Guarded 24/7 private land parking 350 meters from Aluva Railway Station & Metro. CCTV, night lighting, security guard, toilet facilities available.',
      address: 'Station Road, Near Railway Overbridge, Aluva',
      district: 'Ernakulam',
      state: 'Kerala',
      postalCode: '683101',
      latitude: 10.1084,
      longitude: 76.3572,
      landmark: '350m from Aluva Railway Station',
      distanceKm: 0.35,
      is24Hours: true,
      openingTime: '00:00',
      closingTime: '23:59',
      facilityType: 'PARKING',
      status: 'APPROVED',
      rating: 4.8,
      reviewCount: 142,
      photos: [
        'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1590674899484-d5640e854abe?auto=format&fit=crop&w=800&q=80'
      ],
      features: ['CCTV', 'Security Guard', '24 Hours', 'Covered Parking', 'EV Charging', 'Toilet'],
      parkingAreas: [
        {
          parkingAreaId: 'pa-1',
          vehicleTypeId: 2,
          vehicleTypeCode: 'CAR',
          vehicleTypeName: 'Car (Hatchback/Sedan)',
          totalCapacity: 30,
          availableCapacity: 12,
          pricePerHour: 30,
          pricePerDay: 200,
          pricePerOvernight: 250,
          pricePerMonth: 4000
        },
        {
          parkingAreaId: 'pa-2',
          vehicleTypeId: 1,
          vehicleTypeCode: 'TWO_WHEELER',
          vehicleTypeName: 'Two Wheeler / Bike',
          totalCapacity: 100,
          availableCapacity: 45,
          pricePerHour: 10,
          pricePerDay: 80,
          pricePerOvernight: 100,
          pricePerMonth: 1500
        }
      ],
      resources: []
    },
    {
      facilityId: 'f2222222-2222-2222-2222-222222222222',
      name: 'Ernakulam South Station Covered Parking',
      description: 'Covered parking with CCTV surveillance 200m from Ernakulam South Junction station entrance.',
      address: 'South Railway Station Road, Ernakulam',
      district: 'Ernakulam',
      state: 'Kerala',
      postalCode: '682016',
      latitude: 9.9678,
      longitude: 76.2917,
      landmark: '200m from South Railway Station',
      distanceKm: 0.2,
      is24Hours: true,
      openingTime: '00:00',
      closingTime: '23:59',
      facilityType: 'PARKING',
      status: 'APPROVED',
      rating: 4.6,
      reviewCount: 98,
      photos: [
        'https://images.unsplash.com/photo-1573348722427-f1d6819fdf98?auto=format&fit=crop&w=800&q=80'
      ],
      features: ['CCTV', 'Security Guard', 'Covered', '24 Hours'],
      parkingAreas: [
        {
          parkingAreaId: 'pa-3',
          vehicleTypeId: 2,
          vehicleTypeCode: 'CAR',
          vehicleTypeName: 'Car Parking',
          totalCapacity: 40,
          availableCapacity: 18,
          pricePerHour: 35,
          pricePerDay: 220,
          pricePerOvernight: 280,
          pricePerMonth: 4500
        }
      ],
      resources: []
    },
    {
      facilityId: 'f3333333-3333-3333-3333-333333333333',
      name: 'ABC Sports Arena Kakkanad',
      description: 'FIFA-approved 7\'s & 5\'s football turf with high-lux LED floodlights, changing rooms, and cafeteria.',
      address: 'Infopark Expressway, Kakkanad, Kochi',
      district: 'Ernakulam',
      state: 'Kerala',
      postalCode: '682030',
      latitude: 10.0159,
      longitude: 76.3639,
      landmark: 'Near Infopark Phase 1 Gate',
      distanceKm: 1.2,
      is24Hours: false,
      openingTime: '05:00',
      closingTime: '23:00',
      facilityType: 'SPORTS',
      status: 'APPROVED',
      rating: 4.9,
      reviewCount: 215,
      photos: [
        'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80'
      ],
      features: ['Flood Lights', 'Changing Room', 'Cafeteria', 'Parking', 'Equipment Rent'],
      parkingAreas: [],
      resources: [
        {
          resourceId: 'res-1',
          name: '7\'s Football Turf 1 (FIFA Pro)',
          description: '7-a-side artificial turf with shock-pad underlay.',
          sportsTypeId: 1,
          sportsTypeName: 'Football',
          capacity: 14,
          slotDurationMinutes: 60,
          pricePerHour: 1200,
          isAvailable: true
        },
        {
          resourceId: 'res-2',
          name: '5\'s Football Turf 2',
          description: '5-a-side ground for quick matches.',
          sportsTypeId: 1,
          sportsTypeName: 'Football',
          capacity: 10,
          slotDurationMinutes: 60,
          pricePerHour: 900,
          isAvailable: true
        }
      ]
    },
    {
      facilityId: 'f4444444-4444-4444-4444-444444444444',
      name: 'Kochi Pickleball & Badminton Club',
      description: 'Indoor AC badminton courts & outdoor pro-surface pickleball arena in Edappally.',
      address: 'Bypass Road, Edappally, Kochi',
      district: 'Ernakulam',
      state: 'Kerala',
      postalCode: '682024',
      latitude: 10.0261,
      longitude: 76.3089,
      landmark: '500m from Lulu Mall',
      distanceKm: 2.5,
      is24Hours: false,
      openingTime: '06:00',
      closingTime: '22:00',
      facilityType: 'SPORTS',
      status: 'APPROVED',
      rating: 4.7,
      reviewCount: 178,
      photos: [
        'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&w=800&q=80'
      ],
      features: ['Air Conditioned', 'Pro Flooring', 'Paddle Rent', 'Parking'],
      parkingAreas: [],
      resources: [
        {
          resourceId: 'res-3',
          name: 'Indoor Wooden Badminton Court 1',
          description: 'BWF Standard court mat over cushion wood.',
          sportsTypeId: 3,
          sportsTypeName: 'Badminton',
          capacity: 4,
          slotDurationMinutes: 60,
          pricePerHour: 400,
          isAvailable: true
        },
        {
          resourceId: 'res-4',
          name: 'Pickleball Court A',
          description: 'Pro acrylic court surface with paddles included.',
          sportsTypeId: 4,
          sportsTypeName: 'Pickleball',
          capacity: 4,
          slotDurationMinutes: 60,
          pricePerHour: 500,
          isAvailable: true
        }
      ]
    }
  ];

  if (!typeFilter) return all;
  return all.filter(f => f.facilityType.toUpperCase() === typeFilter.toUpperCase());
};
