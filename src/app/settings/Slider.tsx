import React from 'react';

const ToggleSwitch = ({ 
  label, 
  checked, 
  onChange 
}: {
  label: string,
  checked: boolean,
  onChange: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  return (
    <div className="flex items-center justify-between py-3 px-1">
      <label className="font-medium text-[rgba(var(--foreground-rgb),0.9)]">
        {label}
      </label>
      
      <label className="relative inline-block w-12 h-6 cursor-pointer">
        <input
          type="checkbox"
          className="peer sr-only"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
        />
        <div className="absolute inset-0 rounded-full transition-colors duration-200 ease-in-out bg-[rgba(var(--theme-rgb),0.15)] hover:bg-[rgba(var(--theme-rgb),0.25)] peer-focus-visible:ring-2 peer-focus-visible:ring-[var(--theme)] peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-background peer-checked:bg-[var(--theme)]">
          <div 
            className={`absolute left-[2px] top-[2px] h-5 w-5 rounded-full bg-foreground shadow-md transform transition-transform duration-200 ease-in-out ${
              checked ? 'translate-x-6 bg-background' : 'translate-x-0'
            }`}
          />
        </div>
      </label>
    </div>
  );
};

export default ToggleSwitch;