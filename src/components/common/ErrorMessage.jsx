import React from 'react';

export const ErrorMessage = ({ error, onRetry }) => (
  <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-lg shadow-lg">
    <div className="flex items-center">
      {/* Ícono de error */}
      <div className="flex-shrink-0">
        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" 
            d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" 
            clipRule="evenodd" 
          />
        </svg>
      </div>
      {/* Contenido del error */}
      <div className="ml-3">
        <h3 className="text-sm font-medium">Error</h3>
        <div className="mt-2 text-sm">
          <p>{error}</p>
        </div>
        {/* Botón de reintentar (opcional) */}
        {onRetry && (
          <div className="mt-4">
            <button
              onClick={onRetry}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Reintentar
            </button>
          </div>
        )}
      </div>
    </div>
  </div>
);