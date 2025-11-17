export enum AgentName {
  PLANNING = "Planning Agent",
  VENDOR = "Vendor Agent",
  CHECKLIST = "Checklist Agent",
  BUDGET = "Budget Agent",
  GUEST = "Guest Management Agent",
  NOTIFICATION = "Notification Agent",
  SOCIAL = "Social Media Agent",
}

export enum AgentStatus {
  IDLE = "Idle",
  WORKING = "Working",
  COMPLETED = "Completed",
  ALERT = "Alert",
}

export interface Agent {
  id: string;
  name: AgentName;
  description: string;
  status: AgentStatus;
  log: string[];
  sampleTasks: string[];
}

export interface GlobalLogEntry {
  agentName: AgentName;
  message: string;
  timestamp: Date;
}