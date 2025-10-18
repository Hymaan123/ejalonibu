import React, { useState } from 'react';
import { User, FileText, CreditCard, Settings, Download, Eye, MessageSquare, Calendar, Bell, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

const CustomerPortal = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Customer Portal Login</h2>
          <LoginForm />
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', name: 'Dashboard', icon: User },
    { id: 'projects', name: 'My Projects', icon: FileText },
    { id: 'invoices', name: 'Invoices', icon: CreditCard },
    { id: 'documents', name: 'Documents', icon: Download },
    { id: 'messages', name: 'Messages', icon: MessageSquare },
    { id: 'settings', name: 'Settings', icon: Settings },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent user={user} />;
      case 'projects':
        return <ProjectsContent />;
      case 'invoices':
        return <InvoicesContent />;
      case 'documents':
        return <DocumentsContent />;
      case 'messages':
        return <MessagesContent />;
      case 'settings':
        return <SettingsContent user={user} />;
      default:
        return <DashboardContent user={user} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                {user?.avatar ? (
                  <img src={user.avatar} alt={user.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <User className="h-8 w-8 text-blue-600" />
                )}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name}</h1>
                <p className="text-gray-600">{user?.email}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 text-gray-600 hover:text-red-600 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-900'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <tab.icon className="h-5 w-5" />
                    <span>{tab.name}</span>
                  </button>
                ))}
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              {renderContent()}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

const LoginForm = () => {
  const { login } = useAuth();
  const [email, setEmail] = useState('demo@emcmetalworks.com');
  const [password, setPassword] = useState('demo123');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    const success = await login(email, password);
    if (!success) {
      alert('Invalid credentials. Use demo@emcmetalworks.com / demo123');
    }
    
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white py-2 rounded-lg font-semibold transition-colors"
      >
        {loading ? 'Logging in...' : 'Login'}
      </button>
      <p className="text-sm text-gray-600 text-center">
        Demo credentials: demo@emcmetalworks.com / demo123
      </p>
    </form>
  );
};

const DashboardContent = ({ user }: { user: any }) => {
  const stats = [
    { label: 'Active Projects', value: '3', color: 'bg-blue-100 text-blue-900' },
    { label: 'Completed Projects', value: '12', color: 'bg-green-100 text-green-900' },
    { label: 'Pending Invoices', value: '2', color: 'bg-yellow-100 text-yellow-900' },
    { label: 'Total Spent', value: '$45,000', color: 'bg-purple-100 text-purple-900' },
  ];

  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className={`w-12 h-12 rounded-lg ${stat.color} flex items-center justify-center mb-4`}>
              <span className="text-xl font-bold">{stat.value}</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{stat.label}</h3>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h3>
        <div className="space-y-4">
          {[
            { action: 'Project Update', description: 'Industrial Warehouse Framework - 65% complete', time: '2 hours ago' },
            { action: 'Invoice Generated', description: 'Invoice #INV-2024-003 for $8,500', time: '1 day ago' },
            { action: 'Message Received', description: 'New message from project manager', time: '2 days ago' },
            { action: 'Document Uploaded', description: 'Quality certificate for Villa Security Gates', time: '3 days ago' },
          ].map((activity, index) => (
            <div key={index} className="flex items-start space-x-4 p-4 bg-gray-50 rounded-lg">
              <div className="w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
              <div className="flex-1">
                <h4 className="font-semibold text-gray-900">{activity.action}</h4>
                <p className="text-gray-600 text-sm">{activity.description}</p>
                <p className="text-gray-500 text-xs mt-1">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ProjectsContent = () => {
  const projects = [
    {
      id: 'proj_001',
      name: 'Industrial Warehouse Framework',
      status: 'In Progress',
      progress: 65,
      startDate: '2024-01-15',
      estimatedCompletion: '2024-03-15',
      value: '$45,000'
    },
    {
      id: 'proj_002',
      name: 'Luxury Villa Security Gates',
      status: 'Quality Check',
      progress: 90,
      startDate: '2024-02-01',
      estimatedCompletion: '2024-02-28',
      value: '$8,500'
    },
    {
      id: 'proj_003',
      name: 'Office Complex Aluminum Windows',
      status: 'Completed',
      progress: 100,
      startDate: '2024-01-10',
      estimatedCompletion: '2024-02-10',
      value: '$25,000'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">My Projects</h3>
      <div className="space-y-4">
        {projects.map((project) => (
          <div key={project.id} className="border border-gray-200 rounded-lg p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h4 className="text-lg font-semibold text-gray-900">{project.name}</h4>
                <p className="text-gray-600">Project ID: {project.id}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                project.status === 'Completed' ? 'bg-green-100 text-green-800' :
                project.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                'bg-yellow-100 text-yellow-800'
              }`}>
                {project.status}
              </span>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Start Date</p>
                <p className="font-semibold">{project.startDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Est. Completion</p>
                <p className="font-semibold">{project.estimatedCompletion}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Project Value</p>
                <p className="font-semibold">{project.value}</p>
              </div>
            </div>
            
            <div className="mb-4">
              <div className="flex justify-between text-sm text-gray-600 mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="bg-blue-600 h-2 rounded-full"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                <Eye className="h-4 w-4" />
                <span>View Details</span>
              </button>
              <button className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors">
                <MessageSquare className="h-4 w-4" />
                <span>Message Team</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const InvoicesContent = () => {
  const invoices = [
    {
      id: 'INV-2024-003',
      project: 'Luxury Villa Security Gates',
      amount: '$8,500',
      status: 'Paid',
      date: '2024-02-25',
      dueDate: '2024-03-10'
    },
    {
      id: 'INV-2024-002',
      project: 'Office Complex Aluminum Windows',
      amount: '$25,000',
      status: 'Paid',
      date: '2024-02-08',
      dueDate: '2024-02-22'
    },
    {
      id: 'INV-2024-001',
      project: 'Industrial Warehouse Framework',
      amount: '$22,500',
      status: 'Pending',
      date: '2024-02-20',
      dueDate: '2024-03-05'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Invoices</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Invoice ID</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Project</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Amount</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Due Date</th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((invoice) => (
              <tr key={invoice.id} className="border-b border-gray-100">
                <td className="py-3 px-4 font-medium">{invoice.id}</td>
                <td className="py-3 px-4">{invoice.project}</td>
                <td className="py-3 px-4 font-semibold">{invoice.amount}</td>
                <td className="py-3 px-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    invoice.status === 'Paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
                <td className="py-3 px-4">{invoice.dueDate}</td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      <Download className="h-4 w-4" />
                    </button>
                    <button className="text-gray-600 hover:text-gray-800 text-sm">
                      <Eye className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const DocumentsContent = () => {
  const documents = [
    {
      name: 'Quality Certificate - Villa Gates',
      type: 'Certificate',
      date: '2024-02-25',
      size: '2.3 MB',
      format: 'PDF'
    },
    {
      name: 'Project Specifications - Warehouse',
      type: 'Specification',
      date: '2024-01-15',
      size: '1.8 MB',
      format: 'PDF'
    },
    {
      name: 'Warranty Document - Aluminum Windows',
      type: 'Warranty',
      date: '2024-02-08',
      size: '1.2 MB',
      format: 'PDF'
    },
    {
      name: 'Installation Manual - Security Gates',
      type: 'Manual',
      date: '2024-02-20',
      size: '3.1 MB',
      format: 'PDF'
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Documents</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {documents.map((doc, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <FileText className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{doc.name}</h4>
                  <p className="text-sm text-gray-600">{doc.type}</p>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between text-sm text-gray-600 mb-3">
              <span>{doc.date}</span>
              <span>{doc.size}</span>
            </div>
            <div className="flex space-x-2">
              <button className="flex items-center space-x-1 bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm transition-colors">
                <Download className="h-3 w-3" />
                <span>Download</span>
              </button>
              <button className="flex items-center space-x-1 border border-gray-300 hover:bg-gray-50 text-gray-700 px-3 py-1 rounded text-sm transition-colors">
                <Eye className="h-3 w-3" />
                <span>View</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const MessagesContent = () => {
  const messages = [
    {
      id: 1,
      from: 'Project Manager',
      subject: 'Warehouse Project Update',
      preview: 'The structural framework is now 65% complete...',
      date: '2024-02-20',
      unread: true
    },
    {
      id: 2,
      from: 'Quality Control',
      subject: 'Security Gates Quality Check',
      preview: 'Quality inspection completed successfully...',
      date: '2024-02-18',
      unread: false
    },
    {
      id: 3,
      from: 'Billing Department',
      subject: 'Invoice Generated',
      preview: 'Your invoice INV-2024-003 has been generated...',
      date: '2024-02-15',
      unread: false
    }
  ];

  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-bold text-gray-900 mb-6">Messages</h3>
      <div className="space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`p-4 border rounded-lg cursor-pointer hover:shadow-md transition-shadow ${
              message.unread ? 'bg-blue-50 border-blue-200' : 'bg-white border-gray-200'
            }`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <div>
                  <h4 className={`font-semibold ${message.unread ? 'text-blue-900' : 'text-gray-900'}`}>
                    {message.from}
                  </h4>
                  <p className="text-sm text-gray-600">{message.date}</p>
                </div>
              </div>
              {message.unread && (
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
              )}
            </div>
            <h5 className={`font-medium mb-1 ${message.unread ? 'text-blue-900' : 'text-gray-900'}`}>
              {message.subject}
            </h5>
            <p className="text-gray-600 text-sm">{message.preview}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

const SettingsContent = ({ user }: { user: any }) => {
  return (
    <div className="space-y-6">
      {/* Profile Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Profile Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
            <input
              type="text"
              defaultValue={user?.name}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input
              type="email"
              defaultValue={user?.email}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
            <input
              type="tel"
              defaultValue={user?.phone}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Company</label>
            <input
              type="text"
              placeholder="Your company name"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors">
          Save Changes
        </button>
      </div>

      {/* Notification Settings */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Notification Preferences</h3>
        <div className="space-y-4">
          {[
            { id: 'project-updates', label: 'Project Updates', description: 'Get notified about project progress' },
            { id: 'invoices', label: 'Invoice Notifications', description: 'Receive invoice and payment reminders' },
            { id: 'messages', label: 'New Messages', description: 'Get notified about new messages from team' },
            { id: 'maintenance', label: 'Maintenance Reminders', description: 'Receive maintenance schedule reminders' }
          ].map((setting) => (
            <div key={setting.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <div>
                <h4 className="font-semibold text-gray-900">{setting.label}</h4>
                <p className="text-sm text-gray-600">{setting.description}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerPortal;