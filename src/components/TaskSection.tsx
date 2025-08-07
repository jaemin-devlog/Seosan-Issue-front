import React from 'react';
import './TaskSection.css';
import { useApi } from '../hooks';
import { taskAPI, teamAPI } from '../services/api';
import { TaskSummary, TeamOverview } from '../types';
import { LoadingStates } from './LoadingStates';

const TaskSection: React.FC = () => {
  const { data: taskSummary, loading: taskLoading } = useApi<TaskSummary>(() => taskAPI.getSummary());
  const { data: teamOverview, loading: teamLoading } = useApi<TeamOverview>(() => teamAPI.getOverview());

  const isLoading = taskLoading || teamLoading;

  const getProgressColor = (rate: number): string => {
    if (rate >= 90) return '#4CAF50';
    if (rate >= 70) return '#2196F3';
    if (rate >= 50) return '#FF9800';
    return '#F44336';
  };

  const getChangeIndicator = (change: number) => {
    if (change === 0) return null;
    return (
      <span className={`progress-change ${change > 0 ? 'positive' : 'negative'}`}>
        {change > 0 ? '▲' : '▼'} {Math.abs(change)}%
      </span>
    );
  };

  return (
    <section className="task-section" aria-label="작업 현황">
      <h2 className="task-title">오늘의 업무</h2>
      
      {isLoading ? (
        <div className="task-content">
          <LoadingStates type="card" />
        </div>
      ) : (
        <div className="task-content">
          {taskSummary && (
            <>
              <div className="task-summary-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="task-icon">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 1 1 0 000 2H4v10h12V5h-2a1 1 0 100-2 2 2 0 012 2v12a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm5 4a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm0 3a1 1 0 011-1h3a1 1 0 110 2h-3a1 1 0 01-1-1z" clipRule="evenodd"/>
                </svg>
                작업 요약
              </div>
              
              <div className="task-cards">
                <div className="project-header">
                  <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="project-icon">
                    <path fillRule="evenodd" d="M3 5a2 2 0 012-2h10a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2V5zm11 1H6v8h8V6z" clipRule="evenodd"/>
                  </svg>
                  <span>프로젝트 현황</span>
                </div>
                
                <div className="project-stats">
                  <div className="project-card dark">
                    <div className="card-label">진행중</div>
                    <div className="card-value">{taskSummary.projects}</div>
                  </div>
                  <div className="project-card blue">
                    <div className="card-label">할당됨</div>
                    <div className="card-value">{taskSummary.assigned}</div>
                  </div>
                  <div className="project-card light">
                    <div className="card-label">완료됨</div>
                    <div className="card-value">{taskSummary.completed}</div>
                  </div>
                </div>
                
                <div className="project-progress">
                  <span className="progress-label">정시 완료율:</span>
                  <div className="progress-info">
                    <span className="progress-value" style={{ color: getProgressColor(taskSummary.completionRate) }}>
                      {taskSummary.completionRate}%
                    </span>
                    {getChangeIndicator(taskSummary.changeRate)}
                  </div>
                </div>
              </div>
            </>
          )}

          {teamOverview && (
            <div className="team-section">
              <div className="team-header">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor" className="team-icon">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                <span>우리 팀</span>
              </div>
              
              <div className="team-avatars">
                <span className="team-label">팀원</span>
                <div className="team-members">
                  {teamOverview.members.slice(0, 4).map((member) => (
                    <div
                      key={member.id}
                      className="member-avatar"
                      title={`${member.name} - ${member.role}`}
                      style={{ 
                        backgroundImage: `url(${member.avatar})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {!member.avatar && member.name.charAt(0)}
                    </div>
                  ))}
                  {teamOverview.members.length > 4 && (
                    <span className="member-more">+{teamOverview.members.length - 4}</span>
                  )}
                </div>
              </div>
              
              <div className="team-progress">
                <div className="hours-info">
                  <span className="hours-label">이번 주 시간</span>
                  <span className="hours-value">{teamOverview.totalHours}</span>
                </div>
                <div className="circular-progress">
                  <svg width="60" height="60" viewBox="0 0 60 60">
                    <circle 
                      cx="30" 
                      cy="30" 
                      r="25" 
                      stroke="var(--border-secondary)" 
                      strokeWidth="5" 
                      fill="none" 
                    />
                    <circle 
                      cx="30" 
                      cy="30" 
                      r="25" 
                      stroke={getProgressColor(teamOverview.weeklyProgress)}
                      strokeWidth="5" 
                      fill="none"
                      strokeDasharray={`${teamOverview.weeklyProgress * 1.57} 157`}
                      strokeDashoffset="0"
                      transform="rotate(-90 30 30)"
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="progress-percentage">
                    {teamOverview.weeklyProgress}%
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default TaskSection;