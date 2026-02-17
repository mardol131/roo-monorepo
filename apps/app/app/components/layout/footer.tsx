import React from "react";
import Text from "../ui/atoms/text";
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
    <footer className="bg-zinc-900 text-white pt-16 pb-8">
      <div className="max-w-content mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <Text variant="heading4" className="text-white mb-4">
              EventHub
            </Text>
            <Text variant="body2" className="text-zinc-400 mb-6">
              Objevujte a sdílejte nejlepší zážitky v Praze.
            </Text>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.label}
                    href={social.href}
                    aria-label={social.label}
                    className="p-2 rounded-full bg-zinc-800 hover:bg-rose-500 transition-colors"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Links Sections */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <Text variant="body1" className="text-white font-semibold mb-4">
                {section.title}
              </Text>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-zinc-400 hover:text-rose-500 transition-colors"
                    >
                      <Text variant="body2" color="onPrimary">
                        {link.label}
                      </Text>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter Section */}
        <div className="border-y border-zinc-800 py-12 mb-12">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <Text variant="heading4" className="text-white mb-2">
                Zůstaňte v obraze
              </Text>
              <Text variant="body2" className="text-zinc-400">
                Přihlaste se na náš newsletter a dostávejte novinky o nových
                akcích.
              </Text>
            </div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Váš email..."
                className="flex-1 px-4 py-3 rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-rose-500 transition-all"
              />
              <button className="px-6 py-3 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors font-medium">
                <Mail size={18} />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <Text variant="body2" className="text-zinc-400">
            © {currentYear} EventHub. Všechna práva vyhrazena.
          </Text>
          <div className="flex gap-6">
            <a href="#">
              <Text variant="body2" color="onPrimary">
                Soukromí
              </Text>
            </a>
            <a href="#">
              <Text variant="body2" color="onPrimary">
                Podmínky služby
              </Text>
            </a>
            <a href="#">
              <Text variant="body2" color="onPrimary">
                Cookies
              </Text>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
