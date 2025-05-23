import { Link } from 'react-router-dom'

function Signup() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with back to home link */}
      <header className="bg-white shadow fixed w-full z-10">
        <nav className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Link to="/">
              <img src="/logo.png" alt="InvoiceAPI Logo" className="h-8 w-8" />
            </Link>
            <Link to="/" className="text-xl font-bold text-blue-600">InvoiceAPI by SidConsult</Link>
          </div>
          <div className="space-x-6 text-sm text-gray-700">
            <Link to="/" className="hover:text-blue-600">← Back to Home</Link>
          </div>
        </nav>
      </header>

      {/* Signup Section */}
      <section id="signup" className="pt-28 pb-16 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-center">
        <div className="max-w-xl mx-auto px-4">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Get Started Free</h2>
          <p className="text-lg mb-8">Create an account and start generating invoices with our API in less than 2 minutes.</p>
          
          {/* Signup Form */}
          <form className="bg-white text-left text-gray-800 p-6 rounded-lg shadow-lg space-y-4">
            <div>
              <label className="block mb-1 font-medium">Email Address</label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Password</label>
              <input
                type="password"
                placeholder="Choose a strong password"
                className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              Create Account & Get API Key
            </button>
          </form>
          
          {/* Trust Indicators */}
          <p className="mt-6 text-sm text-white/80">
            No credit card required · 50 invoices free every month
          </p>
          <p className="mt-2 text-sm text-white/70">
            Already have an account? <Link to="/login" className="underline hover:text-white">Log in</Link>
          </p>
          
          {/* Additional back to home link */}
          <p className="mt-4 text-sm text-white/70">
            Want to learn more? <Link to="/" className="underline hover:text-white">Go back to home page</Link>
          </p>
        </div>
      </section>
    </div>
  );
}

export default Signup;