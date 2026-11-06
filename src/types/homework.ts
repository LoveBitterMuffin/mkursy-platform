export type HomeworkStatus = 'submitted' | 'under_review' | 'revision_requested' | 'approved';

export interface HomeworkTask {
  id: string;
  lessonId: string;
  courseId: string;
  teacherId: string;
  teacherName: string;
  title: string;
  description: string;
  videoUrl?: string;
  videoProvider?: 'vk' | 'rutube' | 'youtube' | 'direct';
  maxScore: number;
  deadline: string;
  criteria: string[];
  createdAt: string;
}

export interface HomeworkSubmission {
  id: string;
  taskId: string;
  taskTitle: string;
  studentId: string;
  studentName: string;
  groupId: string;
  content: string;
  solutionFiles?: string[];
  status: HomeworkStatus;
  score?: number;
  reviewedByRole?: 'curator' | 'teacher';
  reviewerId?: string;
  reviewerName?: string;
  feedback?: string;
  submittedAt: string;
  reviewedAt?: string;
}
