import React from 'react';
import { ArrowRight, CheckCircle, DollarSign } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import toast from 'react-hot-toast';

const Services = () => {
  const { formatPrice, convertPrice } = useCurrency();

  const handleGetQuote = (serviceTitle: string, serviceCategory: string) => {
    // Create a quote request form data
    const quoteData = {
      serviceCategory: serviceCategory.toLowerCase().replace(/\s+/g, '-'),
      serviceType: serviceTitle,
      timestamp: new Date().toISOString()
    };
    
    // Store in localStorage for the quote form
    localStorage.setItem('quote_prefill', JSON.stringify(quoteData));
    
    // Navigate to contact section with quote intent
    const contactSection = document.getElementById('contact');
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: 'smooth' });
      toast.success(`Quote request prepared for ${serviceTitle}`);
    }
  };

  const services = [
    {
      title: 'Metal Construction Works',
      description: 'Professional structural metalwork including buildings, frameworks, and industrial constructions with precision engineering.',
      image: 'https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Structural Steel Work', 'Industrial Buildings', 'Metal Frameworks', 'Custom Fabrication'],
      priceRange: { min: 2500, max: 50000 },
      category: 'metal-construction'
    },
    {
      title: 'Wrought Iron Work',
      description: 'Elegant and durable wrought iron gates, railings, decorative elements, and custom artistic metalwork.',
      image: 'https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Decorative Gates', 'Stair Railings', 'Window Grilles', 'Artistic Designs'],
      priceRange: { min: 800, max: 5000 },
      category: 'wrought-iron'
    },
    {
      title: 'Aluminum Works',
      description: 'Modern aluminum installations including windows, doors, curtain walls, and architectural elements.',
      image: 'https://images.pexels.com/photos/323645/pexels-photo-323645.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Aluminum Windows', 'Curtain Wall Systems', 'Storefront Installation', 'Custom Profiles'],
      priceRange: { min: 300, max: 25000 },
      category: 'aluminum-works'
    },
    {
      title: 'Security Fence Systems',
      description: 'Sales and professional installation of American security fence wires and perimeter protection systems.',
      image: 'https://images.pexels.com/photos/1098982/pexels-photo-1098982.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Chain Link Fencing', 'Security Wire Installation', 'Perimeter Protection', 'Gate Automation'],
      priceRange: { min: 15, max: 60 },
      category: 'security-fence'
    },
    {
      title: 'Heavy Duty Gates & Doors',
      description: 'Professional installation of heavy duty quality gates and doors for industrial, commercial, and residential applications.',
      image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Industrial Gates', 'Security Doors', 'Automated Systems', 'Custom Hardware'],
      priceRange: { min: 800, max: 12000 },
      category: 'heavy-duty-gates'
    },
    {
      title: 'Car Park Installation',
      description: 'Complete car park construction and installation services including metal structures, roofing, and parking solutions.',
      image: 'https://images.pexels.com/photos/753876/pexels-photo-753876.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop',
      features: ['Metal Car Park Structures', 'Covered Parking Solutions', 'Multi-Level Parking', 'Drainage Systems'],
      priceRange: { min: 1500, max: 100000 },
      category: 'car-park-installation'
    },
  ];

  return (
    <section id="services" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Professional Services
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            We provide comprehensive metal fabrication and construction services with over 15 years of industry experience
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 group border border-gray-700"
            >
              <div className="relative h-64 overflow-hidden">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
              </div>
              
              <div className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                <p className="text-gray-300 mb-6 leading-relaxed">{service.description}</p>
                
                {/* Price Range */}
                <div className="bg-gray-700/50 p-4 rounded-lg mb-6 border border-gray-600">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-300">Price Range</span>
                    <DollarSign className="h-4 w-4 text-green-400" />
                  </div>
                  <div className="text-xl font-bold text-white">
                    {formatPrice(service.priceRange.min)} - {formatPrice(convertPrice(service.priceRange.max, 'USD'))}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">*Prices vary based on specifications</p>
                </div>

                <div className="space-y-3 mb-8">
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center space-x-3">
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="flex space-x-3">
                  <button 
                    onClick={() => handleGetQuote(service.title, service.category)}
                    className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
                  >
                    <DollarSign className="h-4 w-4" />
                    <span>Get Quote</span>
                  </button>
                  <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center space-x-2 group">
                    <span>Learn More</span>
                    <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;