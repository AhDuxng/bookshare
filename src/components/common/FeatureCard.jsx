// File: src/components/common/FeatureCard.jsx
// Card hiển thị feature/bước hướng dẫn

import React from 'react';
import IconBox from './IconBox';

const FeatureCard = ({ 
  icon,
  iconColor = "blue",
  title,
  description,
  step,
  image,
  className = ""
}) => {
  return (
    <div className={`group flex flex-col items-center text-center gap-4 p-6 rounded-2xl bg-gray-50 dark:bg-gray-800/50 hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg hover:shadow-primary/5 border border-transparent hover:border-primary/10 transition-all duration-300 ${className}`}>
      {/* Step Number or Image */}
      {step && (
        <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-white font-bold flex items-center justify-center text-sm shadow-lg">
          {step}
        </div>
      )}
      
      {/* Icon or Image */}
      {image ? (
        <div className="w-full h-40 rounded-xl overflow-hidden mb-2">
          <img src={image} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      ) : icon ? (
        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-700 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary group-hover:text-white transition-all duration-300">
          <IconBox 
            icon={icon} 
            color={iconColor}
            size="lg"
            className="!p-0 !bg-transparent"
          />
        </div>
      ) : null}

      {/* Content */}
      <div className="space-y-2">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
          {title}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
          {description}
        </p>
      </div>
    </div>
  );
};

export default FeatureCard;
