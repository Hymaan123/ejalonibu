import React, { useState } from 'react';
import { Shield, CheckCircle, AlertTriangle, FileText, Camera, Award, Clock, User } from 'lucide-react';
import { motion } from 'framer-motion';

interface QualityCheck {
  id: string;
  category: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  inspector: string;
  date: Date;
  notes?: string;
  images?: string[];
  standards: string[];
}

interface QualityReport {
  projectId: string;
  projectName: string;
  overallScore: number;
  checks: QualityCheck[];
  certifications: string[];
  recommendations: string[];
}

const QualityAssurance = () => {
  const [selectedProject, setSelectedProject] = useState('proj_001');
  const [activeTab, setActiveTab] = useState('checklist');

  const qualityReports: QualityReport[] = [
    {
      projectId: 'proj_001',
      projectName: 'Industrial Warehouse Framework',
      overallScore: 92,
      certifications: ['AWS D1.1 Certified', 'ISO 9001:2015', 'OSHA Compliant'],
      recommendations: [
        'Continue with current welding procedures',
        'Maintain regular inspection schedule',
        'Document all material certifications'
      ],
      checks: [
        {
          id: 'qc_001',
          category: 'Welding Quality',
          description: 'Visual inspection of all structural welds',
          status: 'completed',
          inspector: 'Samuel Adeyemi',
          date: new Date('2024-02-20'),
          notes: 'All welds meet AWS D1.1 standards. Excellent penetration and finish.',
          images: ['https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
          standards: ['AWS D1.1', 'AISC 360']
        },
        {
          id: 'qc_002',
          category: 'Material Verification',
          description: 'Verification of steel grade and certifications',
          status: 'completed',
          inspector: 'Samuel Adeyemi',
          date: new Date('2024-02-18'),
          notes: 'All materials verified with mill certificates. Grade S355 confirmed.',
          standards: ['ASTM A572', 'EN 10025']
        },
        {
          id: 'qc_003',
          category: 'Dimensional Accuracy',
          description: 'Measurement of structural dimensions and tolerances',
          status: 'in-progress',
          inspector: 'Samuel Adeyemi',
          date: new Date('2024-02-22'),
          standards: ['AISC Code of Standard Practice']
        },
        {
          id: 'qc_004',
          category: 'Surface Preparation',
          description: 'Inspection of surface preparation for coating',
          status: 'pending',
          inspector: 'Samuel Adeyemi',
          date: new Date('2024-02-25'),
          standards: ['SSPC-SP6', 'ISO 8501-1']
        }
      ]
    },
    {
      projectId: 'proj_002',
      projectName: 'Luxury Villa Security Gates',
      overallScore: 96,
      certifications: ['Security Grade 3', 'CE Marking', 'Quality Assured'],
      recommendations: [
        'Excellent craftsmanship maintained',
        'Security features exceed requirements',
        'Ready for final installation'
      ],
      checks: [
        {
          id: 'qc_005',
          category: 'Fabrication Quality',
          description: 'Inspection of wrought iron fabrication and joints',
          status: 'completed',
          inspector: 'Ibrahim Musa',
          date: new Date('2024-02-24'),
          notes: 'Exceptional craftsmanship. All joints properly welded and finished.',
          images: ['https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
          standards: ['BS EN 1090', 'Security Standards']
        },
        {
          id: 'qc_006',
          category: 'Security Features',
          description: 'Testing of locking mechanisms and security features',
          status: 'completed',
          inspector: 'Chioma Okafor',
          date: new Date('2024-02-25'),
          notes: 'All security features tested and operational. Exceeds Grade 3 requirements.',
          standards: ['LPS 1175', 'PAS 24']
        }
      ]
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'failed': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'pending': return <AlertTriangle className="h-4 w-4" />;
      case 'failed': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const selectedReport = qualityReports.find(r => r.projectId === selectedProject);

  const renderChecklist = () => (
    <div className="space-y-6">
      {selectedReport?.checks.map((check) => (
        <motion.div
          key={check.id}
          className="bg-white border border-gray-200 rounded-xl p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1">
              <div className="flex items-center space-x-3 mb-2">
                <h3 className="text-lg font-semibold text-gray-900">{check.category}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(check.status)}`}>
                  {getStatusIcon(check.status)}
                  <span className="capitalize">{check.status.replace('-', ' ')}</span>
                </span>
              </div>
              <p className="text-gray-600 mb-3">{check.description}</p>
              
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                <div className="flex items-center space-x-1">
                  <User className="h-4 w-4" />
                  <span>{check.inspector}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{check.date.toLocaleDateString()}</span>
                </div>
              </div>

              <div className="mb-3">
                <h4 className="text-sm font-medium text-gray-900 mb-2">Standards & Codes:</h4>
                <div className="flex flex-wrap gap-2">
                  {check.standards.map((standard, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      {standard}
                    </span>
                  ))}
                </div>
              </div>

              {check.notes && (
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <h4 className="text-sm font-medium text-gray-900 mb-1">Inspector Notes:</h4>
                  <p className="text-sm text-gray-700">{check.notes}</p>
                </div>
              )}

              {check.images && check.images.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-900 mb-2">Inspection Photos:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {check.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Inspection ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderCertifications = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Project Certifications</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {selectedReport?.certifications.map((cert, index) => (
            <div key={index} className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                  <Award className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{cert}</h4>
                  <p className="text-sm text-gray-600">Verified</p>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-green-600 font-medium">✓ Compliant</span>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                  View Certificate
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quality Standards</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              standard: 'AWS D1.1',
              description: 'Structural Welding Code - Steel',
              compliance: 'Full Compliance',
              status: 'verified'
            },
            {
              standard: 'ISO 9001:2015',
              description: 'Quality Management Systems',
              compliance: 'Certified',
              status: 'verified'
            },
            {
              standard: 'AISC 360',
              description: 'Specification for Structural Steel Buildings',
              compliance: 'Full Compliance',
              status: 'verified'
            },
            {
              standard: 'OSHA Standards',
              description: 'Occupational Safety and Health',
              compliance: 'Compliant',
              status: 'verified'
            }
          ].map((item, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-semibold text-gray-900">{item.standard}</h4>
                <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  {item.status}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="text-sm font-medium text-green-600">{item.compliance}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Quality Score</h3>
        <div className="text-center mb-6">
          <div className="relative w-32 h-32 mx-auto">
            <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#e5e7eb"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                stroke="#3b82f6"
                strokeWidth="8"
                fill="none"
                strokeDasharray={`${(selectedReport?.overallScore || 0) * 3.14} 314`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-gray-900">{selectedReport?.overallScore}%</span>
            </div>
          </div>
          <p className="text-gray-600 mt-2">Overall Quality Score</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { label: 'Completed Checks', value: selectedReport?.checks.filter(c => c.status === 'completed').length || 0 },
            { label: 'In Progress', value: selectedReport?.checks.filter(c => c.status === 'in-progress').length || 0 },
            { label: 'Pending', value: selectedReport?.checks.filter(c => c.status === 'pending').length || 0 }
          ].map((stat, index) => (
            <div key={index} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Recommendations</h3>
        <div className="space-y-3">
          {selectedReport?.recommendations.map((recommendation, index) => (
            <div key={index} className="flex items-start space-x-3 p-3 bg-green-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <p className="text-gray-700">{recommendation}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Download Reports</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { name: 'Quality Inspection Report', format: 'PDF', size: '2.3 MB' },
            { name: 'Material Certificates', format: 'PDF', size: '1.8 MB' },
            { name: 'Welding Procedure Specification', format: 'PDF', size: '1.2 MB' },
            { name: 'Test Results Summary', format: 'Excel', size: '0.8 MB' }
          ].map((doc, index) => (
            <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-3">
                <FileText className="h-8 w-8 text-blue-600" />
                <div>
                  <h4 className="font-medium text-gray-900">{doc.name}</h4>
                  <p className="text-sm text-gray-600">{doc.format} • {doc.size}</p>
                </div>
              </div>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
                Download
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Quality Assurance</h1>
          </div>
          <p className="text-gray-600">Comprehensive quality control and inspection processes</p>
        </div>

        {/* Project Selection */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Select Project</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {qualityReports.map((report) => (
                <motion.button
                  key={report.projectId}
                  onClick={() => setSelectedProject(report.projectId)}
                  className={`p-4 border-2 rounded-lg text-left transition-all duration-200 ${
                    selectedProject === report.projectId
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <h3 className="font-semibold text-gray-900 mb-2">{report.projectName}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Quality Score</span>
                    <span className="text-lg font-bold text-blue-600">{report.overallScore}%</span>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              {[
                { id: 'checklist', name: 'Quality Checklist', icon: CheckCircle },
                { id: 'certifications', name: 'Certifications', icon: Award },
                { id: 'reports', name: 'Reports', icon: FileText }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors flex-1 justify-center ${
                    activeTab === tab.id
                      ? 'bg-white text-blue-600 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <tab.icon className="h-4 w-4" />
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'checklist' && renderChecklist()}
          {activeTab === 'certifications' && renderCertifications()}
          {activeTab === 'reports' && renderReports()}
        </motion.div>
      </div>
    </div>
  );
};

export default QualityAssurance;