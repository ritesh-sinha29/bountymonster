import React from "react";
import { Github, Twitter, Linkedin, Github as Discord, Command, ExternalLink } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    platform: [
      { name: "Global Quests", href: "#" },
      { name: "Character Skills", href: "#" },
      { name: "High-Tier Leagues", href: "#" },
      { name: "Proof of Work", href: "#" },
    ],
    hunter_support: [
      { name: "The Archives", href: "#" },
      { name: "Safe Harbor Policy", href: "#" },
      { name: "Payout Streams", href: "#" },
      { name: "Elite Support", href: "#" },
    ],
    company: [
      { name: "Post a Bounty", href: "#" },
      { name: "Integration Guide", href: "#" },
      { name: "Triage Process", href: "#" },
      { name: "Partners", href: "#" },
    ],
  };

  return (
    <footer className="bg-black border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-indigo-600/5 blur-[150px] rounded-full -mb-64 -mr-64 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-24 mb-24">
          {/* Brand Column */}
          <div className="col-span-1 md:col-span-4 lg:col-span-5">
            <div className="flex items-center gap-2 text-white font-bold text-2xl mb-6">
              <Command className="w-8 h-8 text-indigo-500" />
              <span>Bounty <span className="text-indigo-500">Monster</span></span>
            </div>
            <p className="text-zinc-500 text-lg max-w-sm mb-8 leading-relaxed">
              The professional arena where effort meets reward. Level up your career, 
              unlock legendary powers, and claim your glory.
            </p>
            <div className="flex gap-4">
              {[
                { Icon: Discord, label: "Discord" },
                { Icon: Twitter, label: "Twitter" },
                { Icon: Github, label: "GitHub" },
                { Icon: Linkedin, label: "LinkedIn" }
              ].map(({ Icon, label }, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label={`Official Bounty Monster ${label}`}
                  className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-zinc-400 hover:text-white hover:bg-zinc-800 hover:border-indigo-500/30 transition-all"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links Columns */}
          <div className="col-span-1 md:col-span-8 lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-12">
              <div>
                <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-6">The Platform</h4>
                <ul className="space-y-4">
                  {links.platform.map((l) => (
                    <li key={l.name}>
                      <a href={l.href} className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors flex items-center gap-1 group">
                        {l.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-6">Hunter Hub</h4>
                <ul className="space-y-4">
                  {links.hunter_support.map((l) => (
                    <li key={l.name}>
                      <a href={l.href} className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors flex items-center gap-1 group">
                        {l.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="col-span-2 md:col-span-1">
                <h4 className="text-white font-bold uppercase tracking-widest text-[10px] mb-6">Partnering</h4>
                <ul className="space-y-4">
                  {links.company.map((l) => (
                    <li key={l.name}>
                      <a href={l.href} className="text-zinc-500 hover:text-indigo-400 text-sm transition-colors flex items-center gap-1 group">
                        {l.name}
                        <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between pt-12 border-t border-white/5 gap-6">
          <div className="text-zinc-500 text-xs tracking-wide">
            © {currentYear} Bounty Monster. Securing the decentralized future, one quest at a time.
          </div>
          <div className="flex gap-8">
            <a href="#" className="text-zinc-500 hover:text-white text-xs transition-colors">Privacy Policy</a>
            <a href="#" className="text-zinc-500 hover:text-white text-xs transition-colors">Terms of Service</a>
            <a href="#" className="text-zinc-500 hover:text-white text-xs transition-colors">Safe Harbor</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
