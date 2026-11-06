import { StudyGroup } from '../types';
import { initialGroups } from '../data/initialPlatformData';

export class GroupCapacityExceededError extends Error {
  constructor(groupId: string) {
    super(`Группа ${groupId} уже укомплектована (максимум 10 человек)`);
    this.name = 'GroupCapacityExceededError';
  }
}

export class GroupManager {
  private groups: StudyGroup[];

  constructor(seedGroups: StudyGroup[] = initialGroups) {
    this.groups = [...seedGroups];
  }

  public getAllGroups(): StudyGroup[] {
    return [...this.groups];
  }

  public getGroupById(groupId: string): StudyGroup | undefined {
    return this.groups.find(g => g.id === groupId);
  }

  public getGroupsByTeacher(teacherId: string): StudyGroup[] {
    return this.groups.filter(g => g.teacherId === teacherId);
  }

  public getGroupsByCurator(curatorId: string): StudyGroup[] {
    return this.groups.filter(g => g.curatorId === curatorId);
  }

  public addStudentToGroup(groupId: string, studentId: string): StudyGroup {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error(`Группа ${groupId} не найдена`);

    if (group.studentIds.includes(studentId)) {
      return group;
    }
    if (group.studentIds.length >= group.maxCapacity) {
      throw new GroupCapacityExceededError(groupId);
    }

    const updated: StudyGroup = {
      ...group,
      studentIds: [...group.studentIds, studentId],
      status: group.studentIds.length + 1 >= group.maxCapacity ? 'active' : group.status,
    };
    this.groups = this.groups.map(g => (g.id === groupId ? updated : g));
    return updated;
  }

  public enrollStudentIntoCourse(courseId: string, studentId: string): StudyGroup {
    const availableGroup = this.groups.find(
      g => g.courseId === courseId && g.studentIds.length < g.maxCapacity
    );

    if (availableGroup) {
      return this.addStudentToGroup(availableGroup.id, studentId);
    }

    const newGroupIndex = this.groups.filter(g => g.courseId === courseId).length + 1;
    const newGroup: StudyGroup = {
      id: `group-${courseId}-${Date.now().toString(36)}`,
      title: `Группа ${courseId.toUpperCase()} #${newGroupIndex}`,
      courseId,
      courseTitle: courseId,
      teacherId: 'user-teacher-voronov',
      teacherName: 'Д. С. Воронов',
      curatorId: 'user-curator-melnikova',
      curatorName: 'Анна Мельникова',
      studentIds: [studentId],
      maxCapacity: 10,
      status: 'forming',
      createdAt: new Date().toISOString(),
    };
    this.groups.push(newGroup);
    return newGroup;
  }

  public assignTeacherAndCurator(
    groupId: string,
    teacher: { id: string; name: string },
    curator: { id: string; name: string }
  ): StudyGroup {
    const group = this.getGroupById(groupId);
    if (!group) throw new Error(`Группа ${groupId} не найдена`);

    const updated: StudyGroup = {
      ...group,
      teacherId: teacher.id,
      teacherName: teacher.name,
      curatorId: curator.id,
      curatorName: curator.name,
    };
    this.groups = this.groups.map(g => (g.id === groupId ? updated : g));
    return updated;
  }
}

export const groupManager = new GroupManager();
