import React, { useState } from 'react';
import { Menu, X, Wrench, Calculator, MapPin, User, Calendar, Shield, Settings, UserCog } from 'lucide-react';
import { useCurrency } from '../contexts/CurrencyContext';
import { useAuth } from '../contexts/AuthContext';
import EMCLogo from './sliver-nobackground.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showCurrencyMenu, setShowCurrencyMenu] = useState(false);
  const [showToolsMenu, setShowToolsMenu] = useState(false);
  const { currency, setCurrency, exchangeRate } = useCurrency();
  const { user, isAuthenticated } = useAuth();

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'Services', href: '#services' },
    { name: 'Work Profiles', href: '#work-profiles' },
    { name: 'Our Team', href: '#workers-profiles' },
    { name: 'About', href: '#about' },
    { name: 'Gallery', href: '#gallery' },
    { name: 'Payment', href: '#payment' },
    { name: 'Contact', href: '#contact' },
  ];

  const tools = [
    { name: 'Project Calculator', href: '/calculator', icon: Calculator },
    { name: 'Project Tracker', href: '/tracker', icon: MapPin },
    { name: 'Customer Portal', href: '/portal', icon: User },
    { name: 'Virtual Consultation', href: '/consultation', icon: Calendar },
    { name: 'Quality Assurance', href: '/quality', icon: Shield },
    { name: 'Maintenance Scheduling', href: '/maintenance', icon: Settings },
    ...(user?.role === 'admin' ? [{ name: 'Admin Dashboard', href: '/admin', icon: UserCog }] : []),
  ];

  return (
    <header className="bg-gradient-to-r from-gray-900 via-blue-900 to-black shadow-lg fixed w-full top-0 z-50 border-b border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <img
              src={EMCLogo}
              alt="EMC Ejalonibu Logo"
              className="h-14 w-14 md:h-16 md:w-16 object-cover"
              style={{ imageRendering: 'auto' }}
            />
            <div>
              {/* <h1 className="text-2xl md:text-3xl font-extrabold text-white drop-shadow-md tracking-wide">EMC</h1> */}
              {/* <p className="text-sm text-gray-200 font-medium">Eja Oladimeji Metal Works LTD</p> */}
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* Desktop Controls */}
          <div className="hidden lg:flex items-center space-x-4">
            {/* Tools Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowToolsMenu(!showToolsMenu)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                <Calculator className="h-4 w-4" />
                <span>Tools</span>
              </button>
              
              {showToolsMenu && (
                <div className="absolute right-0 mt-2 w-64 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                  {tools.map((tool) => (
                    <a
                      key={tool.name}
                      href={tool.href}
                      className="flex items-center space-x-3 px-4 py-3 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                      onClick={() => setShowToolsMenu(false)}
                    >
                      <tool.icon className="h-4 w-4 text-blue-400" />
                      <span>{tool.name}</span>
                    </a>
                  ))}
                </div>
              )}
            </div>

            {/* Currency Selector */}
            <div className="relative">
              <button
                onClick={() => setShowCurrencyMenu(!showCurrencyMenu)}
                className="flex items-center space-x-2 text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                <span>{currency}</span>
              </button>
              
              {showCurrencyMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg border border-gray-700 py-2 z-50">
                  <button
                    onClick={() => {
                      setCurrency('USD');
                      setShowCurrencyMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-700 transition-colors ${
                      currency === 'USD' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    <span>USD ($)</span>
                    {currency === 'USD' && <span>✓</span>}
                  </button>
                  <button
                    onClick={() => {
                      setCurrency('NGN');
                      setShowCurrencyMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-2 text-sm text-left hover:bg-gray-700 transition-colors ${
                      currency === 'NGN' ? 'bg-blue-600/20 text-blue-400' : 'text-gray-300'
                    }`}
                  >
                    <span>NGN (₦)</span>
                    {currency === 'NGN' && <span>✓</span>}
                  </button>
                  <div className="border-t border-gray-700 mt-2 pt-2 px-4">
                    <p className="text-xs text-gray-400">
                      Rate: 1 USD = ₦{exchangeRate.toFixed(0)}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* User Account */}
            {isAuthenticated ? (
              <div className="flex items-center space-x-3">
                <a
                  href="/portal"
                  className="flex items-center space-x-2 bg-blue-600/20 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-600/30 transition-colors border border-blue-500/30"
                >
                  <User className="h-4 w-4" />
                  <span>{user?.name?.split(' ')[0]}</span>
                </a>
                {user?.role === 'admin' && (
                  <a
                    href="/admin"
                    className="flex items-center space-x-2 bg-purple-600/20 text-purple-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-600/30 transition-colors border border-purple-500/30"
                  >
                    <UserCog className="h-4 w-4" />
                    <span>Admin</span>
                  </a>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <a
                  href="/portal"
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors"
                >
                  Customer Login
                </a>
                <a
                  href="/admin-portal"
                  className="flex items-center space-x-2 bg-purple-600/20 text-purple-400 px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-600/30 transition-colors border border-purple-500/30"
                >
                  <Shield className="h-4 w-4" />
                  <span>Admin Portal</span>
                </a>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-300 hover:text-white focus:outline-none focus:text-white"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="lg:hidden pb-4">
            <nav className="flex flex-col space-y-2 mb-4">
              {navItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-gray-300 hover:text-white px-3 py-2 text-sm font-medium transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
            </nav>

            {/* Mobile Tools */}
            <div className="border-t border-gray-700 pt-4 mb-4">
              <h3 className="text-sm font-semibold text-white mb-2 px-3">Tools</h3>
              <div className="space-y-1">
                {tools.map((tool) => (
                  <a
                    key={tool.name}
                    href={tool.href}
                    className="flex items-center space-x-3 px-3 py-2 text-sm text-gray-300 hover:bg-gray-700 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <tool.icon className="h-4 w-4 text-blue-400" />
                    <span>{tool.name}</span>
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Controls */}
            <div className="border-t border-gray-700 pt-4 space-y-3">
              <div className="flex items-center justify-between px-3">
                <span className="text-sm font-medium text-gray-300">Currency</span>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as 'USD' | 'NGN')}
                  className="text-sm bg-gray-700 border border-gray-600 rounded px-2 py-1 text-white"
                >
                  <option value="USD">USD ($)</option>
                  <option value="NGN">NGN (₦)</option>
                </select>
              </div>

              {isAuthenticated ? (
                <div className="space-y-2">
                  <a
                    href="/portal"
                    className="flex items-center space-x-2 bg-blue-600/20 text-blue-400 px-3 py-2 rounded-lg text-sm font-medium mx-3 border border-blue-500/30"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <User className="h-4 w-4" />
                    <span>{user?.name}</span>
                  </a>
                  {user?.role === 'admin' && (
                    <a
                      href="/admin"
                      className="flex items-center space-x-2 bg-purple-600/20 text-purple-400 px-3 py-2 rounded-lg text-sm font-medium mx-3 border border-purple-500/30"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <UserCog className="h-4 w-4" />
                      <span>Admin Dashboard</span>
                    </a>
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <a
                    href="/portal"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded-lg text-sm font-medium mx-3 text-center block"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Customer Login
                  </a>
                  <a
                    href="/admin-portal"
                    className="flex items-center justify-center space-x-2 bg-purple-600/20 text-purple-400 px-3 py-2 rounded-lg text-sm font-medium mx-3 border border-purple-500/30"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Shield className="h-4 w-4" />
                    <span>Admin Portal</span>
                  </a>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;