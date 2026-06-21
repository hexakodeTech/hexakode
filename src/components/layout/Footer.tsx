"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { SOCIAL_LINKS } from "@/constants/contact";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-primary-container text-on-primary-container relative w-full border-t border-outline-variant/10">
      {/* Reorganized 3-Column Grid for a premium layout */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-gutter py-20 px-margin-mobile md:px-margin-desktop max-w-container-max mx-auto">
        
        {/* Branding & Socials - Spans 2 columns on desktop for SaaS-agency look */}
        <div className="flex flex-col items-start md:col-span-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_zrELXV2pEVyY_zQhDfkswqgdUPyuCrFoE01YX_eE_bufiCuL0pcc5UbjepicohvNODMBE_6NV-3POCl1MZo2hX7VEsXPPsQpQRuiXy8A5lW-NkT8mKT-rwTiVvDsU6ClUx-fz3YnDfoGwNmaFiRPqeOdMmCzyjleGPsJv3YVdwvcMoktRk1-PSwycodQTaUdVEZMNROJkbZUC2BnupDOCp2CnDQhAqbtYJ_69Jn_dPBndOu2Daq7JAzyfvIgPY81edfdATU1IKFa"
                alt="HexaKode Logo"
                fill
                sizes="40px"
                className="object-contain brightness-0 invert"
              />
            </div>
            <span className="font-headline-sm text-white font-bold tracking-tight">
              HexaKode
            </span>
          </div>
          <p className="font-body-sm text-on-primary-container/70 mb-8">
            Code That Powers Growth
          </p>
          <div className="flex gap-4">
            {SOCIAL_LINKS.filter(
              (link) => ["facebook", "instagram", "twitter", "linkedin"].includes(link.iconName)
            ).map((link) => {
              const getSocialIcon = (iconName: string) => {
                switch (iconName) {
                  case "facebook":
                    return (
                      <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                        <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.75z"/>
                      </svg>
                    );
                  case "instagram":
                    return (
                      <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                      </svg>
                    );
                  case "twitter":
                    return (
                      <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    );
                  case "linkedin":
                    return (
                      <svg className="w-5 h-5 fill-currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    );
                  default:
                    return null;
                }
              };

              return (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-on-primary-container/70 hover:text-white transition-colors duration-300"
                  title={link.platform}
                  aria-label={link.platform}
                >
                  {getSocialIcon(link.iconName)}
                </a>
              );
            })}
          </div>
        </div>

        {/* Company Links */}
        <div>
          <h5 className="font-label-mono text-label-mono text-white mb-6 uppercase tracking-wider">
            Company
          </h5>
          <ul className="space-y-4 font-body-sm text-body-sm">
            <li>
              <Link href="/about" className="text-on-primary-container/70 hover:text-white transition-colors duration-300">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/portfolio" className="text-on-primary-container/70 hover:text-white transition-colors duration-300">
                Portfolio
              </Link>
            </li>
            <li>
              <Link href="/#careers" className="text-on-primary-container/70 hover:text-white transition-colors duration-300">
                Careers
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-on-primary-container/70 hover:text-white transition-colors duration-300">
                Contact
              </Link>
            </li>
          </ul>
        </div>

        {/* Legal Links */}
        <div>
          <h5 className="font-label-mono text-label-mono text-white mb-6 uppercase tracking-wider">
            Legal
          </h5>
          <ul className="space-y-4 font-body-sm text-body-sm">
            <li>
              <Link href="/#privacy" className="text-on-primary-container/70 hover:text-white transition-colors duration-300">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/#terms" className="text-on-primary-container/70 hover:text-white transition-colors duration-300">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/#cookies" className="text-on-primary-container/70 hover:text-white transition-colors duration-300">
                Cookie Policy
              </Link>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom copyright bar */}
      <div className="px-margin-mobile md:px-margin-desktop py-8 border-t border-outline-variant/10 max-w-container-max mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="font-body-sm text-body-sm text-on-primary-container/50">
          &copy; {currentYear} HexaKode Engineering. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

