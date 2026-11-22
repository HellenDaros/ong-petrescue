import React from 'react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-[#f1f5f4] border-t border-stone-200 py-3 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3">
        
        {/* Lado Esquerdo: Copyright + Branding */}
        <div className="flex items-center gap-2 text-slate-500 font-medium text-xs">
          <span>© {currentYear}</span>
          
          <div className="flex items-center gap-1.5 ml-1">
           <span className="text-teal-600 font-bold">I🧡PET</span>
          </div>

          <span className="hidden md:inline ml-1">• Todos os direitos reservados.</span>
        </div>

      </div>
    </footer>
  );
}