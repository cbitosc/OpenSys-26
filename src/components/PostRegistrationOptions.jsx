import React, { useEffect } from 'react';
import { ListChecks, MessageCircle } from 'lucide-react';

const PostRegistrationOptions = ({ onRegisterAnother, eventType = 'odyssey' }) => {
  const EVENT_NAMES = {
    odyssey: 'Odyssey',
    decipher: 'Decipher',
    gitarcana: 'Git Arcana'
  };

  const eventName = EVENT_NAMES[eventType] || EVENT_NAMES.odyssey;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Different WhatsApp groups for different events
  const WHATSAPP_GROUPS = {
    odyssey: "https://chat.whatsapp.com/Lqmr9QXhPdXDbN3TaJpvZM",
    decipher: "https://chat.whatsapp.com/BkYAQWYc54ALvUDmzeZvRu",
    gitarcana: "https://chat.whatsapp.com/Boy1dpjLak99OAiZxyw3JK"
  };

  const WHATSAPP_GROUP_LINK = WHATSAPP_GROUPS[eventType] || WHATSAPP_GROUPS.odyssey;

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 sm:px-6 py-10">
      <div className="w-full max-w-3xl space-y-6">
        <div className="rounded-3xl border border-white/10 bg-black/50 p-8 sm:p-10 text-center shadow-lg md:shadow-[0_18px_50px_rgba(0,0,0,0.4)] backdrop-blur-sm md:backdrop-blur-xl">
          <div className="mx-auto mb-5 inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-300">
            <ListChecks className="h-7 w-7" />
          </div>
          <p className="text-xs uppercase tracking-[0.25em] text-white/60">Registration Complete</p>
          <h2 className="mt-3 text-3xl sm:text-4xl font-semibold text-white">You are in for {eventName}</h2>
          <p className="mt-3 text-white/70 max-w-xl mx-auto">
            You are all set. Join the updates group to get schedules and instructions.
          </p>
          <div className="mt-6">
            <a
              href={WHATSAPP_GROUP_LINK}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary inline-flex items-center justify-center gap-2 px-8 py-3"
            >
              <span className="inline-flex items-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Join Group
              </span>
            </a>
          </div>
        </div>

        <button
          onClick={onRegisterAnother}
          className="btn-secondary w-full px-6 py-4 text-center"
        >
          <span className="block">
            <ListChecks className="w-6 h-6 text-emerald-300 mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-white mb-2">Submit Another Registration</h3>
            <p className="text-white/60">Want to register more participants? Click here</p>
          </span>
        </button>
      </div>
    </div>
  );
};

export default PostRegistrationOptions;
