import { useNavigate } from 'react-router-dom';
import React, { useState,  } from 'react';
import { Briefcase, Layers, Store, Play, Check, X, Menu, ChevronDown } from "lucide-react";
import DemoPoster from '/DemoPoster.png';
import {Link} from 'react-router-dom';
import emailjs from '@emailjs/browser';
import toast from 'react-hot-toast';


function Home() {
  // const [isPlaying, setIsPlaying] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  // const videoRef = useRef(null);

  // const handlePlayVideo = () => {
  //   if (videoRef.current) {
  //     videoRef.current.play();
  //     setIsPlaying(true);
  //   }
  // };

  // const handleVideoEnded = () => {
  //   setIsPlaying(false);
  // };

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setTimeout(() => {
        setSubscribed(false);
        setEmail('');
      }, 3000);
    }
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const downloadAPIDocs = () => {
    const link = document.createElement('a');
    link.href = './InvoiceAPI_Developer_Onboarding_Guide.pdf';
    link.download = 'InvoiceAPI_Developer_Onboarding_Guide.pdf';
    link.click();
  };
  const navigate = useNavigate();

  const sendEmail = async () => {
    try {
      await emailjs.send(
        'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
        'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
        {
          subject: 'Enterprise Add-on Access Request',
          message: 'A user has requested access to the Enterprise Add-on.',
        },
        'YOUR_PUBLIC_KEY' // Replace with your EmailJS public key
      );
      toast.success('Email sent successfully!');
    } catch {
      toast.error('Failed to send email. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Enhanced Navbar */}
      <header className="bg-white/95 backdrop-blur-sm shadow-lg fixed w-full z-50 transition-all duration-300">
        <div className="absolute left-0 top-0 h-full flex items-center px-4">
          <div className="flex items-center space-x-3 group">
            <div className="relative">
              <img src="./logo.png" alt="InvoiceAPI Logo" className="h-9 w-9 transition-transform group-hover:scale-110" />
              <div className="absolute inset-0 bg-blue-500 rounded-full opacity-0 group-hover:opacity-20 transition-opacity"></div>
            </div>
            <span className="text-xl font-bold text-blue-600 transition-colors group-hover:text-blue-700">
              InvoiceAPI by SidConsult
            </span>
          </div>
        </div>
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">

          {/* Desktop Menu */}
          <div className="hidden md:flex ml-auto space-x-8 text-sm text-gray-700">
            <button onClick={() => scrollToSection('demo')} className="hover:text-blue-600 transition-colors relative group cursor-pointer">
              Demo
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 cursor-pointer"></span>
            </button>
            <button onClick={() => scrollToSection('pricing')} className="hover:text-blue-600 transition-colors relative group cursor-pointer">
              Pricing
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 cursor-pointer"></span>
            </button>
            <button onClick={() => scrollToSection('docs')} className="hover:text-blue-600 transition-colors relative group cursor-pointer">
              Docs
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 cursor-pointer"></span>
            </button>
            <button onClick={downloadAPIDocs} className="hover:text-blue-600 transition-colors relative group cursor-pointer">
              API Documentation
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300 cursor-pointer"></span>
            </button>
            <button className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-6 py-2 rounded-full hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 hover:shadow-lg cursor-pointer">
              Sign Up
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        </nav>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white border-t shadow-lg ">
            <div className="px-4 py-2 space-y-2">
              <button onClick={() => scrollToSection('demo')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded">Demo</button>
              <button onClick={() => scrollToSection('pricing')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded">Pricing</button>
              <button onClick={() => scrollToSection('docs')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 rounded">Docs</button>
              <button className="w-full bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600 transition-colors">Sign Up</button>
            </div>
          </div>
        )}
      </header>

      {/* Enhanced Hero Section */}
      <section className="pt-32 pb-20 text-center bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-pulse animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in-up">
            Invoice and Payment Management + API Access 
            <span className="block text-4xl md:text-5xl text-blue-200 mt-2">In Seconds</span>
          </h1>
          <p className="mb-10 text-xl md:text-2xl text-blue-100 animate-fade-in-up animation-delay-500">
            Fast, reliable, and user-friendly invoice generation software with powerful API integration.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up animation-delay-1000">
            
            <button onClick={() => navigate('/Registration')}
            className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-full hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl hover:shadow-2xl cursor-pointer">
              Start Free Trial
            </button>
            
            <button 
              onClick={() => scrollToSection('demo')}
              className="border-2 border-white text-white font-semibold px-8 py-4 rounded-full hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Play className="w-5 h-5" />
              Watch Demo
            </button>
          </div>
        </div>
      </section>

      {/* Enhanced Demo Section */}
      <section id="demo" className="bg-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">
            See It in Action
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            Watch how effortlessly you can create and manage invoices using our intuitive API.
          </p>
          
          <div className="relative rounded-xl overflow-hidden shadow-lg">
            <video
              src="Demo.mp4"
              controls
              poster="preview.png"
              className="w-full rounded-xl border border-gray-200"
            >
              Your browser does not support the video tag.
            </video>
          </div>

          <p className="mt-8 text-gray-500">
            Need help getting started? 
            <button className="text-blue-600 hover:underline ml-1 font-medium">
              Contact our support team
            </button>
          </p>
        </div>
      </section>

      {/* Enhanced Use Cases Section */}
      <section className="py-20 bg-gray-50" id="use-cases">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Who is it for?</h2>
          <p className="text-gray-600 mb-16 text-xl max-w-3xl mx-auto">
            Our invoicing solution is designed to serve professionals, startups, and platforms alike.
          </p>

          <div className="grid gap-8 md:grid-cols-3">
            {/* Freelancers */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
              <div className="flex justify-center mb-6 text-blue-600 transform transition-transform group-hover:scale-110">
                <div className="p-4 bg-blue-50 rounded-2xl">
                  <Briefcase className="w-12 h-12" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Freelancers</h3>
              <p className="text-gray-600">
                Create and send polished invoices in seconds — no accounting skills needed.
              </p>
            </div>

            {/* SaaS Businesses */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group md:scale-105">
              <div className="flex justify-center mb-6 text-green-600 transform transition-transform group-hover:scale-110">
                <div className="p-4 bg-green-50 rounded-2xl">
                  <Layers className="w-12 h-12" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">SaaS Businesses</h3>
              <p className="text-gray-600">
                Seamlessly integrate invoicing into your app with our flexible API.
              </p>
            </div>

            {/* Marketplaces */}
            <div className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 group">
              <div className="flex justify-center mb-6 text-purple-600 transform transition-transform group-hover:scale-110">
                <div className="p-4 bg-purple-50 rounded-2xl">
                  <Store className="w-12 h-12" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-800 mb-4">Marketplaces</h3>
              <p className="text-gray-600">
                Automatically generate receipts for vendors and partners at scale.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Pricing Section */}
      <section id="pricing" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-6">Simple, Transparent Pricing</h2>
          <p className="text-xl text-gray-600 mb-16 max-w-3xl mx-auto">
            Choose the plan that fits your business best. No hidden fees. Cancel anytime.
          </p>
          
          <div className="flex flex-col lg:flex-row justify-center items-stretch gap-8 max-w-5xl mx-auto">
            
            {/* Free Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-8 flex flex-col items-center w-full lg:w-80 transition-all duration-300 hover:shadow-2xl hover:border-blue-300 group">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Starter</h3>
              <p className="text-gray-600 mb-6 text-center">Perfect for freelancers just getting started</p>
              <div className="mb-6">
                <p className="text-5xl font-bold text-blue-600 mb-2">$0</p>
                <p className="text-gray-500">Trial Package</p>
              </div>
              <ul className="text-gray-600 mb-8 space-y-3 flex-grow">
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Up to 20 invoices/month</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Email support</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Export as PDF</li>
              </ul>
              <button  onClick={() => navigate('/Registration')} className="w-full bg-blue-500 text-white px-6 py-3 rounded-xl hover:bg-blue-600 transition-all duration-300 transform group-hover:scale-105 font-semibold cursor-pointer ">
                Begin Free Trial
              </button>
            </div>

            {/* Pro Plan */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-3xl shadow-2xl p-8 flex flex-col items-center w-full lg:w-80 transform scale-105 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-yellow-400 to-orange-400 text-center py-2 text-sm font-semibold text-gray-900">
                 MOST POPULAR
              </div>
              <div className="mt-8">
                <h3 className="text-2xl font-semibold mb-2">Pro</h3>
                <p className="text-blue-100 mb-6 text-center">Ideal for growing businesses needing flexibility</p>
                <div className="mb-6">
                  <p className="text-5xl font-bold mb-2">$19<span className="text-xl font-medium">/mo</span></p>
                  <p className="text-blue-200">or $199/year (save 12%)</p>
                </div>
                <ul className="text-blue-100 mb-8 space-y-3 flex-grow">
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-300 mr-2" /> Unlimited invoices</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-300 mr-2" /> Priority email support</li>
                  <li className="flex items-center"><Check className="w-5 h-5 text-green-300 mr-2" /> Branded PDF templates</li>
                </ul>
                <button onClick={() => navigate('/UpgradePage')} className="w-full bg-white text-blue-600 px-6 py-3 rounded-xl hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg cursor-pointer">
                  Start Pro Today
                </button>
              </div>
            </div>

            {/* Business Plan */}
            <div className="bg-white border-2 border-gray-200 rounded-3xl shadow-lg p-8 flex flex-col items-center w-full lg:w-80 transition-all duration-300 hover:shadow-2xl hover:border-purple-300 group">
              <h3 className="text-2xl font-semibold mb-2 text-gray-800">Enterprise</h3>
              <p className="text-gray-600 mb-6 text-center">For teams and enterprises with advanced needs</p>
              <div className="mb-6">
                <p className="text-5xl font-bold text-purple-600 mb-2">$49<span className="text-xl font-medium">/mo</span></p>
                <p className="text-gray-500">Billed monthly</p>
              </div>
              <ul className="text-gray-600 mb-8 space-y-3 flex-grow">
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Custom branding</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Priority support & SLA</li>
                <li className="flex items-center"><Check className="w-5 h-5 text-green-500 mr-2" /> Team access and permissions</li>
              </ul>
              <button onClick={sendEmail} className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform group-hover:scale-105 cursor-pointer">
                Contact Sales
              </button>
            </div>

          </div>
        </div>
      </section>

      {/* Enhanced Code Sample */}
      <section id="docs" className="py-20 bg-gray-900 text-white">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-6">API Usage Example</h2>
          <p className="text-xl text-gray-300 text-center mb-12">Simple, powerful, and ready to integrate</p>
          
          <div className="bg-gray-800 rounded-2xl p-6 shadow-2xl border border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <div className="flex space-x-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              </div>
              <span className="text-gray-400 text-sm">invoice-response.json</span>
            </div>
            <pre className="text-green-300 overflow-x-auto text-sm leading-relaxed">
{`{
  "id": 18,
  "invoiceNumber": "INV-66E3E2D6",
  "issueDate": "2025-05-20T15:59:02.3488314Z",
  "dueDate": "2025-05-25T15:59:02.3489445Z",
  "status": "Draft",
  "customer": {
    "id": 1013,
    "fullName": "Test Customer",
    "email": "Test@example.com",
    "phone": "+102365489",
    "address": "Test Address"
  },
  "items": [
    {
      "id": 1002,
      "product": {
        "id": 1,
        "name": "Requirement Elicitation",
        "description": "Requirements Finalization & Design",
        "price": 25
      },
      "description": "Requirements Finalization & Design",
      "quantity": 2,
      "unitPrice": 25,
      "total": 50
    }
  ]
}`}
            </pre>
          </div>
        </div>
      </section>

      {/* Enhanced Testimonials */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16 text-gray-800">What Our Users Say</h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">⭐</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 text-lg">"Super easy to integrate and saves us hours every week!"</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  J
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Jane Smith</span>
                  <p className="text-gray-600 text-sm">Startup CTO</p>
                </div>
              </div>
            </div>
            <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i} className="text-xl">⭐</span>
                  ))}
                </div>
              </div>
              <p className="text-gray-700 mb-4 text-lg">"The best invoice API we've used. Highly recommended."</p>
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full flex items-center justify-center text-white font-bold mr-3">
                  M
                </div>
                <div>
                  <span className="font-semibold text-gray-800">Mike Johnson</span>
                  <p className="text-gray-600 text-sm">SaaS Founder</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Enhanced Newsletter CTA */}
      <section className="py-20 bg-white text-center">
        <div className="max-w-4xl mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-gray-800">Stay Updated</h2>
          <p className="mb-10 text-xl text-gray-600">Get tips, updates, and feature announcements.</p>
          
          {subscribed ? (
            <div className="bg-green-50 border-2 border-green-200 rounded-2xl p-8 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-4">
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-8 h-8 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-green-800 mb-2">Thank you!</h3>
              <p className="text-green-700">You've been successfully subscribed to our newsletter.</p>
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 p-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors text-lg"
              />
              <button 
                onClick={handleSubscribe}
                className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-8 py-4 rounded-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 transform hover:scale-105 font-semibold shadow-lg"
              >
                Subscribe
              </button>
            </div>
          )}
        </div>
      </section>
      

      {/* Enhanced Final CTA */}
      <section id="signup" className="py-20 text-center bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative z-10 max-w-4xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to get started?</h2>
          <p className="text-xl mb-10 text-blue-100">Join thousands of developers who trust InvoiceAPI</p>
          <button onClick={() => navigate('/Registration')}
          className="inline-block bg-white text-blue-600 font-bold px-10 py-5 rounded-2xl shadow-2xl hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 text-lg cursor-pointer">
            Get Your API Key Now
          </button>
        </div>
      </section>

      {/* Enhanced Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <img src="./logo.png" alt="InvoiceAPI Logo" className="h-8 w-8" />
              <span className="text-xl font-bold">InvoiceAPI by SidConsult</span>
            </div>
            <p className="text-gray-400 mb-6">&copy; 2025 InvoiceAPI. Powered By Sidconsult. All rights reserved.</p>
            <div className="flex justify-center space-x-8 text-sm">
              <button className="hover:text-blue-400 transition-colors">Privacy Policy</button>
              <button className="hover:text-blue-400 transition-colors">Terms of Service</button>
              <button className="hover:text-blue-400 transition-colors">Contact</button>
            </div>
          </div>
        </div>
      </footer>
    </div>

          
);
  
}


export default Home;