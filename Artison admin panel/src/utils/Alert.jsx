import toast from 'react-hot-toast';
import { CheckCircle2, XCircle, AlertCircle, Info, X } from 'lucide-react';
import React from 'react';

const CustomToast = ({ t, title, message, icon: Icon, colorClass, bgClass }) => (
  <div
    className={`${
      t.visible ? 'animate-enter' : 'animate-leave'
    } max-w-sm w-full bg-white shadow-xl rounded-2xl border border-gray-100 pointer-events-auto flex ring-1 ring-black ring-opacity-5 overflow-hidden`}
  >
    <div className={`w-1.5 ${bgClass}`}></div>
    <div className="flex-1 p-4">
      <div className="flex items-start">
        <div className="flex-shrink-0 pt-0.5">
          <Icon className={`h-6 w-6 ${colorClass}`} />
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm font-semibold text-gray-900">{title}</p>
          {message && <p className="mt-1 text-sm text-gray-500">{message}</p>}
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => toast.dismiss(t.id)}
            className="rounded-md inline-flex text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-400"
          >
            <span className="sr-only">Close</span>
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  </div>
);

const Alert = {
  success: (title, message) =>
    toast.custom((t) => (
      <CustomToast t={t} title={title} message={message} icon={CheckCircle2} colorClass="text-green-500" bgClass="bg-green-500" />
    )),

  error: (title, message) =>
    toast.custom((t) => (
      <CustomToast t={t} title={title} message={message} icon={XCircle} colorClass="text-red-500" bgClass="bg-red-500" />
    )),

  warning: (title, message) =>
    toast.custom((t) => (
      <CustomToast t={t} title={title} message={message} icon={AlertCircle} colorClass="text-yellow-500" bgClass="bg-yellow-500" />
    )),

  info: (title, message) =>
    toast.custom((t) => (
      <CustomToast t={t} title={title} message={message} icon={Info} colorClass="text-blue-500" bgClass="bg-blue-500" />
    )),
};

export default Alert;
