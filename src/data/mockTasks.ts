
export interface Task {
  id: number;
  employee: string;
  task: string;
  lastUpdated: string;
  daysIgnored: number;
  status: 'todo' | 'inProgress' | 'followUp' | 'done';
}

export const ignoredTasks: Task[] = [
  // John Doe's To Do tasks
  {
    id: 1,
    employee: "John Doe",
    task: "Website Redesign for Client A",
    lastUpdated: "2024-02-15",
    daysIgnored: 0,
    status: 'todo'
  },
  {
    id: 2,
    employee: "John Doe",
    task: "Social Media Strategy",
    lastUpdated: "2024-02-20",
    daysIgnored: 0,
    status: 'todo'
  },
  {
    id: 3,
    employee: "John Doe",
    task: "Content Calendar Creation",
    lastUpdated: "2024-02-22",
    daysIgnored: 0,
    status: 'todo'
  },
  {
    id: 4,
    employee: "John Doe",
    task: "SEO Audit Planning",
    lastUpdated: "2024-02-23",
    daysIgnored: 0,
    status: 'todo'
  },

  // John Doe's In Progress tasks
  {
    id: 5,
    employee: "John Doe",
    task: "Client Website Development",
    lastUpdated: "2024-02-18",
    daysIgnored: 5,
    status: 'inProgress'
  },
  {
    id: 6,
    employee: "John Doe",
    task: "Marketing Campaign Execution",
    lastUpdated: "2024-02-19",
    daysIgnored: 4,
    status: 'inProgress'
  },
  {
    id: 7,
    employee: "John Doe",
    task: "Analytics Report Creation",
    lastUpdated: "2024-02-20",
    daysIgnored: 3,
    status: 'inProgress'
  },
  {
    id: 8,
    employee: "John Doe",
    task: "Client Presentation Preparation",
    lastUpdated: "2024-02-21",
    daysIgnored: 2,
    status: 'inProgress'
  },

  // John Doe's Follow Up tasks
  {
    id: 9,
    employee: "John Doe",
    task: "Client Feedback Review",
    lastUpdated: "2024-02-15",
    daysIgnored: 8,
    status: 'followUp'
  },
  {
    id: 10,
    employee: "John Doe",
    task: "Project Timeline Update",
    lastUpdated: "2024-02-16",
    daysIgnored: 7,
    status: 'followUp'
  },
  {
    id: 11,
    employee: "John Doe",
    task: "Resource Allocation Review",
    lastUpdated: "2024-02-17",
    daysIgnored: 6,
    status: 'followUp'
  },
  {
    id: 12,
    employee: "John Doe",
    task: "Budget Assessment",
    lastUpdated: "2024-02-18",
    daysIgnored: 5,
    status: 'followUp'
  },

  // John Doe's Done tasks
  {
    id: 13,
    employee: "John Doe",
    task: "Initial Client Meeting",
    lastUpdated: "2024-02-10",
    daysIgnored: 13,
    status: 'done'
  },
  {
    id: 14,
    employee: "John Doe",
    task: "Project Proposal",
    lastUpdated: "2024-02-11",
    daysIgnored: 12,
    status: 'done'
  },
  {
    id: 15,
    employee: "John Doe",
    task: "Contract Signing",
    lastUpdated: "2024-02-12",
    daysIgnored: 11,
    status: 'done'
  },
  {
    id: 16,
    employee: "John Doe",
    task: "Project Setup",
    lastUpdated: "2024-02-13",
    daysIgnored: 10,
    status: 'done'
  },

  // Jane Smith's To Do tasks
  {
    id: 17,
    employee: "Jane Smith",
    task: "Content Strategy Planning",
    lastUpdated: "2024-02-23",
    daysIgnored: 0,
    status: 'todo'
  },
  {
    id: 18,
    employee: "Jane Smith",
    task: "Social Media Calendar",
    lastUpdated: "2024-02-24",
    daysIgnored: 0,
    status: 'todo'
  },
  {
    id: 19,
    employee: "Jane Smith",
    task: "Blog Post Writing",
    lastUpdated: "2024-02-25",
    daysIgnored: 0,
    status: 'todo'
  },
  {
    id: 20,
    employee: "Jane Smith",
    task: "Email Newsletter Draft",
    lastUpdated: "2024-02-26",
    daysIgnored: 0,
    status: 'todo'
  },

  // Jane Smith's In Progress tasks
  {
    id: 21,
    employee: "Jane Smith",
    task: "Video Content Creation",
    lastUpdated: "2024-02-20",
    daysIgnored: 3,
    status: 'inProgress'
  },
  {
    id: 22,
    employee: "Jane Smith",
    task: "Influencer Outreach",
    lastUpdated: "2024-02-21",
    daysIgnored: 2,
    status: 'inProgress'
  },
  {
    id: 23,
    employee: "Jane Smith",
    task: "Social Media Engagement",
    lastUpdated: "2024-02-22",
    daysIgnored: 1,
    status: 'inProgress'
  },
  {
    id: 24,
    employee: "Jane Smith",
    task: "Content Performance Analysis",
    lastUpdated: "2024-02-23",
    daysIgnored: 0,
    status: 'inProgress'
  },

  // Jane Smith's Follow Up tasks
  {
    id: 25,
    employee: "Jane Smith",
    task: "Client Content Approval",
    lastUpdated: "2024-02-16",
    daysIgnored: 7,
    status: 'followUp'
  },
  {
    id: 26,
    employee: "Jane Smith",
    task: "Campaign Performance Review",
    lastUpdated: "2024-02-17",
    daysIgnored: 6,
    status: 'followUp'
  },
  {
    id: 27,
    employee: "Jane Smith",
    task: "Content Strategy Update",
    lastUpdated: "2024-02-18",
    daysIgnored: 5,
    status: 'followUp'
  },
  {
    id: 28,
    employee: "Jane Smith",
    task: "Stakeholder Feedback",
    lastUpdated: "2024-02-19",
    daysIgnored: 4,
    status: 'followUp'
  },

  // Jane Smith's Done tasks
  {
    id: 29,
    employee: "Jane Smith",
    task: "Brand Voice Guidelines",
    lastUpdated: "2024-02-12",
    daysIgnored: 11,
    status: 'done'
  },
  {
    id: 30,
    employee: "Jane Smith",
    task: "Content Audit",
    lastUpdated: "2024-02-13",
    daysIgnored: 10,
    status: 'done'
  },
  {
    id: 31,
    employee: "Jane Smith",
    task: "Editorial Calendar Setup",
    lastUpdated: "2024-02-14",
    daysIgnored: 9,
    status: 'done'
  },
  {
    id: 32,
    employee: "Jane Smith",
    task: "Style Guide Creation",
    lastUpdated: "2024-02-15",
    daysIgnored: 8,
    status: 'done'
  },

  // Mike Johnson's To Do tasks
  {
    id: 33,
    employee: "Mike Johnson",
    task: "PPC Campaign Planning",
    lastUpdated: "2024-02-24",
    daysIgnored: 0,
    status: 'todo'
  },
  {
    id: 34,
    employee: "Mike Johnson",
    task: "Keyword Research",
    lastUpdated: "2024-02-25",
    daysIgnored: 0,
    status: 'todo'
  },
  {
    id: 35,
    employee: "Mike Johnson",
    task: "Ad Copy Writing",
    lastUpdated: "2024-02-26",
    daysIgnored: 0,
    status: 'todo'
  },
  {
    id: 36,
    employee: "Mike Johnson",
    task: "Budget Allocation",
    lastUpdated: "2024-02-27",
    daysIgnored: 0,
    status: 'todo'
  },

  // Mike Johnson's In Progress tasks
  {
    id: 37,
    employee: "Mike Johnson",
    task: "Campaign Optimization",
    lastUpdated: "2024-02-21",
    daysIgnored: 2,
    status: 'inProgress'
  },
  {
    id: 38,
    employee: "Mike Johnson",
    task: "A/B Testing Setup",
    lastUpdated: "2024-02-22",
    daysIgnored: 1,
    status: 'inProgress'
  },
  {
    id: 39,
    employee: "Mike Johnson",
    task: "Landing Page Review",
    lastUpdated: "2024-02-23",
    daysIgnored: 0,
    status: 'inProgress'
  },
  {
    id: 40,
    employee: "Mike Johnson",
    task: "Conversion Tracking Setup",
    lastUpdated: "2024-02-24",
    daysIgnored: 0,
    status: 'inProgress'
  },

  // Mike Johnson's Follow Up tasks
  {
    id: 41,
    employee: "Mike Johnson",
    task: "Campaign Performance Review",
    lastUpdated: "2024-02-17",
    daysIgnored: 6,
    status: 'followUp'
  },
  {
    id: 42,
    employee: "Mike Johnson",
    task: "Client ROI Discussion",
    lastUpdated: "2024-02-18",
    daysIgnored: 5,
    status: 'followUp'
  },
  {
    id: 43,
    employee: "Mike Johnson",
    task: "Budget Adjustment Meeting",
    lastUpdated: "2024-02-19",
    daysIgnored: 4,
    status: 'followUp'
  },
  {
    id: 44,
    employee: "Mike Johnson",
    task: "Strategy Refinement",
    lastUpdated: "2024-02-20",
    daysIgnored: 3,
    status: 'followUp'
  },

  // Mike Johnson's Done tasks
  {
    id: 45,
    employee: "Mike Johnson",
    task: "Initial Campaign Setup",
    lastUpdated: "2024-02-13",
    daysIgnored: 10,
    status: 'done'
  },
  {
    id: 46,
    employee: "Mike Johnson",
    task: "Competitor Analysis",
    lastUpdated: "2024-02-14",
    daysIgnored: 9,
    status: 'done'
  },
  {
    id: 47,
    employee: "Mike Johnson",
    task: "Market Research",
    lastUpdated: "2024-02-15",
    daysIgnored: 8,
    status: 'done'
  },
  {
    id: 48,
    employee: "Mike Johnson",
    task: "Campaign Strategy Document",
    lastUpdated: "2024-02-16",
    daysIgnored: 7,
    status: 'done'
  }
];
