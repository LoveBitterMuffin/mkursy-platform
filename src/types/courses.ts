export type SubjectType = 'all' | 'math' | 'physics' | 'informatics';
export type GradeRange = '5-8' | '9' | '10-11';

export interface Course {
  id: string;
  title: string;
  subject: SubjectType;
  gradeRange: GradeRange;
  partnerStandard: string;
  shortDescription: string;
  durationHours: number;
  pricePerMonth: string;
  features: string[];
  badgeColor?: string;
  skillTreeTargetId?: string;
  status: 'active' | 'upcoming';
}

export interface EnrollmentFormData {
  studentName: string;
  parentContact: string;
  grade: string;
  courseId: string;
}
