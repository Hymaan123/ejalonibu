import { useMemo } from 'react';
import { ArrowRight, Phone, Mail } from 'lucide-react';

const Hero = () => {
  const sparkParticles = useMemo(() => (
    Array.from({ length: 25 }).map((_, i) => ({
      key: i,
      left: 20 + Math.random() * 60,
      top: 30 + Math.random() * 40,
      animationDelay: Math.random() * 3,
      animationDuration: 1 + Math.random() * 2
    }))
  ), []);

  const grindSparks = useMemo(() => (
    Array.from({ length: 15 }).map((_, i) => ({
      key: i,
      left: 30 + Math.random() * 40,
      top: 60 + Math.random() * 20,
      animationDelay: Math.random() * 4,
      animationDuration: 0.5 + Math.random() * 1,
      rotate: Math.random() * 360
    }))
  ), []);

  const metalParticles = useMemo(() => (
    Array.from({ length: 20 }).map((_, i) => ({
      key: i,
      left: 10 + Math.random() * 80,
      top: 20 + Math.random() * 60,
      animationDelay: Math.random() * 4,
      animationDuration: 2 + Math.random() * 3
    }))
  ), []);

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      {/* Animated Welding Background with Tools */}
      <div className="absolute inset-0">
        {/* Base welding workshop image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop)',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-blue-900/80 to-black/90"></div>
        </div>

        {/* Welder Tools Silhouettes */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {/* Welding Torch */}
          <div className="absolute top-1/4 left-1/6 w-16 h-4 bg-gray-300 rounded-full transform rotate-45 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/6 w-8 h-2 bg-gray-400 rounded-full transform rotate-45 translate-x-4"></div>
          
          {/* Welding Helmet */}
          <div className="absolute top-1/5 right-1/4 w-12 h-10 bg-gray-400 rounded-lg animate-pulse animation-delay-1000"></div>
          <div className="absolute top-1/5 right-1/4 w-8 h-6 bg-gray-600 rounded transform translate-x-2 translate-y-2"></div>
          
          {/* Angle Grinder */}
          <div className="absolute bottom-1/3 left-1/3 w-10 h-6 bg-gray-300 rounded animate-pulse animation-delay-2000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-gray-400 rounded-full transform translate-x-2"></div>
          
          {/* Welding Rods */}
          <div className="absolute top-2/3 right-1/3 w-1 h-16 bg-gray-300 animate-pulse"></div>
          <div className="absolute top-2/3 right-1/3 w-1 h-16 bg-gray-300 transform translate-x-2 animate-pulse animation-delay-1000"></div>
          <div className="absolute top-2/3 right-1/3 w-1 h-16 bg-gray-300 transform translate-x-4 animate-pulse animation-delay-2000"></div>
          
          {/* Welding Clamps */}
          <div className="absolute bottom-1/4 right-1/5 w-8 h-3 bg-gray-400 rounded animate-pulse animation-delay-1000"></div>
          <div className="absolute bottom-1/4 right-1/5 w-2 h-8 bg-gray-300 rounded transform translate-x-3 -translate-y-2"></div>
          
          {/* Metal Sheets */}
          <div className="absolute top-1/2 left-1/5 w-20 h-1 bg-gray-300 animate-pulse"></div>
          <div className="absolute top-1/2 left-1/5 w-20 h-1 bg-gray-400 transform translate-y-2 animate-pulse animation-delay-1000"></div>
          
          {/* Welding Cable */}
          <div className="absolute bottom-1/5 left-1/4 w-32 h-1 bg-gray-400 rounded-full animate-pulse transform rotate-12"></div>
          <div className="absolute bottom-1/5 left-1/4 w-24 h-1 bg-gray-300 rounded-full animate-pulse transform rotate-45 translate-x-8 animation-delay-1000"></div>
        </div>

        {/* Welding Sparks Animation */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Main welding light effect */}
          <div className="absolute top-1/3 left-1/4 w-32 h-32 bg-blue-400 rounded-full opacity-30 animate-pulse blur-xl"></div>
          <div className="absolute top-1/3 left-1/4 w-16 h-16 bg-white rounded-full opacity-60 animate-ping blur-lg"></div>
          
          {/* Secondary welding points */}
          <div className="absolute top-1/2 right-1/3 w-24 h-24 bg-orange-400 rounded-full opacity-25 animate-pulse blur-xl animation-delay-1000"></div>
          <div className="absolute bottom-1/3 left-1/2 w-20 h-20 bg-yellow-300 rounded-full opacity-20 animate-pulse blur-xl animation-delay-2000"></div>

          {/* Welding torch flame effect */}
          <div className="absolute top-1/4 left-1/6 w-8 h-8 bg-blue-300 rounded-full opacity-40 animate-pulse blur-md transform translate-x-8 translate-y-2"></div>
          <div className="absolute top-1/4 left-1/6 w-4 h-4 bg-white rounded-full opacity-70 animate-ping blur-sm transform translate-x-10 translate-y-3"></div>

          {/* Sparks particles */}
          {sparkParticles.map((p) => (
            <div
              key={p.key}
              className="absolute w-1 h-1 bg-orange-400 rounded-full animate-spark"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.animationDelay}s`,
                animationDuration: `${p.animationDuration}s`
              }}
            ></div>
          ))}

          {/* Metal grinding sparks */}
          {grindSparks.map((p, i) => (
            <div
              key={`grind-${i}`}
              className="absolute w-0.5 h-3 bg-yellow-300 rounded-full animate-spark"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.animationDelay}s`,
                animationDuration: `${p.animationDuration}s`,
                transform: `rotate(${p.rotate}deg)`
              }}
            ></div>
          ))}

          {/* Floating metal particles */}
          {metalParticles.map((p, i) => (
            <div
              key={`metal-${i}`}
              className="absolute w-0.5 h-0.5 bg-yellow-200 rounded-full animate-float"
              style={{
                left: `${p.left}%`,
                top: `${p.top}%`,
                animationDelay: `${p.animationDelay}s`,
                animationDuration: `${p.animationDuration}s`
              }}
            ></div>
          ))}

          {/* Welding arc glow */}
          <div className="absolute top-1/3 left-1/4 w-64 h-2 bg-gradient-to-r from-transparent via-blue-300 to-transparent opacity-40 animate-arc blur-sm"></div>
          <div className="absolute top-1/3 left-1/4 w-48 h-1 bg-gradient-to-r from-transparent via-white to-transparent opacity-60 animate-arc-bright"></div>
          
          {/* Grinding disc glow */}
          <div className="absolute bottom-1/3 left-1/3 w-12 h-12 bg-orange-300 rounded-full opacity-30 animate-pulse blur-lg animation-delay-2000"></div>
          <div className="absolute bottom-1/3 left-1/3 w-6 h-6 bg-yellow-200 rounded-full opacity-50 animate-ping blur-md animation-delay-2000"></div>
        </div>

        {/* Heat shimmer effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-orange-900/10 via-transparent to-blue-900/10 animate-shimmer"></div>
        
        {/* workshop atmosphere */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent via-gray-900/20 to-gray-900/40"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
          Professional Metal Construction
          <span className="block text-orange-400 animate-glow">& Fabrication Services</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed">
          EMC Ejalonibu Metal and Aluminium Works LTD - Your trusted partner for premium metal construction, 
          wrought iron work, aluminum installations, and security fencing solutions.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <button
            onClick={() => {
              const el = document.getElementById('services');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 flex items-center space-x-2 group shadow-lg hover:shadow-orange-500/25"
          >
            <span>View Our Services</span>
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
          </button>
          
          <button
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-300 shadow-lg"
          >
            Get Free Quote
          </button>
        </div>

        {/* Contact Info */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-white">
          <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
            <Phone className="h-5 w-5 text-orange-400" />
            <span className="text-lg">+234 80 5546 0603</span>
          </div>
          <div className="flex items-center space-x-2 bg-black/30 px-4 py-2 rounded-lg backdrop-blur-sm">
            <Mail className="h-5 w-5 text-orange-400" />
            <span className="text-lg">ejaoladimejimetalswork@gmail.com</span>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;