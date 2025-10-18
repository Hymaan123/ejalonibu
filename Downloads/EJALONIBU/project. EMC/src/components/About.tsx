import React from 'react';
import { Award, Users, Clock, Shield } from 'lucide-react';

const About = () => {
  const stats = [
    { icon: Award, label: 'Years Experience', value: '20+' },
    { icon: Users, label: 'Projects Completed', value: '500+' },
    { icon: Clock, label: 'Expert Craftsmen', value: '25+' },
    { icon: Shield, label: 'Quality Guarantee', value: '100%' },
  ];

  return (
    <section id="about" className="py-20 bg-gradient-to-br from-black via-gray-900 to-blue-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              About EMC Ejalonibu Metal and Aluminium Works
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed">
              EMC Ejalonibu Metal and Aluminium Works LTD has been a leading name in metal fabrication and construction 
              for over 20 years, delivering exceptional quality and craftsmanship to clients across Nigeria.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div className="bg-orange-600/20 p-2 rounded-lg border border-orange-500/30">
                  <Award className="h-6 w-6 text-orange-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Expert Craftsmanship</h3>
                  <p className="text-gray-300">Our skilled artisans combine traditional techniques with modern technology for superior results.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-blue-600/20 p-2 rounded-lg border border-blue-500/30">
                  <Shield className="h-6 w-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Quality Materials</h3>
                  <p className="text-gray-300">We source only the finest materials to ensure durability and longevity in every project.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-green-600/20 p-2 rounded-lg border border-green-500/30">
                  <Clock className="h-6 w-6 text-green-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Timely Delivery</h3>
                  <p className="text-gray-300">We pride ourselves on completing projects on schedule without compromising quality.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <img
              src="https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&fit=crop"
              alt="Metal construction work"
              className="rounded-xl shadow-2xl border border-gray-700"
            />
            <div className="absolute -bottom-6 -left-6 bg-gradient-to-r from-orange-600 to-orange-700 text-white p-6 rounded-xl border border-orange-500/30">
              <p className="text-2xl font-bold">20+</p>
              <p className="text-sm">Years of Excellence</p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-4 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-4 border border-gray-700">
                <stat.icon className="h-8 w-8 text-blue-400" />
              </div>
              <p className="text-3xl font-bold text-white mb-2">{stat.value}</p>
              <p className="text-gray-300">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;