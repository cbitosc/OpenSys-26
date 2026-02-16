import React, { memo, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { FiCalendar, FiUsers, FiAward, FiExternalLink, FiMapPin } from "react-icons/fi";

const Events = memo(() => {
  const navigate = useNavigate();
  const events = [
    {
      title: "Git Arcana",
      date: "17th February 2026",
      team: "Solo/Duo",
      description: "Dive into the depths of version control like never before. Teams receive custom GitHub repositories filled with mysteries, hunt for clues hidden in commit messages, pull request labels, secret files, and code history. Decode the archives, connect the dots, and unravel the ultimate secret to claim victory!",
      status: 'closed',
      statusEmoji: "✨",
      tag: { label: "New", className: "bg-yellow-500/20 text-yellow-300 border border-yellow-500/40" },
      prize: "Offline Mode",
      path: "/gitarcana"
    },
    {
      title: "Decipher",
      date: "18th February 2026",
      team: "Solo/Duo",
      description: "A dynamic decryption challenge that tests participants' problem-solving skills. In Round 1, individuals tackle encryption-based questions, while Round 2 presents interconnected puzzles hidden within QR-coded images. The quickest to decode all challenges emerges as winner!",
      status: 'closed',
      statusEmoji: "🔥",
      tag: { label: "Top-Rated", className: "bg-orange-500/20 text-orange-300 border border-orange-500/40" },
      prize: "Offline Mode",
      path: "/decipher"
    },
    {
      title: "Odyssey",
      date: "17th-18th February 2026",
      team: "Solo",
      description: "A thrilling two-day online challenge where participants race against time to solve a series of mind-bending puzzles. With each level increasing in difficulty, only the fastest and sharpest minds will conquer all levels and claim victory!",
      status: 'closed',
      statusEmoji: "🚀",
      tag: { label: "Popular", className: "bg-red-500/20 text-red-300 border border-red-500/40" },
      prize: "Online Mode",
      path: "/odyssey"
    }
  ];

  const handleRegistration = useCallback((eventPath) => {
    // Navigate to registration page for the specific event
    navigate(`/register${eventPath}`);
  }, [navigate]);

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-bold text-white mb-3">
          Our Events
        </h2>
        <div className="mb-14 flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-purple-900/50 bg-purple-900/20 backdrop-blur-sm px-6 py-3">
            <FiCalendar className="w-5 h-5 text-purple-400" />
            <span className="text-purple-200 font-medium">
              All events take place on 17th & 18th February 2026
            </span>
          </div>
        </div>

        {/* Event Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {events.map((event, index) => (
            <div
              key={event.title}
              className="event-card group relative overflow-hidden rounded-3xl bg-black/40 backdrop-blur-sm md:backdrop-blur-xl border border-purple-900 hover:border-purple-700 transition-colors duration-150"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <div className="relative p-6 h-full flex flex-col">
                {/* Card Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-violet-500 flex items-center justify-center">
                    <FiExternalLink className="w-6 h-6 text-white" />
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    event.status === 'open' 
                      ? event.tag.className
                      : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                  }`}>
                    {event.status === 'open' ? `${event.statusEmoji} ${event.tag.label}` : 'Closed'}
                  </div>
                </div>

                {/* Event Title */}
                <h3 className="text-xl font-bold mb-3 text-white group-hover:text-purple-300 transition-colors">
                  {event.title}
                </h3>

                {/* Event Description */}
                <p className="text-gray-400 mb-4 flex-grow text-sm leading-relaxed">
                  {event.description}
                </p>

                {/* Event Details */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <FiCalendar className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm text-gray-400">
                    <FiUsers className="w-4 h-4 text-purple-400 flex-shrink-0" />
                    <span>{event.team}</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <FiMapPin className="w-4 h-4 text-fuchsia-400 flex-shrink-0" />
                    <span className="font-medium text-purple-300">{event.prize}</span>
                  </div>
                </div>

                {/* Registration Button */}
                <div className="mt-auto">
                  {event.status === 'open' ? (
                    <button
                      onClick={() => handleRegistration(event.path)}
                      className="btn-primary w-full py-3 text-center"
                    >
                      <span>Register Now →</span>
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-3 rounded-full bg-gray-600/20 text-gray-500 font-medium border border-gray-600/30 cursor-not-allowed"
                    >
                      Registration Closed
                    </button>
                  )}
                </div>
              </div>

              {/* Hover Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-violet-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl pointer-events-none" />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
});

export default Events;