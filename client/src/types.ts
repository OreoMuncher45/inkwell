export interface Note {
  id: string;
  title: string;
  content: string; // Storing raw HTML or simple markdown/text for the minimal editor
  plainText: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isPinned: boolean;
  isDeleted: boolean;
}
