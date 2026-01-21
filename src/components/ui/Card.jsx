import React from 'react';

const Card = ({ 
  children, 
  className = '', 
  title, 
  subtitle,
  actions,
  noPadding = false,
  onClick,
  ...props
}) => {
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      {...props}
    >
      {(title || subtitle || actions) && (
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 sm:gap-4 mb-4">
          <div className="flex-1">
            {title && (
              <h3 className="text-lg font-semibold text-gray-900">
                {title}
              </h3>
            )}
            {subtitle && (
              <p className="text-sm text-gray-600 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          {actions && (
            <div className="flex-shrink-0">
              {actions}
            </div>
          )}
        </div>
      )}
      
      <div className={noPadding ? '' : ''}>
        {children}
      </div>
    </div>
  );
};

export default Card;