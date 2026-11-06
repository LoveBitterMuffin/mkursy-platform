export interface StudyGroup {
  id: string;
  title: string;
  courseId: string;
  courseTitle: string;
  teacherId: string;
  teacherName: string;
  curatorId: string;
  curatorName: string;
  studentIds: string[];
  maxCapacity: 10;
  status: 'forming' | 'active' | 'graduated';
  createdAt: string;
}

export interface GroupRosterMember {
  studentId: string;
  name: string;
  email: string;
  grade: number;
  joinedAt: string;
  completedTasksCount: number;
  averageScore: number;
}
