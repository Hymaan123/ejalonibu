import React, { useState } from 'react';
import { Calendar, Clock, Wrench, Bell, CheckCircle, AlertTriangle, User, Phone, Mail } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

interface MaintenanceTask {
  id: string;
  projectId: string;
  projectName: string;
  taskType: 'inspection' | 'cleaning' | 'lubrication' | 'repair' | 'replacement';
  description: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  scheduledDate: Date;
  estimatedDuration: number; // in hours
  assignedTechnician?: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'overdue';
  lastCompleted?: Date;
  nextDue?: Date;
  instructions: string[];
  requiredTools: string[];
  safetyNotes: string[];
}

interface MaintenanceSchedule {
  projectId: string;
  projectName: string;
  installationDate: Date;
  warrantyExpiry: Date;
  maintenanceInterval: number; // in months
  tasks: MaintenanceTask[];
}

const MaintenanceScheduling = () => {
  const [selectedView, setSelectedView] = useState<'calendar' | 'tasks' | 'schedule'>('calendar');
  const [selectedProject, setSelectedProject] = useState<string>('all');
  const [showNewTaskForm, setShowNewTaskForm] = useState(false);

  const maintenanceSchedules: MaintenanceSchedule[] = [
    {
      projectId: 'proj_001',
      projectName: 'Industrial Warehouse Framework',
      installationDate: new Date('2024-03-15'),
      warrantyExpiry: new Date('2026-03-15'),
      maintenanceInterval: 6,
      tasks: [
        {
          id: 'maint_001',
          projectId: 'proj_001',
          projectName: 'Industrial Warehouse Framework',
          taskType: 'inspection',
          description: 'Structural integrity inspection of main framework',
          priority: 'high',
          scheduledDate: new Date('2024-09-15'),
          estimatedDuration: 4,
          assignedTechnician: 'Samuel Adeyemi',
          status: 'scheduled',
          lastCompleted: new Date('2024-03-15'),
          nextDue: new Date('2024-09-15'),
          instructions: [
            'Visual inspection of all welded joints',
            'Check for signs of corrosion or wear',
            'Measure structural deflections',
            'Document any anomalies with photos'
          ],
          requiredTools: ['Measuring tape', 'Level', 'Camera', 'Inspection checklist'],
          safetyNotes: ['Wear safety harness when working at height', 'Use proper fall protection equipment']
        },
        {
          id: 'maint_002',
          projectId: 'proj_001',
          projectName: 'Industrial Warehouse Framework',
          taskType: 'cleaning',
          description: 'Cleaning and surface preparation for protective coating',
          priority: 'medium',
          scheduledDate: new Date('2024-06-15'),
          estimatedDuration: 8,
          status: 'completed',
          lastCompleted: new Date('2024-06-15'),
          nextDue: new Date('2024-12-15'),
          instructions: [
            'Remove dirt and debris from all surfaces',
            'Clean with appropriate solvents',
            'Apply protective coating as needed',
            'Inspect coating integrity'
          ],
          requiredTools: ['Pressure washer', 'Cleaning solvents', 'Brushes', 'Protective coating'],
          safetyNotes: ['Use appropriate PPE', 'Ensure proper ventilation']
        }
      ]
    },
    {
      projectId: 'proj_002',
      projectName: 'Luxury Villa Security Gates',
      installationDate: new Date('2024-02-28'),
      warrantyExpiry: new Date('2027-02-28'),
      maintenanceInterval: 3,
      tasks: [
        {
          id: 'maint_003',
          projectId: 'proj_002',
          projectName: 'Luxury Villa Security Gates',
          taskType: 'lubrication',
          description: 'Lubrication of gate hinges and automation system',
          priority: 'medium',
          scheduledDate: new Date('2024-05-28'),
          estimatedDuration: 2,
          assignedTechnician: 'Yusuf Abdullahi',
          status: 'completed',
          lastCompleted: new Date('2024-05-28'),
          nextDue: new Date('2024-08-28'),
          instructions: [
            'Lubricate all hinges and pivot points',
            'Check automation system operation',
            'Test remote control functionality',
            'Calibrate safety sensors'
          ],
          requiredTools: ['Lubricants', 'Remote control tester', 'Multimeter'],
          safetyNotes: ['Disconnect power before maintenance', 'Test all safety features after completion']
        },
        {
          id: 'maint_004',
          projectId: 'proj_002',
          projectName: 'Luxury Villa Security Gates',
          taskType: 'inspection',
          description: 'Security system functionality check',
          priority: 'high',
          scheduledDate: new Date('2024-08-28'),
          estimatedDuration: 3,
          assignedTechnician: 'Chioma Okafor',
          status: 'scheduled',
          instructions: [
            'Test all locking mechanisms',
            'Verify access control system',
            'Check emergency override functions',
            'Update security software if needed'
          ],
          requiredTools: ['Security system tester', 'Laptop', 'Access cards'],
          safetyNotes: ['Follow security protocols', 'Document all access attempts']
        }
      ]
    }
  ];

  const allTasks = maintenanceSchedules.flatMap(schedule => schedule.tasks);
  const filteredTasks = selectedProject === 'all' 
    ? allTasks 
    : allTasks.filter(task => task.projectId === selectedProject);

  const getTaskTypeColor = (type: string) => {
    switch (type) {
      case 'inspection': return 'bg-blue-100 text-blue-800';
      case 'cleaning': return 'bg-green-100 text-green-800';
      case 'lubrication': return 'bg-yellow-100 text-yellow-800';
      case 'repair': return 'bg-orange-100 text-orange-800';
      case 'replacement': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'urgent': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'scheduled': return 'bg-gray-100 text-gray-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4" />;
      case 'in-progress': return <Clock className="h-4 w-4" />;
      case 'scheduled': return <Calendar className="h-4 w-4" />;
      case 'overdue': return <AlertTriangle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const scheduleReminder = (taskId: string) => {
    toast.success('Reminder scheduled! You will be notified before the maintenance date.');
  };

  const markTaskComplete = (taskId: string) => {
    toast.success('Task marked as completed!');
  };

  const renderCalendarView = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Maintenance Calendar</h3>
        
        {/* Calendar Header */}
        <div className="grid grid-cols-7 gap-2 mb-4">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center font-semibold text-gray-600 py-2">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }, (_, i) => {
            const date = new Date();
            date.setDate(date.getDate() - date.getDay() + i);
            const tasksForDate = filteredTasks.filter(task => 
              task.scheduledDate.toDateString() === date.toDateString()
            );

            return (
              <div key={i} className="min-h-[100px] border border-gray-200 rounded-lg p-2">
                <div className="text-sm font-medium text-gray-900 mb-1">
                  {date.getDate()}
                </div>
                <div className="space-y-1">
                  {tasksForDate.map((task) => (
                    <div
                      key={task.id}
                      className={`text-xs p-1 rounded ${getTaskTypeColor(task.taskType)} cursor-pointer`}
                      title={task.description}
                    >
                      {task.taskType}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Upcoming Tasks */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Upcoming Tasks (Next 30 Days)</h3>
        <div className="space-y-4">
          {filteredTasks
            .filter(task => {
              const thirtyDaysFromNow = new Date();
              thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
              return task.scheduledDate <= thirtyDaysFromNow && task.status !== 'completed';
            })
            .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
            .map((task) => (
              <div key={task.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-gray-900">{task.description}</h4>
                    <p className="text-sm text-gray-600">{task.projectName}</p>
                  </div>
                  <div className="flex space-x-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(task.taskType)}`}>
                      {task.taskType}
                    </span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getPriorityColor(task.priority)}`}>
                      {task.priority}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{task.scheduledDate.toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{task.estimatedDuration}h</span>
                    </div>
                    {task.assignedTechnician && (
                      <div className="flex items-center space-x-1">
                        <User className="h-4 w-4" />
                        <span>{task.assignedTechnician}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => scheduleReminder(task.id)}
                      className="flex items-center space-x-1 text-blue-600 hover:text-blue-800 text-sm"
                    >
                      <Bell className="h-4 w-4" />
                      <span>Remind</span>
                    </button>
                    {task.status !== 'completed' && (
                      <button
                        onClick={() => markTaskComplete(task.id)}
                        className="flex items-center space-x-1 text-green-600 hover:text-green-800 text-sm"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Complete</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );

  const renderTasksView = () => (
    <div className="space-y-6">
      {filteredTasks.map((task) => (
        <motion.div
          key={task.id}
          className="bg-white rounded-xl shadow-lg p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{task.description}</h3>
              <p className="text-gray-600">{task.projectName}</p>
            </div>
            <div className="flex space-x-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 ${getStatusColor(task.status)}`}>
                {getStatusIcon(task.status)}
                <span className="capitalize">{task.status.replace('-', ' ')}</span>
              </span>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(task.priority)}`}>
                {task.priority}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Scheduled Date</p>
              <p className="font-semibold">{task.scheduledDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Duration</p>
              <p className="font-semibold">{task.estimatedDuration} hours</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Task Type</p>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTaskTypeColor(task.taskType)}`}>
                {task.taskType}
              </span>
            </div>
            {task.assignedTechnician && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Assigned To</p>
                <p className="font-semibold">{task.assignedTechnician}</p>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Instructions</h4>
              <ul className="space-y-2">
                {task.instructions.map((instruction, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-gray-700">
                    <span className="text-blue-600 mt-1">•</span>
                    <span>{instruction}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Required Tools</h4>
              <div className="flex flex-wrap gap-2">
                {task.requiredTools.map((tool, index) => (
                  <span key={index} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Safety Notes</h4>
              <ul className="space-y-2">
                {task.safetyNotes.map((note, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm text-red-700">
                    <AlertTriangle className="h-4 w-4 text-red-600 mt-0.5 flex-shrink-0" />
                    <span>{note}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-6 pt-4 border-t">
            <button
              onClick={() => scheduleReminder(task.id)}
              className="flex items-center space-x-2 border border-gray-300 hover:bg-gray-50 text-gray-700 px-4 py-2 rounded-lg text-sm transition-colors"
            >
              <Bell className="h-4 w-4" />
              <span>Set Reminder</span>
            </button>
            {task.status !== 'completed' && (
              <button
                onClick={() => markTaskComplete(task.id)}
                className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
              >
                <CheckCircle className="h-4 w-4" />
                <span>Mark Complete</span>
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  );

  const renderScheduleView = () => (
    <div className="space-y-6">
      {maintenanceSchedules.map((schedule) => (
        <div key={schedule.projectId} className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{schedule.projectName}</h3>
              <p className="text-gray-600">Project ID: {schedule.projectId}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Warranty Expires</p>
              <p className="font-semibold text-red-600">{schedule.warrantyExpiry.toLocaleDateString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Installation Date</p>
              <p className="font-semibold">{schedule.installationDate.toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Maintenance Interval</p>
              <p className="font-semibold">{schedule.maintenanceInterval} months</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Tasks</p>
              <p className="font-semibold">{schedule.tasks.length}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Maintenance Timeline</h4>
            <div className="space-y-3">
              {schedule.tasks
                .sort((a, b) => a.scheduledDate.getTime() - b.scheduledDate.getTime())
                .map((task) => (
                  <div key={task.id} className="flex items-center space-x-4 p-3 bg-gray-50 rounded-lg">
                    <div className={`w-3 h-3 rounded-full ${
                      task.status === 'completed' ? 'bg-green-500' :
                      task.status === 'in-progress' ? 'bg-blue-500' :
                      task.status === 'overdue' ? 'bg-red-500' : 'bg-gray-400'
                    }`}></div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-900">{task.description}</h5>
                      <p className="text-sm text-gray-600">{task.taskType} • {task.priority} priority</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{task.scheduledDate.toLocaleDateString()}</p>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <Wrench className="h-8 w-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Maintenance Scheduling</h1>
          </div>
          <p className="text-gray-600">Automated maintenance scheduling and reminders for your projects</p>
        </div>

        {/* Controls */}
        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
              <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
                {[
                  { id: 'calendar', name: 'Calendar', icon: Calendar },
                  { id: 'tasks', name: 'Tasks', icon: CheckCircle },
                  { id: 'schedule', name: 'Schedules', icon: Clock }
                ].map((view) => (
                  <button
                    key={view.id}
                    onClick={() => setSelectedView(view.id as any)}
                    className={`flex items-center space-x-2 px-4 py-2 rounded-md font-medium transition-colors ${
                      selectedView === view.id
                        ? 'bg-white text-blue-600 shadow-sm'
                        : 'text-gray-600 hover:text-gray-900'
                    }`}
                  >
                    <view.icon className="h-4 w-4" />
                    <span>{view.name}</span>
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-4">
                <select
                  value={selectedProject}
                  onChange={(e) => setSelectedProject(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm"
                >
                  <option value="all">All Projects</option>
                  {maintenanceSchedules.map((schedule) => (
                    <option key={schedule.projectId} value={schedule.projectId}>
                      {schedule.projectName}
                    </option>
                  ))}
                </select>

                <button
                  onClick={() => setShowNewTaskForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors"
                >
                  Schedule Task
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <motion.div
          key={selectedView}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {selectedView === 'calendar' && renderCalendarView()}
          {selectedView === 'tasks' && renderTasksView()}
          {selectedView === 'schedule' && renderScheduleView()}
        </motion.div>
      </div>
    </div>
  );
};

export default MaintenanceScheduling;