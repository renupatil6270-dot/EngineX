// src/pages/PortalSelection.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function PortalSelection() {
  const navigate = useNavigate();

  const portals = [
    {
      id: 'dreamer',
      title: 'Dreamer Portal',
      description: 'Explore engineering streams, assess your interests, and take the stream finder quiz.',
      icon: '🚀',
      route: '/dreamer-quiz',
      badge: 'Popular',
    },
    {
      id: 'achiever',
      title: 'Achiever Portal',
      description: 'Access study resources, roadmap guides, semester trackers, and subject roadmaps.',
      icon: '🎯',
      route: '/achiever-dashboard',
      badge: 'Active',
    },
    {
      id: 'innovator',
      title: 'Innovator Portal',
      description: 'Discover hackathons, open source projects, and project collaboration opportunities.',
      icon: '💡',
      route: '/innovator-hub',
      badge: 'New',
    },
  ];

  return (
    <div className="portal-page">
      <div className="portal-header">
        <h1>Select Your EngineX Portal</h1>
        <p>Choose the track that matches your current academic journey</p>
      </div>

      <div className="portal-grid">
        {portals.map((portal) => (
          <div
            key={portal.id}
            className="portal-card"
            onClick={() => navigate(portal.route)}
          >
            <div className="portal-card-top">
              <span className="portal-icon">{portal.icon}</span>
              <span className="portal-badge">{portal.badge}</span>
            </div>
            <h3>{portal.title}</h3>
            <p>{portal.description}</p>
            <div className="portal-action">
              <span>Enter Portal</span>
              <span className="arrow">→</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
