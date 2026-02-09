import React, { useState } from 'react';
import { MessageSquare, X } from 'lucide-react';

const Chatbox = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {isOpen ? (
        <div className="bg-white rounded-2xl shadow-2xl w-96 h-[600px] flex flex-col transform animate-pop-in">
          <header className="bg-violet-600 text-white p-4 flex justify-between items-center rounded-t-2xl">
            <div className="flex items-center space-x-3">
              <MessageSquare size={24} />
              <h3 className="text-lg font-semibold">Assistant ZAKSOFT</h3>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-violet-700 p-1 rounded-full">
              <X size={20} />
            </button>
          </header>
          <div className="flex-1 p-4 overflow-y-auto bg-slate-50">
            {/* Chat messages will go here */}
          </div>
          <div className="p-4 bg-white border-t border-slate-200 rounded-b-2xl">
            <form className="flex items-center space-x-2">
              <input
                type="text"
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2 bg-slate-100 rounded-full focus:outline-none focus:ring-2 focus:ring-violet-500"
              />
              <button type="submit" className="bg-violet-600 text-white p-3 rounded-full hover:bg-violet-700 transition-colors shadow-md">
                <MessageSquare size={20} />
              </button>
            </form>
          </div>
        </div>
      ) : (
        <button onClick={() => setIsOpen(true)} className="bg-violet-600 text-white p-4 rounded-full shadow-lg hover:bg-violet-700 transition-all duration-300 transform hover:scale-110">
          <MessageSquare size={32} />
        </button>
      )}
    </div>
  );
};

export default Chatbox;
