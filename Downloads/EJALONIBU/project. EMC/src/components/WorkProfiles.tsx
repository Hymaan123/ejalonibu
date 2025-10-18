import React, { useState } from 'react';
import { DollarSign, Calculator, CheckCircle, Clock, Users, Award } from 'lucide-react';

interface WorkProfile {
  id: string;
  title: string;
  category: string;
  description: string;
  image: string;
  priceUSD: {
    min: number;
    max: number;
  };
  priceNGN: {
    min: number;
    max: number;
  };
  duration: string;
  complexity: 'Basic' | 'Intermediate' | 'Advanced';
  features: string[];
  specifications: string[];
}

const WorkProfiles = () => {
  const [selectedCurrency, setSelectedCurrency] = useState<'USD' | 'NGN'>('USD');
  const [selectedWork, setSelectedWork] = useState<WorkProfile | null>(null);

  const workProfiles: WorkProfile[] = [
    {
      id: 'metal-construction-basic',
      title: 'Basic Metal Framework',
      category: 'Metal Construction Works',
      description: 'Standard structural metalwork for small to medium buildings and frameworks.',
      image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 2500, max: 8000 },
      priceNGN: { min: 4000000, max: 12800000 },
      duration: '2-4 weeks',
      complexity: 'Basic',
      features: ['Structural Steel Work', 'Basic Welding', 'Standard Finishing', 'Quality Inspection'],
      specifications: ['Steel Grade: S275', 'Welding: AWS D1.1', 'Coating: Primer + Paint', 'Load Capacity: Up to 50 tons']
    },
    {
      id: 'metal-construction-industrial',
      title: 'Industrial Metal Construction',
      category: 'Metal Construction Works',
      description: 'Heavy-duty industrial metalwork for factories, warehouses, and large structures.',
      image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 15000, max: 50000 },
      priceNGN: { min: 24000000, max: 80000000 },
      duration: '6-12 weeks',
      complexity: 'Advanced',
      features: ['Heavy Structural Work', 'Precision Engineering', 'Industrial Grade Materials', 'Comprehensive Testing'],
      specifications: ['Steel Grade: S355', 'Welding: AWS D1.1 & D1.2', 'Coating: Hot-dip Galvanizing', 'Load Capacity: 100+ tons']
    },
    {
      id: 'wrought-iron-decorative',
      title: 'Decorative Wrought Iron',
      category: 'Wrought Iron Work',
      description: 'Elegant decorative wrought iron gates, railings, and artistic elements.',
      image: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 800, max: 3500 },
      priceNGN: { min: 1280000, max: 5600000 },
      duration: '1-3 weeks',
      complexity: 'Intermediate',
      features: ['Custom Designs', 'Hand-forged Elements', 'Artistic Finishing', 'Rust Protection'],
      specifications: ['Material: Mild Steel', 'Thickness: 12-20mm', 'Finish: Powder Coating', 'Design: Custom Patterns']
    },
    {
      id: 'wrought-iron-security',
      title: 'Security Wrought Iron',
      category: 'Wrought Iron Work',
      description: 'Heavy-duty security gates and barriers with decorative elements.',
      image: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 1200, max: 5000 },
      priceNGN: { min: 1920000, max: 8000000 },
      duration: '2-4 weeks',
      complexity: 'Advanced',
      features: ['Security Features', 'Reinforced Structure', 'Advanced Locking', 'Anti-climb Design'],
      specifications: ['Material: High-tensile Steel', 'Thickness: 16-25mm', 'Security Rating: Class 3', 'Lock System: Multi-point']
    },
    {
      id: 'aluminum-windows',
      title: 'Aluminum Windows & Doors',
      category: 'Aluminum Works',
      description: 'Modern aluminum window and door installations for residential and commercial use.',
      image: 'https://images.pexels.com/photos/323645/pexels-photo-323645.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 300, max: 1500 },
      priceNGN: { min: 480000, max: 2400000 },
      duration: '1-2 weeks',
      complexity: 'Basic',
      features: ['Energy Efficient', 'Weather Sealing', 'Modern Hardware', 'Custom Sizing'],
      specifications: ['Profile: 6063-T5', 'Glass: Double Glazed', 'Hardware: European Standard', 'Thermal Break: Yes']
    },
    {
      id: 'aluminum-curtain-wall',
      title: 'Curtain Wall Systems',
      category: 'Aluminum Works',
      description: 'Advanced curtain wall systems for commercial buildings and high-rises.',
      image: 'https://images.pexels.com/photos/323645/pexels-photo-323645.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 8000, max: 25000 },
      priceNGN: { min: 12800000, max: 40000000 },
      duration: '4-8 weeks',
      complexity: 'Advanced',
      features: ['Structural Glazing', 'Weather Performance', 'Thermal Efficiency', 'Seismic Resistance'],
      specifications: ['System: Stick/Unitized', 'Glass: High Performance', 'Sealant: Structural', 'Wind Load: 2.5 kPa']
    },
    {
      id: 'security-fence-residential',
      title: 'Residential Security Fencing',
      category: 'Security Fence Systems',
      description: 'Chain link and security wire fencing for residential properties.',
      image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 15, max: 35 },
      priceNGN: { min: 24000, max: 56000 },
      duration: '3-7 days',
      complexity: 'Basic',
      features: ['Chain Link Mesh', 'Galvanized Posts', 'Security Wire Top', 'Gate Installation'],
      specifications: ['Height: 1.8-2.4m', 'Mesh: 50x50mm', 'Wire: 3.15mm', 'Posts: 60x60mm']
    },
    {
      id: 'security-fence-commercial',
      title: 'Commercial Security Perimeter',
      category: 'Security Fence Systems',
      description: 'High-security perimeter fencing for commercial and industrial facilities.',
      image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 25, max: 60 },
      priceNGN: { min: 40000, max: 96000 },
      duration: '1-2 weeks',
      complexity: 'Advanced',
      features: ['Anti-climb Mesh', 'Razor Wire', 'Detection Systems', 'Access Control'],
      specifications: ['Height: 2.4-4.0m', 'Security Rating: SR1-SR2', 'Detection: Optional', 'Access: Automated Gates']
    },
    {
      id: 'heavy-duty-gates-residential',
      title: 'Residential Heavy Duty Gates',
      category: 'Heavy Duty Gates & Doors',
      description: 'Quality heavy-duty gates for residential properties with security features.',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 800, max: 2500 },
      priceNGN: { min: 1280000, max: 4000000 },
      duration: '1-2 weeks',
      complexity: 'Intermediate',
      features: ['Automated Opening', 'Security Locks', 'Weather Resistant', 'Remote Control'],
      specifications: ['Material: Steel Frame', 'Motor: 24V DC', 'Weight Capacity: 400kg', 'Opening Speed: 12m/min']
    },
    {
      id: 'heavy-duty-gates-industrial',
      title: 'Industrial Heavy Duty Gates',
      category: 'Heavy Duty Gates & Doors',
      description: 'Industrial-grade gates and doors for factories and commercial facilities.',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 3000, max: 12000 },
      priceNGN: { min: 4800000, max: 19200000 },
      duration: '2-4 weeks',
      complexity: 'Advanced',
      features: ['Heavy Duty Motors', 'Safety Systems', 'Access Control', 'Emergency Override'],
      specifications: ['Material: Reinforced Steel', 'Motor: 3-phase', 'Weight Capacity: 2000kg', 'Safety: Photocells & Loops']
    },
    {
      id: 'car-park-basic',
      title: 'Basic Car Park Structure',
      category: 'Car Park Installation',
      description: 'Simple covered car park structures for residential and small commercial use.',
      image: 'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 1500, max: 5000 },
      priceNGN: { min: 2400000, max: 8000000 },
      duration: '1-3 weeks',
      complexity: 'Basic',
      features: ['Steel Frame Structure', 'Roofing System', 'Concrete Foundation', 'Basic Drainage'],
      specifications: ['Capacity: 2-10 cars', 'Height: 2.5m clearance', 'Roofing: Metal Sheets', 'Foundation: Concrete Pads']
    },
    {
      id: 'car-park-multi-level',
      title: 'Multi-Level Car Park',
      category: 'Car Park Installation',
      description: 'Advanced multi-level car park systems for commercial and institutional use.',
      image: 'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      priceUSD: { min: 25000, max: 100000 },
      priceNGN: { min: 40000000, max: 160000000 },
      duration: '8-16 weeks',
      complexity: 'Advanced',
      features: ['Multi-Level Design', 'Ramp Systems', 'Lighting & Ventilation', 'Fire Safety Systems'],
      specifications: ['Capacity: 50-500 cars', 'Levels: 2-6 floors', 'Ramp Grade: 1:7', 'Load: 2.5 kN/m²']
    }
  ];

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'Basic': return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'Intermediate': return 'bg-yellow-600/20 text-yellow-400 border-yellow-500/30';
      case 'Advanced': return 'bg-red-600/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const formatPrice = (price: number, currency: 'USD' | 'NGN') => {
    if (currency === 'USD') {
      return `$${price.toLocaleString()}`;
    } else {
      return `₦${price.toLocaleString()}`;
    }
  };

  return (
    <section id="work-profiles" className="py-20 bg-gradient-to-br from-black via-gray-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Work Profiles & Pricing
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed mb-8">
            Detailed profiles of all our services with transparent pricing in both USD and NGN currencies
          </p>
          
          {/* Currency Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-gray-800 p-1 rounded-lg border border-gray-700">
              <button
                onClick={() => setSelectedCurrency('USD')}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                  selectedCurrency === 'USD' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                USD ($)
              </button>
              <button
                onClick={() => setSelectedCurrency('NGN')}
                className={`px-6 py-2 rounded-md font-semibold transition-all duration-200 ${
                  selectedCurrency === 'NGN' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:text-blue-400'
                }`}
              >
                NGN (₦)
              </button>
            </div>
          </div>
        </div>

        {/* Work Profiles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {workProfiles.map((work) => (
            <div
              key={work.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
            >
              {/* Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={work.image}
                  alt={work.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getComplexityColor(work.complexity)}`}>
                    {work.complexity}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="mb-4">
                  <span className="text-sm text-blue-400 font-medium">{work.category}</span>
                  <h3 className="text-xl font-bold text-white mt-1">{work.title}</h3>
                </div>

                <p className="text-gray-300 text-sm mb-4 leading-relaxed">{work.description}</p>

                {/* Pricing */}
                <div className="bg-gray-700/50 p-4 rounded-lg mb-4 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Price Range</span>
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="text-2xl font-bold text-white">
                    {selectedCurrency === 'USD' 
                      ? `${formatPrice(work.priceUSD.min, 'USD')} - ${formatPrice(work.priceUSD.max, 'USD')}`
                      : `${formatPrice(work.priceNGN.min, 'NGN')} - ${formatPrice(work.priceNGN.max, 'NGN')}`
                    }
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-300">
                    <Clock className="h-4 w-4 mr-1" />
                    <span>{work.duration}</span>
                  </div>
                </div>

                {/* Features */}
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-white mb-2">Key Features</h4>
                  <div className="space-y-1">
                    {work.features.slice(0, 3).map((feature, index) => (
                      <div key={index} className="flex items-center text-sm text-gray-300">
                        <CheckCircle className="h-3 w-3 text-green-400 mr-2 flex-shrink-0" />
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedWork(work)}
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300"
                  >
                    View Details
                  </button>
                  <button className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300">
                    Get Quote
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Modal */}
        {selectedWork && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-bold text-white">{selectedWork.title}</h3>
                    <p className="text-blue-400 font-medium">{selectedWork.category}</p>
                  </div>
                  <button
                    onClick={() => setSelectedWork(null)}
                    className="text-gray-400 hover:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Image and Basic Info */}
                  <div>
                    <img
                      src={selectedWork.image}
                      alt={selectedWork.title}
                      className="w-full h-64 object-cover rounded-lg mb-4 border border-gray-700"
                    />
                    <p className="text-gray-300 leading-relaxed">{selectedWork.description}</p>
                  </div>

                  {/* Detailed Information */}
                  <div className="space-y-6">
                    {/* Pricing */}
                    <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                      <h4 className="text-lg font-semibold text-white mb-4">Pricing Information</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-300 mb-1">USD Price Range</p>
                          <p className="text-xl font-bold text-white">
                            ${selectedWork.priceUSD.min.toLocaleString()} - ${selectedWork.priceUSD.max.toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-300 mb-1">NGN Price Range</p>
                          <p className="text-xl font-bold text-white">
                            ₦{selectedWork.priceNGN.min.toLocaleString()} - ₦{selectedWork.priceNGN.max.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <div className="mt-4 flex items-center text-sm text-gray-300">
                        <Clock className="h-4 w-4 mr-2" />
                        <span>Duration: {selectedWork.duration}</span>
                      </div>
                    </div>

                    {/* Features */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Features Included</h4>
                      <div className="space-y-2">
                        {selectedWork.features.map((feature, index) => (
                          <div key={index} className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-green-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-300">{feature}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Specifications */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Technical Specifications</h4>
                      <div className="space-y-2">
                        {selectedWork.specifications.map((spec, index) => (
                          <div key={index} className="flex items-center">
                            <Award className="h-4 w-4 text-blue-400 mr-3 flex-shrink-0" />
                            <span className="text-gray-300">{spec}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4 pt-4">
                      <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                        Request Quote
                      </button>
                      <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300">
                        Start Project
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkProfiles;