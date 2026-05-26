"use client";

import React from "react";
import { Facebook, Instagram, Twitter, Linkedin, Mail } from "lucide-react";
import { useTranslations } from "next-intl";
import { IntlLink, Link } from "@/app/i18n/navigation";
import Text from "../ui/atoms/text";

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const t = useTranslations("global.footer");
  const appName = useTranslations("global.root")("appName");

  const footerLinks: {
    title: string;
    links: { label: string; href: IntlLink }[];
  }[] = [
    {
      title: t("sections.help.title"),
      links: [
        { label: t("sections.help.pricing"), href: "/pages/pricing" },
        { label: t("sections.help.faq"), href: "/pages/faq" },
        {
          label: t("sections.help.howItWorksForUser"),
          href: "/pages/how-it-works-for-user",
        },
        { label: t("sections.help.contact"), href: "/pages/contact" },
      ],
    },
    {
      title: t("sections.company.title"),
      links: [
        { label: t("sections.company.gastro"), href: "/pages/for-gastro" },
        {
          label: t("sections.company.entertainment"),
          href: "/pages/for-entertainment",
        },
        { label: t("sections.company.venue"), href: "/pages/for-venue" },
        {
          label: t("sections.company.howItWorksForCompany"),
          href: "/pages/how-it-works-for-company",
        },
        {
          label: t("sections.company.partnership"),
          href: "/pages/partnership",
        },
      ],
    },
    {
      title: t("sections.roo.title"),
      links: [
        { label: t("sections.roo.about"), href: "/pages/about" },
        { label: t("sections.roo.roadmap"), href: "/pages/roadmap" },
      ],
    },
  ];

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Instagram, href: "#", label: "Instagram" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
  ];

  const bottomLinks: { label: string; href: IntlLink }[] = [
    { label: t("bottom.privacy"), href: "/gdpr" },
    { label: t("bottom.terms"), href: "/terms-and-conditions" },
    { label: t("bottom.cookies"), href: "/cookies" },
  ];

  return (
    <footer className="bg-zinc-900 text-white pt-10 pb-6 flex justify-center">
      <div className={`max-w-content w-full px-4`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="lg:col-span-2">
            <div className="flex flex-col">
              <Text
                variant="label-lg"
                color="white"
                className="font-semibold tracking-wide"
              >
                {appName}
              </Text>
              <Text
                variant="caption"
                color="textLight"
                className="mt-2 mb-4 leading-relaxed"
              >
                {t("brand.description")}
              </Text>
            </div>
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

          {footerLinks.map((section) => (
            <div key={section.title}>
              <Text variant="label" className="font-semibold" color="white">
                {section.title}
              </Text>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link href={link.href}>
                      <Text
                        variant="label"
                        className="font-semibold"
                        color="textLight"
                      >
                        {link.label}
                      </Text>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-y border-zinc-800 py-6 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-4">
            <div className="flex-1 flex flex-col">
              <Text variant="label-lg" color="white" className="font-semibold">
                {t("newsletter.heading")}
              </Text>
              <Text variant="caption" color="textLight" className="mt-0.5">
                {t("newsletter.subheading")}
              </Text>
            </div>
            <div className="flex gap-2 md:w-72">
              <input
                type="email"
                placeholder={t("newsletter.placeholder")}
                className="flex-1 px-3 py-2 text-xs rounded-lg bg-zinc-800 text-white placeholder-zinc-500 focus:outline-none focus:ring-1 focus:ring-rose-500 transition-all"
              />
              <button
                aria-label={t("newsletter.submitLabel")}
                className="px-3 py-2 bg-rose-500 text-white rounded-lg hover:bg-rose-600 transition-colors"
              >
                <Mail size={14} />
              </button>
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center gap-3">
          <Text variant="caption" color="textLight">
            © {currentYear} {appName}. {t("bottom.rights")}
          </Text>
          <div className="flex gap-5">
            {bottomLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href as any}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                <Text variant="caption" color="textLight">
                  {link.label}
                </Text>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
