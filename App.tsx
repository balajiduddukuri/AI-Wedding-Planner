import React, { useState, useEffect, useRef } from 'react';
import { AgentCard } from './components/AgentCard';
import { GlobalLog } from './components/GlobalLog';
import { Agent, AgentName, AgentStatus, GlobalLogEntry } from './types';
import { INITIAL_AGENTS, SIMULATION_SCRIPT } from './constants';

const App: React.FC = () => {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [globalLog, setGlobalLog] = useState<GlobalLogEntry[]>([]);
  const [isSimulating, setIsSimulating] = useState(false);
  // FIX: The return type of `setTimeout` in the browser is `number`, not `NodeJS.Timeout`.
  const simulationTimeoutRef = useRef<number | null>(null);

  const runSimulation = () => {
    let scriptIndex = 0;
    
    const executeStep = () => {
      if (scriptIndex >= SIMULATION_SCRIPT.length) {
        setIsSimulating(false);
        // Set all agents to IDLE at the end except for ones that are completed/alerted
        setAgents(prev => prev.map(a => ({...a, status: a.status === AgentStatus.WORKING ? AgentStatus.IDLE : a.status})));
        return;
      }

      const step = SIMULATION_SCRIPT[scriptIndex];

      // Update Agent State
      setAgents(prevAgents =>
        prevAgents.map(agent => {
          if (agent.name === step.agent) {
            const newLog = [...agent.log, step.message];
            // If status is provided in script, use it. Otherwise, keep the current one.
            let newStatus = step.status || agent.status;
            
            // After a delay, set to targetStatus if available
            if (step.targetStatus) {
                setTimeout(() => {
                    setAgents(prev => prev.map(a => a.name === step.agent ? {...a, status: step.targetStatus!} : a));
                }, 1500);
            }

            return { ...agent, status: newStatus, log: newLog.slice(-5) }; // Keep last 5 logs
          }
          return agent;
        })
      );

      // Update Global Log
      setGlobalLog(prevLog => [
        ...prevLog,
        { agentName: step.agent, message: step.message, timestamp: new Date() },
      ]);
      
      scriptIndex++;
      if (simulationTimeoutRef.current) {
          clearTimeout(simulationTimeoutRef.current);
      }
      simulationTimeoutRef.current = setTimeout(executeStep, step.delay);
    };

    setIsSimulating(true);
    executeStep();
  };
  
  const resetSimulation = () => {
    if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
    }
    setAgents(INITIAL_AGENTS);
    setGlobalLog([]);
    setIsSimulating(false);
  }
  
  const handleTaskClick = (agentName: AgentName, task: string) => {
    if (isSimulating) return;

    const startMessage = `Executing user task: "${task}"`;
    const endMessage = `Task "${task}" completed.`;

    // Set agent to working
    setAgents(prev => prev.map(a => a.name === agentName ? {...a, status: AgentStatus.WORKING, log: [...a.log, startMessage].slice(-5)} : a));
    setGlobalLog(prev => [...prev, { agentName, message: startMessage, timestamp: new Date() }]);

    // After a delay, set agent to completed/idle
    setTimeout(() => {
      setAgents(prev => prev.map(a => a.name === agentName ? {...a, status: AgentStatus.IDLE, log: [...a.log, endMessage].slice(-5)} : a));
      setGlobalLog(prev => [...prev, { agentName, message: endMessage, timestamp: new Date() }]);
    }, 2500);
  };


  useEffect(() => {
    // Cleanup timeout on unmount
    return () => {
      if (simulationTimeoutRef.current) {
        clearTimeout(simulationTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="bg-sky-50 min-h-screen font-sans text-gray-800">
      <main className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-12">
          <h1 className="text-5xl md:text-6xl font-extrabold text-gray-800">
            AI Wedding Planner
          </h1>
          <p className="mt-4 text-lg text-gray-600 max-w-3xl mx-auto">
            An intelligent multi-agent system designed to automate and optimize wedding planning into a seamless, guided experience.
          </p>
        </header>

        <div className="flex justify-center items-center space-x-4 mb-12">
            <button
                onClick={runSimulation}
                disabled={isSimulating}
                className="px-8 py-3 bg-sky-500 text-white font-bold rounded-full hover:bg-sky-600 disabled:bg-sky-300 transition-colors shadow-lg"
            >
                {isSimulating ? 'Simulation in Progress...' : 'Start Simulation'}
            </button>
            <button
                onClick={resetSimulation}
                className="px-8 py-3 bg-gray-200 text-gray-800 font-bold rounded-full hover:bg-gray-300 transition-colors shadow-lg"
            >
                Reset
            </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {agents.map(agent => (
            <AgentCard key={agent.id} agent={agent} onTaskClick={handleTaskClick} isSimulating={isSimulating}/>
          ))}
        </div>

        <div className="mb-12">
            <GlobalLog logs={globalLog} />
        </div>

        <section className="bg-white rounded-2xl shadow-lg p-8 mb-12">
             <h2 className="text-3xl font-bold text-center mb-8">How It Works</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                 <div className="flex flex-col items-center">
                     <div className="p-4 bg-sky-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" /></svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2">Personalized Planning</h3>
                     <p className="text-gray-600">Agents gather your preferences to create custom workflows and recommendations tailored to your theme and budget.</p>
                 </div>
                 <div className="flex flex-col items-center">
                     <div className="p-4 bg-sky-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2">Automated Coordination</h3>
                     <p className="text-gray-600">From vendor communication to guest RSVPs, agents work together to manage tasks efficiently, minimizing manual effort.</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="p-4 bg-sky-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V7a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                    </div>
                     <h3 className="text-xl font-bold mb-2">Real-Time Tracking</h3>
                     <p className="text-gray-600">A central log provides comprehensive oversight of planning milestones and spending for enhanced control.</p>
                 </div>
             </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-8">
             <h2 className="text-3xl font-bold text-center mb-8">How to Use This Simulator</h2>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                 <div className="flex flex-col items-center">
                     <div className="p-4 bg-sky-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" /></svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2">1. Start Simulation</h3>
                     <p className="text-gray-600">Click the 'Start Simulation' button to begin the automated wedding planning process.</p>
                 </div>
                 <div className="flex flex-col items-center">
                     <div className="p-4 bg-sky-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                     </div>
                     <h3 className="text-xl font-bold mb-2">2. Observe Agents</h3>
                     <p className="text-gray-600">Watch as agents collaborate. Their status, activity, and the global log will update in real-time.</p>
                 </div>
                 <div className="flex flex-col items-center">
                    <div className="p-4 bg-sky-100 rounded-full mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h5M20 20v-5h-5M4 20h5v-5M20 4h-5v5" /></svg>
                    </div>
                     <h3 className="text-xl font-bold mb-2">3. Reset State</h3>
                     <p className="text-gray-600">Use the 'Reset' button to stop the simulation and return all agents to their initial idle state.</p>
                 </div>
             </div>
        </section>

        <footer className="text-center mt-12 py-6 border-t border-gray-200">
            <p className="text-gray-500">Capstone Project: Agents for Good</p>
        </footer>
      </main>
    </div>
  );
};

export default App;