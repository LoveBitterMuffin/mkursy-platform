import React, { useState } from 'react';
import { Compass } from 'lucide-react';
import { initialSkills, initialProfile } from './data/initialData';
import { sampleParabolaLesson } from './data/sampleLessons';
import { SkillNode, Lesson, StudentProfile, UserRole, User, AppView } from './types';
import { updateSkillStatuses, calculateForecastScore } from './utils/skillTreeLogic';
import { Navbar } from './components/layout/Navbar';
import { SkillTree } from './components/tree/SkillTree';
import { StudentDashboard } from './components/dashboard/StudentDashboard';
import { LessonEditor } from './components/editor/LessonEditor';
import { LessonPlayer } from './components/player/LessonPlayer';
import { CourseCatalog } from './components/courses';
import { mcoursesList } from './data/coursesData';
import { authService } from './services/authService';
import { AuthModal } from './components/auth/AuthModal';
import { PaymentModal } from './components/payment/PaymentModal';
import { CrmPipeline } from './components/crm/CrmPipeline';
import { PlatformGroupsView } from './components/views/PlatformGroupsView';
import { PlatformHomeworkView } from './components/views/PlatformHomeworkView';
import { DevToolsPanel } from './components/devtools/DevToolsPanel';
import { ThemeProvider } from './context/ThemeContext';

export const AppContent: React.FC = () => {
  const [currentView, setCurrentView] = useState<AppView>('tree');
  const [skills, setSkills] = useState<SkillNode[]>(initialSkills);
  const [profile, setProfile] = useState<StudentProfile>(initialProfile);
  const [currentLesson, setCurrentLesson] = useState<Lesson>(sampleParabolaLesson);
  const [currentUser, setCurrentUser] = useState<User | null>(authService.getCurrentUser());
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [isPayOpen, setIsPayOpen] = useState(false);

  const handleOpenLesson = (lessonId: string) => {
    if (lessonId === 'lesson-parabola' || currentLesson.id === lessonId) setCurrentLesson(sampleParabolaLesson);
    setCurrentView('player');
  };

  const handleFinishLesson = (earnedXp: number) => {
    const newlyMasteredId = skills.find(s => s.lessonId === currentLesson.id || s.id === currentLesson.skillId)?.id;
    const currentCompleted = skills.filter(s => s.status === 'mastered').map(s => s.id);
    const updated = Array.from(new Set(newlyMasteredId ? [...currentCompleted, newlyMasteredId] : currentCompleted));
    const refreshed = updateSkillStatuses(skills, updated);
    setSkills(refreshed);
    setProfile(p => ({ ...p, totalXp: p.totalXp + earnedXp, forecastScore: calculateForecastScore(refreshed, updated, p.targetExam) }));
    setTimeout(() => setCurrentView('tree'), 1000);
  };

  const handleRoleChange = (role: UserRole) => {
    const u = authService.switchRole(role);
    setCurrentUser(u);
    if (role === 'developer') setCurrentView('devtools');
    else if (role === 'admin') setCurrentView('crm');
    else if (role === 'teacher') setCurrentView('groups');
    else if (role === 'curator') setCurrentView('groups');
    else setCurrentView('tree');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      <Navbar
        currentView={currentView}
        onViewChange={setCurrentView}
        profile={profile}
        currentUser={currentUser}
        onSwitchRole={handleRoleChange}
        onOpenAuth={() => setIsAuthOpen(true)}
      />

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
        {currentView === 'courses' && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setIsPayOpen(true)}
                className="px-4 py-2 bg-[#FF7A00] hover:bg-[#e06c00] text-white text-xs font-bold rounded-xl shadow-md transition-colors"
              >
                Оплатить курс онлайн (шлюз)
              </button>
            </div>
            <CourseCatalog courses={mcoursesList} onNavigateSkillTree={() => setCurrentView('tree')} />
          </div>
        )}
        {currentView === 'tree' && (
          <div className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900/40 p-5 rounded-3xl border border-slate-200 dark:border-slate-800/60 shadow-sm">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] uppercase tracking-wider">
                  <Compass className="w-4 h-4" /> Навигация по математике
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                  Интерактивная карта знаний «МКурсы»
                </h2>
              </div>
            </div>
            <SkillTree skills={skills} onOpenLesson={handleOpenLesson} />
          </div>
        )}
        {currentView === 'dashboard' && <StudentDashboard profile={profile} skills={skills} onOpenTopic={t => t.lessonId ? handleOpenLesson(t.lessonId) : setCurrentView('tree')} />}
        {currentView === 'editor' && <LessonEditor initialLesson={currentLesson} onSave={setCurrentLesson} onBack={() => setCurrentView('tree')} />}
        {currentView === 'player' && <LessonPlayer lesson={currentLesson} onBack={() => setCurrentView('tree')} onFinish={handleFinishLesson} />}
        {currentView === 'crm' && <CrmPipeline curators={authService.getUsersByRole('curator')} onLeadEnrolled={() => setCurrentView('groups')} />}
        {currentView === 'groups' && <PlatformGroupsView currentUser={currentUser} />}
        {currentView === 'homework' && <PlatformHomeworkView currentUser={currentUser} />}
        {currentView === 'devtools' && <DevToolsPanel />}
      </main>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} onAuthSuccess={u => setCurrentUser(u)} />
      <PaymentModal
        isOpen={isPayOpen}
        onClose={() => setIsPayOpen(false)}
        courseTitle="ЕГЭ Профиль 2026: Математика"
        courseId="ege-profile"
        amount={4900}
        studentId={currentUser?.id || 'demo-student'}
        studentEmail={currentUser?.email || 'student@mcourses.ru'}
        onSuccess={() => { setIsPayOpen(false); setCurrentView('groups'); }}
      />
    </div>
  );
};

export const App: React.FC = () => (
  <ThemeProvider>
    <AppContent />
  </ThemeProvider>
);

export default App;
