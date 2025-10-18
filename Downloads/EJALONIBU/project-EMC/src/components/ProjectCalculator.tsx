import React, { useState, useEffect } from 'react';
import { Calculator, ArrowLeft, Download, Share2, Save } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCurrency } from '../contexts/CurrencyContext';
import toast from 'react-hot-toast';

interface ProjectSpecs {
  category: string;
  type: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
  };
  material: string;
  finish: string;
  complexity: 'basic' | 'intermediate' | 'advanced';
  quantity: number;
  additionalFeatures: string[];
  location: string;
  urgency: 'standard' | 'urgent' | 'emergency';
}

const ProjectCalculator = () => {
  const { formatPrice, convertPrice } = useCurrency();
  const [currentStep, setCurrentStep] = useState(1);
  const [specs, setSpecs] = useState<ProjectSpecs>({
    category: '',
    type: '',
    dimensions: { length: 0, width: 0, height: 0 },
    material: '',
    finish: '',
    complexity: 'basic',
    quantity: 1,
    additionalFeatures: [],
    location: '',
    urgency: 'standard'
  });
  const [estimate, setEstimate] = useState<number>(0);
  const [breakdown, setBreakdown] = useState<any>({});

  const categories = [
    {
      id: 'metal-construction',
      name: 'Metal Construction Works',
      types: ['Structural Framework', 'Industrial Building', 'Warehouse Structure', 'Custom Framework'],
      basePrice: 2500,
      materials: ['Mild Steel', 'Stainless Steel', 'Galvanized Steel', 'High-tensile Steel']
    },
    {
      id: 'wrought-iron',
      name: 'Wrought Iron Work',
      types: ['Decorative Gates', 'Security Gates', 'Railings', 'Window Grilles', 'Artistic Elements'],
      basePrice: 800,
      materials: ['Mild Steel', 'Cast Iron', 'Wrought Iron', 'Galvanized Steel']
    },
    {
      id: 'aluminum',
      name: 'Aluminum Works',
      types: ['Windows', 'Doors', 'Curtain Wall', 'Storefront', 'Custom Profiles'],
      basePrice: 300,
      materials: ['6063-T5 Aluminum', '6061-T6 Aluminum', 'Anodized Aluminum', 'Powder Coated Aluminum']
    },
    {
      id: 'security-fence',
      name: 'Security Fence Systems',
      types: ['Chain Link Fence', 'Security Mesh', 'Perimeter Fence', 'Anti-climb Fence'],
      basePrice: 25,
      materials: ['Galvanized Steel', 'PVC Coated Steel', 'Stainless Steel', 'High-tensile Wire']
    },
    {
      id: 'gates-doors',
      name: 'Heavy Duty Gates & Doors',
      types: ['Sliding Gates', 'Swing Gates', 'Barrier Gates', 'Industrial Doors'],
      basePrice: 1200,
      materials: ['Steel Frame', 'Aluminum Frame', 'Reinforced Steel', 'Composite Materials']
    },
    {
      id: 'car-park',
      name: 'Car Park Installation',
      types: ['Single Level', 'Multi-Level', 'Covered Parking', 'Underground Parking'],
      basePrice: 5000,
      materials: ['Steel Structure', 'Concrete & Steel', 'Aluminum Frame', 'Hybrid Materials']
    }
  ];

  const finishes = [
    { id: 'primer', name: 'Primer Only', multiplier: 1.0 },
    { id: 'paint', name: 'Paint Finish', multiplier: 1.1 },
    { id: 'powder-coating', name: 'Powder Coating', multiplier: 1.3 },
    { id: 'galvanizing', name: 'Hot-dip Galvanizing', multiplier: 1.5 },
    { id: 'anodizing', name: 'Anodizing', multiplier: 1.4 },
    { id: 'custom', name: 'Custom Finish', multiplier: 1.6 }
  ];

  const additionalFeatures = [
    { id: 'automation', name: 'Automation System', price: 800 },
    { id: 'security', name: 'Security Features', price: 500 },
    { id: 'lighting', name: 'Integrated Lighting', price: 300 },
    { id: 'access-control', name: 'Access Control', price: 600 },
    { id: 'remote-control', name: 'Remote Control', price: 200 },
    { id: 'safety-sensors', name: 'Safety Sensors', price: 400 },
    { id: 'weatherproofing', name: 'Weather Protection', price: 250 },
    { id: 'custom-design', name: 'Custom Design', price: 1000 }
  ];

  const complexityMultipliers = {
    basic: 1.0,
    intermediate: 1.4,
    advanced: 1.8
  };

  const urgencyMultipliers = {
    standard: 1.0,
    urgent: 1.3,
    emergency: 1.6
  };

  const locationMultipliers: { [key: string]: number } = {
    'Lagos': 1.0,
    'Abuja': 1.1,
    'Port Harcourt': 1.05,
    'Kano': 1.15,
    'Ibadan': 1.08,
    'Other': 1.2
  };

  useEffect(() => {
    calculateEstimate();
  }, [specs]);

  const calculateEstimate = () => {
    const category = categories.find(c => c.id === specs.category);
    if (!category) return;

    let basePrice = category.basePrice;
    
    // Calculate area/volume based on category
    let area = specs.dimensions.length * specs.dimensions.width;
    if (specs.category === 'metal-construction' || specs.category === 'car-park') {
      area = area * specs.dimensions.height; // Volume for 3D structures
    }
    
    // Base calculation
    let total = basePrice * area * specs.quantity;
    
    // Apply multipliers
    total *= complexityMultipliers[specs.complexity];
    total *= urgencyMultipliers[specs.urgency];
    total *= locationMultipliers[specs.location] || 1.2;
    
    // Apply finish multiplier
    const finish = finishes.find(f => f.id === specs.finish);
    if (finish) {
      total *= finish.multiplier;
    }
    
    // Add additional features
    const featuresTotal = specs.additionalFeatures.reduce((sum, featureId) => {
      const feature = additionalFeatures.find(f => f.id === featureId);
      return sum + (feature ? feature.price : 0);
    }, 0);
    
    total += featuresTotal * specs.quantity;
    
    setEstimate(total);
    
    // Create breakdown
    setBreakdown({
      basePrice: basePrice * area * specs.quantity,
      complexity: (basePrice * area * specs.quantity) * (complexityMultipliers[specs.complexity] - 1),
      urgency: (basePrice * area * specs.quantity) * (urgencyMultipliers[specs.urgency] - 1),
      location: (basePrice * area * specs.quantity) * ((locationMultipliers[specs.location] || 1.2) - 1),
      finish: (basePrice * area * specs.quantity) * ((finish?.multiplier || 1) - 1),
      features: featuresTotal * specs.quantity,
      total: total
    });
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveEstimate = () => {
    const estimateData = {
      specs,
      estimate,
      breakdown,
      timestamp: new Date().toISOString()
    };
    
    const savedEstimates = JSON.parse(localStorage.getItem('emc_estimates') || '[]');
    savedEstimates.push(estimateData);
    localStorage.setItem('emc_estimates', JSON.stringify(savedEstimates));
    
    toast.success('Estimate saved successfully!');
  };

  const downloadEstimate = () => {
    const estimateText = `
EMC Ejalonibu Metal and Aluminium Works - Project Estimate

Category: ${specs.category}
Type: ${specs.type}
Dimensions: ${specs.dimensions.length}m x ${specs.dimensions.width}m x ${specs.dimensions.height}m
Material: ${specs.material}
Finish: ${specs.finish}
Complexity: ${specs.complexity}
Quantity: ${specs.quantity}
Location: ${specs.location}
Urgency: ${specs.urgency}

COST BREAKDOWN:
Base Price: ${formatPrice(breakdown.basePrice)}
Complexity: ${formatPrice(breakdown.complexity)}
Urgency: ${formatPrice(breakdown.urgency)}
Location: ${formatPrice(breakdown.location)}
Finish: ${formatPrice(breakdown.finish)}
Features: ${formatPrice(breakdown.features)}

TOTAL ESTIMATE: ${formatPrice(estimate)}

Generated on: ${new Date().toLocaleDateString()}
Valid for: 30 days

Contact EMC Ejalonibu Metal and Aluminium Works:
Phone: +234 (0) 123 456 7890
Email: info@ejalonibumetalworks.com
    `;

    const blob = new Blob([estimateText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `EMC_Ejalonibu_Estimate_${Date.now()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const shareEstimate = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'EMC Ejalonibu Metal and Aluminium Works - Project Estimate',
          text: `Project estimate: ${formatPrice(estimate)} for ${specs.category}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('Error sharing:', error);
      }
    } else {
      // Fallback - copy to clipboard
      const shareText = `EMC Ejalonibu Metal and Aluminium Works Project Estimate: ${formatPrice(estimate)} for ${specs.category}. Get your quote at ${window.location.href}`;
      navigator.clipboard.writeText(shareText);
      toast.success('Estimate copied to clipboard!');
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Select Project Category</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {categories.map((category) => (
                <motion.button
                  key={category.id}
                  onClick={() => setSpecs({ ...specs, category: category.id, type: '' })}
                  className={`p-6 border-2 rounded-xl text-left transition-all duration-200 ${
                    specs.category === category.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="font-semibold text-gray-900 mb-2">{category.name}</h4>
                  <p className="text-sm text-gray-600">Starting from {formatPrice(category.basePrice)}</p>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 2:
        const selectedCategory = categories.find(c => c.id === specs.category);
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Select Project Type</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {selectedCategory?.types.map((type) => (
                <motion.button
                  key={type}
                  onClick={() => setSpecs({ ...specs, type })}
                  className={`p-4 border-2 rounded-xl text-left transition-all duration-200 ${
                    specs.type === type
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h4 className="font-semibold text-gray-900">{type}</h4>
                </motion.button>
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Project Specifications</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Dimensions (meters)
                </label>
                <div className="space-y-3">
                  <input
                    type="number"
                    placeholder="Length"
                    value={specs.dimensions.length || ''}
                    onChange={(e) => setSpecs({
                      ...specs,
                      dimensions: { ...specs.dimensions, length: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Width"
                    value={specs.dimensions.width || ''}
                    onChange={(e) => setSpecs({
                      ...specs,
                      dimensions: { ...specs.dimensions, width: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Height"
                    value={specs.dimensions.height || ''}
                    onChange={(e) => setSpecs({
                      ...specs,
                      dimensions: { ...specs.dimensions, height: parseFloat(e.target.value) || 0 }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Material</label>
                  <select
                    value={specs.material}
                    onChange={(e) => setSpecs({ ...specs, material: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select Material</option>
                    {selectedCategory?.materials.map((material) => (
                      <option key={material} value={material}>{material}</option>
                    ))}
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={specs.quantity}
                    onChange={(e) => setSpecs({ ...specs, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Complexity</label>
                  <select
                    value={specs.complexity}
                    onChange={(e) => setSpecs({ ...specs, complexity: e.target.value as any })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="basic">Basic</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Finish & Features</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Finish Type</label>
                <div className="space-y-2">
                  {finishes.map((finish) => (
                    <label key={finish.id} className="flex items-center space-x-3">
                      <input
                        type="radio"
                        name="finish"
                        value={finish.id}
                        checked={specs.finish === finish.id}
                        onChange={(e) => setSpecs({ ...specs, finish: e.target.value })}
                        className="text-blue-600"
                      />
                      <span className="text-gray-700">{finish.name}</span>
                      <span className="text-sm text-gray-500">({(finish.multiplier * 100 - 100).toFixed(0)}% extra)</span>
                    </label>
                  ))}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Additional Features</label>
                <div className="space-y-2">
                  {additionalFeatures.map((feature) => (
                    <label key={feature.id} className="flex items-center space-x-3">
                      <input
                        type="checkbox"
                        checked={specs.additionalFeatures.includes(feature.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSpecs({
                              ...specs,
                              additionalFeatures: [...specs.additionalFeatures, feature.id]
                            });
                          } else {
                            setSpecs({
                              ...specs,
                              additionalFeatures: specs.additionalFeatures.filter(f => f !== feature.id)
                            });
                          }
                        }}
                        className="text-blue-600"
                      />
                      <span className="text-gray-700">{feature.name}</span>
                      <span className="text-sm text-gray-500">+{formatPrice(feature.price)}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Location & Timeline</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Location</label>
                <select
                  value={specs.location}
                  onChange={(e) => setSpecs({ ...specs, location: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select Location</option>
                  <option value="Lagos">Lagos</option>
                  <option value="Abuja">Abuja</option>
                  <option value="Port Harcourt">Port Harcourt</option>
                  <option value="Kano">Kano</option>
                  <option value="Ibadan">Ibadan</option>
                  <option value="Other">Other Location</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Project Urgency</label>
                <select
                  value={specs.urgency}
                  onChange={(e) => setSpecs({ ...specs, urgency: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="standard">Standard (No rush)</option>
                  <option value="urgent">Urgent (+30%)</option>
                  <option value="emergency">Emergency (+60%)</option>
                </select>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-900">Project Estimate</h3>
            
            {/* Estimate Summary */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <div className="text-center mb-6">
                <h4 className="text-3xl font-bold text-blue-900">{formatPrice(estimate)}</h4>
                <p className="text-gray-600">Total Project Estimate</p>
              </div>
              
              {/* Cost Breakdown */}
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Base Price:</span>
                  <span className="font-semibold">{formatPrice(breakdown.basePrice)}</span>
                </div>
                {breakdown.complexity > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Complexity ({specs.complexity}):</span>
                    <span className="font-semibold">+{formatPrice(breakdown.complexity)}</span>
                  </div>
                )}
                {breakdown.urgency > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Urgency ({specs.urgency}):</span>
                    <span className="font-semibold">+{formatPrice(breakdown.urgency)}</span>
                  </div>
                )}
                {breakdown.location > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Location ({specs.location}):</span>
                    <span className="font-semibold">+{formatPrice(breakdown.location)}</span>
                  </div>
                )}
                {breakdown.finish > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Finish:</span>
                    <span className="font-semibold">+{formatPrice(breakdown.finish)}</span>
                  </div>
                )}
                {breakdown.features > 0 && (
                  <div className="flex justify-between">
                    <span className="text-gray-700">Additional Features:</span>
                    <span className="font-semibold">+{formatPrice(breakdown.features)}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-blue-900">{formatPrice(estimate)}</span>
                </div>
              </div>
            </div>

            {/* Project Summary */}
            <div className="bg-gray-50 p-6 rounded-xl">
              <h4 className="font-semibold text-gray-900 mb-4">Project Summary</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Category:</span>
                  <span className="ml-2 font-medium">{specs.category}</span>
                </div>
                <div>
                  <span className="text-gray-600">Type:</span>
                  <span className="ml-2 font-medium">{specs.type}</span>
                </div>
                <div>
                  <span className="text-gray-600">Dimensions:</span>
                  <span className="ml-2 font-medium">
                    {specs.dimensions.length}×{specs.dimensions.width}×{specs.dimensions.height}m
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Material:</span>
                  <span className="ml-2 font-medium">{specs.material}</span>
                </div>
                <div>
                  <span className="text-gray-600">Quantity:</span>
                  <span className="ml-2 font-medium">{specs.quantity}</span>
                </div>
                <div>
                  <span className="text-gray-600">Location:</span>
                  <span className="ml-2 font-medium">{specs.location}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4">
              <button
                onClick={saveEstimate}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Save className="h-5 w-5" />
                <span>Save Estimate</span>
              </button>
              
              <button
                onClick={downloadEstimate}
                className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Download className="h-5 w-5" />
                <span>Download PDF</span>
              </button>
              
              <button
                onClick={shareEstimate}
                className="flex items-center space-x-2 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                <Share2 className="h-5 w-5" />
                <span>Share</span>
              </button>
            </div>

            {/* Disclaimer */}
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <p className="text-sm text-yellow-800">
                <strong>Note:</strong> This is an estimated cost based on the specifications provided. 
                Final pricing may vary based on site conditions, material availability, and detailed engineering requirements. 
                Contact us for a detailed quote and site assessment.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Calculator className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Project Calculator</h1>
          </div>
          <p className="text-gray-600">Get an instant estimate for your metal construction project</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Step {currentStep} of 6</span>
            <span className="text-sm text-gray-600">{Math.round((currentStep / 6) * 100)}% Complete</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 6) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          {renderStep()}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center space-x-2 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              <span>Previous</span>
            </button>

            {currentStep < 6 ? (
              <button
                onClick={handleNext}
                disabled={
                  (currentStep === 1 && !specs.category) ||
                  (currentStep === 2 && !specs.type) ||
                  (currentStep === 3 && (!specs.dimensions.length || !specs.dimensions.width || !specs.material)) ||
                  (currentStep === 4 && !specs.finish) ||
                  (currentStep === 5 && !specs.location)
                }
                className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Next Step
              </button>
            ) : (
              <button
                onClick={() => window.location.href = '/#contact'}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
              >
                Request Official Quote
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCalculator;