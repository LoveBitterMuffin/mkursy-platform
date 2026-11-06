import React, { useState } from 'react';
import { GroupList } from '../groups/GroupList';
import { GroupDetail } from '../groups/GroupDetail';
import { groupManager } from '../../services/groupManager';
import { authService } from '../../services/authService';
import { StudyGroup, User } from '../../types';

interface PlatformGroupsViewProps {
  currentUser: User | null;
}

export const PlatformGroupsView: React.FC<PlatformGroupsViewProps> = ({ currentUser }) => {
  const [groups, setGroups] = useState<StudyGroup[]>(groupManager.getAllGroups());
  const [selectedGroup, setSelectedGroup] = useState<StudyGroup>(groups[0]);
  const [error, setError] = useState<string | null>(null);

  const allUsers = authService.getAllUsers();

  const handleAddStudent = (groupId: string) => {
    setError(null);
    try {
      const studentId = `user-student-${Date.now().toString(36)}`;
      groupManager.addStudentToGroup(groupId, studentId);
      const refreshed = groupManager.getAllGroups();
      setGroups(refreshed);
      const updatedSel = refreshed.find(g => g.id === groupId);
      if (updatedSel) setSelectedGroup(updatedSel);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Ошибка комплектования группы';
      setError(msg);
    }
  };

  const displayedGroups =
    currentUser?.role === 'teacher'
      ? groups.filter(g => g.teacherId === currentUser.id)
      : currentUser?.role === 'curator'
      ? groups.filter(g => g.curatorId === currentUser.id)
      : groups;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white">Учебные группы центра (строго по 10 человек)</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            За каждой группой закреплен 1 куратор и 1 преподаватель. Преподаватель может вести несколько групп.
          </p>
        </div>
        <div className="text-xs font-semibold px-3 py-1.5 bg-blue-50 dark:bg-blue-500/10 text-[#0066FF] dark:text-blue-300 border border-blue-200 dark:border-blue-500/20 rounded-xl">
          Всего групп: {groups.length}
        </div>
      </div>

      {error && (
        <div className="p-3 bg-amber-950/80 border border-amber-700 rounded-xl text-amber-200 text-xs">
          {error}
        </div>
      )}

      <GroupList
        groups={displayedGroups.length > 0 ? displayedGroups : groups}
        onSelectGroup={setSelectedGroup}
        selectedGroupId={selectedGroup?.id}
      />

      {selectedGroup && (
        <GroupDetail
          group={selectedGroup}
          allUsers={allUsers}
          onAddStudent={currentUser?.role === 'admin' ? handleAddStudent : undefined}
        />
      )}
    </div>
  );
};
