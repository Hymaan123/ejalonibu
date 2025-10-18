import React, { useState } from 'react';
import { CreditCard, DollarSign, Shield, CheckCircle, AlertCircle } from 'lucide-react';

interface PaymentOption {
  id: string;
  name: string;
  type: 'card' | 'bank' | 'mobile';
  currencies: ('USD' | 'NGN')[];
  fees: {
    USD: number;
    NGN: number;
  };
  processingTime: string;
  icon: React.ReactNode;
}

const PaymentSystem = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'NGN'>('USD');
  const [selectedPayment, setSelectedPayment] = useState<string>('');
  const [amount, setAmount] = useState<string>('');
  const [showPaymentForm, setShowPaymentForm] = useState(false);

  const paymentOptions: PaymentOption[] = [
    {
      id: 'visa-mastercard',
      name: 'Visa/Mastercard',
      type: 'card',
      currencies: ['USD', 'NGN'],
      fees: { USD: 2.9, NGN: 1.5 },
      processingTime: 'Instant',
      icon: <CreditCard className="h-6 w-6" />
    },
    {
      id: 'bank-transfer-usd',
      name: 'International Wire Transfer',
      type: 'bank',
      currencies: ['USD'],
      fees: { USD: 25, NGN: 0 },
      processingTime: '1-3 business days',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      id: 'bank-transfer-ngn',
      name: 'Nigerian Bank Transfer',
      type: 'bank',
      currencies: ['NGN'],
      fees: { USD: 0, NGN: 50 },
      processingTime: 'Instant',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      id: 'paystack',
      name: 'Paystack (Cards & Bank)',
      type: 'mobile',
      currencies: ['NGN'],
      fees: { USD: 0, NGN: 1.5 },
      processingTime: 'Instant',
      icon: <Shield className="h-6 w-6" />
    },
    {
      id: 'flutterwave',
      name: 'Flutterwave',
      type: 'mobile',
      currencies: ['USD', 'NGN'],
      fees: { USD: 3.8, NGN: 1.4 },
      processingTime: 'Instant',
      icon: <Shield className="h-6 w-6" />
    }
  ];

  const exchangeRate = 1600; // 1 USD = 1600 NGN (example rate)

  const calculateFee = (amount: number, paymentId: string, currency: 'USD' | 'NGN') => {
    const payment = paymentOptions.find(p => p.id === paymentId);
    if (!payment) return 0;

    const feeRate = payment.fees[currency];
    if (currency === 'USD' && payment.id === 'bank-transfer-usd') {
      return feeRate; // Flat fee for wire transfer
    }
    if (currency === 'NGN' && payment.id === 'bank-transfer-ngn') {
      return feeRate; // Flat fee for local transfer
    }
    return (amount * feeRate) / 100; // Percentage fee
  };

  const convertCurrency = (amount: number, from: 'USD' | 'NGN', to: 'USD' | 'NGN') => {
    if (from === to) return amount;
    if (from === 'USD' && to === 'NGN') return amount * exchangeRate;
    if (from === 'NGN' && to === 'USD') return amount / exchangeRate;
    return amount;
  };

  const filteredPaymentOptions = paymentOptions.filter(option => 
    option.currencies.includes(selectedCurrency)
  );

  const handlePayment = () => {
    if (!selectedPayment || !amount) {
      alert('Please select a payment method and enter an amount');
      return;
    }
    setShowPaymentForm(true);
  };

  return (
    <section id="payment" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-white mb-4">
            Secure Payment System
          </h2>
          <p className="text-xl text-gray-300 leading-relaxed">
            Multiple payment options available in both USD and NGN currencies
          </p>
        </div>

        {!showPaymentForm ? (
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
            {/* Currency Selection */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Select Currency</h3>
              <div className="flex space-x-4">
                <button
                  onClick={() => setSelectedCurrency('USD')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedCurrency === 'USD'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  }`}
                >
                  USD ($)
                </button>
                <button
                  onClick={() => setSelectedCurrency('NGN')}
                  className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 ${
                    selectedCurrency === 'NGN'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600 border border-gray-600'
                  }`}
                >
                  NGN (₦)
                </button>
              </div>
            </div>

            {/* Amount Input */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Payment Amount</h3>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg">
                  {selectedCurrency === 'USD' ? '$' : '₦'}
                </span>
                <input
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="Enter amount"
                  className="w-full pl-8 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg text-white placeholder-gray-400"
                />
              </div>
              {amount && (
                <p className="mt-2 text-sm text-gray-300">
                  Equivalent: {selectedCurrency === 'USD' 
                    ? `₦${convertCurrency(parseFloat(amount), 'USD', 'NGN').toLocaleString()}`
                    : `$${convertCurrency(parseFloat(amount), 'NGN', 'USD').toFixed(2)}`
                  }
                </p>
              )}
            </div>

            {/* Payment Methods */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-white mb-4">Select Payment Method</h3>
              <div className="space-y-3">
                {filteredPaymentOptions.map((option) => {
                  const fee = amount ? calculateFee(parseFloat(amount), option.id, selectedCurrency) : 0;
                  const total = amount ? parseFloat(amount) + fee : 0;

                  return (
                    <div
                      key={option.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                        selectedPayment === option.id
                          ? 'border-blue-500 bg-blue-600/20'
                          : 'border-gray-600 hover:border-gray-500 bg-gray-700/50'
                      }`}
                      onClick={() => setSelectedPayment(option.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="text-blue-400">{option.icon}</div>
                          <div>
                            <h4 className="font-semibold text-white">{option.name}</h4>
                            <p className="text-sm text-gray-300">Processing: {option.processingTime}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-300">
                            Fee: {selectedCurrency === 'USD' ? '$' : '₦'}{fee.toFixed(2)}
                          </p>
                          {amount && (
                            <p className="font-semibold text-white">
                              Total: {selectedCurrency === 'USD' ? '$' : '₦'}{total.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Security Notice */}
            <div className="bg-green-600/20 border border-green-500/30 rounded-lg p-4 mb-8">
              <div className="flex items-start space-x-3">
                <Shield className="h-5 w-5 text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-green-400">Secure Payment Processing</h4>
                  <p className="text-sm text-green-300 mt-1">
                    All payments are processed through secure, encrypted channels. Your financial information is protected with industry-standard security measures.
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Button */}
            <button
              onClick={handlePayment}
              disabled={!selectedPayment || !amount}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300"
            >
              Proceed to Payment
            </button>
          </div>
        ) : (
          /* Payment Form */
          <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg p-8 border border-gray-700">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">Complete Payment</h3>
              <button
                onClick={() => setShowPaymentForm(false)}
                className="text-gray-400 hover:text-gray-300"
              >
                ← Back
              </button>
            </div>

            {/* Payment Summary */}
            <div className="bg-gray-700/50 rounded-lg p-6 mb-8 border border-gray-600">
              <h4 className="font-semibold text-white mb-4">Payment Summary</h4>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-300">Amount:</span>
                  <span className="font-semibold text-white">{selectedCurrency === 'USD' ? '$' : '₦'}{amount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Processing Fee:</span>
                  <span className="font-semibold text-white">
                    {selectedCurrency === 'USD' ? '$' : '₦'}{calculateFee(parseFloat(amount), selectedPayment, selectedCurrency).toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-gray-600 pt-2 flex justify-between">
                  <span className="font-semibold text-white">Total:</span>
                  <span className="font-bold text-lg text-blue-400">
                    {selectedCurrency === 'USD' ? '$' : '₦'}{(parseFloat(amount) + calculateFee(parseFloat(amount), selectedPayment, selectedCurrency)).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Form */}
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              {selectedPayment === 'visa-mastercard' && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-3 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                        placeholder="123"
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedPayment.includes('bank-transfer') && (
                <div className="bg-blue-600/20 border border-blue-500/30 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <AlertCircle className="h-5 w-5 text-blue-400 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-blue-400">Bank Transfer Instructions</h4>
                      <p className="text-sm text-blue-300 mt-1">
                        After clicking "Complete Payment", you will receive detailed bank transfer instructions via email.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center justify-center space-x-2"
              >
                <CheckCircle className="h-5 w-5" />
                <span>Complete Payment</span>
              </button>
            </form>
          </div>
        )}
      </div>
    </section>
  );
};

export default PaymentSystem;