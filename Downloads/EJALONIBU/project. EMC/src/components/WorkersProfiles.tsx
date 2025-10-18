import React, { useState } from 'react';
import { User, Award, Clock, Phone, Mail, MapPin, Wrench, Shield, Star, Calendar } from 'lucide-react';

interface Worker {
  id: string;
  name: string;
  position: string;
  department: string;
  specialization: string[];
  experience: number;
  certifications: string[];
  image: string;
  phone: string;
  email: string;
  location: string;
  joinDate: string;
  projectsCompleted: number;
  rating: number;
  skills: {
    name: string;
    level: number;
  }[];
  bio: string;
  achievements: string[];
  availability: 'Available' | 'On Project' | 'On Leave';
}

const WorkersProfiles = () => {
  const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null);
  const [filterDepartment, setFilterDepartment] = useState<string>('All');

  const workers: Worker[] = [
    {
      id: 'w001',
      name: 'Eja Oladimeji',
      position: 'Managing Director & Chief Engineer',
      department: 'Management',
      specialization: ['Project Management', 'Structural Engineering', 'Business Development'],
      experience: 18,
      certifications: ['Professional Engineer (PE)', 'Project Management Professional (PMP)', 'AWS Certified Welding Inspector'],
      image: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      phone: '+234 (0) 123 456 7890',
      email: 'eja.oladimeji@emcmetalworks.com',
      location: 'Lagos, Nigeria',
      joinDate: '2007-01-15',
      projectsCompleted: 150,
      rating: 5.0,
      skills: [
        { name: 'Project Management', level: 95 },
        { name: 'Structural Design', level: 90 },
        { name: 'Team Leadership', level: 98 },
        { name: 'Client Relations', level: 92 }
      ],
      bio: 'Founder and Managing Director of EMC Ejalonibu with over 18 years of experience in metal construction and fabrication. Led the company from startup to becoming one of Nigeria\'s premier metal works companies.',
      achievements: [
        'Founded EMC Ejalonibu Metal and Aluminium Works LTD in 2007',
        'Completed over 150 major projects',
        'Certified AWS Welding Inspector',
        'Led team to win "Best Metal Construction Company 2023" award'
      ],
      availability: 'Available'
    },
    {
      id: 'w002',
      name: 'Adebayo Kunle',
      position: 'Senior Welding Supervisor',
      department: 'Metal Construction',
      specialization: ['Structural Welding', 'Pipeline Welding', 'Quality Control'],
      experience: 12,
      certifications: ['AWS D1.1 Certified', 'ASME Section IX', 'API 1104 Pipeline Welding'],
      image: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      phone: '+234 (0) 123 456 7891',
      email: 'adebayo.kunle@emcmetalworks.com',
      location: 'Lagos, Nigeria',
      joinDate: '2012-03-20',
      projectsCompleted: 89,
      rating: 4.9,
      skills: [
        { name: 'Structural Welding', level: 95 },
        { name: 'Quality Control', level: 88 },
        { name: 'Team Supervision', level: 85 },
        { name: 'Safety Management', level: 90 }
      ],
      bio: 'Expert welder with 12 years of experience specializing in structural and pipeline welding. Known for exceptional quality and attention to detail.',
      achievements: [
        'AWS D1.1 Structural Welding Certification',
        'Zero safety incidents in 5 years',
        'Trained over 20 junior welders',
        'Led welding team for Lagos Bridge Project'
      ],
      availability: 'On Project'
    },
    {
      id: 'w003',
      name: 'Fatima Abubakar',
      position: 'Aluminum Works Specialist',
      department: 'Aluminum Works',
      specialization: ['Curtain Wall Systems', 'Window Installation', 'Aluminum Fabrication'],
      experience: 8,
      certifications: ['AAMA Certified', 'Glazing Contractor License', 'Safety Training Certificate'],
      image: 'https://images.pexels.com/photos/1181519/pexels-photo-1181519.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      phone: '+234 (0) 123 456 7892',
      email: 'fatima.abubakar@emcmetalworks.com',
      location: 'Abuja, Nigeria',
      joinDate: '2016-07-10',
      projectsCompleted: 65,
      rating: 4.8,
      skills: [
        { name: 'Aluminum Fabrication', level: 92 },
        { name: 'Curtain Wall Installation', level: 88 },
        { name: 'Technical Drawing', level: 85 },
        { name: 'Quality Assurance', level: 87 }
      ],
      bio: 'Specialized aluminum works expert with extensive experience in modern building facades and window systems. Known for precision and innovative solutions.',
      achievements: [
        'AAMA Certified Aluminum Specialist',
        'Completed 15 high-rise curtain wall projects',
        'Developed new installation techniques',
        'Led Abuja Commercial Complex project'
      ],
      availability: 'Available'
    },
    {
      id: 'w004',
      name: 'Ibrahim Musa',
      position: 'Wrought Iron Craftsman',
      department: 'Wrought Iron',
      specialization: ['Decorative Ironwork', 'Security Gates', 'Artistic Metalwork'],
      experience: 15,
      certifications: ['Traditional Blacksmithing Certificate', 'Artistic Metalwork Diploma', 'Safety Certification'],
      image: 'https://images.pexels.com/photos/1181717/pexels-photo-1181717.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      phone: '+234 (0) 123 456 7893',
      email: 'ibrahim.musa@emcmetalworks.com',
      location: 'Kano, Nigeria',
      joinDate: '2010-05-15',
      projectsCompleted: 120,
      rating: 4.9,
      skills: [
        { name: 'Hand Forging', level: 98 },
        { name: 'Decorative Design', level: 95 },
        { name: 'Security Systems', level: 85 },
        { name: 'Artistic Welding', level: 92 }
      ],
      bio: 'Master craftsman with 15 years of experience in traditional and modern wrought iron work. Combines artistic flair with functional security solutions.',
      achievements: [
        'Master Blacksmith Certification',
        'Created signature gates for 50+ luxury homes',
        'Won "Best Artistic Metalwork" award 2022',
        'Trained 15 apprentice craftsmen'
      ],
      availability: 'Available'
    },
    {
      id: 'w005',
      name: 'Chioma Okafor',
      position: 'Security Systems Engineer',
      department: 'Security Fence Systems',
      specialization: ['Perimeter Security', 'Access Control', 'Fence Installation'],
      experience: 7,
      certifications: ['Security Systems Certification', 'Access Control Specialist', 'Project Management Certificate'],
      image: 'https://images.pexels.com/photos/1181562/pexels-photo-1181562.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      phone: '+234 (0) 123 456 7894',
      email: 'chioma.okafor@emcmetalworks.com',
      location: 'Port Harcourt, Nigeria',
      joinDate: '2018-02-28',
      projectsCompleted: 45,
      rating: 4.7,
      skills: [
        { name: 'Security Design', level: 90 },
        { name: 'Fence Installation', level: 88 },
        { name: 'Access Control', level: 85 },
        { name: 'Site Survey', level: 87 }
      ],
      bio: 'Security systems specialist with expertise in modern perimeter protection and access control systems. Focuses on comprehensive security solutions.',
      achievements: [
        'Designed security for 30+ industrial facilities',
        'Certified Security Systems Engineer',
        'Implemented first smart fence system in region',
        'Zero security breaches in installed systems'
      ],
      availability: 'On Project'
    },
    {
      id: 'w006',
      name: 'Yusuf Abdullahi',
      position: 'Heavy Duty Gates Technician',
      department: 'Heavy Duty Gates',
      specialization: ['Automated Gates', 'Motor Installation', 'Gate Maintenance'],
      experience: 10,
      certifications: ['Gate Automation Certification', 'Electrical Installation License', 'Motor Control Specialist'],
      image: 'https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      phone: '+234 (0) 123 456 7895',
      email: 'yusuf.abdullahi@emcmetalworks.com',
      location: 'Kaduna, Nigeria',
      joinDate: '2014-09-12',
      projectsCompleted: 78,
      rating: 4.8,
      skills: [
        { name: 'Gate Automation', level: 93 },
        { name: 'Motor Installation', level: 90 },
        { name: 'Electrical Systems', level: 87 },
        { name: 'Troubleshooting', level: 89 }
      ],
      bio: 'Specialized technician in heavy duty gate systems and automation. Expert in motor installation and maintenance with 10 years of field experience.',
      achievements: [
        'Installed 200+ automated gate systems',
        'Certified Gate Automation Specialist',
        'Developed maintenance protocols',
        '99% uptime rate on installed systems'
      ],
      availability: 'Available'
    },
    {
      id: 'w007',
      name: 'Blessing Okoro',
      position: 'Car Park Structures Engineer',
      department: 'Car Park Installation',
      specialization: ['Structural Design', 'Multi-level Parking', 'Drainage Systems'],
      experience: 9,
      certifications: ['Structural Engineering License', 'Parking Structure Specialist', 'AutoCAD Certified'],
      image: 'https://images.pexels.com/photos/1181424/pexels-photo-1181424.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      phone: '+234 (0) 123 456 7896',
      email: 'blessing.okoro@emcmetalworks.com',
      location: 'Lagos, Nigeria',
      joinDate: '2016-01-20',
      projectsCompleted: 35,
      rating: 4.9,
      skills: [
        { name: 'Structural Design', level: 91 },
        { name: 'CAD Design', level: 88 },
        { name: 'Project Planning', level: 85 },
        { name: 'Site Management', level: 87 }
      ],
      bio: 'Structural engineer specializing in car park and parking structure design. Expert in multi-level parking solutions and drainage systems.',
      achievements: [
        'Designed 25+ car park structures',
        'Licensed Structural Engineer',
        'Completed largest multi-level parking in Lagos',
        'Innovative drainage system design'
      ],
      availability: 'Available'
    },
    {
      id: 'w008',
      name: 'Samuel Adeyemi',
      position: 'Quality Control Inspector',
      department: 'Quality Assurance',
      specialization: ['Welding Inspection', 'Material Testing', 'Safety Compliance'],
      experience: 11,
      certifications: ['AWS Certified Welding Inspector', 'NDT Level II', 'ISO 9001 Lead Auditor'],
      image: 'https://images.pexels.com/photos/1181605/pexels-photo-1181605.jpeg?auto=compress&cs=tinysrgb&w=400&h=400&fit=crop',
      phone: '+234 (0) 123 456 7897',
      email: 'samuel.adeyemi@emcmetalworks.com',
      location: 'Lagos, Nigeria',
      joinDate: '2013-11-05',
      projectsCompleted: 95,
      rating: 4.9,
      skills: [
        { name: 'Welding Inspection', level: 96 },
        { name: 'Material Testing', level: 92 },
        { name: 'Quality Systems', level: 89 },
        { name: 'Documentation', level: 88 }
      ],
      bio: 'Senior quality control inspector ensuring all EMC Ejalonibu projects meet international standards. Expert in welding inspection and material testing.',
      achievements: [
        'AWS Certified Welding Inspector',
        'NDT Level II Certification',
        'Zero quality failures in 3 years',
        'Implemented ISO 9001 quality system'
      ],
      availability: 'Available'
    }
  ];

  const departments = ['All', 'Management', 'Metal Construction', 'Aluminum Works', 'Wrought Iron', 'Security Fence Systems', 'Heavy Duty Gates', 'Car Park Installation', 'Quality Assurance'];

  const filteredWorkers = filterDepartment === 'All' 
    ? workers 
    : workers.filter(worker => worker.department === filterDepartment);

  const getAvailabilityColor = (availability: string) => {
    switch (availability) {
      case 'Available': return 'bg-green-600/20 text-green-400 border-green-500/30';
      case 'On Project': return 'bg-blue-600/20 text-blue-400 border-blue-500/30';
      case 'On Leave': return 'bg-red-600/20 text-red-400 border-red-500/30';
      default: return 'bg-gray-600/20 text-gray-400 border-gray-500/30';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-500'}`}
      />
    ));
  };

  return (
    <section id="workers-profiles" className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Our Expert Team
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Meet the skilled professionals behind EMC Ejalonibu's success. Our experienced team brings expertise across all metalwork disciplines.
          </p>
        </div>

        {/* Department Filter */}
        <div className="mb-12">
          <div className="flex flex-wrap justify-center gap-2">
            {departments.map((dept) => (
              <button
                key={dept}
                onClick={() => setFilterDepartment(dept)}
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  filterDepartment === dept
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700 border border-gray-700'
                }`}
              >
                {dept}
              </button>
            ))}
          </div>
        </div>

        {/* Workers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredWorkers.map((worker) => (
            <div
              key={worker.id}
              className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer border border-gray-700"
              onClick={() => setSelectedWorker(worker)}
            >
              {/* Profile Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={worker.image}
                  alt={worker.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-semibold border ${getAvailabilityColor(worker.availability)}`}>
                    {worker.availability}
                  </span>
                </div>
              </div>

              {/* Worker Info */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-1">{worker.name}</h3>
                <p className="text-blue-400 font-medium mb-2">{worker.position}</p>
                <p className="text-sm text-gray-300 mb-3">{worker.department}</p>

                {/* Rating */}
                <div className="flex items-center mb-3">
                  <div className="flex mr-2">
                    {renderStars(worker.rating)}
                  </div>
                  <span className="text-sm text-gray-300">({worker.rating})</span>
                </div>

                {/* Experience & Projects */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-blue-400">{worker.experience}</p>
                    <p className="text-xs text-gray-300">Years Exp.</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-orange-400">{worker.projectsCompleted}</p>
                    <p className="text-xs text-gray-300">Projects</p>
                  </div>
                </div>

                {/* Specializations */}
                <div className="mb-4">
                  <p className="text-sm font-medium text-white mb-2">Specializations:</p>
                  <div className="flex flex-wrap gap-1">
                    {worker.specialization.slice(0, 2).map((spec, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full"
                      >
                        {spec}
                      </span>
                    ))}
                    {worker.specialization.length > 2 && (
                      <span className="px-2 py-1 bg-gray-700 text-gray-300 text-xs rounded-full">
                        +{worker.specialization.length - 2} more
                      </span>
                    )}
                  </div>
                </div>

                {/* Contact Button */}
                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-all duration-300">
                  View Full Profile
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Detailed Worker Modal */}
        {selectedWorker && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700">
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div className="flex items-start space-x-6">
                    <img
                      src={selectedWorker.image}
                      alt={selectedWorker.name}
                      className="w-24 h-24 rounded-full object-cover border border-gray-600"
                    />
                    <div>
                      <h3 className="text-3xl font-bold text-white">{selectedWorker.name}</h3>
                      <p className="text-xl text-blue-400 font-medium">{selectedWorker.position}</p>
                      <p className="text-gray-300">{selectedWorker.department}</p>
                      <div className="flex items-center mt-2">
                        <div className="flex mr-2">
                          {renderStars(selectedWorker.rating)}
                        </div>
                        <span className="text-sm text-gray-300">({selectedWorker.rating}/5.0)</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedWorker(null)}
                    className="text-gray-400 hover:text-gray-300 text-2xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Left Column */}
                  <div className="space-y-6">
                    {/* Bio */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">About</h4>
                      <p className="text-gray-300 leading-relaxed">{selectedWorker.bio}</p>
                    </div>

                    {/* Contact Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Contact Information</h4>
                      <div className="space-y-3">
                        <div className="flex items-center space-x-3">
                          <Phone className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-300">{selectedWorker.phone}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Mail className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-300">{selectedWorker.email}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <MapPin className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-300">{selectedWorker.location}</span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <Calendar className="h-5 w-5 text-blue-400" />
                          <span className="text-gray-300">Joined: {new Date(selectedWorker.joinDate).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Skills */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Skills & Expertise</h4>
                      <div className="space-y-3">
                        {selectedWorker.skills.map((skill, index) => (
                          <div key={index}>
                            <div className="flex justify-between mb-1">
                              <span className="text-sm font-medium text-gray-300">{skill.name}</span>
                              <span className="text-sm text-gray-400">{skill.level}%</span>
                            </div>
                            <div className="w-full bg-gray-700 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                                style={{ width: `${skill.level}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-6">
                    {/* Statistics */}
                    <div className="bg-gray-700/50 p-6 rounded-lg border border-gray-600">
                      <h4 className="text-lg font-semibold text-white mb-4">Professional Statistics</h4>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="text-center">
                          <p className="text-3xl font-bold text-blue-400">{selectedWorker.experience}</p>
                          <p className="text-sm text-gray-300">Years Experience</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-orange-400">{selectedWorker.projectsCompleted}</p>
                          <p className="text-sm text-gray-300">Projects Completed</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-green-400">{selectedWorker.certifications.length}</p>
                          <p className="text-sm text-gray-300">Certifications</p>
                        </div>
                        <div className="text-center">
                          <p className="text-3xl font-bold text-purple-400">{selectedWorker.rating}</p>
                          <p className="text-sm text-gray-300">Rating</p>
                        </div>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Specializations</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedWorker.specialization.map((spec, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-600/20 text-blue-400 text-sm rounded-full border border-blue-500/30"
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Certifications</h4>
                      <div className="space-y-2">
                        {selectedWorker.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center space-x-2">
                            <Award className="h-4 w-4 text-yellow-400" />
                            <span className="text-gray-300">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Achievements */}
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-3">Key Achievements</h4>
                      <div className="space-y-2">
                        {selectedWorker.achievements.map((achievement, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <Star className="h-4 w-4 text-yellow-400 mt-0.5 flex-shrink-0" />
                            <span className="text-gray-300">{achievement}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Availability Status */}
                    <div className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                      <h4 className="text-lg font-semibold text-white mb-2">Current Status</h4>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold border ${getAvailabilityColor(selectedWorker.availability)}`}>
                        {selectedWorker.availability}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-4 mt-8 pt-6 border-t border-gray-700">
                  <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                    <Phone className="h-5 w-5" />
                    <span>Contact Worker</span>
                  </button>
                  <button className="flex-1 bg-orange-600 hover:bg-orange-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2">
                    <Mail className="h-5 w-5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorkersProfiles;