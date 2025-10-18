import React from 'react';
import { Wrench, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';

const Footer = () => {
  const services = [
    'Metal Construction Works',
    'Wrought Iron Work',
    'Aluminum Works',
    'Security Fence Systems',
    'Heavy Duty Gates & Doors',
    'Car Park Installation',
  ];

  const quickLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Work Profiles', href: '#work-profiles' },
    { name: 'Our Team', href: '#workers-profiles' },
    { name: 'About Us', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Payment', href: '#payment' },
    { name: 'Contact', href: '#contact' },
  ];

  const socialLinks = [
    { icon: Facebook, href: '#', label: 'Facebook' },
    { icon: Twitter, href: '#', label: 'Twitter' },
    { icon: Instagram, href: '#', label: 'Instagram' },
    { icon: Linkedin, href: '#', label: 'LinkedIn' },
  ];

  return (
    <footer className="bg-gradient-to-br from-black via-gray-900 to-blue-900 text-white border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-6">
            <div className="flex items-center space-x-3">
              <div className="bg-orange-600 p-2 rounded-lg">
                <Wrench className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold">EMC Ejalonibu</h3>
                <p className="text-sm text-gray-400">EMC Ejalonibu Metal and Aluminium Works LTD</p>
              </div>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Professional metal fabrication and construction services with over 15 years of experience 
              delivering quality craftsmanship across Nigeria.
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  aria-label={social.label}
                  className="bg-gray-800 hover:bg-orange-600 p-2 rounded-lg transition-colors duration-300 border border-gray-700"
                >
                  <social.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Our Services</h4>
            <ul className="space-y-3">
              {services.map((service, index) => (
                <li key={index}>
                  <a
                    href="#services"
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    {service}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.href} 
                    className="text-gray-300 hover:text-orange-400 transition-colors duration-200"
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6">Contact Info</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <Phone className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">+234 80 5546 0603</p>
                  <p className="text-gray-300">+234 80 3786 1879</p>
                  <p className="text-gray-300">+234 80 2450 9293</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <Mail className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">ejaoladimejimetalswork@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-5 w-5 text-orange-400 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-gray-300">Plot No. R14 Kuji layout, kuje area council.</p>
                  <p className="text-gray-300">Abuja, Nigeria</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © 2025 EMC Ejalonibu Metal and Aluminium Works LTD. All rights reserved.
          </p>
          <p className="text-gray-400 text-sm">
            Built & designed with ❤️ by HymaanTECH
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-gray-400 hover:text-orange-400 text-sm transition-colors duration-200">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;