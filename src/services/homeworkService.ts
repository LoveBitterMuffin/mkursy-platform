import { HomeworkTask, HomeworkSubmission, HomeworkStatus } from '../types';
import { initialHomeworkTasks, initialHomeworkSubmissions } from '../data/initialPlatformData';

export interface CreateTaskPayload {
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
}

export interface ReviewSubmissionPayload {
  submissionId: string;
  score: number;
  status: HomeworkStatus;
  feedback: string;
  reviewerId: string;
  reviewerName: string;
  reviewedByRole: 'curator' | 'teacher';
}

export class HomeworkService {
  private tasks: HomeworkTask[];
  private submissions: HomeworkSubmission[];

  constructor(
    seedTasks: HomeworkTask[] = initialHomeworkTasks,
    seedSubmissions: HomeworkSubmission[] = initialHomeworkSubmissions
  ) {
    this.tasks = [...seedTasks];
    this.submissions = [...seedSubmissions];
  }

  public getAllTasks(): HomeworkTask[] {
    return [...this.tasks];
  }

  public getTasksByCourse(courseId: string): HomeworkTask[] {
    return this.tasks.filter(t => t.courseId === courseId);
  }

  public getTasksByTeacher(teacherId: string): HomeworkTask[] {
    return this.tasks.filter(t => t.teacherId === teacherId);
  }

  public createTask(payload: CreateTaskPayload): HomeworkTask {
    const newTask: HomeworkTask = {
      ...payload,
      id: `task-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    this.tasks.unshift(newTask);
    return newTask;
  }

  public submitHomework(
    taskId: string,
    studentId: string,
    studentName: string,
    groupId: string,
    content: string
  ): HomeworkSubmission {
    const task = this.tasks.find(t => t.id === taskId);
    const newSubmission: HomeworkSubmission = {
      id: `sub-${Date.now().toString(36)}`,
      taskId,
      taskTitle: task ? task.title : 'Домашнее задание',
      studentId,
      studentName,
      groupId,
      content,
      status: 'submitted',
      submittedAt: new Date().toISOString(),
    };
    this.submissions.unshift(newSubmission);
    return newSubmission;
  }

  public reviewSubmission(payload: ReviewSubmissionPayload): HomeworkSubmission {
    const sub = this.submissions.find(s => s.id === payload.submissionId);
    if (!sub) throw new Error(`Решение ${payload.submissionId} не найдено`);

    const updated: HomeworkSubmission = {
      ...sub,
      score: payload.score,
      status: payload.status,
      feedback: payload.feedback,
      reviewerId: payload.reviewerId,
      reviewerName: payload.reviewerName,
      reviewedByRole: payload.reviewedByRole,
      reviewedAt: new Date().toISOString(),
    };
    this.submissions = this.submissions.map(s => (s.id === payload.submissionId ? updated : s));
    return updated;
  }

  public getSubmissionsByGroup(groupId: string): HomeworkSubmission[] {
    return this.submissions.filter(s => s.groupId === groupId);
  }

  public getSubmissionsByStudent(studentId: string): HomeworkSubmission[] {
    return this.submissions.filter(s => s.studentId === studentId);
  }
}

export const homeworkService = new HomeworkService();
