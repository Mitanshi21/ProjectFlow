import React, { useState, useRef, useEffect } from 'react';
import { 
  Home, Plus, Search, Edit, Download, Eye, Trash2, BarChart2, PieChart, ArrowLeft, 
  Calendar, DollarSign, Percent, User, Phone, FileText, AlertTriangle, CheckCircle, Clock, 
  ChevronDown, ChevronUp, CreditCard, Wallet, ArrowUp, ArrowDown, 
  Target, Check, X, List, BookOpen, Briefcase 
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart as RePieChart, Pie, Cell, ResponsiveContainer 
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

const initialProjects = [
  {
    id: 1,
    name: "Skyline Tower Construction",
    client: "Urban Developers Ltd.",
    contactPerson: "Rajesh Sharma",
    phone: "+91 98765 43210",
    gst: "27AABCU9603R1ZM",
    value: 2500000,
    received: 1500000,
    cashReceived: 250000,
    pending: 1000000,
    status: "running",
    progress: 65,
    startDate: "2023-01-15",
    expectedCompletion: "2024-06-30",
    timeline: [
      { phase: "Planning", startDate: "2023-01-15", endDate: "2023-03-20", completed: true, remark: "Approved by client" },
      { phase: "Foundation", startDate: "2023-03-25", endDate: "2023-06-10", completed: true, remark: "Structural integrity verified" },
      { phase: "Structure", startDate: "2023-06-15", endDate: "2023-11-30", completed: true, remark: "Framework completed" },
      { phase: "Finishing", startDate: "2023-12-01", endDate: "2024-04-15", completed: false, remark: "Interior work in progress" },
      { phase: "Handover", startDate: "2024-04-16", endDate: "2024-06-30", completed: false, remark: "Pending final inspection" }
    ],
    payments: [
      { date: "2023-02-10", amount: 500000, method: "Bank Transfer", remark: "Initial payment" },
      { date: "2023-04-15", amount: 750000, method: "Cheque", remark: "Foundation completion" },
      { date: "2023-08-20", amount: 250000, method: "Cash", remark: "Structure milestone" }
    ],
    remarks: "Client requested premium materials for finishing phase."
  },
  {
    id: 2,
    name: "Green Valley Resort",
    client: "Eco Hospitality Group",
    contactPerson: "Priya Mehta",
    phone: "+91 87654 32109",
    gst: "27AABCE8903R2ZN",
    value: 4200000,
    received: 4200000,
    cashReceived: 0,
    pending: 0,
    status: "completed",
    progress: 100,
    startDate: "2022-05-10",
    expectedCompletion: "2023-11-15",
    timeline: [
      { phase: "Planning", startDate: "2022-05-10", endDate: "2022-07-20", completed: true, remark: "Eco-certification obtained" },
      { phase: "Construction", startDate: "2022-07-25", endDate: "2023-05-10", completed: true, remark: "All permits secured" },
      { phase: "Landscaping", startDate: "2023-05-15", endDate: "2023-09-01", completed: true, remark: "Native plants used" },
      { phase: "Furnishing", startDate: "2023-09-05", endDate: "2023-10-20", completed: true, remark: "Sustainable furniture installed" },
      { phase: "Handover", startDate: "2023-10-25", endDate: "2023-11-15", completed: true, remark: "Client satisfied" }
    ],
    payments: [
      { date: "2022-06-01", amount: 1000000, method: "Bank Transfer", remark: "Initial payment" },
      { date: "2022-12-15", amount: 2000000, method: "Bank Transfer", remark: "Construction milestone" },
      { date: "2023-10-10", amount: 1200000, method: "Bank Transfer", remark: "Final payment" }
    ],
    remarks: "Project completed ahead of schedule with zero disputes."
  },
  {
    id: 3,
    name: "Metro Mall Renovation",
    client: "City Retail Ventures",
    contactPerson: "Vikram Singh",
    phone: "+91 76543 21098",
    gst: "27AABCR7803R3ZO",
    value: 1800000,
    received: 900000,
    cashReceived: 0,
    pending: 900000,
    status: "dispute",
    progress: 50,
    startDate: "2023-03-01",
    expectedCompletion: "2024-02-28",
    timeline: [
      { phase: "Planning", startDate: "2023-03-01", endDate: "2023-04-15", completed: true, remark: "Design approved" },
      { phase: "Demolition", startDate: "2023-04-20", endDate: "2023-06-10", completed: true, remark: "Completed without issues" },
      { phase: "Reconstruction", startDate: "2023-06-15", endDate: "2023-12-20", completed: false, remark: "Dispute over material quality" },
      { phase: "Finishing", startDate: "2023-12-21", endDate: "2024-02-10", completed: false, remark: "On hold pending resolution" },
      { phase: "Handover", startDate: "2024-02-11", endDate: "2024-02-28", completed: false, remark: "Delayed due to dispute" }
    ],
    payments: [
      { date: "2023-03-20", amount: 500000, method: "Bank Transfer", remark: "Initial payment" },
      { date: "2023-07-05", amount: 400000, method: "Cheque", remark: "Demolition completion" }
    ],
    remarks: "Dispute regarding material specifications. Legal consultation in progress."
  }
];

const statusColors = {
  running: "bg-blue-500/20 text-blue-700 border-blue-500",
  completed: "bg-green-500/20 text-green-700 border-green-500",
  dispute: "bg-orange-400/20 text-orange-700 border-orange-400"
};

const statusIcons = {
  running: <Clock className="w-5 h-5 text-blue-500" />,
  completed: <CheckCircle className="w-5 h-5 text-green-500" />,
  dispute: <AlertTriangle className="w-5 h-5 text-orange-400" />
};

const calculateProjectStatus = (project) => {
  // Check if there are disputes mentioned in remarks
  const hasDisputes = project.remarks.toLowerCase().includes('dispute') || 
                     project.remarks.toLowerCase().includes('issue') ||
                     project.remarks.toLowerCase().includes('conflict');
  
  // Check if all timeline phases are completed
  const allPhasesCompleted = project.timeline.every(phase => phase.completed);
  
  // Check if all payments are received (pending is 0)
  const allPaymentsReceived = project.pending <= 0;
  
  if (hasDisputes) {
    return "dispute";
  } else if (allPhasesCompleted && allPaymentsReceived) {
    return "completed";
  } else {
    return "running";
  }
};

const calculateProjectProgress = (project) => {
  if (project.timeline.length === 0) return 0;
  const completedPhases = project.timeline.filter(phase => phase.completed).length;
  return Math.round((completedPhases / project.timeline.length) * 100);
};

const App = () => {
  const [newProject, setNewProject] = useState({
    name: '',
    client: '',
    contactPerson: '',
    phone: '',
    gst: '',
    value: 0,
    received: 0,
    cashReceived: 0,
    pending: 0,
    status: 'running',
    progress: 0,
    startDate: '',
    expectedCompletion: '',
    timeline: [
      { phase: 'Planning', startDate: '', endDate: '', completed: false, remark: '' }
    ],
    payments: [
      { date: '', amount: 0, method: 'Bank Transfer', remark: '' }
    ],
    remarks: ''
  });
  const [projects, setProjects] = useState(initialProjects);
  const [currentView, setCurrentView] = useState('dashboard');
  const [selectedProject, setSelectedProject] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [isExpanded, setIsExpanded] = useState({});
  const [scrollPosition, setScrollPosition] = useState(0);
  const [isScrollTopVisible, setIsScrollTopVisible] = useState(false);
  const printRef = useRef();
  const containerRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => {
      const position = window.scrollY;
      setScrollPosition(position);
      setIsScrollTopVisible(position > 300);
      
      // Update the print content to match the current view
      if (printRef.current && containerRef.current) {
        printRef.current.innerHTML = containerRef.current.innerHTML;
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Filter projects based on search and status
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         project.contactPerson.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || project.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
    setCurrentView('project-detail');
    setIsEditing(false);
    setIsExpanded({});
  };

  const handleAddProject = () => {
    setSelectedProject(null);
    setNewProject({
      name: '',
      client: '',
      contactPerson: '',
      phone: '',
      gst: '',
      value: 0,
      received: 0,
      cashReceived: 0,
      pending: 0,
      status: 'running',
      progress: 0,
      startDate: '',
      expectedCompletion: '',
      timeline: [{ phase: 'Planning', startDate: '', endDate: '', completed: false, remark: '' }],
      payments: [{ date: '', amount: 0, method: 'Bank Transfer', remark: '' }],
      remarks: ''
    });
    setCurrentView('project-form');
    setIsEditing(true);
    setIsExpanded({});
  };

  const handleSaveProject = () => {
    // Calculate status based on data
    const updatedProject = {
      ...newProject,
      pending: newProject.value - newProject.received,
      status: calculateProjectStatus(newProject),
      progress: calculateProjectProgress(newProject)
    };
    
    if (selectedProject) {
      // Update existing project
      setProjects(projects.map(p => 
        p.id === selectedProject.id ? updatedProject : p
      ));
    } else {
      // Add new project
      const newId = Math.max(...projects.map(p => p.id), 0) + 1;
      setProjects([...projects, { ...updatedProject, id: newId }]);
    }
    
    setCurrentView('dashboard');
    setIsEditing(false);
  };

  const handleDeleteProject = (id) => {
    setProjects(projects.filter(p => p.id !== id));
    if (selectedProject && selectedProject.id === id) {
      setSelectedProject(null);
      setCurrentView('dashboard');
    }
  };

  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    
    document.body.innerHTML = `
      <html>
        <head>
          <title>ProjectFlow Report</title>
          <style>
            body { font-family: 'Inter', sans-serif; line-height: 1.6; color: #333; }
            .print-container { padding: 20mm; }
            .header { display: flex; align-items: center; margin-bottom: 30px; }
            .logo { font-size: 24px; font-weight: bold; color: #4f46e5; margin-right: 10px; }
            .subheader { font-size: 16px; color: #6b7280; }
            .section { margin-bottom: 25px; }
            .section-title { font-size: 20px; font-weight: 600; margin-bottom: 15px; color: #1e40af; }
            .project-name { font-size: 28px; font-weight: 700; margin: 10px 0; }
            .client-name { font-size: 22px; font-weight: 600; margin: 5px 0; color: #3b82f6; }
            .status-badge { display: inline-block; padding: 5px 10px; border-radius: 20px; font-size: 14px; font-weight: 500; }
            .table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            .table th, .table td { border: 1px solid #e5e7eb; padding: 12px 15px; text-align: left; }
            .table th { background-color: #f3f4f6; font-weight: 600; }
            .chart-container { margin: 25px 0; }
            .footer { margin-top: 40px; text-align: center; font-size: 14px; color: #6b7280; }
            .signature { margin-top: 50px; }
          </style>
        </head>
        <body>
          <div class="print-container">
            ${printContent}
          </div>
        </body>
      </html>
    `;
    
    window.print();
    document.body.innerHTML = originalContent;
    window.location.reload();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewProject(prev => {
      const updated = { ...prev, [name]: value };
      if (name === 'value' || name === 'received') {
        updated.pending = updated.value - updated.received;
      }
      return updated;
    });
  };

  const handlePaymentChange = (index, field, value) => {
    const updatedPayments = [...newProject.payments];
    updatedPayments[index][field] = value;
    setNewProject(prev => ({ ...prev, payments: updatedPayments }));
  };

  const handleTimelineChange = (index, field, value) => {
    const updatedTimeline = [...newProject.timeline];
    updatedTimeline[index][field] = value;
    setNewProject(prev => ({ ...prev, timeline: updatedTimeline }));
  };

  const togglePhase = (phaseId) => {
    setIsExpanded(prev => ({ ...prev, [phaseId]: !prev[phaseId] }));
  };

  const addNewPhase = () => {
    const newPhase = { phase: '', startDate: '', endDate: '', completed: false, remark: '' };
    setNewProject(prev => ({
      ...prev,
      timeline: [...prev.timeline, newPhase]
    }));
  };

  const removePhase = (index) => {
    if (newProject.timeline.length > 1) {
      const updatedTimeline = newProject.timeline.filter((_, i) => i !== index);
      setNewProject(prev => ({ ...prev, timeline: updatedTimeline }));
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  const statusData = [
    { name: 'Running', value: filteredProjects.filter(p => p.status === 'running').length },
    { name: 'Completed', value: filteredProjects.filter(p => p.status === 'completed').length },
    { name: 'Disputed', value: filteredProjects.filter(p => p.status === 'dispute').length }
  ];

  const financialData = [
    { name: 'Total Value', value: filteredProjects.reduce((sum, p) => sum + p.value, 0) },
    { name: 'Received', value: filteredProjects.reduce((sum, p) => sum + p.received, 0) },
    { name: 'Pending', value: filteredProjects.reduce((sum, p) => sum + p.pending, 0) }
  ];

  const COLORS = ['#3B82F6', '#10B981', '#F97316'];

  // Format numbers with commas for Indian numbering system
  const formatNumber = (num) => {
    if (num === null || num === undefined) return '0';
    return new Intl.NumberFormat('en-IN').format(num);
  };

  const formatCurrency = (num) => {
    if (num === null || num === undefined) return '₹0';
    return `₹${new Intl.NumberFormat('en-IN').format(num)}`;
  };

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col items-start"
            >
              <div className="flex items-center space-x-3">
                <div className="bg-indigo-600 p-2 rounded-xl">
                  <BarChart2 className="w-6 h-6 text-white" />
                </div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  ProjectFlow Dashboard
                </h1>
              </div>
              <p className="text-slate-500 text-sm mt-1">Northern Star Engineering</p>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  className="pl-9 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <button 
                onClick={handleAddProject}
                className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
              >
                <Plus className="w-4 h-4" />
                <span>Add Project</span>
              </button>
            </motion.div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="container mx-auto px-4 py-6" ref={containerRef}>
          {/* Filters */}
          <div className="flex flex-wrap gap-3 mb-6">
            <button 
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                filterStatus === 'all' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              All Projects
            </button>
            <button 
              onClick={() => setFilterStatus('running')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                filterStatus === 'running' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              <Clock className="w-4 h-4 mr-2" />
              Running
            </button>
            <button 
              onClick={() => setFilterStatus('completed')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                filterStatus === 'completed' 
                  ? 'bg-green-500 text-white' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Completed
            </button>
            <button 
              onClick={() => setFilterStatus('dispute')}
              className={`px-4 py-2 rounded-lg font-medium flex items-center transition-colors ${
                filterStatus === 'dispute' 
                  ? 'bg-orange-400 text-white' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50'
              }`}
            >
              <AlertTriangle className="w-4 h-4 mr-2" />
              Disputes
            </button>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700">Total Projects</h3>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <FileText className="w-5 h-5 text-blue-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-indigo-700">{filteredProjects.length}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-sm text-slate-500">Running: <span className="font-medium text-blue-600">{filteredProjects.filter(p => p.status === 'running').length}</span></span>
                <span className="text-sm text-slate-500">Completed: <span className="font-medium text-green-600">{filteredProjects.filter(p => p.status === 'completed').length}</span></span>
                <span className="text-sm text-slate-500">Disputes: <span className="font-medium text-orange-600">{filteredProjects.filter(p => p.status === 'dispute').length}</span></span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700">Total Value</h3>
                <div className="bg-green-100 p-2 rounded-lg">
                  <DollarSign className="w-5 h-5 text-green-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-indigo-700">{formatCurrency(filteredProjects.reduce((sum, p) => sum + p.value, 0))}</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-sm text-slate-500">Received: <span className="font-medium text-green-600">{formatCurrency(filteredProjects.reduce((sum, p) => sum + p.received, 0))}</span></span>
                <span className="text-sm text-slate-500">Pending: <span className="font-medium text-orange-600">{formatCurrency(filteredProjects.reduce((sum, p) => sum + p.pending, 0))}</span></span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700">Cash Received</h3>
                <div className="bg-amber-100 p-2 rounded-lg">
                  <Wallet className="w-5 h-5 text-amber-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-indigo-700">{formatCurrency(filteredProjects.reduce((sum, p) => sum + p.cashReceived, 0))}</p>
              <div className="mt-2">
                <span className="text-sm text-slate-500">({Math.round(filteredProjects.reduce((sum, p) => sum + p.cashReceived, 0) / filteredProjects.reduce((sum, p) => sum + p.value, 0) * 100)}% of total value)</span>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl shadow-md p-6 border border-slate-200 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-700">Avg. Progress</h3>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <Percent className="w-5 h-5 text-purple-500" />
                </div>
              </div>
              <p className="text-3xl font-bold text-indigo-700">
                {filteredProjects.length > 0 
                  ? Math.round(filteredProjects.reduce((sum, p) => sum + p.progress, 0) / filteredProjects.length) 
                  : 0}%
              </p>
              <div className="mt-2">
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div 
                    className="bg-indigo-600 h-2 rounded-full" 
                    style={{ width: `${filteredProjects.length > 0 ? Math.round(filteredProjects.reduce((sum, p) => sum + p.progress, 0) / filteredProjects.length) : 0}%` }}
                  ></div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl shadow-md p-6 border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <PieChart className="w-5 h-5 text-indigo-600 mr-2" />
                Project Status Distribution
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <RePieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} projects`} />
                    <Legend verticalAlign="bottom" height={36} />
                  </RePieChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl shadow-md p-6 border border-slate-200"
            >
              <h3 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
                <BarChart2 className="w-5 h-5 text-indigo-600 mr-2" />
                Financial Overview
              </h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                    <XAxis dataKey="name" stroke="#6b7280" />
                    <YAxis stroke="#6b7280" tickFormatter={formatCurrency} />
                    <Tooltip formatter={(value) => [formatCurrency(value), 'Amount']} />
                    <Legend />
                    <Bar dataKey="value" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                      {financialData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </motion.div>
          </div>

          {/* Projects Table */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200"
          >
            <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row md:justify-between md:items-center gap-4">
              <h2 className="text-xl font-bold text-slate-800">Projects Overview</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Project</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Client</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Progress</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Value (₹)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Received (₹)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Cash (₹)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Pending (₹)</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {filteredProjects.map((project) => (
                    <tr 
                      key={project.id} 
                      className="hover:bg-indigo-50/50 transition-colors cursor-pointer"
                      onClick={() => handleProjectSelect(project)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <span className="text-indigo-700 font-bold">{project.name.charAt(0)}</span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-slate-900">{project.name}</div>
                            <div className="text-xs text-slate-500">{project.startDate} to {project.expectedCompletion}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-900">{project.client}</div>
                        <div className="text-xs text-slate-500">{project.contactPerson}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-3 py-1 inline-flex items-center text-xs font-medium rounded-full border ${statusColors[project.status]}`}>
                          {statusIcons[project.status]}
                          <span className="ml-1">{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="w-24">
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${project.status === 'completed' ? 'bg-green-500' : project.status === 'dispute' ? 'bg-orange-400' : 'bg-blue-500'}`} 
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-slate-500 mt-1 block">{project.progress}%</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">
                        {formatCurrency(project.value)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600 font-medium">
                        {formatCurrency(project.received)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-amber-600 font-medium">
                        {formatCurrency(project.cashReceived)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-orange-600 font-medium">
                        {formatCurrency(project.pending)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        <div className="flex space-x-2">
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                              setNewProject(project);
                              setIsEditing(true);
                              setCurrentView('project-form');
                            }}
                            className="text-indigo-600 hover:text-indigo-900"
                            title="Edit Project"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteProject(project.id);
                            }}
                            className="text-rose-600 hover:text-rose-900"
                            title="Delete Project"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {filteredProjects.length === 0 && (
                    <tr>
                      <td colSpan="9" className="px-6 py-12 text-center text-slate-500">
                        No projects found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        </main>

        {/* Footer */}
        <footer className="py-4 bg-gradient-to-r from-indigo-600 to-purple-700 mt-8">
          <div className="container mx-auto px-4 text-center text-white text-sm">
            <p className="font-medium">ProjectFlow Dashboard</p>
            <p className="mt-1 text-indigo-100">Developed by Abhishek Jariwala for Northern Star Engineering</p>
          </div>
        </footer>

        {/* Scroll to Top Button */}
        <AnimatePresence>
          {isScrollTopVisible && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              onClick={scrollToTop}
              className="fixed bottom-6 right-6 bg-indigo-600 text-white p-3 rounded-full shadow-lg hover:bg-indigo-700 transition-colors z-50"
              aria-label="Scroll to top"
            >
              <ArrowUp className="w-5 h-5" />
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    );
  }

  if (currentView === 'project-detail' || currentView === 'project-form') {
    const isDetailView = currentView === 'project-detail' && !isEditing;
    const project = isDetailView ? selectedProject : newProject;
    const title = isDetailView ? project.name : (selectedProject ? "Edit Project" : "Add New Project");
    const subtitle = isDetailView ? project.client : "";

    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <button 
                onClick={() => {
                  setCurrentView('dashboard');
                  setSelectedProject(null);
                  setIsEditing(false);
                }}
                className="text-slate-600 hover:text-indigo-600 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {title}
                </h1>
                {subtitle && <p className="text-slate-500">{subtitle}</p>}
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              {isDetailView && (
                <>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="flex items-center space-x-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md"
                  >
                    <Edit className="w-4 h-4" />
                    <span>Edit Project</span>
                  </button>
                  <button 
                    onClick={handlePrint}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors shadow-md"
                  >
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </button>
                </>
              )}
            </motion.div>
          </div>
        </header>

        {/* Project Detail Content */}
        <main className="container mx-auto px-4 py-6">
          <div ref={printRef}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200 mb-8 print:shadow-none print:border-1">
              {/* Client Information */}
              <div className="p-6 border-b border-slate-200 bg-gradient-to-r from-indigo-50 to-purple-50">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div className="w-full">
                    <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center">
                      <User className="w-5 h-5 text-indigo-600 mr-2" />
                      Client Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Company Name</p>
                        {isDetailView ? (
                          <p className="font-medium">{project.client}</p>
                        ) : (
                          <input
                            type="text"
                            name="client"
                            value={project.client}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter client name"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Contact Person</p>
                        {isDetailView ? (
                          <p className="font-medium">{project.contactPerson}</p>
                        ) : (
                          <input
                            type="text"
                            name="contactPerson"
                            value={project.contactPerson}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter contact person"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">GST Number</p>
                        {isDetailView ? (
                          <p className="font-medium">{project.gst}</p>
                        ) : (
                          <input
                            type="text"
                            name="gst"
                            value={project.gst}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter GST number"
                          />
                        )}
                      </div>
                      <div>
                        <p className="text-sm text-slate-500 mb-1">Phone</p>
                        {isDetailView ? (
                          <p className="font-medium flex items-center">
                            <Phone className="w-4 h-4 mr-2 text-slate-400" />
                            {project.phone}
                          </p>
                        ) : (
                          <input
                            type="text"
                            name="phone"
                            value={project.phone}
                            onChange={handleInputChange}
                            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            placeholder="Enter phone number"
                          />
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 md:mt-0 flex-shrink-0">
                    <div className={`px-4 py-2 inline-flex items-center rounded-full text-sm font-medium border ${statusColors[project.status]}`}>
                      {statusIcons[project.status]}
                      <span className="ml-2">{project.status.charAt(0).toUpperCase() + project.status.slice(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Project Name */}
              <div className="p-6 border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-800 mb-1 flex items-center">
                  <Briefcase className="w-5 h-5 text-indigo-600 mr-2" />
                  Project Information
                </h2>
                <div className="mt-4">
                  <p className="text-sm text-slate-500 mb-1">Project Name</p>
                  {isDetailView ? (
                    <p className="text-2xl font-bold text-indigo-700">{project.name}</p>
                  ) : (
                    <input
                      type="text"
                      name="name"
                      value={project.name}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      placeholder="Enter project name"
                    />
                  )}
                </div>
              </div>

              {/* Project Summary */}
              <div className="p-6 border-b border-slate-200">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Project Value</p>
                    {isDetailView ? (
                      <p className="text-2xl font-bold text-indigo-700">{formatCurrency(project.value)}</p>
                    ) : (
                      <input
                        type="number"
                        name="value"
                        value={project.value}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Money Received</p>
                    {isDetailView ? (
                      <p className="text-2xl font-bold text-green-600">{formatCurrency(project.received)}</p>
                    ) : (
                      <input
                        type="number"
                        name="received"
                        value={project.received}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Cash Received</p>
                    {isDetailView ? (
                      <p className="text-2xl font-bold text-amber-600">{formatCurrency(project.cashReceived)}</p>
                    ) : (
                      <input
                        type="number"
                        name="cashReceived"
                        value={project.cashReceived}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Pending Amount</p>
                    <p className="text-2xl font-bold text-orange-600">{formatCurrency(project.pending)}</p>
                  </div>
                </div>
              </div>

              {/* Timeline and Progress */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <Calendar className="w-5 h-5 text-indigo-600 mr-2" />
                    Project Timeline
                  </h2>
                  {!isDetailView && (
                    <button 
                      onClick={addNewPhase}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Phase
                    </button>
                  )}
                </div>
                
                <div className="mb-6">
                  <div className="flex justify-between text-xs text-slate-500 mb-1">
                    <span>Progress</span>
                    <span>{project.progress}%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full ${project.status === 'completed' ? 'bg-green-500' : project.status === 'dispute' ? 'bg-orange-400' : 'bg-blue-500'}`} 
                      style={{ width: `${project.progress}%` }}
                    ></div>
                  </div>
                </div>

                <div className="space-y-4">
                  {project.timeline.map((phase, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg overflow-hidden">
                      <div 
                        className="flex items-center justify-between p-4 bg-slate-50 cursor-pointer hover:bg-slate-100 transition-colors"
                        onClick={() => togglePhase(index)}
                      >
                        <div className="flex items-center">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
                            phase.completed ? 'bg-green-500' : 'bg-slate-300'
                          }`}>
                            {phase.completed ? (
                              <CheckCircle className="w-5 h-5 text-white" />
                            ) : (
                              <span className="text-slate-700 font-bold text-sm">{index + 1}</span>
                            )}
                          </div>
                          <h3 className="font-bold text-slate-800">{phase.phase || 'Phase ' + (index + 1)}</h3>
                        </div>
                        <div>
                          {isExpanded[index] ? (
                            <ChevronUp className="w-5 h-5 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-5 h-5 text-slate-400" />
                          )}
                        </div>
                      </div>
                      
                      {isExpanded[index] && (
                        <div className="p-4 bg-white border-t border-slate-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm text-slate-500 mb-1">Phase Name</p>
                              {isDetailView ? (
                                <p className="font-medium">{phase.phase}</p>
                              ) : (
                                <input
                                  type="text"
                                  value={phase.phase}
                                  onChange={(e) => handleTimelineChange(index, 'phase', e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Enter phase name"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 mb-1">Start Date</p>
                              {isDetailView ? (
                                <p className="font-medium">{phase.startDate}</p>
                              ) : (
                                <input
                                  type="date"
                                  value={phase.startDate}
                                  onChange={(e) => handleTimelineChange(index, 'startDate', e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                              )}
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 mb-1">End Date</p>
                              {isDetailView ? (
                                <p className="font-medium">{phase.endDate}</p>
                              ) : (
                                <input
                                  type="date"
                                  value={phase.endDate}
                                  onChange={(e) => handleTimelineChange(index, 'endDate', e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                />
                              )}
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm text-slate-500 mb-1">Remark</p>
                              {isDetailView ? (
                                <p className="italic text-slate-600">"{phase.remark}"</p>
                              ) : (
                                <input
                                  type="text"
                                  value={phase.remark}
                                  onChange={(e) => handleTimelineChange(index, 'remark', e.target.value)}
                                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                                  placeholder="Enter remarks for this phase"
                                />
                              )}
                            </div>
                          </div>
                          
                          <div className="mt-4 flex items-center space-x-2">
                            <input
                              type="checkbox"
                              id={`phase-${index}-completed`}
                              checked={phase.completed}
                              onChange={(e) => handleTimelineChange(index, 'completed', e.target.checked)}
                              disabled={isDetailView}
                              className="rounded text-indigo-600 focus:ring-indigo-500"
                            />
                            <label htmlFor={`phase-${index}-completed`} className="text-sm text-slate-700">
                              Mark as completed
                            </label>
                          </div>
                          
                          {!isDetailView && project.timeline.length > 1 && (
                            <button
                              onClick={() => removePhase(index)}
                              className="mt-3 text-rose-600 hover:text-rose-800 text-sm flex items-center"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Remove Phase
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Details */}
              <div className="p-6 border-b border-slate-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-slate-800 flex items-center">
                    <DollarSign className="w-5 h-5 text-indigo-600 mr-2" />
                    Payment History
                  </h2>
                  {!isDetailView && (
                    <button 
                      onClick={() => {
                        const newPayment = { date: '', amount: 0, method: 'Bank Transfer', remark: '' };
                        setNewProject(prev => ({ 
                          ...prev, 
                          payments: [...prev.payments, newPayment] 
                        }));
                      }}
                      className="text-indigo-600 hover:text-indigo-800 text-sm font-medium flex items-center"
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Add Payment
                    </button>
                  )}
                </div>
                
                <div className="space-y-4">
                  {project.payments.map((payment, index) => (
                    <div key={index} className="border border-slate-200 rounded-lg p-4 bg-slate-50">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Date</p>
                          {isDetailView ? (
                            <p className="font-medium">{payment.date}</p>
                          ) : (
                            <input
                              type="date"
                              value={payment.date}
                              onChange={(e) => handlePaymentChange(index, 'date', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Amount (₹)</p>
                          {isDetailView ? (
                            <p className="font-medium text-green-600">{formatCurrency(payment.amount)}</p>
                          ) : (
                            <input
                              type="number"
                              value={payment.amount}
                              onChange={(e) => handlePaymentChange(index, 'amount', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            />
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Method</p>
                          {isDetailView ? (
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              payment.method === 'Cash' 
                                ? 'bg-amber-100 text-amber-800' 
                                : 'bg-blue-100 text-blue-800'
                            }`}>
                              {payment.method === 'Cash' ? (
                                <span className="flex items-center">
                                  <Wallet className="w-3 h-3 mr-1" />
                                  Cash
                                </span>
                              ) : (
                                <span className="flex items-center">
                                  <CreditCard className="w-3 h-3 mr-1" />
                                  {payment.method}
                                </span>
                              )}
                            </span>
                          ) : (
                            <select
                              value={payment.method}
                              onChange={(e) => handlePaymentChange(index, 'method', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                            >
                              <option>Bank Transfer</option>
                              <option>Cheque</option>
                              <option>Cash</option>
                              <option>UPI</option>
                            </select>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-slate-500 mb-1">Remark</p>
                          {isDetailView ? (
                            <p className="italic text-slate-600">"{payment.remark}"</p>
                          ) : (
                            <input
                              type="text"
                              value={payment.remark}
                              onChange={(e) => handlePaymentChange(index, 'remark', e.target.value)}
                              className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                              placeholder="Enter payment remarks"
                            />
                          )}
                        </div>
                      </div>
                      
                      {!isDetailView && project.payments.length > 1 && (
                        <button
                          onClick={() => {
                            const updatedPayments = project.payments.filter((_, i) => i !== index);
                            setNewProject(prev => ({ ...prev, payments: updatedPayments }));
                          }}
                          className="mt-3 text-rose-600 hover:text-rose-800 text-sm flex items-center"
                        >
                          <Trash2 className="w-4 h-4 mr-1" />
                          Remove Payment
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Remarks */}
              <div className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-2 flex items-center">
                  <FileText className="w-5 h-5 text-indigo-600 mr-2" />
                  Remarks
                </h2>
                {isDetailView ? (
                  <p className="text-slate-700 italic">"{project.remarks}"</p>
                ) : (
                  <textarea
                    name="remarks"
                    value={project.remarks}
                    onChange={handleInputChange}
                    rows="3"
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    placeholder="Enter project remarks..."
                  />
                )}
              </div>
            </div>

            {/* Project Charts - Only in detail view */}
            {isDetailView && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">Payment Timeline</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={project.payments} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                        <XAxis dataKey="date" stroke="#6b7280" />
                        <YAxis stroke="#6b7280" />
                        <Tooltip formatter={(value) => formatCurrency(value)} />
                        <Bar dataKey="amount" fill="#3B82F6" radius={[4, 4, 0, 0]}>
                          {project.payments.map((entry, index) => (
                            <Cell 
                              key={`cell-${index}`} 
                              fill={entry.method === 'Cash' ? '#F59E0B' : '#3B82F6'} 
                            />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white rounded-xl shadow-md p-6 border border-slate-200">
                  <h3 className="text-lg font-semibold text-slate-700 mb-4">Phase Completion</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <RePieChart>
                        <Pie
                          data={[
                            { name: 'Completed Phases', value: project.timeline.filter(p => p.completed).length },
                            { name: 'Pending Phases', value: project.timeline.filter(p => !p.completed).length }
                          ]}
                          cx="50%"
                          cy="50%"
                          innerRadius={40}
                          outerRadius={70}
                          fill="#8884d8"
                          paddingAngle={2}
                          dataKey="value"
                          label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        >
                          <Cell fill="#10B981" />
                          <Cell fill="#94A3B8" />
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} phases`, name]} />
                        <Legend verticalAlign="bottom" height={36} />
                      </RePieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons for Form View */}
          {!isDetailView && (
            <div className="flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4 mt-6">
              <button
                onClick={() => {
                  setCurrentView('dashboard');
                  setIsEditing(false);
                }}
                className="px-6 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProject}
                className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-md w-full sm:w-auto"
              >
                {selectedProject ? 'Update Project' : 'Create Project'}
              </button>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-4 bg-gradient-to-r from-indigo-600 to-purple-700 mt-8">
          <div className="container mx-auto px-4 text-center text-white text-sm">
            <p className="font-medium">ProjectFlow Dashboard</p>
            <p className="mt-1 text-indigo-100">Developed by Abhishek Jariwala for Northern Star Engineering</p>
          </div>
        </footer>
      </div>
    );
  }

  return <div>Loading...</div>;
};

export default App;
