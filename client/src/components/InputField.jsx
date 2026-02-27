import React from 'react';

const InputField = ({ label, icon: Icon, ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-agri-dark">
      {Icon && <Icon size={18} className="text-agri" />} 
      {label}
    </label>
    <input 
      {...props}
      className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri focus:border-transparent outline-none transition-all shadow-sm"
    />
  </div>
);

export default InputField;