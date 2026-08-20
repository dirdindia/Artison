import React, { createContext, useContext, useState, useCallback } from 'react';
import { AlertTriangle, Loader2, X } from 'lucide-react';

const ConfirmContext = createContext();

export const useConfirm = () => useContext(ConfirmContext);

export const ConfirmProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Promise resolver
  const [resolver, setResolver] = useState(null);

  const confirm = useCallback(({ title, message, confirmText = 'Confirm', cancelText = 'Cancel', type = 'warning' }) => {
    return new Promise((resolve) => {
      setConfig({ title, message, confirmText, cancelText, type });
      setIsOpen(true);
      setResolver(() => resolve);
    });
  }, []);

  const handleConfirm = async () => {
    setIsLoading(true);
    if (resolver) resolver(true);
    setIsLoading(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    if (resolver) resolver(false);
    setIsOpen(false);
  };

  const getIconAndColors = () => {
    switch (config?.type) {
      case 'danger':
        return { icon: AlertTriangle, bg: 'bg-red-50', text: 'text-red-500', btn: 'bg-red-600 hover:bg-red-700' };
      case 'warning':
        return { icon: AlertTriangle, bg: 'bg-yellow-50', text: 'text-yellow-600', btn: 'bg-yellow-600 hover:bg-yellow-700' };
      default:
        return { icon: AlertTriangle, bg: 'bg-blue-50', text: 'text-blue-500', btn: 'bg-blue-600 hover:bg-blue-700' };
    }
  };

  const styles = getIconAndColors();
  const Icon = styles.icon;

  return (
    <ConfirmContext.Provider value={{ confirm }}>
      {children}
      {isOpen && config && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-[#3b2f2f]/40 backdrop-blur-sm transition-opacity"
            onClick={!isLoading ? handleCancel : undefined}
          ></div>
          
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 transform transition-all border border-[#eae0d5] animate-enter">
            {!isLoading && (
              <button 
                onClick={handleCancel}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            )}

            <div className="flex flex-col items-center text-center">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-4 ${styles.bg}`}>
                <Icon className={`w-6 h-6 ${styles.text}`} />
              </div>
              
              <h3 className="text-xl font-bold text-[#3b2f2f] mb-2">{config.title}</h3>
              {config.message && (
                <p className="text-[#5a4d4d] text-sm mb-6">{config.message}</p>
              )}

              <div className="flex gap-3 w-full">
                <button
                  onClick={handleCancel}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2.5 rounded-xl border border-[#eae0d5] text-[#5a4d4d] font-medium hover:bg-[#fdfbf7] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {config.cancelText}
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={isLoading}
                  className={`flex-1 px-4 py-2.5 rounded-xl text-white font-medium transition-colors flex items-center justify-center disabled:opacity-70 cursor-pointer ${styles.btn}`}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Wait...
                    </>
                  ) : (
                    config.confirmText
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};
