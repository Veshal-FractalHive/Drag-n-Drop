// Common types used across the application

export interface NavigationItem {
  id: number;
  name: string;
  link: string;
}

export interface GameResult {
  isCorrect: boolean;
  message: string;
  explanation?: string;
}

export interface MatchPair {
  id: string;
  left: string;
  right: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
}

export interface KanbanColumns {
  [key: string]: Task[];
}

export interface DropZone {
  id: string;
  title: string;
}

export interface DraggableItem {
  id: string;
  content: string;
  category?: string;
}

export interface DraggableCategorizedItem {
  id: string;
  name: string;
  category: string;
  isOddOne: boolean;
}

export interface Question {
  id: number;
  options: string[];
  correctAnswer: number;
  category: string;
  explanation: string;
}

export interface Blank {
  id: string;
  correctWord: string;
}

export interface FillInTheBlanksData {
  sentence: string[];
  blanks: Blank[];
  options: string[];
}
