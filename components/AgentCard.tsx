import React from 'react';
import { Agent, AgentStatus, AgentName } from '../types';
import { PlanningIcon, VendorIcon, ChecklistIcon, BudgetIcon, GuestIcon, NotificationIcon, SocialIcon } from './IconComponents';

interface AgentCardProps {
  agent: Agent;
  onTaskClick: (agentName: AgentName, task: string) => void;
  isSimulating: boolean;
}

const AgentIcon: React.FC<{ agentName: AgentName; className: string }> = ({ agentName, className }) => {
  switch (agentName) {
    case AgentName.PLANNING:
      return <PlanningIcon className={className} />;
    case AgentName.VENDOR:
      return <VendorIcon className={className} />;
    case AgentName.CHECKLIST:
      return <ChecklistIcon className={className} />;
    case AgentName.BUDGET:
      return <BudgetIcon className={className} />;
    case AgentName.GUEST:
      return <GuestIcon className={className} />;
    case AgentName.NOTIFICATION:
      return <NotificationIcon className={className} />;
    case AgentName.SOCIAL:
      return <SocialIcon className={className} />;
    default:
      return null;
  }
};

const statusColors = {
  [AgentStatus.IDLE]: 'bg-gray-400',
  [AgentStatus.WORKING]: 'bg-blue-500 animate-pulse',
  [AgentStatus.COMPLETED]: 'bg-green-500',
  [AgentStatus.ALERT]: 'bg-red-500 animate-ping',
};

const statusBorderColors = {
  [AgentStatus.IDLE]: 'border-gray-300',
  [AgentStatus.WORKING]: 'border-blue-500',
  [AgentStatus.COMPLETED]: 'border-green-500',
  [AgentStatus.ALERT]: 'border-red-500',
};


export const AgentCard: React.FC<AgentCardProps> = ({ agent, onTaskClick, isSimulating }) => {
  const latestLog = agent.log.length > 0 ? agent.log[agent.log.length - 1] : 'Waiting for tasks...';

  return (
    <div className={`bg-white rounded-2xl shadow-lg p-6 flex flex-col transition-all duration-300 border-2 ${statusBorderColors[agent.status]}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-sky-100 rounded-full">
             <AgentIcon agentName={agent.name} className="h-6 w-6 text-sky-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">{agent.name}</h3>
        </div>
        <div className="flex items-center space-x-2">
          <div className={`h-3 w-3 rounded-full ${statusColors[agent.status]}`}></div>
          <span className="text-sm font-semibold text-gray-600">{agent.status}</span>
        </div>
      </div>
      <p className="text-gray-600 text-sm mb-4 flex-grow">{agent.description}</p>
      <div className="bg-gray-50 p-4 rounded-lg min-h-[80px] flex flex-col justify-center mb-4">
         <p className="text-xs text-gray-500 font-semibold mb-1">LATEST ACTIVITY:</p>
         <p className="text-sm text-gray-800">{latestLog}</p>
      </div>
      <div>
        <p className="text-xs text-gray-500 font-semibold mb-2">SAMPLE TASKS:</p>
        <div className="flex flex-wrap gap-2">
          {agent.sampleTasks.map(task => (
            <button
              key={task}
              onClick={() => onTaskClick(agent.name, task)}
              disabled={isSimulating}
              className="px-3 py-1 bg-sky-100 text-sky-700 text-xs font-semibold rounded-full hover:bg-sky-200 disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
            >
              {task}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};