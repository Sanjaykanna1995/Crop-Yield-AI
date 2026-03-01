import type { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { 
  ArrowRight, 
  CloudSun, 
  BarChart3, 
  Zap, 
  Leaf, 
} from "lucide-react";

/**
 * Types for Component Props
 */
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  desc: string;
}

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 selection:bg-emerald-100 selection:text-emerald-900">
      
      {/* Floating Navbar */}
      <nav className="fixed top-0 w-full z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-3 bg-white/70 backdrop-blur-md border border-white/20 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <div className="bg-emerald-600 p-1.5 rounded-lg">
              <Leaf className="text-white w-5 h-5" />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-800">CropYield AI</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition font-semibold">Features</a>
            <button 
              onClick={() => navigate("/auth")}
              className="bg-slate-900 text-white px-6 py-2.5 rounded-xl hover:bg-slate-800 transition shadow-md shadow-slate-200 active:scale-95"
            >
              Sign In
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/40 to-slate-50 z-10" />
          <img 
            src="https://images.unsplash.com/photo-1500382017468-9049fed747ef" 
            alt="Farm" 
            className="w-full h-full object-cover scale-110 animate-[pulse_10s_ease-in-out_infinite]"
          />
        </div>

        <div className="relative z-20 text-center px-6 max-w-4xl">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30 text-emerald-100 px-4 py-1.5 rounded-full text-sm font-semibold mb-8 animate-in fade-in slide-in-from-bottom-4">
            <Zap className="w-4 h-4 fill-emerald-400" />
            <span>Powering the Future of Precision Farming</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-[1.1]">
            Predict Yield with <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300">
              Machine Intelligence
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-200 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            Transform soil metrics and climate data into high-confidence harvest intelligence using advanced Big Data modeling.
          </p>
          
          <div className="flex items-center justify-center">
            <button
              onClick={() => navigate("/auth")}
              className="group w-full sm:w-auto px-12 py-5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-2xl font-bold transition-all shadow-2xl shadow-emerald-900/40 flex items-center justify-center gap-3 active:scale-95"
            >
              Get Started Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-32 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">Precision Components</h2>
            <p className="text-slate-500 text-lg font-medium max-w-2xl mx-auto">
              Our infrastructure is engineered to process complex agricultural variables with enterprise-grade reliability.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-10">
            <FeatureCard 
              icon={<Zap className="w-7 h-7 text-emerald-600" />}
              title="AI-Based Predictions"
              desc="Advanced Random Forest regressors analyzing historical soil composition and moisture patterns for localized forecasts."
            />
            <FeatureCard 
              icon={<CloudSun className="w-7 h-7 text-emerald-600" />}
              title="Climate Integration"
              desc="Deep-sync with hyper-local weather APIs to account for seasonal volatility and climate-driven yield shifts."
            />
            <FeatureCard 
              icon={<BarChart3 className="w-7 h-7 text-emerald-600" />}
              title="Analytics Dashboard"
              desc="High-density visualizers designed for tracking yield performance across diverse soil types and crop varieties."
            />
          </div>
        </div>
      </section>

      {/* Bottom CTA Section */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="bg-emerald-900 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800/50 rounded-full -mr-32 -mt-32 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 rounded-full -ml-32 -mb-32 blur-3xl" />
            
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 relative z-10">Ready to optimize your harvest?</h2>
            <button 
              onClick={() => navigate("/auth")}
              className="relative z-10 px-10 py-4 bg-white text-emerald-900 rounded-2xl font-bold hover:bg-emerald-50 transition-colors shadow-lg active:scale-95"
            >
              Access the Platform
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8 mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-emerald-600 p-1 rounded-md">
                <Leaf className="text-white w-4 h-4" />
              </div>
              <span className="font-bold text-xl text-slate-800 tracking-tight">CropYield AI</span>
            </div>
            <div className="flex gap-8 text-sm font-semibold text-slate-500">
              <a href="#" className="hover:text-emerald-600 transition">Privacy Policy</a>
              <a href="#" className="hover:text-emerald-600 transition">Terms of Service</a>
              <a href="#" className="hover:text-emerald-600 transition">Contact</a>
            </div>
          </div>
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-slate-100">
            <p className="text-slate-400 text-sm italic font-medium">
              "Engineering the future of food security through data intelligence."
            </p>
            <div className="text-slate-400 text-xs font-bold uppercase tracking-widest">
              © 2026 CropYield Intelligence • v1.0.4
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

/**
 * Sub-component Rectified with proper TypeScript interfaces
 */
const FeatureCard = ({ icon, title, desc }: FeatureCardProps) => (
  <div className="group bg-slate-50/50 p-12 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-2xl hover:bg-white hover:border-emerald-100 transition-all duration-500">
    <div className="mb-8 bg-white w-16 h-16 rounded-2xl flex items-center justify-center shadow-sm group-hover:bg-emerald-600 group-hover:scale-110 group-hover:shadow-emerald-200 transition-all duration-500">
      <div className="group-hover:text-white transition-colors">
        {icon}
      </div>
    </div>
    <h3 className="text-2xl font-bold text-slate-900 mb-5">{title}</h3>
    <p className="text-slate-500 leading-relaxed font-medium">{desc}</p>
  </div>
);

export default Home;