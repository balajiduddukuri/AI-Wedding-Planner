
import React from 'react';
import { GlobalLogEntry, AgentName } from '../types';

interface GlobalLogProps {
  logs: GlobalLogEntry[];
}

const agentColors: Record<AgentName, string> = {
    [AgentName.PLANNING]: 'text-indigo-500',
    [AgentName.VENDOR]: 'text-sky-500',
    [AgentName.CHECKLIST]: 'text-emerald-500',
    [AgentName.BUDGET]: 'text-rose-500',
    [AgentName.GUEST]: 'text-amber-500',
    [AgentName.NOTIFICATION]: 'text-violet-500',
    [AgentName.SOCIAL]: 'text-fuchsia-500',
};

export const GlobalLog: React.FC<GlobalLogProps> = ({ logs }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Inter-Agent Communication Log</h3>
      <div className="bg-gray-900 rounded-lg p-4 h-96 overflow-y-auto font-mono text-sm text-white flex flex-col-reverse">
        <div>
          {logs.slice().reverse().map((log, index) => (
            <div key={index} className="flex items-start mb-2">
              <span className="text-gray-500 mr-3">{log.timestamp.toLocaleTimeString()}</span>
              <span className={`${agentColors[log.agentName]} font-bold mr-2`}>[{log.agentName}]:</span>
              <span className="flex-1 whitespace-pre-wrap">{log.message}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};