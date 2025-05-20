import './App.css';
import { Briefcase, Layers, Store } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navbar */}
      <header className="bg-white shadow fixed w-full z-10">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <img src="/logo.png" alt="InvoiceAPI Logo" className="h-8 w-8" />
            <span className="text-xl font-bold text-blue-600">InvoiceAPI by SidConsult</span>
          </div>
          <div className="space-x-6 text-sm text-gray-700">
            <a href="#demo" className="hover:text-blue-600">Demo</a>
            <a href="#pricing" className="hover:text-blue-600">Pricing</a>
            <a href="#docs" className="hover:text-blue-600">Docs</a>
            <a href="#signup" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Sign Up</a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-28 pb-16 text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white">
        <h1 className="text-5xl font-bold mb-4">Generate Invoices via API in Seconds</h1>
        <p className="mb-8 text-lg">Fast, reliable, and developer-friendly invoice generation.</p>
        <a
          href="#signup"
          className="inline-block bg-white text-blue-600 font-semibold px-6 py-3 rounded shadow hover:bg-blue-100 transition"
        >
          Get Started Free
        </a>
      </section>

      {/* Trusted By */}
      <section className="bg-white py-8 text-center">
        {/* <p className="mb-4 text-gray-600">Trusted by startups and developers worldwide</p> */}
        {/* <div className="flex justify-center space-x-8 grayscale opacity-60">
          <img src="/logo1.png" alt="client1" className="h-8" />
          <img src="/logo2.png" alt="client2" className="h-8" />
          <img src="/logo3.png" alt="client3" className="h-8" />
        </div> */}
      </section>

      {/* Demo Section */}
      {/* <p className="text-gray-600" align="center"><b>See how easy it is to generate invoices with our API.</b></p> */}
      <section id="demo" className="bg-gray-50 py-16 px-4">
  <div className="max-w-5xl mx-auto text-center">
    <h2 className="text-3xl font-extrabold text-gray-800 mb-4">
      See It in Action
    </h2>
    <p className="text-lg text-gray-600 mb-8">
      Watch how effortlessly you can create and manage invoices using our intuitive API.
    </p>
    
    <div className="relative rounded-xl overflow-hidden shadow-lg">
      <video
        src="Demo.mp4"
        controls
        poster="/DemoPoster.png"
        className="w-full rounded-xl border border-gray-200"
      >
        Your browser does not support the video tag.
      </video>

      {/* Optional Overlay Play Icon for Aesthetic (if using auto poster w/ JS) */}
      {/* <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-20">
        <button className="text-white text-4xl hover:scale-105 transition-transform">
          <i className="fas fa-play-circle"></i>
        </button>
      </div> */}
    </div>

    <p className="mt-6 text-sm text-gray-500">
      Need help getting started? <a href="#contact" className="text-blue-600 hover:underline">Contact our support team</a>.
    </p>
  </div>
</section>


      {/* Use Cases Section */}
      <section className="py-16 bg-gray-100" id="use-cases">
  <div className="max-w-6xl mx-auto px-4 text-center">
    <h2 className="text-3xl font-extrabold text-gray-800 mb-4">Who is it for?</h2>
    <p className="text-gray-600 mb-12 text-lg">
      Our invoicing solution is designed to serve professionals, startups, and platforms alike.
    </p>

    <div className="grid gap-8 md:grid-cols-3">
      {/* Freelancers */}
      <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition-shadow text-center">
        <div className="flex justify-center mb-4 text-blue-600">
          <Briefcase className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Freelancers</h3>
        <p className="text-gray-600 text-sm">
          Create and send polished invoices in seconds — no accounting skills needed.
        </p>
      </div>

      {/* SaaS Businesses */}
      <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition-shadow text-center">
        <div className="flex justify-center mb-4 text-green-600">
          <Layers className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">SaaS Businesses</h3>
        <p className="text-gray-600 text-sm">
          Seamlessly integrate invoicing into your app with our flexible API.
        </p>
      </div>

      {/* Marketplaces */}
      <div className="bg-white p-8 rounded-2xl shadow hover:shadow-md transition-shadow text-center">
        <div className="flex justify-center mb-4 text-purple-600">
          <Store className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-semibold text-gray-800 mb-2">Marketplaces</h3>
        <p className="text-gray-600 text-sm">
          Automatically generate receipts for vendors and partners at scale.
        </p>
      </div>
    </div>
  </div>
</section>

      {/* Pricing Table */}
      <section id="pricing" className="py-16 bg-gray-50">
  <div className="max-w-7xl mx-auto px-4 text-center">
    <h2 className="text-4xl font-extrabold text-gray-800 mb-4">Simple, Transparent Pricing</h2>
    <p className="text-lg text-gray-600 mb-12">
      Choose the plan that fits your business best. No hidden fees. Cancel anytime.
    </p>
    <div className="flex flex-col md:flex-row justify-center items-stretch gap-8">
      
      {/* Free Plan */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center w-full md:w-80 transition-transform hover:scale-105">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Starter</h3>
        <p className="text-gray-600 mb-4 text-sm">Perfect for freelancers just getting started</p>
        <p className="text-3xl font-bold text-blue-600 mb-2">$0</p>
        <ul className="text-gray-600 text-sm mb-6 space-y-1">
          <li>✔ Up to 50 invoices/month</li>
          <li>✔ Email support</li>
          <li>✔ Export as PDF</li>
        </ul>
        <a href="#signup" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors">
          Sign Up Free
        </a>
      </div>

      {/* Pro Plan */}
      <div className="bg-white border-2 border-blue-500 rounded-2xl shadow-lg p-8 flex flex-col items-center w-full md:w-80 transform scale-105">
        <span className="text-xs uppercase bg-blue-100 text-blue-700 px-3 py-1 rounded-full mb-3">Most Popular</span>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Pro</h3>
        <p className="text-gray-600 mb-4 text-sm">Ideal for growing businesses needing flexibility</p>
        <p className="text-3xl font-bold text-blue-600 mb-1">$19<span className="text-base font-medium">/mo</span></p>
        <p className="text-sm text-gray-500 mb-4">or $199/year (save 12%)</p>
        <ul className="text-gray-600 text-sm mb-6 space-y-1">
          <li>✔ Unlimited invoices</li>
          <li>✔ Priority email support</li>
          <li>✔ Branded PDF templates</li>
        </ul>
        <a href="#signup" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors">
          Get Started
        </a>
      </div>

      {/* Business Plan */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 flex flex-col items-center w-full md:w-80 transition-transform hover:scale-105">
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Business</h3>
        <p className="text-gray-600 mb-4 text-sm">For teams and enterprises with advanced needs</p>
        <p className="text-3xl font-bold text-blue-600 mb-2">$49<span className="text-base font-medium">/mo</span></p>
        <ul className="text-gray-600 text-sm mb-6 space-y-1">
          <li>✔ Custom branding</li>
          <li>✔ Priority support & SLA</li>
          <li>✔ Team access and permissions</li>
        </ul>
        <a href="#signup" className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors">
          Contact Sales
        </a>
      </div>

    </div>
  </div>
</section>


      {/* Code Sample */}
      <section id="docs" className="py-12 bg-gray-100">
        <h2 className="text-2xl font-bold text-center mb-6">API Usage Example</h2>
        <pre className="bg-gray-800 text-green-200 rounded p-6 max-w-2xl mx-auto overflow-x-auto text-sm">
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
    }`}
        </pre>
      </section>

      {/* Testimonials */}
      <section className="py-12 bg-white">
        <h2 className="text-2xl font-bold text-center mb-8">What Our Users Say</h2>
        <div className="flex flex-col md:flex-row justify-center gap-8">
          <div className="bg-gray-100 p-6 rounded shadow w-80">
            <p className="mb-2">“Super easy to integrate and saves us hours every week!”</p>
            <span className="font-semibold">— Jane, Startup CTO</span>
          </div>
          <div className="bg-gray-100 p-6 rounded shadow w-80">
            <p className="mb-2">“The best invoice API we’ve used. Highly recommended.”</p>
            <span className="font-semibold">— Mike, SaaS Founder</span>
          </div>
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-12 bg-gray-100 text-center">
        <h2 className="text-2xl font-bold mb-4">Stay Updated</h2>
        <p className="mb-6 text-gray-600">Get tips, updates, and feature announcements.</p>
        <form className="flex justify-center">
          <input type="email" placeholder="Your email" className="p-2 rounded-l border border-gray-300 w-64" />
          <button className="bg-blue-600 text-white px-4 rounded-r hover:bg-blue-700">Subscribe</button>
        </form>
      </section>

      {/* Final CTA */}
      <section id="signup" className="py-16 text-center bg-blue-600 text-white">
        <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
        <a
          href="#"
          className="inline-block bg-white text-blue-600 font-semibold px-8 py-4 rounded shadow hover:bg-blue-100 transition"
        >
          Sign up for API Key
        </a>
      </section>

      {/* Footer */}
      <footer className="sticky bottom-0 bg-white py-6 text-center text-sm text-gray-500 shadow-inner">
        <p>&copy; 2025 InvoiceAPI. Powered By Sidconsult. All rights reserved.</p>
        <div className="mt-2 space-x-4">
          <a href="#" className="hover:underline">Privacy Policy</a>
          <a href="#" className="hover:underline">Terms of Service</a>
          <a href="#" className="hover:underline">Contact</a>
        </div>
      </footer>
    </div>
  );
}

export default App;
