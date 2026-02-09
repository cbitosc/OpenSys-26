import React, { memo } from "react";
import { FiUsers, FiAward, FiCalendar, FiMapPin } from "react-icons/fi";

const About = memo(() => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-bold text-white mb-3">
          About OpenSys
        </h2>

        <p className="text-center text-purple-200 mb-14 font-medium">
          The ultimate convergence of technology, innovation, and creativity
        </p>

        {/* Main Content Card */}
        <div className="bg-black/40 backdrop-blur-sm md:backdrop-blur-xl rounded-3xl p-8 md:p-12 border border-purple-900 shadow-lg md:shadow-2xl mb-16">
        <p className="text-gray-300 leading-relaxed mb-6">
  <span className="text-purple-300 font-semibold">OpenSys</span> is a collection
  of technical and creative events designed to be competitive, fun, and
  collaborative. Each event challenges participants to think, solve problems,
  and innovate, while staying engaging for learners of all levels.
</p>

<p className="text-gray-300 leading-relaxed mb-6">
  As the open source community of CBIT, we believe in accessibility and the free
  sharing of knowledge. All OpenSys events are completely free, welcoming
  everyone from beginners to experienced developers.
</p>

<p className="text-gray-300 leading-relaxed">
  Join OpenSys to learn, compete, connect, and celebrate technology together.
</p>

        </div>

        {/* Stats */}

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {/* Free to Participate */}
          <div className="bg-black/40 backdrop-blur-sm md:backdrop-blur-xl rounded-2xl p-6 text-center border border-purple-900">
            <FiUsers className="mx-auto text-3xl text-pink-500 mb-3" />
            <h3 className="text-lg md:text-xl font-bold text-purple-300">
              Free to Participate
            </h3>
            <p className="text-gray-400 mt-2 text-sm">Open for everyone</p>
          </div>

          {/* Win Exciting Prizes */}
          <div className="bg-black/40 backdrop-blur-sm md:backdrop-blur-xl rounded-2xl p-6 text-center border border-purple-900">
            <FiAward className="mx-auto text-3xl text-pink-500 mb-3" />
            <h3 className="text-lg md:text-xl font-bold text-purple-300">
              Win Exciting Prizes
            </h3>
            <p className="text-gray-400 mt-2 text-sm">Cash rewards & goodies</p>
          </div>

          {/* Event Dates */}
          <div className="bg-black/40 backdrop-blur-sm md:backdrop-blur-xl rounded-2xl p-6 text-center border border-purple-900">
            <FiCalendar className="mx-auto text-3xl text-pink-500 mb-3" />
            <h3 className="text-lg md:text-xl font-bold text-purple-300">
              17th & 18th Feb
            </h3>
            <p className="text-gray-400 mt-2 text-sm">Two days of events</p>
          </div>

          {/* Location */}
          <div className="bg-black/40 backdrop-blur-sm md:backdrop-blur-xl rounded-2xl p-6 text-center border border-purple-900">
            <FiMapPin className="mx-auto text-3xl text-pink-500 mb-3" />
            <h3 className="text-lg md:text-xl font-bold text-purple-300">
              CBIT
            </h3>
            <p className="text-gray-400 mt-2 text-sm">Gandipet, Hyderabad</p>
          </div>
        </div>
      </div>
    </section>
  );
});

export default About;
