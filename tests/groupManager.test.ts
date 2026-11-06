import { describe, it, expect, beforeEach } from 'vitest';
import { GroupManager, GroupCapacityExceededError } from '../src/services/groupManager';
import { StudyGroup } from '../src/types';

describe('GroupManager (AC-04)', () => {
  let manager: GroupManager;

  const mockSeedGroup: StudyGroup = {
    id: 'group-test-1',
    title: 'Тестовая группа 1',
    courseId: 'ege-profile',
    courseTitle: 'ЕГЭ Профиль 2026',
    teacherId: 'teacher-1',
    teacherName: 'Воронов Д. С.',
    curatorId: 'curator-1',
    curatorName: 'Мельникова А.',
    studentIds: ['s1', 's2', 's3', 's4', 's5', 's6', 's7', 's8', 's9'],
    maxCapacity: 10,
    status: 'forming',
    createdAt: new Date().toISOString(),
  };

  beforeEach(() => {
    manager = new GroupManager([mockSeedGroup]);
  });

  it('accepts the 10th student into the group', () => {
    const updated = manager.addStudentToGroup('group-test-1', 's10');
    expect(updated.studentIds.length).toBe(10);
    expect(updated.status).toBe('active');
  });

  it('strictly rejects the 11th student with GroupCapacityExceededError', () => {
    manager.addStudentToGroup('group-test-1', 's10');
    expect(() => {
      manager.addStudentToGroup('group-test-1', 's11');
    }).toThrow(GroupCapacityExceededError);
  });

  it('allows one teacher to be assigned to multiple groups', () => {
    const group2: StudyGroup = {
      id: 'group-test-2',
      title: 'Тестовая группа 2',
      courseId: 'olympiad',
      courseTitle: 'Олимпиады',
      teacherId: 'teacher-1',
      teacherName: 'Воронов Д. С.',
      curatorId: 'curator-2',
      curatorName: 'Романов И.',
      studentIds: ['s101'],
      maxCapacity: 10,
      status: 'forming',
      createdAt: new Date().toISOString(),
    };
    const multiManager = new GroupManager([mockSeedGroup, group2]);
    const teacherGroups = multiManager.getGroupsByTeacher('teacher-1');
    expect(teacherGroups.length).toBe(2);
    expect(teacherGroups.map(g => g.id)).toEqual(['group-test-1', 'group-test-2']);
  });

  it('auto-creates a new group when existing group for the course is full', () => {
    manager.addStudentToGroup('group-test-1', 's10');
    const newGroup = manager.enrollStudentIntoCourse('ege-profile', 's11');
    expect(newGroup.id).not.toBe('group-test-1');
    expect(newGroup.studentIds).toEqual(['s11']);
    expect(newGroup.maxCapacity).toBe(10);
  });
});
