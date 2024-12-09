export interface LabDocument {
  id: string;
  title: string;
  description: string;
  category: 'FACILITY' | 'RESEARCH' | 'RULES' | 'IDEA' | 'OBSERVATION';
  reference: string;
  isAvailable: boolean;
  variant: 'document' | 'image' | 'interactive';
  imagePath?: string;
  hasDetail?: boolean;
 }
 