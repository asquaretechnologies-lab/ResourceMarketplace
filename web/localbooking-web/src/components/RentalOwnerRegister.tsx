import React, { useState, useEffect } from 'react';
import { 
  Bike, Car, Key, Plus, Calendar, Clock, Phone, AlertTriangle, 
  CheckCircle, RefreshCw, DollarSign, Shield, ArrowRight, UserCheck, 
  FileText, Fuel, Gauge, Sparkles, X, ChevronRight, Check
} from 'lucide-react';
import { 
  getTodayBoard, getOwnerVehicles, lookupRenter, createWalkInBooking, 
  processPickupHandover, processReturnInspection, settleRental, getDailyRentalReport,
  getRentalPlans, getDrivers
} from '../services/api';
import { TodayBoard, Vehicle, RentalBoardItem, ReturnEstimate } from '../types';

interface RentalOwnerRegisterProps {
  facilityId: string;
  facilityName: string;
}

export const RentalOwnerRegister: React.FC<RentalOwnerRegisterProps> = ({
  facilityId = 'f5555555-5555-5555-5555-555555555555',
  facilityName = 'Fort Kochi Wheels & Rentals'
}) => {
  const [activeTab, setActiveTab] = useState<'board' | 'fleet' | 'reports'>('board');
  const [boardData, setBoardData] = useState<TodayBoard | null>(null);
  const [fleet, setFleet] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionSuccessMsg, setActionSuccessMsg] = useState<string | null>(null);

  // Modals state
  const [isWalkInModalOpen, setIsWalkInModalOpen] = useState(false);
  const [pickupModalItem, setPickupModalItem] = useState<RentalBoardItem | null>(null);
  const [returnModalItem, setReturnModalItem] = useState<RentalBoardItem | null>(null);
  const [settleEstimate, setSettleEstimate] = useState<ReturnEstimate | null>(null);

  // Walk-in Form State
  const [walkInPhone, setWalkInPhone] = useState('');
  const [lookupResult, setLookupResult] = useState<any | null>(null);
  const [lookupLoading, setLookupLoading] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [selectedVehicleId, setSelectedVehicleId] = useState('');
  const [rentalDays, setRentalDays] = useState(1);
  const [withDriver, setWithDriver] = useState(false);
  const [depositAmount, setDepositAmount] = useState(1000);
  const [depositMethod, setDepositMethod] = useState<'UPI' | 'CASH'>('UPI');
  const [rentMethod, setRentMethod] = useState<'UPI' | 'CASH'>('UPI');
  const [upiRef, setUpiRef] = useState('');
  const [walkInSubmitting, setWalkInSubmitting] = useState(false);

  // Pickup Form State
  const [pickupOdo, setPickupOdo] = useState(12000);
  const [pickupFuel, setPickupFuel] = useState(100);
  const [helmetsGiven, setHelmetsGiven] = useState(2);
  const [pickupNotes, setPickupNotes] = useState('');

  // Return Form State
  const [returnOdo, setReturnOdo] = useState(12200);
  const [returnFuel, setReturnFuel] = useState(90);
  const [returnNotes, setReturnNotes] = useState('');

  // Settlement Form State
  const [settleDeduction, setSettleDeduction] = useState(0);
  const [settleRefundMethod, setSettleRefundMethod] = useState<'UPI' | 'CASH'>('UPI');

  useEffect(() => {
    loadData();
  }, [facilityId]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [board, vehicles] = await Promise.all([
        getTodayBoard(facilityId),
        getOwnerVehicles(facilityId)
      ]);
      setBoardData(board);
      setFleet(vehicles);
    } catch (err) {
      console.warn('API error loading rental register, setting up live local state:', err);
      // Fallback demo state if running offline/local
      setBoardData({
        totalFleetCount: 5,
        availableCount: 3,
        onRentCount: 2,
        maintenanceCount: 0,
        pickupsDue: [
          {
            bookingId: 'demo-b-1',
            rentalAgreementId: 'demo-a-1',
            bookingNumber: 'RENT-20261101-001',
            vehicleId: 'v-1',
            vehicleName: 'Royal Enfield Classic 350',
            registrationNumber: 'KL 07 CB 1902',
            category: 'BIKE',
            customerName: 'Rohit Verma (Tourist)',
            customerPhone: '+919847123456',
            scheduledPickup: new Date().toISOString(),
            scheduledReturn: new Date(Date.now() + 86400000 * 2).toISOString(),
            bookingStatus: 'CONFIRMED',
            paymentStatus: 'PAID',
            totalAmount: 1900,
            depositAmount: 2000,
            withDriver: false
          }
        ],
        activeOnRent: [
          {
            bookingId: 'demo-b-2',
            rentalAgreementId: 'demo-a-2',
            bookingNumber: 'RENT-20261031-004',
            vehicleId: 'v-2',
            vehicleName: 'Honda Activa 6G',
            registrationNumber: 'KL 07 CA 4012',
            category: 'SCOOTER',
            customerName: 'Sarah Jenkins (UK)',
            customerPhone: '+447891234567',
            scheduledPickup: new Date(Date.now() - 3600000 * 12).toISOString(),
            scheduledReturn: new Date(Date.now() + 3600000 * 12).toISOString(),
            actualPickup: new Date(Date.now() - 3600000 * 12).toISOString(),
            bookingStatus: 'ON_RENT',
            paymentStatus: 'PAID',
            totalAmount: 450,
            depositAmount: 1000,
            withDriver: false
          }
        ],
        returnsDue: [
          {
            bookingId: 'demo-b-2',
            rentalAgreementId: 'demo-a-2',
            bookingNumber: 'RENT-20261031-004',
            vehicleId: 'v-2',
            vehicleName: 'Honda Activa 6G',
            registrationNumber: 'KL 07 CA 4012',
            category: 'SCOOTER',
            customerName: 'Sarah Jenkins (UK)',
            customerPhone: '+447891234567',
            scheduledPickup: new Date(Date.now() - 3600000 * 12).toISOString(),
            scheduledReturn: new Date(Date.now() + 3600000 * 12).toISOString(),
            bookingStatus: 'ON_RENT',
            paymentStatus: 'PAID',
            totalAmount: 450,
            depositAmount: 1000,
            withDriver: false
          }
        ],
        overdue: []
      });

      setFleet([
        {
          vehicleId: 'v-1',
          facilityId,
          vehicleModelId: 2,
          make: 'Royal Enfield',
          model: 'Classic 350',
          category: 'BIKE',
          transmission: 'MANUAL',
          fuelType: 'PETROL',
          seats: 2,
          rentalPlanId: 'p-1',
          rentalPlanName: 'RE Cruiser',
          pricePerDay: 950,
          securityDepositAmount: 2000,
          registrationNumber: 'KL 07 CB 1902',
          color: 'Gunmetal Grey',
          odometerKm: 15200,
          fuelLevelPercent: 85,
          status: 'AVAILABLE',
          isListedOnline: true,
          photos: []
        },
        {
          vehicleId: 'v-2',
          facilityId,
          vehicleModelId: 1,
          make: 'Honda',
          model: 'Activa 6G',
          category: 'SCOOTER',
          transmission: 'AUTOMATIC',
          fuelType: 'PETROL',
          seats: 2,
          rentalPlanId: 'p-2',
          rentalPlanName: 'Daily Scooter',
          pricePerDay: 450,
          securityDepositAmount: 1000,
          registrationNumber: 'KL 07 CA 4012',
          color: 'Pearl Blue',
          odometerKm: 12450,
          fuelLevelPercent: 90,
          status: 'ON_RENT',
          isListedOnline: true,
          photos: []
        },
        {
          vehicleId: 'v-3',
          facilityId,
          vehicleModelId: 3,
          make: 'Royal Enfield',
          model: 'Himalayan 450',
          category: 'BIKE',
          transmission: 'MANUAL',
          fuelType: 'PETROL',
          seats: 2,
          rentalPlanId: 'p-3',
          rentalPlanName: 'Himalayan Explorer',
          pricePerDay: 1400,
          securityDepositAmount: 3000,
          registrationNumber: 'KL 07 CB 5544',
          color: 'Kamet White',
          odometerKm: 6100,
          fuelLevelPercent: 95,
          status: 'AVAILABLE',
          isListedOnline: true,
          photos: []
        },
        {
          vehicleId: 'v-4',
          facilityId,
          vehicleModelId: 4,
          make: 'Maruti Suzuki',
          model: 'Swift ZXi',
          category: 'HATCHBACK',
          transmission: 'MANUAL',
          fuelType: 'PETROL',
          seats: 5,
          rentalPlanId: 'p-4',
          rentalPlanName: 'Swift Standard',
          pricePerDay: 1600,
          securityDepositAmount: 3000,
          registrationNumber: 'KL 07 CD 8801',
          color: 'Sizzling Red',
          odometerKm: 28400,
          fuelLevelPercent: 80,
          status: 'AVAILABLE',
          isListedOnline: true,
          photos: []
        },
        {
          vehicleId: 'v-5',
          facilityId,
          vehicleModelId: 5,
          make: 'Mahindra',
          model: 'Thar 4x4',
          category: 'SUV',
          transmission: 'AUTOMATIC',
          fuelType: 'DIESEL',
          seats: 4,
          rentalPlanId: 'p-5',
          rentalPlanName: 'Thar 4x4 Off-Road',
          pricePerDay: 3200,
          securityDepositAmount: 5000,
          registrationNumber: 'KL 07 CE 9999',
          color: 'Napoli Black',
          odometerKm: 14200,
          fuelLevelPercent: 100,
          status: 'AVAILABLE',
          isListedOnline: true,
          photos: []
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneLookup = async (phone: string) => {
    setWalkInPhone(phone);
    if (phone.trim().length >= 10) {
      setLookupLoading(true);
      try {
        const res = await lookupRenter(facilityId, phone.trim());
        setLookupResult(res);
        if (res?.fullName) setCustomerName(res.fullName);
      } catch (e) {
        setLookupResult(null);
      } finally {
        setLookupLoading(false);
      }
    } else {
      setLookupResult(null);
    }
  };

  const handleVehicleSelect = (vId: string) => {
    setSelectedVehicleId(vId);
    const v = fleet.find(item => item.vehicleId === vId);
    if (v) {
      setDepositAmount(v.securityDepositAmount || 1000);
    }
  };

  const handleWalkInSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVehicleId || !customerName.trim() || !walkInPhone.trim()) {
      alert('Please fill in customer details and select a vehicle.');
      return;
    }

    setWalkInSubmitting(true);
    const start = new Date();
    const end = new Date(start.getTime() + rentalDays * 86400000);

    try {
      await createWalkInBooking({
        facilityId,
        vehicleId: selectedVehicleId,
        customerName: customerName.trim(),
        customerPhone: walkInPhone.trim(),
        startDateTime: start.toISOString(),
        endDateTime: end.toISOString(),
        withDriver,
        pickupMode: 'AT_SHOP',
        dropMode: 'AT_SHOP',
        helmetsGiven: 2,
        securityDepositAmount: depositAmount,
        depositPaymentMethod: depositMethod,
        rentPaymentMethod: rentMethod,
        upiReference: upiRef || undefined,
        notes: `Walk-in customer (${rentalDays} days)`
      });

      setActionSuccessMsg(`Walk-in rental registered successfully for ${customerName}! Receipt generated.`);
      setIsWalkInModalOpen(false);
      // Reset form
      setCustomerName('');
      setWalkInPhone('');
      setSelectedVehicleId('');
      setUpiRef('');
      await loadData();
    } catch (err: any) {
      alert(`Walk-in failed: ${err.message || 'Error occurred'}`);
    } finally {
      setWalkInSubmitting(false);
    }
  };

  const handlePickupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupModalItem) return;

    try {
      await processPickupHandover(pickupModalItem.bookingId, {
        odometerKm: pickupOdo,
        fuelLevelPercent: pickupFuel,
        helmetsGiven,
        damageNotes: pickupNotes
      });
      setActionSuccessMsg(`Vehicle ${pickupModalItem.registrationNumber} handed over to ${pickupModalItem.customerName}. Trip is now ACTIVE!`);
      setPickupModalItem(null);
      await loadData();
    } catch (err: any) {
      alert(`Handover failed: ${err.message || 'Error occurred'}`);
    }
  };

  const handleReturnSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!returnModalItem) return;

    try {
      const estimate = await processReturnInspection(returnModalItem.bookingId, {
        odometerKm: returnOdo,
        fuelLevelPercent: returnFuel,
        damageNotes: returnNotes
      });
      setSettleEstimate(estimate);
      setSettleDeduction(estimate.totalExtraCharges || 0);
      setReturnModalItem(null);
    } catch (err: any) {
      alert(`Return inspection failed: ${err.message || 'Error occurred'}`);
    }
  };

  const handleSettleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settleEstimate) return;

    try {
      const refundAmt = Math.max(0, (settleEstimate.depositHeld || 0) - settleDeduction);
      await settleRental(settleEstimate.rentalAgreementId, {
        extraKmCharge: settleEstimate.extraKmCharge,
        lateFeeCharge: settleEstimate.lateFee,
        fuelCharge: settleEstimate.fuelPenaltyCharge,
        damageCharge: 0,
        otherCharges: 0,
        depositDeducted: settleDeduction,
        depositRefunded: refundAmt,
        refundMethod: settleRefundMethod
      });
      setActionSuccessMsg(`Trip completed and security deposit settled (₹${refundAmt} refunded via ${settleRefundMethod}). Vehicle marked AVAILABLE.`);
      setSettleEstimate(null);
      await loadData();
    } catch (err: any) {
      alert(`Settlement failed: ${err.message || 'Error occurred'}`);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      
      {/* Top Banner / Store Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(59, 130, 246, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '16px',
        padding: '24px',
        display: 'flex',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '16px'
      }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '4px 10px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', fontSize: '0.75rem', fontWeight: 600, marginBottom: '8px' }}>
            <Key size={14} />
            <span>Digital Rental Register (Kerala Tourist Fleet)</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc', margin: 0 }}>
            {facilityName}
          </h2>
          <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: '4px 0 0 0' }}>
            Instant walk-in registration, digital handovers, fuel/odometer tracking & UPI deposit settlement.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button 
            id="quick-walkin-btn"
            onClick={() => setIsWalkInModalOpen(true)}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              padding: '10px 20px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.9rem',
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
            }}
          >
            <Plus size={18} />
            <span>Quick Walk-in Booking</span>
          </button>

          <button
            onClick={loadData}
            style={{
              padding: '10px 14px',
              borderRadius: '12px',
              background: 'rgba(30, 41, 59, 0.8)',
              color: '#cbd5e1',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              cursor: 'pointer'
            }}
            title="Refresh board"
          >
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      {/* Action Success Alert Banner */}
      {actionSuccessMsg && (
        <div style={{
          padding: '14px 18px',
          borderRadius: '12px',
          background: 'rgba(16, 185, 129, 0.15)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#6ee7b7',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '12px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CheckCircle size={18} color="#34d399" />
            <span style={{ fontSize: '0.9rem', fontWeight: 600 }}>{actionSuccessMsg}</span>
          </div>
          <button 
            onClick={() => setActionSuccessMsg(null)}
            style={{ background: 'transparent', border: 'none', color: '#6ee7b7', cursor: 'pointer' }}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {/* 4 Operations KPI Cards */}
      <div className="kpi-grid">
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Available Fleet</span>
            <Bike size={16} color="#10b981" />
          </div>
          <div className="kpi-card-value" style={{ color: '#34d399' }}>
            {boardData?.availableCount || 0} / {boardData?.totalFleetCount || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Ready for immediate tourist rental</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Currently On Rent</span>
            <Key size={16} color="#3b82f6" />
          </div>
          <div className="kpi-card-value" style={{ color: '#60a5fa' }}>
            {boardData?.onRentCount || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Bikes & cars running on Kerala roads</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Pickups Due Today</span>
            <Clock size={16} color="#f59e0b" />
          </div>
          <div className="kpi-card-value" style={{ color: '#fbbf24' }}>
            {boardData?.pickupsDue?.length || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Customer handovers scheduled</div>
        </div>

        <div className="kpi-card">
          <div className="kpi-card-header">
            <span>Overdue Returns</span>
            <AlertTriangle size={16} color="#ef4444" />
          </div>
          <div className="kpi-card-value" style={{ color: '#f87171' }}>
            {boardData?.overdue?.length || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#fca5a5' }}>Late penalty charges active</div>
        </div>
      </div>

      {/* Sub Tabs: Operations Board | Fleet | Daily Register Report */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid rgba(255, 255, 255, 0.1)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveTab('board')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'board' ? 'rgba(16, 185, 129, 0.2)' : 'transparent',
            border: activeTab === 'board' ? '1px solid rgba(16, 185, 129, 0.5)' : 'none',
            color: activeTab === 'board' ? '#34d399' : '#94a3b8',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Today's Operations Board
        </button>

        <button
          onClick={() => setActiveTab('fleet')}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            background: activeTab === 'fleet' ? 'rgba(59, 130, 246, 0.2)' : 'transparent',
            border: activeTab === 'fleet' ? '1px solid rgba(59, 130, 246, 0.5)' : 'none',
            color: activeTab === 'fleet' ? '#60a5fa' : '#94a3b8',
            fontWeight: 600,
            cursor: 'pointer'
          }}
        >
          Fleet Management ({fleet.length})
        </button>
      </div>

      {/* TAB 1: OPERATIONS BOARD */}
      {activeTab === 'board' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
          
          {/* Column 1: Pickups Due */}
          <div style={{
            background: 'rgba(18, 24, 38, 0.7)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#fbbf24', fontWeight: 700 }}>
                <Clock size={16} />
                <span>Pickups Due ({boardData?.pickupsDue?.length || 0})</span>
              </div>
            </div>

            {boardData?.pickupsDue?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '0.85rem' }}>
                No pending handovers scheduled for today.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {boardData?.pickupsDue?.map(item => (
                  <div key={item.bookingId} style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#f8fafc' }}>{item.vehicleName}</span>
                      <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.registrationNumber}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{item.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Phone size={12} /> {item.customerPhone}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#fbbf24', marginTop: '8px' }}>
                      Deposit: ₹{item.depositAmount} | Rent: ₹{item.totalAmount}
                    </div>

                    <button
                      onClick={() => {
                        setPickupModalItem(item);
                        setPickupOdo(12000);
                      }}
                      style={{
                        marginTop: '12px',
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        color: '#fff',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        border: 'none',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px'
                      }}
                    >
                      <Key size={14} /> Handover & Start Trip
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 2: Active On Rent */}
          <div style={{
            background: 'rgba(18, 24, 38, 0.7)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#60a5fa', fontWeight: 700 }}>
                <Key size={16} />
                <span>Active On Rent ({boardData?.activeOnRent?.length || 0})</span>
              </div>
            </div>

            {boardData?.activeOnRent?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '0.85rem' }}>
                No vehicles currently out on rent.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {boardData?.activeOnRent?.map(item => (
                  <div key={item.bookingId} style={{
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '10px',
                    padding: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                      <span style={{ fontWeight: 700, color: '#f8fafc' }}>{item.vehicleName}</span>
                      <span style={{ fontFamily: 'monospace', color: '#38bdf8', fontSize: '0.8rem', background: 'rgba(56, 189, 248, 0.1)', padding: '2px 6px', borderRadius: '4px' }}>
                        {item.registrationNumber}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{item.customerName}</div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', alignItems: 'center', gap: '6px', marginTop: '4px' }}>
                      <Phone size={12} /> {item.customerPhone}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '6px' }}>
                      Return: {new Date(item.scheduledReturn).toLocaleString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '12px' }}>
                      <a
                        href={`https://wa.me/${item.customerPhone.replace(/\D/g, '')}?text=Hello%20${encodeURIComponent(item.customerName)},%20this%20is%20${encodeURIComponent(facilityName)}%20regarding%20your%20vehicle%20${encodeURIComponent(item.registrationNumber)}.`}
                        target="_blank"
                        rel="noreferrer"
                        style={{
                          flex: 1,
                          padding: '7px',
                          borderRadius: '8px',
                          background: 'rgba(34, 197, 94, 0.15)',
                          color: '#4ade80',
                          border: '1px solid rgba(34, 197, 94, 0.4)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          textAlign: 'center',
                          textDecoration: 'none'
                        }}
                      >
                        WhatsApp
                      </a>

                      <button
                        onClick={() => {
                          setReturnModalItem(item);
                          setReturnOdo(12200);
                        }}
                        style={{
                          flex: 1.5,
                          padding: '7px',
                          borderRadius: '8px',
                          background: 'rgba(59, 130, 246, 0.2)',
                          color: '#93c5fd',
                          border: '1px solid rgba(59, 130, 246, 0.4)',
                          fontSize: '0.75rem',
                          fontWeight: 600,
                          cursor: 'pointer'
                        }}
                      >
                        Inspect Return
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Column 3: Returns & Overdue */}
          <div style={{
            background: 'rgba(18, 24, 38, 0.7)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '14px',
            padding: '16px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700 }}>
                <AlertTriangle size={16} />
                <span>Returns & Overdue ({ (boardData?.returnsDue?.length || 0) + (boardData?.overdue?.length || 0) })</span>
              </div>
            </div>

            {boardData?.returnsDue?.length === 0 && boardData?.overdue?.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '30px', color: '#64748b', fontSize: '0.85rem' }}>
                All returns on schedule. No overdue vehicles.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {boardData?.overdue?.map(item => (
                  <div key={item.bookingId} style={{
                    background: 'rgba(239, 68, 68, 0.12)',
                    border: '1px solid rgba(239, 68, 68, 0.4)',
                    borderRadius: '10px',
                    padding: '14px'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 700, color: '#fca5a5' }}>OVERDUE: {item.vehicleName}</span>
                      <span style={{ color: '#ef4444', fontWeight: 800, fontSize: '0.75rem' }}>
                        {item.overdueMinutes ? `${Math.round(item.overdueMinutes / 60)} hrs late` : 'LATE'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#f8fafc' }}>{item.customerName} ({item.customerPhone})</div>

                    <button
                      onClick={() => setReturnModalItem(item)}
                      style={{
                        marginTop: '10px',
                        width: '100%',
                        padding: '8px',
                        borderRadius: '8px',
                        background: '#ef4444',
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '0.75rem',
                        border: 'none',
                        cursor: 'pointer'
                      }}
                    >
                      Receive Overdue Return
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* TAB 2: FLEET MANAGEMENT */}
      {activeTab === 'fleet' && (
        <div style={{
          background: 'rgba(18, 24, 38, 0.7)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '14px',
          padding: '20px'
        }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#f8fafc', marginBottom: '16px' }}>
            Registered Bikes & Cars ({fleet.length} Vehicles)
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
            {fleet.map(v => (
              <div key={v.vehicleId} style={{
                background: 'rgba(30, 41, 59, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                padding: '16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '8px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ margin: 0, color: '#f8fafc', fontSize: '1rem', fontWeight: 700 }}>
                      {v.make} {v.model}
                    </h4>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{v.color} ({v.year || 2024})</span>
                  </div>

                  <span style={{
                    padding: '3px 8px',
                    borderRadius: '12px',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    background: v.status === 'AVAILABLE' ? 'rgba(16, 185, 129, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                    color: v.status === 'AVAILABLE' ? '#34d399' : '#60a5fa'
                  }}>
                    {v.status}
                  </span>
                </div>

                <div style={{ fontFamily: 'monospace', fontWeight: 700, color: '#38bdf8', fontSize: '0.9rem' }}>
                  {v.registrationNumber}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#cbd5e1', marginTop: '6px' }}>
                  <span>₹{v.pricePerDay} / day</span>
                  <span>Deposit: ₹{v.securityDepositAmount}</span>
                </div>

                <div style={{ display: 'flex', gap: '12px', fontSize: '0.75rem', color: '#94a3b8', borderTop: '1px solid rgba(255, 255, 255, 0.05)', paddingTop: '8px', marginTop: '4px' }}>
                  <span><Gauge size={12} /> {v.odometerKm} km</span>
                  <span><Fuel size={12} /> {v.fuelLevelPercent}% Fuel</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL 1: QUICK WALK-IN BOOKING (< 60 seconds) */}
      {isWalkInModalOpen && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#121826',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '16px',
            maxWidth: '560px',
            width: '100%',
            maxHeight: '90vh',
            overflowY: 'auto',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Key size={18} color="#10b981" />
                Quick Walk-in Rental Register
              </h3>
              <button onClick={() => setIsWalkInModalOpen(false)} style={{ background: 'transparent', border: 'none', color: '#94a3b8', cursor: 'pointer' }}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleWalkInSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              
              {/* Phone with Auto-Lookup */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>
                  Tourist Mobile Number (auto-looks up customer) *
                </label>
                <input
                  type="tel"
                  placeholder="e.g. 9847012345"
                  value={walkInPhone}
                  onChange={e => handlePhoneLookup(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
                {lookupLoading && <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>Checking customer records...</span>}
                {lookupResult?.isBlacklisted && (
                  <div style={{ color: '#ef4444', fontSize: '0.8rem', fontWeight: 600, marginTop: '4px' }}>
                    ⚠️ WARNING: Customer is blacklisted for this shop! Reason: {lookupResult.blacklistReason}
                  </div>
                )}
                {lookupResult && !lookupResult.isBlacklisted && (
                  <div style={{ color: '#34d399', fontSize: '0.8rem', marginTop: '4px' }}>
                    ✓ Returning Customer: {lookupResult.fullName} ({lookupResult.totalPreviousRentals} previous rentals)
                  </div>
                )}
              </div>

              {/* Customer Name */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Customer Full Name *</label>
                <input
                  type="text"
                  placeholder="e.g. John Doe"
                  value={customerName}
                  onChange={e => setCustomerName(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                />
              </div>

              {/* Select Available Vehicle */}
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Select Available Vehicle *</label>
                <select
                  value={selectedVehicleId}
                  onChange={e => handleVehicleSelect(e.target.value)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    borderRadius: '8px',
                    background: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    fontSize: '0.9rem'
                  }}
                >
                  <option value="">-- Choose Bike or Car --</option>
                  {fleet.filter(v => v.status === 'AVAILABLE').map(v => (
                    <option key={v.vehicleId} value={v.vehicleId}>
                      {v.make} {v.model} ({v.registrationNumber}) - ₹{v.pricePerDay}/day | Dep: ₹{v.securityDepositAmount}
                    </option>
                  ))}
                </select>
              </div>

              {/* Duration Days */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Duration (Days) *</label>
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={rentalDays}
                    onChange={e => setRentalDays(Math.max(1, parseInt(e.target.value) || 1))}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff'
                    }}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Deposit Amount (₹) *</label>
                  <input
                    type="number"
                    value={depositAmount}
                    onChange={e => setDepositAmount(parseInt(e.target.value) || 0)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff'
                    }}
                  />
                </div>
              </div>

              {/* Payment Methods */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Rent Payment Mode *</label>
                  <select
                    value={rentMethod}
                    onChange={e => setRentMethod(e.target.value as 'UPI' | 'CASH')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#1e293b',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff'
                    }}
                  >
                    <option value="UPI">Direct UPI (QR / PhonePe / GPay)</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Deposit Payment Mode *</label>
                  <select
                    value={depositMethod}
                    onChange={e => setDepositMethod(e.target.value as 'UPI' | 'CASH')}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: '#1e293b',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff'
                    }}
                  >
                    <option value="UPI">UPI</option>
                    <option value="CASH">Cash</option>
                  </select>
                </div>
              </div>

              {/* UPI UTR / Ref (if UPI selected) */}
              {(rentMethod === 'UPI' || depositMethod === 'UPI') && (
                <div>
                  <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>UPI Reference / UTR Number (optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. 423984029348"
                    value={upiRef}
                    onChange={e => setUpiRef(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      borderRadius: '8px',
                      background: 'rgba(30, 41, 59, 0.6)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      color: '#fff'
                    }}
                  />
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={walkInSubmitting}
                style={{
                  marginTop: '10px',
                  padding: '12px',
                  borderRadius: '10px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer'
                }}
              >
                {walkInSubmitting ? 'Registering...' : 'Register Walk-in & Handover Key'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: PICKUP HANDOVER */}
      {pickupModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#121826',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
              Pickup Handover: {pickupModalItem.vehicleName} ({pickupModalItem.registrationNumber})
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px' }}>
              Customer: <strong>{pickupModalItem.customerName}</strong>
            </p>

            <form onSubmit={handlePickupSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Starting Odometer (Km) *</label>
                <input
                  type="number"
                  value={pickupOdo}
                  onChange={e => setPickupOdo(parseInt(e.target.value) || 0)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Fuel Level: {pickupFuel}%</label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={10}
                  value={pickupFuel}
                  onChange={e => setPickupFuel(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Helmets Provided</label>
                <select
                  value={helmetsGiven}
                  onChange={e => setHelmetsGiven(parseInt(e.target.value))}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
                >
                  <option value={1}>1 Helmet</option>
                  <option value={2}>2 Helmets (Driver + Pillion)</option>
                  <option value={0}>None / Car</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setPickupModalItem(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#10b981', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Confirm Handover
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: RETURN INSPECTION */}
      {returnModalItem && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#121826',
            border: '1px solid rgba(59, 130, 246, 0.4)',
            borderRadius: '16px',
            maxWidth: '500px',
            width: '100%',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
              Return Inspection: {returnModalItem.vehicleName} ({returnModalItem.registrationNumber})
            </h3>
            <p style={{ fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '16px' }}>
              Customer: <strong>{returnModalItem.customerName}</strong>
            </p>

            <form onSubmit={handleReturnSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Return Odometer (Km) *</label>
                <input
                  type="number"
                  value={returnOdo}
                  onChange={e => setReturnOdo(parseInt(e.target.value) || 0)}
                  required
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Return Fuel Level: {returnFuel}%</label>
                <input
                  type="range"
                  min={10}
                  max={100}
                  step={10}
                  value={returnFuel}
                  onChange={e => setReturnFuel(parseInt(e.target.value))}
                  style={{ width: '100%' }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Damage Notes / Observations (if any)</label>
                <textarea
                  placeholder="e.g. Scratches on left mirror"
                  value={returnNotes}
                  onChange={e => setReturnNotes(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff',
                    minHeight: '60px'
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setReturnModalItem(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#3b82f6', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Calculate Bill & Settle
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 4: SETTLEMENT & DEPOSIT REFUND */}
      {settleEstimate && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(6px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '16px'
        }}>
          <div style={{
            background: '#121826',
            border: '1px solid rgba(16, 185, 129, 0.5)',
            borderRadius: '16px',
            maxWidth: '520px',
            width: '100%',
            padding: '24px'
          }}>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginBottom: '14px' }}>
              Final Settlement & Security Deposit Refund
            </h3>

            {/* Bill Summary */}
            <div style={{ background: 'rgba(30, 41, 59, 0.6)', borderRadius: '10px', padding: '14px', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                <span>Km Driven:</span>
                <span style={{ fontWeight: 600 }}>{settleEstimate.totalKmDriven} km</span>
              </div>
              {settleEstimate.extraKm > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                  <span>Extra Km Charge ({settleEstimate.extraKm} km):</span>
                  <span>+₹{settleEstimate.extraKmCharge}</span>
                </div>
              )}
              {settleEstimate.lateFee > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#ef4444' }}>
                  <span>Late Fee ({settleEstimate.overtimeHours} hrs late):</span>
                  <span>+₹{settleEstimate.lateFee}</span>
                </div>
              )}
              {settleEstimate.fuelPenaltyCharge > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#fbbf24' }}>
                  <span>Fuel Deficit Penalty:</span>
                  <span>+₹{settleEstimate.fuelPenaltyCharge}</span>
                </div>
              )}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '6px', display: 'flex', justifyContent: 'space-between', fontWeight: 700, color: '#f8fafc' }}>
                <span>Security Deposit Held:</span>
                <span style={{ color: '#34d399' }}>₹{settleEstimate.depositHeld}</span>
              </div>
            </div>

            <form onSubmit={handleSettleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Total Deposit Deducted (₹)</label>
                <input
                  type="number"
                  value={settleDeduction}
                  onChange={e => setSettleDeduction(Math.min(settleEstimate.depositHeld, parseInt(e.target.value) || 0))}
                  style={{
                    width: '100%',
                    padding: '10px',
                    borderRadius: '8px',
                    background: '#1e293b',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    color: '#fff'
                  }}
                />
              </div>

              <div style={{ background: 'rgba(16, 185, 129, 0.12)', padding: '12px', borderRadius: '8px', color: '#34d399', fontWeight: 700, display: 'flex', justifyContent: 'space-between' }}>
                <span>Net Refund to Customer:</span>
                <span>₹{Math.max(0, (settleEstimate.depositHeld || 0) - settleDeduction)}</span>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Refund Given Via *</label>
                <select
                  value={settleRefundMethod}
                  onChange={e => setSettleRefundMethod(e.target.value as 'UPI' | 'CASH')}
                  style={{ width: '100%', padding: '10px', borderRadius: '8px', background: '#1e293b', border: '1px solid rgba(255, 255, 255, 0.1)', color: '#fff' }}
                >
                  <option value="UPI">UPI Transfer</option>
                  <option value="CASH">Cash</option>
                </select>
              </div>

              <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setSettleEstimate(null)}
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: 'transparent', border: '1px solid rgba(255, 255, 255, 0.2)', color: '#fff', cursor: 'pointer' }}
                >
                  Back
                </button>
                <button
                  type="submit"
                  style={{ flex: 1, padding: '10px', borderRadius: '8px', background: '#10b981', border: 'none', color: '#fff', fontWeight: 700, cursor: 'pointer' }}
                >
                  Complete Trip & Return Key
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
