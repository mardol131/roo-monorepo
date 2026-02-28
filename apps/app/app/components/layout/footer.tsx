import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";

type Props = {};

export default function Footer({}: Props) {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "Společnost",
      links: [
        { label: "O nás", href: "#" },
        { label: "Kariéra", href: "#" },
        { label: "Blog", href: "#" },
        { label: "Kontakty", href: "#" },
      ],
    },
    {
      title: "Pomoc",
      links: [
        { label: "Centrum podpory", href: "#" },
        { label: "FAQ", href: "#" },
        { label: "Bezpečnost", href: "#" },
        { label: "Podmínky", href: "#" },
      ],
    },
    {
      title: "Zařízení",
      links: [
        { label: "Web app", href: "#" },
        { label: "Mobilní app", href: "#" },
        { label: "Desktop app", href: "#" },
        { label: "API", href: "#" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  return (
    <footer className="bg-zinc-900 text-white pt-10 pb-6">
      <div className="max-w-content mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-2">
            <span className="text-sm font-semibold text-white tracking-wide">
              EventHub
            </span>
            <p className="text-xs text-zinc-400 mt-2 mb-4 leading-relaxed">
              Objevujte a sdílejte nejlepší zážitky v Praze.
            </p>
            <div className="flex gap-2">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-1.5 rounded-lg bg-zinc-800 hover:bg-rose-500 transition-colors"
                  >
                    <Icon size={14} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <p className="text-xs font-semibold text-white mb-3">
                {section.title}
              </p>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-xs text-zinc-400 hover:text-rose-400 transition-colors"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-y border-zinc-800 py-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1">
              <p className="text-sm font-semibold text-white">
                Zůstaňte v obraze
              </p>
              <p className="text-xs text-zinc-400 mt-0.5">
                Přihlaste se na newsletter a dostávejte novinky o nových akcích.
              </p>
            </div>
            <div className="flex gap-2 md:w-72">
              <input
                type="email"
                placeholder="Váš email..."
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
              />
              <button className="px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors">
                <Mail size={14} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="text-xs text-zinc-500">
            © {currentYear} EventHub. Všechna práva vyhrazena.
          </p>
          <div className="flex gap-5">
            {["Soukromí", "Podmínky služby", "Cookies"].map((label) => (
              <a
                key={label}
                href="#"
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
