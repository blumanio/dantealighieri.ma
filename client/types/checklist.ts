export interface ChecklistSubItem {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime?: string;
  tips?: string;
  resources?: string[];
  dueDate?: Date;
  dependencies?: string[];
}

export interface ChecklistItem {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'critical' | 'high' | 'medium' | 'low';
  estimatedTime: string;
  tips?: string;
  resources?: string[];
  dueDate?: Date;
  subItems?: ChecklistSubItem[];
  dependencies?: string[];
  category?: string;
}

export interface ChecklistPhase {
  id: string;
  titleKey: string;
  description: string;
  icon: string;
  estimatedTime: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  isOpen: boolean;
  items: ChecklistItem[];
  completionReward?: string;
  nextPhaseUnlocked?: boolean;
}