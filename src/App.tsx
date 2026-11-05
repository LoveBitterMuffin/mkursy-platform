import React, { useState } from 'react';
import { initialSkills, initialProfile } from './data/initialData';
import { sampleParabolaLesson } from './data/sampleLessons';
import { SkillNode, Lesson, StudentProfile } from './types';
import { updateSkillStatuses, calculateForecastScore } from './utils/skillTreeLogic';
import { Navbar } from './components/layout/Navbar';
import { SkillTree } from './components/tree/SkillTree';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { LessonEditor } from './components/editor/LessonEditor';
import { LessonPlayer } from './components/player/LessonPlayer';

export const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<'tree' | 'dashboard' | 'editor' | 'player'>('tree');
  const [skills, setSkills] = useState<SkillNode[]>(initialSkills);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(sampleParabolaLesson);
  const [isTeacherMode, setIsTeacherMode] = useState<boolean>(false);

  const handleOpenLesson = (lessonId: string) => {
    // In MVP, we link sampleParabolaLesson or matching lesson
    if (lessonId === 'lesson-parabola' || currentLesson.id === lessonId) {
      setCurrentLesson(sampleParabolaLesson);
    }
    setCurrentView('player');
  };

  const handleFinishLesson = (earnedXp: number) => {
    const newlyMasteredId = skills.find(
      s => s.lessonId === currentLesson.id || s.id === currentLesson.skillId
    )?.id;

    const currentCompleted = skills.filter(s => s.status === 'mastered').map(s => s.id);
    const updatedCompletedIds = Array.from(
      new Set(newlyMasteredId ? [...currentCompleted, newlyMasteredId] : currentCompleted)
    );

    const refreshed = updateSkillStatuses(skills, updatedCompletedIds);
    const newForecast = calculateForecastScore(refreshed, updatedCompletedIds, profile.targetExam);

    setSkills(refreshed);
    setProfile(prev => ({
      ...prev,
      totalXp: prev.totalXp + earnedXp,
      forecastScore: newForecast,
    }));

    setTimeout(() => {
      setCurrentView('tree');
    }, 1200);
  };

  const handleOpenTopicFromDashboard = (topic: SkillNode) => {
    if (topic.status !== 'locked' && topic.lessonId) {
      handleOpenLesson(topic.lessonId);
    } else {
      setCurrentView('tree');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        currentView={currentView === 'player' ? 'tree' : currentView}
        onViewChange={view => setCurrentView(view)}
        profile={profile}
        isTeacherMode={isTeacherMode}
        onToggleTeacherMode={() => {
          const next = !isTeacherMode;
          setIsTeacherMode(next);
          if (next) setCurrentView('editor');
          else setCurrentView('tree');
        }}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6">
        {currentView === 'tree' && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h2 className="text-xl font-extrabold text-white">Интерактивная карта знаний «МКурсы»</h2>
                <p className="text-xs text-slate-400">
                  Созвездия математических навыков 5–11 классов. Осваивайте темы, чтобы открывать продвинутые задачи ОГЭ/ЕГЭ.
                </p>
              </div>
            </div>
            <SkillTree skills={skills} onOpenLesson={handleOpenLesson} />
          </div>
        )}

        {currentView === 'dashboard' && (
          <StudentDashboard
            profile={profile}
            skills={skills}
            onOpenTopic={handleOpenTopicFromDashboard}
          />
        )}

        {currentView === 'editor' && (
          <LessonEditor
            initialLesson={currentLesson}
            onSave={updated => setCurrentLesson(updated)}
            onBack={() => setCurrentView('tree')}
          />
        )}

        {currentView === 'player' && (
          <LessonPlayer
            lesson={currentLesson}
            onBack={() => setCurrentView('tree')}
            onFinish={handleFinishLesson}
          />
        )}
      </main>
    </div>
  );
};

export default App;
