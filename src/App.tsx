import React, { useState } from 'react';
import { Sparkles, Compass } from 'lucide-react';
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
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500/30">
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

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'tree' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-slate-900/40 p-5 rounded-3xl border border-slate-800/60">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-indigo-400 uppercase tracking-wider">
                  <Compass className="w-4 h-4" /> Навигация по математике
                </div>
                <h2 className="text-2xl font-black text-white tracking-tight">
                  Интерактивная карта знаний «МКурсы»
                </h2>
                <p className="text-xs text-slate-400 max-w-2xl font-medium">
                  Созвездия тем 5–11 классов. Осваивайте фундаментальные темы, чтобы открывать олимпиадные задачи и задания второй части ЕГЭ.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/30 px-3.5 py-2 rounded-2xl text-xs font-bold text-indigo-300">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>{skills.filter(s => s.status === 'mastered').length} из {skills.length} освоено</span>
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
