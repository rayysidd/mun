'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="relative w-full min-h-screen overflow-hidden">
      {/* World Map Image Background */}
      <div className="world-map-background">
        <div className="map-image-container">
          <img 
            src='/images/world-map.jpg' 
            alt="World Map"
            className="world-map-image"
          />
        </div>
        
        {/* Interactive Overlay Elements */}
        <svg className="world-map-overlay" viewBox="0 0 1000 500" preserveAspectRatio="xMidYMid slice">
          {/* Major Cities/Capitals */}
          <circle className="country-dot dot-1" cx="200" cy="130" r="4" />
          <circle className="country-dot dot-2" cx="240" cy="320" r="4" />
          <circle className="country-dot dot-3" cx="470" cy="110" r="4" />
          <circle className="country-dot dot-4" cx="480" cy="260" r="4" />
          <circle className="country-dot dot-5" cx="680" cy="140" r="4" />
          <circle className="country-dot dot-6" cx="770" cy="340" r="4" />
          <circle className="country-dot dot-7" cx="320" cy="150" r="4" />
          <circle className="country-dot dot-8" cx="640" cy="120" r="4" />
          
          {/* Diplomatic Connection Routes */}
          <path className="connection-line line-1" d="M200,130 Q300,100 470,110" stroke="rgba(192, 192, 192, 0.7)" strokeWidth="2" fill="none" strokeDasharray="8,12" />
          <path className="connection-line line-2" d="M470,110 Q575,90 680,140" stroke="rgba(192, 192, 192, 0.7)" strokeWidth="2" fill="none" strokeDasharray="8,12" />
          <path className="connection-line line-3" d="M240,320 Q360,290 480,260" stroke="rgba(192, 192, 192, 0.7)" strokeWidth="2" fill="none" strokeDasharray="8,12" />
          <path className="connection-line line-4" d="M480,260 Q620,300 770,340" stroke="rgba(192, 192, 192, 0.7)" strokeWidth="2" fill="none" strokeDasharray="8,12" />
          
          {/* Pulsing Diplomatic Hubs */}
          <circle className="diplomatic-hub hub-1" cx="200" cy="130" r="15" />
          <circle className="diplomatic-hub hub-2" cx="470" cy="110" r="15" />
          <circle className="diplomatic-hub hub-3" cx="680" cy="140" r="15" />
          <circle className="diplomatic-hub hub-4" cx="480" cy="260" r="15" />
        </svg>
        
        {/* Color Overlay for Navy Theme */}
        <div className="color-overlay"></div>
      </div>

      {/* Floating Diplomatic Elements */}
      <div className="floating-elements">
        <div className="diplomatic-icon icon-1">🏛️</div>
        <div className="diplomatic-icon icon-2">⚖️</div>
        <div className="diplomatic-icon icon-3">🌍</div>
        <div className="diplomatic-icon icon-4">🤝</div>
        <div className="diplomatic-icon icon-5">📜</div>
        <div className="diplomatic-icon icon-6">🕊️</div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-6 py-12">
        
        {/* Header Section */}
        <header className="flex flex-col items-center gap-8 mb-16">

          {/* This outer div provides the styled "box" */}
          <div className="logo-container py-4 px-6">
            {/* This new inner div arranges the content side-by-side */}
            <div className="flex items-center gap-5">
              <Image
                src="https://upload.wikimedia.org/wikipedia/commons/e/ee/UN_emblem_blue.svg"
                alt="DiploMate Logo"
                width={70}
                height={70}
                className="logo-image"
              />
              <h1 className="brand-title">
                DiploMate
              </h1>
            </div>
          </div>

          <p className="mission-statement">
            Your AI-powered command center for Model UN. Navigate complex diplomacy, 
            forge strategic alliances, and master the art of international relations.
          </p>
        </header>

        {/* Enhanced Navigation Buttons */}
        <nav className="w-full max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-1">
            
            
            {/* Profile */}
            <button
              onClick={() => router.push('/profile')}
              className="nav-card speech-card clickable-card"
            >
              <div className="card-icon">
                <span className="text-3xl">👤</span>
              </div>
              <h3 className="card-title">Profile Page</h3>
              <p className="card-description">Manage your credentials, track achievements, and build your international reputation.</p>
              
            </button>

            {/* Speech Writer Card */}
            <button
              onClick={() => router.push('/speech')}
              className="nav-card speech-card clickable-card"
            >
              <div className="card-icon">
                <span className="text-3xl">📝</span>
              </div>
              <h3 className="card-title">Speech Architect</h3>
              <p className="card-description">Craft compelling diplomatic speeches, resolutions, and position papers with AI assistance.</p>
            </button>
            
            {/* Events Card */}
            <button
              onClick={() => router.push('/events')}
              className="nav-card events-card clickable-card"
            >
              <div className="card-icon">
                <span className="text-3xl">🏛️</span>
              </div>
              <h3 className="card-title">Conference Hub</h3>
              <p className="card-description">Organize Model UN conferences, manage committees, and coordinate diplomatic simulations.</p>
            </button>
            
          </div>
        </nav>

        {/* Footer */}
        <footer className="mt-20 text-center">
          <p className="footer-text">
            Empowering the next generation of global leaders
          </p>
        </footer>
      </div>

      <style jsx>{`
        .world-map-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          overflow: hidden;
        }

        .map-image-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .world-map-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center;
          opacity: 0.4;
          filter: contrast(1.2) brightness(0.8);
        }

        .color-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, 
            rgba(12, 22, 49, 0.85) 0%, 
            rgba(26, 47, 92, 0.75) 25%, 
            rgba(43, 74, 138, 0.7) 50%, 
            rgba(26, 47, 92, 0.75) 75%, 
            rgba(12, 22, 49, 0.85) 100%
          );
          mix-blend-mode: multiply;
        }

        .world-map-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          z-index: 2;
        }

        .country-dot {
          fill: rgba(192, 192, 192, 0.9);
          stroke: rgba(255, 255, 255, 0.6);
          stroke-width: 1;
          animation: dotPulse 4s infinite ease-in-out;
          filter: drop-shadow(0 0 4px rgba(192, 192, 192, 0.5));
        }

        .dot-1 { animation-delay: 0s; }
        .dot-2 { animation-delay: -0.5s; }
        .dot-3 { animation-delay: -1s; }
        .dot-4 { animation-delay: -1.5s; }
        .dot-5 { animation-delay: -2s; }
        .dot-6 { animation-delay: -2.5s; }
        .dot-7 { animation-delay: -3s; }
        .dot-8 { animation-delay: -3.5s; }

        .connection-line {
          animation: lineFlow 10s infinite linear;
          filter: drop-shadow(0 0 2px rgba(192, 192, 192, 0.3));
        }

        .line-1 { animation-delay: 0s; }
        .line-2 { animation-delay: -2s; }
        .line-3 { animation-delay: -4s; }
        .line-4 { animation-delay: -6s; }

        .diplomatic-hub {
          fill: none;
          stroke: rgba(192, 192, 192, 0.4);
          stroke-width: 1;
          animation: hubPulse 6s infinite ease-in-out;
        }

        .hub-1 { animation-delay: 0s; }
        .hub-2 { animation-delay: -1.5s; }
        .hub-3 { animation-delay: -3s; }
        .hub-4 { animation-delay: -4.5s; }

        .floating-elements {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 3;
        }

        .diplomatic-icon {
          position: absolute;
          font-size: 2rem;
          opacity: 0.5;
          animation: diplomaticFloat 25s infinite ease-in-out;
          filter: grayscale(0.2) brightness(1.3) drop-shadow(0 0 10px rgba(192, 192, 192, 0.3));
        }

        .icon-1 { top: 15%; left: 10%; animation-delay: 0s; }
        .icon-2 { top: 25%; right: 15%; animation-delay: -5s; }
        .icon-3 { top: 45%; left: 5%; animation-delay: -10s; }
        .icon-4 { top: 35%; right: 8%; animation-delay: -15s; }
        .icon-5 { bottom: 30%; left: 12%; animation-delay: -20s; }
        .icon-6 { bottom: 20%; right: 20%; animation-delay: -3s; }

        .logo-container {
          position: relative;
          padding: 1.5rem;
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.05));
          border-radius: 24px;
          border: 1px solid rgba(192, 192, 192, 0.3);
          backdrop-filter: blur(20px);
        }

        .logo-image {
          filter: brightness(0) saturate(100%) invert(75%) sepia(0%) saturate(0%) hue-rotate(0deg) brightness(1.2) contrast(1);
          animation: logoRotate 20s infinite linear;
        }

        .brand-title {
          font-size: clamp(2.5rem, 8vw, 5rem);
          font-weight: 900;
          color: #e6e6e6; /* Use a solid color for visibility */
          font-family: 'Playfair Display', serif;
          letter-spacing: -0.02em;
          animation: titleGlow 3s ease-in-out infinite alternate;
        }

        .brand-subtitle {
          font-size: clamp(1rem, 3vw, 1.5rem);
          color: rgba(192, 192, 192, 0.9);
          font-weight: 500;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .mission-statement {
          max-width: 42rem;
          font-size: clamp(1rem, 2.5vw, 1.25rem);
          line-height: 1.7;
          color: rgba(192, 192, 192, 0.95);
          font-weight: 300;
          margin: 0 auto;
          text-align: center;
          text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
        }

        .nav-card {
          position: relative;
          background: linear-gradient(135deg, 
            rgba(13, 22, 49, 0.95) 0%, 
            rgba(26, 47, 92, 0.9) 50%, 
            rgba(13, 22, 49, 0.95) 100%
          );
          backdrop-filter: blur(20px);
          border: 1px solid rgba(192, 192, 192, 0.2);
          border-radius: 24px;
          padding: 2.5rem;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          overflow: hidden;
          min-height: 200;
        }

        .clickable-card {
          cursor: pointer;
          text-align: left;
          border: none;
          font-family: inherit;
        }

        .nav-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #c0c0c0, #e6e6e6, #c0c0c0);
          transform: scaleX(0);
          transition: transform 0.4s ease;
        }

        .nav-card::after {
          content: '';
          position: absolute;
          top: 50%;
          left: 50%;
          width: 0;
          height: 0;
          background: radial-gradient(circle, rgba(192, 192, 192, 0.1) 0%, transparent 70%);
          transform: translate(-50%, -50%);
          transition: all 0.6s ease;
        }

        .nav-card:hover::before {
          transform: scaleX(1);
        }

        .nav-card:hover::after {
          width: 300px;
          height: 300px;
        }

        .nav-card:hover {
          transform: translateY(-12px) scale(1.02);
          border-color: rgba(192, 192, 192, 0.4);
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.4),
            0 0 30px rgba(192, 192, 192, 0.15),
            inset 0 1px 0 rgba(192, 192, 192, 0.1);
        }

        .card-icon {
          width: 3rem;
          height: 3rem;
          color: #c0c0c0;
          margin-bottom: 1.5rem;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .nav-card:hover .card-icon {
          transform: scale(1.1);
          color: #e6e6e6;
          filter: drop-shadow(0 0 15px rgba(192, 192, 192, 0.5));
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #c0c0c0;
          margin-bottom: 1rem;
          font-family: 'Playfair Display', serif;
          position: relative;
          z-index: 2;
        }

        .card-description {
          color: rgba(192, 192, 192, 0.8);
          line-height: 1.6;
          font-size: 0.95rem;
          margin-bottom: 2rem;
          position: relative;
          z-index: 2;
          flex-grow: 1;
        }

        .action-button {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.1), rgba(192, 192, 192, 0.05));
          border: 1px solid rgba(192, 192, 192, 0.2);
          border-radius: 12px;
          padding: 1rem 1.5rem;
          color: #c0c0c0;
          font-weight: 500;
          transition: all 0.3s ease;
          position: relative;
          z-index: 2;
          cursor: pointer;
          font-family: inherit;
          font-size: 0.95rem;
          margin-top: auto;
        }

        .action-button:hover {
          background: linear-gradient(135deg, rgba(192, 192, 192, 0.15), rgba(192, 192, 192, 0.08));
          border-color: rgba(192, 192, 192, 0.3);
          color: #e6e6e6;
        }

        .card-arrow {
          font-size: 1.2rem;
          transition: all 0.3s ease;
          opacity: 0.7;
        }

        .nav-card:hover .card-arrow {
          transform: translateX(8px);
          opacity: 1;
        }

        .footer-text {
          color: rgba(192, 192, 192, 0.6);
          font-size: 0.9rem;
          font-style: italic;
          letter-spacing: 0.05em;
        }

        @keyframes dotPulse {
          0%, 100% { 
            fill: rgba(192, 192, 192, 0.9);
            transform: scale(1);
          }
          50% { 
            fill: rgba(255, 255, 255, 1);
            transform: scale(1.2);
          }
        }

        @keyframes lineFlow {
          0% { stroke-dashoffset: 0; }
          100% { stroke-dashoffset: 60; }
        }

        @keyframes hubPulse {
          0%, 100% { 
            stroke: rgba(192, 192, 192, 0.4);
            r: 15;
          }
          50% { 
            stroke: rgba(192, 192, 192, 0.7);
            r: 20;
          }
        }

        @keyframes diplomaticFloat {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.5; }
          25% { transform: translateY(-15px) scale(1.1); opacity: 0.7; }
          50% { transform: translateY(-5px) scale(0.9); opacity: 0.6; }
          75% { transform: translateY(-10px) scale(1.05); opacity: 0.8; }
        }

        @keyframes logoRotate {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        @keyframes titleGlow {
          0% { text-shadow: 0 0 20px rgba(192, 192, 192, 0.3); }
          100% { text-shadow: 0 0 30px rgba(192, 192, 192, 0.6), 0 0 40px rgba(192, 192, 192, 0.3); }
        }

        @media (max-width: 768px) {
          .nav-card {
            padding: 2rem;
            min-height: 280px;
          }

          .diplomatic-icon {
            font-size: 1.5rem;
          }

          .world-map-image {
            opacity: 0.3;
          }

          .country-dot {
            r: 3;
          }
        }
      `}</style>
    </main>
  );
}
