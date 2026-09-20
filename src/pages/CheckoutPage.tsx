import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, AlertCircle, ShoppingBag } from 'lucide-react';
import { useCartStore } from '../store/cartStore';
import { OrderSummary } from '../components/checkout/OrderSummary';
import { ShippingForm } from '../components/checkout/ShippingForm';
import { SquarePaymentForm } from '../components/checkout/SquarePaymentForm';
import { OrderSuccessModal } from '../components/checkout/OrderSuccessModal';
import { OrderCustomerInfo, OrderResult } from '../types';

export const CheckoutPage: React.FC = () => {
  const navigate = useNavigate();
  const { items, getSubtotal, clearCart } = useCartStore();

  const [customerInfo, setCustomerInfo] = useState<OrderCustomerInfo>({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    suite: '',
    city: '',
    stateProvince: '',
    postalCode: '',
    country: '',
    shippingOption: 'standard',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedOrder, setCompletedOrder] = useState<OrderResult | null>(null);

  const subtotal = getSubtotal();
  const shippingCost = customerInfo.shippingOption === 'express' ? 25.00 : 0.00;
  const estimatedTax = subtotal * 0.0825;
  const total = subtotal + shippingCost + estimatedTax;

  const handleFieldChange = (field: keyof OrderCustomerInfo, value: any) => {
    setCustomerInfo((prev) => ({ ...prev, [field]: value }));
    setErrorMessage(null);
  };

  const handlePaymentSuccess = (orderResult: any) => {
    setIsProcessing(false);
    setCompletedOrder(orderResult);
    clearCart();
  };

  const handlePaymentError = (errorMsg: string) => {
    setIsProcessing(false);
    setErrorMessage(errorMsg);
  };

  if (items.length === 0 && !completedOrder) {
    return (
      <div className="min-h-screen bg-black text-white pt-32 pb-24 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <div className="w-20 h-20 border border-hairline flex items-center justify-center">
          <ShoppingBag size={28} strokeWidth={1.2} />
        </div>
        <div className="space-y-3">
          <h1 className="font-display-mega text-5xl sm:text-7xl text-white uppercase leading-[0.92]">
            Bag is{' '}
            <span
              className="italic text-gold-shine"
              style={{ fontFamily: "'PP Editorial New', serif" }}
            >
              empty.
            </span>
          </h1>
          <p className="text-sm text-white/50 max-w-sm mx-auto">
            You must allocate at least one piece from Release 001 to proceed to checkout.
          </p>
        </div>
        <Link to="/shop" className="btn-gold">
          Explore the pieces
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white pt-24 sm:pt-32 pb-24">
      <div className="max-w-[1760px] mx-auto px-5 sm:px-8 md:px-12">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-10 sm:pb-14 border-b border-hairline items-end">
          <div className="lg:col-span-8 flex items-center gap-6">
            <Link to="/shop" className="link-arrow text-white/60 hover:text-gold">
              <ArrowLeft size={14} className="rotate-180" />
              Return to shop
            </Link>
          </div>
          <div className="lg:col-span-4 text-right">
            <div className="folio text-white/40">Page 19 — The Counter</div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mt-12 sm:mt-16">
          <div className="lg:col-span-7 space-y-8">
            <div className="space-y-3">
              <div className="folio text-gold">Allocation</div>
              <h1 className="font-display-mega text-5xl sm:text-7xl lg:text-8xl text-white uppercase leading-[0.9] tracking-[-0.02em]">
                Secure the{' '}
                <span
                  className="italic text-hollow-gold"
                  style={{ fontFamily: "'PP Editorial New', serif" }}
                >
                  allocation.
                </span>
              </h1>
            </div>

            <div className="border border-hairline p-6 sm:p-10 space-y-8 bg-black">
              <ShippingForm info={customerInfo} onChange={handleFieldChange} />

              <div className="border-t border-hairline pt-8">
                <SquarePaymentForm
                  items={items}
                  customerInfo={customerInfo}
                  isProcessing={isProcessing}
                  onPaymentSuccess={handlePaymentSuccess}
                  onPaymentError={handlePaymentError}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 lg:sticky lg:top-32">
            <OrderSummary
              items={items}
              subtotal={subtotal}
              shippingCost={shippingCost}
              tax={estimatedTax}
              total={total}
            />
          </div>
        </div>
      </div>

      {completedOrder && (
        <OrderSuccessModal
          order={completedOrder}
          onClose={() => {
            setCompletedOrder(null);
            navigate('/');
          }}
        />
      )}
    </div>
  );
};
