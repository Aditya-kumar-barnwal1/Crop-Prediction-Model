import React from 'react';

const SelectField = ({ label, icon: Icon, options, placeholder = "Select an option", ...props }) => (
  <div className="space-y-2">
    <label className="flex items-center gap-2 text-sm font-semibold text-agri-dark">
      {Icon && <Icon size={18} className="text-agri" />} 
      {label}
    </label>
    <div className="relative">
      <select 
        {...props}
        className="w-full p-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-agri focus:border-transparent outline-none transition-all shadow-sm appearance-none cursor-pointer text-gray-700"
      >
        {/* We use the placeholder prop here instead of hardcoding it */}
        <option value="" disabled>{placeholder}</option>
        
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-500">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
      </div>
    </div>
  </div>
);

export default SelectField;