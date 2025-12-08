import React from 'react';
import { Star, MapPin, Clock, CheckCircle } from 'lucide-react';
import { Provider } from '../types';

interface ProviderCardProps {
  provider: Provider;
  onClick: () => void;
}

export const ProviderCard: React.FC<ProviderCardProps> = ({ provider, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden active:scale-[0.98] transition-all duration-200 cursor-pointer mb-4"
    >
      <div className="relative h-32 w-full">
        <img 
          src={provider.imageUrl} 
          alt={provider.name} 
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-sm text-gray-800 dark:text-gray-200">
          <Clock size={12} className="mr-1 text-gray-500 dark:text-gray-400" />
          {provider.availability}
        </div>
      </div>
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-bold text-gray-800 dark:text-gray-100 text-lg leading-tight line-clamp-1 flex-1">
            {provider.name}
          </h3>
          {provider.verified && (
            <CheckCircle size={16} className="text-brand-500 ml-1 flex-shrink-0" fill="currentColor" color="white" />
          )}
        </div>
        
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-3">
          <MapPin size={14} className="mr-1" />
          <span>{provider.distance}</span>
          <span className="mx-2">•</span>
          <Star size={14} className="text-yellow-400 fill-current mr-1" />
          <span className="font-semibold text-gray-700 dark:text-gray-300">{provider.rating}</span>
          <span className="text-gray-400 dark:text-gray-500 ml-1">({provider.reviewCount})</span>
        </div>

        <div className="flex flex-wrap gap-2">
           {provider.services.slice(0, 2).map((s) => (
             <span key={s.id} className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-600">
               {s.name}
             </span>
           ))}
           {provider.services.length > 2 && (
             <span className="text-xs bg-gray-50 dark:bg-gray-700 text-gray-400 dark:text-gray-400 px-2 py-1 rounded-md border border-gray-100 dark:border-gray-600">
               +{provider.services.length - 2}
             </span>
           )}
        </div>
      </div>
    </div>
  );
};