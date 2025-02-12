
export interface Task {
  id: number;
  employee: string;
  task: string;
  lastUpdated: string;
  daysIgnored: number;
}

export const ignoredTasks: Task[] = [
  // John Doe's tasks
  {
    id: 1,
    employee: "John Doe",
    task: "Website Redesign for Client A",
    lastUpdated: "2024-02-15",
    daysIgnored: 0,
  },
  {
    id: 2,
    employee: "John Doe",
    task: "Social Media Strategy",
    lastUpdated: "2024-02-20",
    daysIgnored: 0,
  },
  {
    id: 3,
    employee: "John Doe",
    task: "Email Campaign Design",
    lastUpdated: "2024-02-22",
    daysIgnored: 8,
  },
  {
    id: 4,
    employee: "John Doe",
    task: "Client Meeting Notes",
    lastUpdated: "2024-02-15",
    daysIgnored: 12,
  },
  {
    id: 5,
    employee: "John Doe",
    task: "SEO Optimization",
    lastUpdated: "2024-02-18",
    daysIgnored: 9,
  },
  
  // Jane Smith's tasks
  {
    id: 6,
    employee: "Jane Smith",
    task: "Content Calendar Planning",
    lastUpdated: "2024-02-23",
    daysIgnored: 0,
  },
  {
    id: 7,
    employee: "Jane Smith",
    task: "Analytics Report",
    lastUpdated: "2024-02-21",
    daysIgnored: 0,
  },
  {
    id: 8,
    employee: "Jane Smith",
    task: "Client Presentation",
    lastUpdated: "2024-02-16",
    daysIgnored: 11,
  },
  {
    id: 9,
    employee: "Jane Smith",
    task: "Brand Guidelines Update",
    lastUpdated: "2024-02-17",
    daysIgnored: 10,
  },
  {
    id: 10,
    employee: "Jane Smith",
    task: "Marketing Strategy",
    lastUpdated: "2024-02-19",
    daysIgnored: 8,
  },

  // Mike Johnson's tasks
  {
    id: 11,
    employee: "Mike Johnson",
    task: "PPC Campaign Setup",
    lastUpdated: "2024-02-24",
    daysIgnored: 0,
  },
  {
    id: 12,
    employee: "Mike Johnson",
    task: "Lead Generation Report",
    lastUpdated: "2024-02-22",
    daysIgnored: 0,
  },
  {
    id: 13,
    employee: "Mike Johnson",
    task: "Website Performance Review",
    lastUpdated: "2024-02-15",
    daysIgnored: 12,
  },
  {
    id: 14,
    employee: "Mike Johnson",
    task: "Competitor Analysis",
    lastUpdated: "2024-02-16",
    daysIgnored: 11,
  },
  {
    id: 15,
    employee: "Mike Johnson",
    task: "Social Media Audit",
    lastUpdated: "2024-02-18",
    daysIgnored: 9,
  }
];
