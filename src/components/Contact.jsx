import { FaDiscord, FaGithub, FaLinkedin, FaInstagram, FaEnvelope, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';

const Contact = () => {
  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      <div className="relative z-10 max-w-6xl mx-auto px-6">
        {/* Heading */}
        <h2 className="text-center text-4xl md:text-5xl font-bold text-white mb-3">
          Contact Us
        </h2>
        <p className="text-center text-purple-200 mb-14 font-medium">
          Have questions? We're here to help you with any queries about OpenSys 2026.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left box - Get in Touch */}
          <div className="bg-black/40 backdrop-blur-sm md:backdrop-blur-xl rounded-3xl p-8 border border-purple-900 shadow-lg md:shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-white">Get in Touch</h3>

            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="mt-1 p-3 rounded-xl bg-purple-900/30">
                  <FaEnvelope className="w-5 h-5 text-fuchsia-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-1">Email</h4>
                  <p className="text-gray-300">cosc@cbit.ac.in</p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-3 rounded-xl bg-purple-900/30">
                  <FaPhone className="w-5 h-5 text-fuchsia-400 rotate-90" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-1">Contact</h4>
                  <p className="text-gray-300">
                    Pawan Mohit: +91 9492532259<br />
                    Karthekeya: +91 9490050289
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="mt-1 p-3 rounded-xl bg-purple-900/30">
                  <FaMapMarkerAlt className="w-5 h-5 text-fuchsia-400" />
                </div>
                <div>
                  <h4 className="font-semibold text-purple-300 mb-1">Location</h4>
                  <p className="text-gray-300">
                    Chaitanya Bharathi Institute of Technology<br />
                    Gandipet, Hyderabad – 500075
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right box - Connect With Us */}
          <div className="bg-black/40 backdrop-blur-sm md:backdrop-blur-xl rounded-3xl p-8 border border-purple-900 shadow-lg md:shadow-2xl">
            <h3 className="text-2xl font-bold mb-6 text-white">Connect With Us</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
              <a
                href="https://github.com/cbitosc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-purple-900/20 border border-purple-800/50 hover:bg-purple-800/30 transition-colors duration-150 text-white"
              >
                <FaGithub className="w-5 h-5 text-fuchsia-400" />
                <span>GitHub</span>
              </a>

              <a
                href="https://discord.com/invite/BCBvtyPsEt"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-purple-900/20 border border-purple-800/50 hover:bg-purple-800/30 transition-colors duration-150 text-white"
              >
                <FaDiscord className="w-5 h-5 text-[#5865F2]" />
                <span>Discord</span>
              </a>

              <a
                href="https://www.instagram.com/cbitosc/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-purple-900/20 border border-purple-800/50 hover:bg-purple-800/30 transition-colors duration-150 text-white"
              >
                <FaInstagram className="w-5 h-5 text-[#DD2A7B]" />
                <span>Instagram</span>
              </a>

              <a
                href="https://linkedin.com/company/cbitosc"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 rounded-xl bg-purple-900/20 border border-purple-800/50 hover:bg-purple-800/30 transition-colors duration-150 text-white"
              >
                <FaLinkedin className="w-5 h-5 text-[#0A66C2]" />
                <span>LinkedIn</span>
              </a>
            </div>
            <p className="text-gray-400">
              Follow us for the latest updates and announcements about OpenSys 2026!
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;