import React, { useState } from 'react';
import { Video, Calendar, Clock, User, Phone, Mail, CheckCircle, X } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface TimeSlot {
  id: string;
  time: string;
  available: boolean;
}

interface ConsultationRequest {
  name: string;
  email: string;
  phone: string;
  projectType: string;
  description: string;
  preferredDate: string;
  preferredTime: string;
  consultationType: 'video' | 'phone' | 'in-person';
}

const VirtualConsultation = () => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [formData, setFormData] = useState<ConsultationRequest>({
    name: '',
    email: '',
    phone: '',
    projectType: '',
    description: '',
    preferredDate: '',
    preferredTime: '',
    consultationType: 'video'
  });

  const projectTypes = [
    'Metal Construction Works',
    'Wrought Iron Work',
    'Aluminum Works',
    'Security Fence Systems',
    'Heavy Duty Gates & Doors',
    'Car Park Installation',
    'General Consultation'
  ];

  const timeSlots: TimeSlot[] = [
    { id: '09:00', time: '9:00 AM', available: true },
    { id: '10:00', time: '10:00 AM', available: true },
    { id: '11:00', time: '11:00 AM', available: false },
    { id: '14:00', time: '2:00 PM', available: true },
    { id: '15:00', time: '3:00 PM', available: true },
    { id: '16:00', time: '4:00 PM', available: true },
    { id: '17:00', time: '5:00 PM', available: false }
  ];

  const experts = [
    {
      name: 'Eja Oladimeji',
      title: 'Managing Director & Chief Engineer',
      specialization: 'Project Management, Structural Engineering',
      experience: '18+ years',
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 5.0
    },
    {
      name: 'Adebayo Kunle',
      title: 'Senior Welding Supervisor',
      specialization: 'Structural Welding, Quality Control',
      experience: '12+ years',
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 4.9
    },
    {
      name: 'Fatima Abubakar',
      title: 'Aluminum Works Specialist',
      specialization: 'Curtain Wall Systems, Window Installation',
      experience: '8+ years',
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop',
      rating: 4.8
    }
  ];

  const handleInputChange = (field: keyof ConsultationRequest, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast.success('Consultation scheduled successfully! You will receive a confirmation email shortly.');
    setStep(4); // Success step
  };

  const generateAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends for business consultations
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          value: date.toISOString().split('T')[0],
          label: date.toLocaleDateString('en-US', { 
            weekday: 'long', 
            month: 'short', 
            day: 'numeric' 
          })
        });
      }
    }
    
    return dates;
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Schedule Your Consultation</h2>
              <p className="text-gray-600">Get expert advice on your metal construction project</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Type *</label>
                <select
                  value={formData.projectType}
                  onChange={(e) => handleInputChange('projectType', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select project type</option>
                  {projectTypes.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project Description</label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Please describe your project requirements, timeline, and any specific questions you have..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">Consultation Type</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { id: 'video', label: 'Video Call', icon: Video, description: 'Face-to-face consultation via video' },
                  { id: 'phone', label: 'Phone Call', icon: Phone, description: 'Voice consultation over phone' },
                  { id: 'in-person', label: 'In-Person', icon: User, description: 'Meet at our office or your location' }
                ].map((type) => (
                  <motion.button
                    key={type.id}
                    onClick={() => handleInputChange('consultationType', type.id as any)}
                    className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                      formData.consultationType === type.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3 mb-2">
                      <type.icon className="h-5 w-5 text-blue-600" />
                      <span className="font-semibold text-gray-900">{type.label}</span>
                    </div>
                    <p className="text-sm text-gray-600">{type.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Date & Time</h2>
              <p className="text-gray-600">Choose your preferred consultation schedule</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Dates</h3>
                <div className="space-y-2">
                  {generateAvailableDates().map((date) => (
                    <motion.button
                      key={date.value}
                      onClick={() => {
                        setSelectedDate(date.value);
                        handleInputChange('preferredDate', date.value);
                      }}
                      className={`w-full p-3 text-left border-2 rounded-lg transition-all duration-200 ${
                        selectedDate === date.value
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Calendar className="h-5 w-5 text-blue-600" />
                        <span className="font-medium">{date.label}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Available Times</h3>
                <div className="grid grid-cols-2 gap-3">
                  {timeSlots.map((slot) => (
                    <motion.button
                      key={slot.id}
                      onClick={() => {
                        if (slot.available) {
                          setSelectedTime(slot.id);
                          handleInputChange('preferredTime', slot.time);
                        }
                      }}
                      disabled={!slot.available}
                      className={`p-3 text-center border-2 rounded-lg transition-all duration-200 ${
                        !slot.available
                          ? 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                          : selectedTime === slot.id
                          ? 'border-blue-500 bg-blue-50 text-blue-900'
                          : 'border-gray-200 hover:border-gray-300 text-gray-900'
                      }`}
                      whileHover={slot.available ? { scale: 1.05 } : {}}
                      whileTap={slot.available ? { scale: 0.95 } : {}}
                    >
                      <div className="flex items-center justify-center space-x-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{slot.time}</span>
                      </div>
                      {!slot.available && (
                        <span className="text-xs text-gray-400">Booked</span>
                      )}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Meet Your Expert</h2>
              <p className="text-gray-600">You'll be consulting with one of our specialists</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {experts.map((expert, index) => (
                <div key={index} className="bg-gray-50 rounded-xl p-6 text-center">
                  <img
                    src={expert.image}
                    alt={expert.name}
                    className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-bold text-gray-900 mb-1">{expert.name}</h3>
                  <p className="text-blue-600 font-medium mb-2">{expert.title}</p>
                  <p className="text-sm text-gray-600 mb-3">{expert.specialization}</p>
                  <div className="flex items-center justify-center space-x-2 mb-2">
                    <span className="text-sm text-gray-600">{expert.experience}</span>
                    <span className="text-yellow-500">★</span>
                    <span className="text-sm font-medium">{expert.rating}</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Consultation Summary */}
            <div className="bg-blue-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Consultation Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Name:</span>
                  <span className="ml-2 font-medium">{formData.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Email:</span>
                  <span className="ml-2 font-medium">{formData.email}</span>
                </div>
                <div>
                  <span className="text-gray-600">Project Type:</span>
                  <span className="ml-2 font-medium">{formData.projectType}</span>
                </div>
                <div>
                  <span className="text-gray-600">Consultation Type:</span>
                  <span className="ml-2 font-medium capitalize">{formData.consultationType.replace('-', ' ')}</span>
                </div>
                <div>
                  <span className="text-gray-600">Date:</span>
                  <span className="ml-2 font-medium">
                    {new Date(formData.preferredDate).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Time:</span>
                  <span className="ml-2 font-medium">{formData.preferredTime}</span>
                </div>
              </div>
              {formData.description && (
                <div className="mt-4">
                  <span className="text-gray-600">Project Description:</span>
                  <p className="mt-1 text-gray-800">{formData.description}</p>
                </div>
              )}
            </div>
          </div>
        );

      case 4:
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Consultation Scheduled!</h2>
              <p className="text-gray-600 mb-6">
                Your consultation has been successfully scheduled. You will receive a confirmation email with meeting details.
              </p>
            </div>

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm font-bold">1</span>
                  </div>
                  <p className="text-gray-700">You'll receive a confirmation email with meeting link/details</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm font-bold">2</span>
                  </div>
                  <p className="text-gray-700">Our expert will review your project details beforehand</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mt-0.5">
                    <span className="text-green-600 text-sm font-bold">3</span>
                  </div>
                  <p className="text-gray-700">Join the consultation at your scheduled time</p>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={() => window.location.href = '/'}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  setStep(1);
                  setFormData({
                    name: '',
                    email: '',
                    phone: '',
                    projectType: '',
                    description: '',
                    preferredDate: '',
                    preferredTime: '',
                    consultationType: 'video'
                  });
                  setSelectedDate('');
                  setSelectedTime('');
                }}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Schedule Another
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.name && formData.email && formData.phone && formData.projectType;
      case 2:
        return selectedDate && selectedTime;
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Virtual Consultation</h1>
          </div>
          <p className="text-gray-600">Get expert advice from our metal construction specialists</p>
        </div>

        {/* Progress Bar */}
        {step < 4 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-600">Step {step} of 3</span>
              <span className="text-sm text-gray-600">{Math.round((step / 3) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          {step < 4 && (
            <div className="flex justify-between mt-8 pt-6 border-t">
              <button
                onClick={() => setStep(Math.max(1, step - 1))}
                disabled={step === 1}
                className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <span>Previous</span>
              </button>

              {step < 3 ? (
                <button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Next Step
                </button>
              ) : (
                <button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                >
                  Schedule Consultation
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VirtualConsultation;