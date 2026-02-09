import React from 'react';
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="bg-gradient-to-br from-violet-50 to-white">
      <div className="container mx-auto px-4 py-24 md:py-40">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="text-center md:text-left">
            <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight leading-tight">
              Maîtrisez la tech de demain avec <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-indigo-600">ZAKSOFT</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl text-slate-600 max-w-xl mx-auto md:mx-0">
              Des formations conçues par des experts pour vous aider à construire l'avenir du web.
            </p>
            <Link to="/formations">
              <button className="mt-10 bg-violet-600 text-white font-bold py-4 px-10 rounded-full text-xl hover:bg-violet-700 transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-2xl shadow-violet-300/50">
                Explorer les formations
              </button>
            </Link>
          </div>
          <div className="hidden md:flex justify-center">
            {/* TODO: Remplacer ce logo par une illustration plus pertinente */}
            <img src="/logo.png" alt="Illustration ZAKSOFT Learn" className="rounded-3xl shadow-2xl w-2/3 animate-float"/>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
