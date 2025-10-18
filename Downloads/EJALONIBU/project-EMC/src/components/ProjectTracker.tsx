import React, { useState, useEffect } from 'react';
import { MapPin, Clock, CheckCircle, AlertCircle, Camera, MessageSquare, Calendar, User, Truck, Wrench } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface ProjectUpdate {
  id: string;
  timestamp: Date;
  status: string;
  description: string;
  images?: string[];
  location?: {
    lat: number;
    lng: number;
    address: string;
  };
  worker?: string;
  notes?: string;
}

interface Project {
  id: string;
  title: string;
  category: string;
  status: 'planning' | 'in-progress' | 'quality-check' | 'completed' | 'on-hold';
  progress: number;
  startDate: Date;
  estimatedCompletion: Date;
  actualCompletion?: Date;
  client: string;
  location: string;
  value: number;
  assignedWorkers: string[];
  updates: ProjectUpdate[];
  milestones: {
    id: string;
    title: string;
    completed: boolean;
    completedDate?: Date;
    description: string;
  }[];
}

const ProjectTracker = () => {
  const { user, isAuthenticated } = useAuth();
  const [selectedProject, setSelectedProject] = useState<string>('');
  const [projects, setProjects] = useState<Project[]>([]);
  const [filter, setFilter] = useState<string>('all');

  // Mock project data
  useEffect(() => {
    const mockProjects: Project[] = [
      {
        id: 'proj_001',
        title: 'Industrial Warehouse Framework',
        category: 'Metal Construction Works',
        status: 'in-progress',
        progress: 65,
        startDate: new Date('2024-01-15'),
        estimatedCompletion: new Date('2024-03-15'),
        client: 'ABC Manufacturing Ltd',
        location: 'Lagos Industrial Estate',
        value: 45000,
        assignedWorkers: ['Adebayo Kunle', 'Samuel Adeyemi'],
        milestones: [
          { id: 'm1', title: 'Site Preparation', completed: true, completedDate: new Date('2024-01-20'), description: 'Site cleared and foundations prepared' },
          { id: 'm2', title: 'Steel Framework', completed: true, completedDate: new Date('2024-02-10'), description: 'Main structural framework erected' },
          { id: 'm3', title: 'Roofing Installation', completed: false, description: 'Metal roofing and cladding installation' },
          { id: 'm4', title: 'Final Inspection', completed: false, description: 'Quality control and client handover' }
        ],
        updates: [
          {
            id: 'u1',
            timestamp: new Date('2024-02-20T10:30:00'),
            status: 'Progress Update',
            description: 'Completed 65% of structural work. Roofing materials delivered on site.',
            images: ['https://images.pexels.com/photos/1105766/pexels-photo-1105766.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
            location: { lat: 6.5244, lng: 3.3792, address: 'Lagos Industrial Estate' },
            worker: 'Adebayo Kunle',
            notes: 'Weather conditions favorable. On schedule for completion.'
          },
          {
            id: 'u2',
            timestamp: new Date('2024-02-18T14:15:00'),
            status: 'Material Delivery',
            description: 'Roofing materials and secondary steel delivered to site.',
            worker: 'Site Supervisor'
          }
        ]
      },
      {
        id: 'proj_002',
        title: 'Luxury Villa Security Gates',
        category: 'Wrought Iron Work',
        status: 'quality-check',
        progress: 90,
        startDate: new Date('2024-02-01'),
        estimatedCompletion: new Date('2024-02-28'),
        client: 'Mr. & Mrs. Johnson',
        location: 'Victoria Island, Lagos',
        value: 8500,
        assignedWorkers: ['Ibrahim Musa'],
        milestones: [
          { id: 'm1', title: 'Design Approval', completed: true, completedDate: new Date('2024-02-03'), description: 'Custom design approved by client' },
          { id: 'm2', title: 'Fabrication', completed: true, completedDate: new Date('2024-02-20'), description: 'Gates fabricated in workshop' },
          { id: 'm3', title: 'Installation', completed: true, completedDate: new Date('2024-02-25'), description: 'Gates installed and tested' },
          { id: 'm4', title: 'Quality Check', completed: false, description: 'Final quality inspection and client approval' }
        ],
        updates: [
          {
            id: 'u1',
            timestamp: new Date('2024-02-25T16:00:00'),
            status: 'Installation Complete',
            description: 'Security gates successfully installed. Automation system tested and working perfectly.',
            images: ['https://images.pexels.com/photos/531880/pexels-photo-531880.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
            worker: 'Ibrahim Musa',
            notes: 'Client very satisfied with the craftsmanship. Pending final quality check.'
          }
        ]
      },
      {
        id: 'proj_003',
        title: 'Office Complex Aluminum Windows',
        category: 'Aluminum Works',
        status: 'completed',
        progress: 100,
        startDate: new Date('2024-01-10'),
        estimatedCompletion: new Date('2024-02-10'),
        actualCompletion: new Date('2024-02-08'),
        client: 'Skyline Properties',
        location: 'Abuja CBD',
        value: 25000,
        assignedWorkers: ['Fatima Abubakar'],
        milestones: [
          { id: 'm1', title: 'Measurements', completed: true, completedDate: new Date('2024-01-12'), description: 'Site measurements and specifications' },
          { id: 'm2', title: 'Manufacturing', completed: true, completedDate: new Date('2024-01-25'), description: 'Windows manufactured to specification' },
          { id: 'm3', title: 'Installation', completed: true, completedDate: new Date('2024-02-05'), description: 'All windows installed' },
          { id: 'm4', title: 'Project Completion', completed: true, completedDate: new Date('2024-02-08'), description: 'Project completed and handed over' }
        ],
        updates: [
          {
            id: 'u1',
            timestamp: new Date('2024-02-08T12:00:00'),
            status: 'Project Completed',
            description: 'All aluminum windows successfully installed. Project completed 2 days ahead of schedule.',
            images: ['https://images.pexels.com/photos/323645/pexels-photo-323645.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop'],
            worker: 'Fatima Abubakar',
            notes: 'Excellent client feedback. Project completed under budget and ahead of schedule.'
          }
        ]
      }
    ];

    setProjects(mockProjects);
    if (mockProjects.length > 0) {
      setSelectedProject(mockProjects[0].id);
    }
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'planning': return 'bg-yellow-100 text-yellow-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'quality-check': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      case 'on-hold': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'planning': return <Calendar className="h-4 w-4" />;
      case 'in-progress': return <Wrench className="h-4 w-4" />;
      case 'quality-check': return <AlertCircle className="h-4 w-4" />;
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'on-hold': return <Clock className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const filteredProjects = filter === 'all' 
    ? projects 
    : projects.filter(project => project.status === filter);

  const selectedProjectData = projects.find(p => p.id === selectedProject);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Authentication Required</h2>
          <p className="text-gray-600 mb-6">Please log in to access the project tracker.</p>
          <button
            onClick={() => window.location.href = '/#contact'}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold"
          >
            Contact Us for Access
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Tracker</h1>
          <p className="text-gray-600">Real-time updates on your metal construction projects</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Projects List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Projects</h2>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="text-sm border border-gray-300 rounded-lg px-3 py-1"
                >
                  <option value="all">All Status</option>
                  <option value="planning">Planning</option>
                  <option value="in-progress">In Progress</option>
                  <option value="quality-check">Quality Check</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              <div className="space-y-4">
                {filteredProjects.map((project) => (
                  <motion.div
                    key={project.id}
                    onClick={() => setSelectedProject(project.id)}
                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedProject === project.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 text-sm">{project.title}</h3>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(project.status)}`}>
                        {getStatusIcon(project.status)}
                        <span className="capitalize">{project.status.replace('-', ' ')}</span>
                      </span>
                    </div>
                    
                    <p className="text-xs text-gray-600 mb-3">{project.category}</p>
                    
                    <div className="mb-3">
                      <div className="flex justify-between text-xs text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin className="h-3 w-3" />
                        <span>{project.location}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{project.estimatedCompletion.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Project Details */}
          <div className="lg:col-span-2">
            {selectedProjectData && (
              <div className="space-y-6">
                {/* Project Overview */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProjectData.title}</h2>
                      <p className="text-gray-600">{selectedProjectData.category}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-2 ${getStatusColor(selectedProjectData.status)}`}>
                      {getStatusIcon(selectedProjectData.status)}
                      <span className="capitalize">{selectedProjectData.status.replace('-', ' ')}</span>
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Client</p>
                      <p className="font-semibold">{selectedProjectData.client}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Location</p>
                      <p className="font-semibold">{selectedProjectData.location}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Project Value</p>
                      <p className="font-semibold">${selectedProjectData.value.toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="mb-6">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>Overall Progress</span>
                      <span>{selectedProjectData.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                        style={{ width: `${selectedProjectData.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">Start Date</p>
                      <p className="font-semibold">{selectedProjectData.startDate.toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600 mb-1">
                        {selectedProjectData.actualCompletion ? 'Completed' : 'Estimated Completion'}
                      </p>
                      <p className="font-semibold">
                        {(selectedProjectData.actualCompletion || selectedProjectData.estimatedCompletion).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Milestones */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Project Milestones</h3>
                  <div className="space-y-4">
                    {selectedProjectData.milestones.map((milestone, index) => (
                      <div key={milestone.id} className="flex items-start space-x-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          milestone.completed ? 'bg-green-100' : 'bg-gray-100'
                        }`}>
                          {milestone.completed ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <div className="w-3 h-3 rounded-full bg-gray-400"></div>
                          )}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className={`font-semibold ${milestone.completed ? 'text-green-900' : 'text-gray-900'}`}>
                              {milestone.title}
                            </h4>
                            {milestone.completedDate && (
                              <span className="text-sm text-gray-500">
                                {milestone.completedDate.toLocaleDateString()}
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Recent Updates */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Recent Updates</h3>
                  <div className="space-y-6">
                    {selectedProjectData.updates.map((update) => (
                      <div key={update.id} className="border-l-4 border-blue-500 pl-6">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-gray-900">{update.status}</h4>
                          <span className="text-sm text-gray-500">
                            {update.timestamp.toLocaleDateString()} {update.timestamp.toLocaleTimeString()}
                          </span>
                        </div>
                        
                        <p className="text-gray-700 mb-3">{update.description}</p>
                        
                        {update.images && update.images.length > 0 && (
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-3">
                            {update.images.map((image, index) => (
                              <img
                                key={index}
                                src={image}
                                alt={`Update ${index + 1}`}
                                className="w-full h-24 object-cover rounded-lg"
                              />
                            ))}
                          </div>
                        )}
                        
                        <div className="flex items-center justify-between text-sm text-gray-600">
                          {update.worker && (
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{update.worker}</span>
                            </div>
                          )}
                          {update.location && (
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-4 w-4" />
                              <span>{update.location.address}</span>
                            </div>
                          )}
                        </div>
                        
                        {update.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <p className="text-sm text-gray-700">{update.notes}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Assigned Workers */}
                <div className="bg-white rounded-xl shadow-lg p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Assigned Team</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {selectedProjectData.assignedWorkers.map((worker, index) => (
                      <div key={index} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900">{worker}</p>
                          <p className="text-sm text-gray-600">Project Team Member</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectTracker;