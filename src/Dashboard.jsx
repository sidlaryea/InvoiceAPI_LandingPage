import { AlertCircle, BarChart3, TrendingUp, Shield, Clock, Key, Calendar, Crown, Check, ArrowRight, User, Bell, Settings, LogOut } from 'lucide-react';
import { useState } from 'react';

export default function Dashboard({ formData, apiUsage, apiKey }) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  
  // Add console logging to debug props
  console.log('Dashboard props:', { formData, apiUsage, apiKey });
  
  // Provide default values to prevent crashes
  const safeFormData = formData || { firstName: 'User', lastName: 'Demo' };
  const safeApiUsage = apiUsage || {
    currentUsage: 0,
    monthlyLimit: 1000,
    totalRequests: 0,
    successRate: 99,
    avgResponseTime: 250
  };
  const safeApiKey = apiKey || 'api_xxxxxxxxxxxxxxxxx';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800">
      {/* Enhanced Navbar */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50 transition-all duration-300">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <img src="./logo.png" alt="InvoiceAPI Logo" className="h-9 w-9 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold text-blue-600 transition-colors group-hover:text-blue-700">
              InvoiceAPI by SidConsult
            </span>
          </div>
          
          {/* Profile Section */}
          <div className="flex items-center space-x-4">
            <button className="p-2 rounded-full hover:bg-gray-100 transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
            </button>
            
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-100 transition-colors"
              >
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
                <div className="text-left hidden sm:block">
                  <p className="text-sm font-medium text-gray-900">{safeFormData.firstName} {safeFormData.lastName}</p>
                  <p className="text-xs text-gray-500">Free Plan</p>
                </div>
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <User className="w-4 h-4 mr-3" />
                    Profile
                  </a>
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    <Settings className="w-4 h-4 mr-3" />
                    Settings
                  </a>
                  <hr className="my-2" />
                  <a href="#" className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50">
                    <LogOut className="w-4 h-4 mr-3" />
                    Sign Out
                  </a>
                </div>
              )}
            </div>
          </div>
        </nav>
      </header>

      <div className="pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
              

          {/* Debug Info - Remove this in production */}
          {/* <div className="mb-4 p-4 bg-yellow-100 border border-yellow-300 rounded-lg">
            <h3 className="font-bold text-yellow-800">Debug Info:</h3>
            <p className="text-sm text-yellow-700">
              Props received: formData={formData ? '✓' : '✗'}, apiUsage={apiUsage ? '✓' : '✗'}, apiKey={apiKey ? '✓' : '✗'}
            </p>
          </div> */}

          {/* Welcome Section */}
          <div className="mb-8 text-center text-white">
            <h1 className="text-4xl font-bold mb-2">
              Welcome back, {safeFormData.firstName}! 👋
            </h1>
            <p className="text-blue-100 text-lg">Here's your API usage overview and account details.</p>
          </div>

          {/* Usage Alert */}
          {safeApiUsage.currentUsage / safeApiUsage.monthlyLimit > 0.8 && (
            <div className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center">
                <AlertCircle className="w-5 h-5 text-orange-600 mr-3" />
                <div className="flex-1">
                  <h3 className="text-sm font-semibold text-orange-800">Usage Alert</h3>
                  <p className="text-sm text-orange-700">
                    You've used {Math.round((safeApiUsage.currentUsage / safeApiUsage.monthlyLimit) * 100)}% of your monthly limit. 
                    Consider upgrading to avoid service interruption.
                  </p>
                </div>
                <button className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-lg font-medium hover:from-orange-600 hover:to-red-600 transition-all flex items-center">
                  <Crown className="w-4 h-4 mr-2" />
                  Upgrade Now
                </button>
              </div>
            </div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Monthly Usage */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{safeApiUsage.currentUsage}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600 mb-2">Monthly Usage</h3>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${(safeApiUsage.currentUsage / safeApiUsage.monthlyLimit) * 100}%` }}
                ></div>
              </div>
              <p className="text-xs text-gray-500 mt-2">{safeApiUsage.currentUsage} / {safeApiUsage.monthlyLimit} requests</p>
            </div>

            {/* Total Requests */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-lg flex items-center justify-center shadow-lg">
                  <TrendingUp className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{safeApiUsage.totalRequests.toLocaleString()}</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Total Requests</h3>
              <p className="text-sm text-green-600 font-medium mt-2">+12% from last month</p>
            </div>

            {/* Success Rate */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Shield className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{safeApiUsage.successRate}%</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Success Rate</h3>
              <p className="text-sm text-green-600 font-medium mt-2">Excellent performance</p>
            </div>

            {/* Avg Response Time */}
            <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-lg flex items-center justify-center shadow-lg">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <span className="text-2xl font-bold text-gray-900">{safeApiUsage.avgResponseTime}ms</span>
              </div>
              <h3 className="text-sm font-medium text-gray-600">Avg Response Time</h3>
              <p className="text-sm text-green-600 font-medium mt-2">Fast & reliable</p>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* API Key Section & Activity */}
            <div className="lg:col-span-2">
              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20 mb-6">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Key className="w-5 h-5 mr-2" />
                  Your API Key
                </h2>
                <div className="bg-gray-50 rounded-lg p-4 font-mono text-sm break-all border">
                  {safeApiKey}
                </div>
                <p className="text-sm text-gray-600 mt-3 flex items-center">
                  <Shield className="w-4 h-4 mr-1" />
                  Keep your API key secure and never share it publicly
                </p>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Recent Activity
                </h2>
                <div className="space-y-4">
                  {[{ time: '2 hours ago', action: 'API call to /users endpoint', status: 'success' },
                    { time: '5 hours ago', action: 'API call to /data endpoint', status: 'success' },
                    { time: '1 day ago', action: 'API key regenerated', status: 'info' },
                    { time: '2 days ago', action: 'Account created', status: 'info' }
                  ].map((activity, index) => (
                    <div key={index} className="flex items-center py-3 border-b border-gray-100 last:border-b-0">
                      <div className={`w-2 h-2 rounded-full mr-3 ${activity.status === 'success' ? 'bg-green-500' : 'bg-blue-500'}`}></div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="text-xs text-gray-500">{activity.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Upgrade & Quick Actions */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl p-6 text-white shadow-lg">
                <div className="flex items-center mb-4">
                  <Crown className="w-8 h-8 mr-3" />
                  <h2 className="text-xl font-bold">Upgrade to Pro</h2>
                </div>
                <p className="text-purple-100 mb-4">
                  Unlock higher rate limits, priority support, and advanced analytics.
                </p>
                <ul className="space-y-2 mb-6 text-sm text-purple-100">
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    10,000 requests/month
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Priority support
                  </li>
                  <li className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    Advanced analytics
                  </li>
                </ul>
                <button className="w-full bg-white text-purple-600 font-semibold py-3 rounded-lg hover:bg-purple-50 transition-colors flex items-center justify-center">
                  Upgrade Now
                  <ArrowRight className="w-4 h-4 ml-2" />
                </button>
              </div>

              <div className="bg-white/95 backdrop-blur-sm rounded-xl shadow-lg p-6 border border-white/20">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="space-y-3">
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center">
                    <Key className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Regenerate API Key</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center">
                    <BarChart3 className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">View Analytics</span>
                  </button>
                  <button className="w-full text-left p-3 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors flex items-center">
                    <Shield className="w-5 h-5 text-gray-600 mr-3" />
                    <span className="text-sm font-medium text-gray-900">Security Settings</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
         {/* Enhanced Footer */}
      <footer role="contentinfo" aria-label="Footer" lang="en" dir="ltr" className=" text-white py-0.5  bottom-0 left-0 w-full">
  <div className="container mx-auto p-2 md:p-4">
    <div className="text-center">
      <p className="text-gray-400 mb-2">
        &copy; 2025 InvoiceAPI. Powered By Sidconsult. All rights reserved.
      </p>
    </div>
  </div>
</footer>

    </div>
  );
}