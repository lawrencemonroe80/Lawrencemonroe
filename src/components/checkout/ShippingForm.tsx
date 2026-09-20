import React from 'react';
import { OrderCustomerInfo } from '../../types';

interface ShippingFormProps {
  info: OrderCustomerInfo;
  onChange: (field: keyof OrderCustomerInfo, value: any) => void;
}

const inputClass = "w-full bg-transparent border-b border-hairline focus:border-gold py-3 font-body text-base text-white placeholder:text-white/30 focus:outline-none transition-colors";

export const ShippingForm: React.FC<ShippingFormProps> = ({ info, onChange }) => {
  return (
    <div className="space-y-10">
      {/* Email */}
      <div className="space-y-3">
        <label className="folio text-gold">Email</label>
        <input
          type="email"
          required
          value={info.email}
          onChange={(e) => onChange('email', e.target.value)}
          placeholder="Enter your email"
          className={inputClass}
        />
      </div>

      {/* Name */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="space-y-3">
          <label className="folio">First name</label>
          <input type="text" required value={info.firstName} onChange={(e) => onChange('firstName', e.target.value)} placeholder="First name" className={inputClass} />
        </div>
        <div className="space-y-3">
          <label className="folio">Last name</label>
          <input type="text" required value={info.lastName} onChange={(e) => onChange('lastName', e.target.value)} placeholder="Last name" className={inputClass} />
        </div>
      </div>

      {/* Address */}
      <div className="space-y-3">
        <label className="folio">Address</label>
        <input type="text" required value={info.address} onChange={(e) => onChange('address', e.target.value)} placeholder="Street address" className={inputClass} />
      </div>

      {/* City / State / Postal / Country */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
        <div className="space-y-3 col-span-2 sm:col-span-2">
          <label className="folio">City</label>
          <input type="text" required value={info.city} onChange={(e) => onChange('city', e.target.value)} placeholder="City" className={inputClass} />
        </div>
        <div className="space-y-3">
          <label className="folio">State</label>
          <input type="text" value={info.stateProvince} onChange={(e) => onChange('stateProvince', e.target.value)} placeholder="State" className={inputClass} />
        </div>
        <div className="space-y-3">
          <label className="folio">Postal</label>
          <input type="text" required value={info.postalCode} onChange={(e) => onChange('postalCode', e.target.value)} placeholder="Postal code" className={inputClass} />
        </div>
      </div>

      <div className="space-y-3">
        <label className="folio">Country</label>
        <input type="text" required value={info.country} onChange={(e) => onChange('country', e.target.value)} placeholder="Country" className={inputClass} />
      </div>

      {/* Shipping method */}
      <div className="space-y-4 pt-2">
        <label className="folio text-gold">Courier method</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {[
            { id: 'standard', label: 'Standard Priority', note: '2–4 business days', price: 'Free' },
            { id: 'express', label: 'Expedited Courier', note: '1–2 business days', price: '$25.00' },
          ].map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => onChange('shippingOption', opt.id)}
              className={`p-5 border text-left transition-colors ${
                info.shippingOption === opt.id
                  ? 'border-gold bg-gold/5 text-white'
                  : 'border-hairline text-white/60 hover:border-white/40'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="font-display-mega text-lg text-white">{opt.label}</div>
                <div className={`w-3 h-3 border ${info.shippingOption === opt.id ? 'border-gold bg-gold' : 'border-white/30'}`} />
              </div>
              <div className="flex items-center justify-between">
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-white/40">{opt.note}</div>
                <div className="font-mono text-[10px] tracking-[0.2em] uppercase text-gold">{opt.price}</div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
