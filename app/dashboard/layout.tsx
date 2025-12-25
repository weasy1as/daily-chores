"use client";
import { LogoutButton } from "@/components/logout-button";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";

import { useState } from "react";

const navItems = [
  {
    name: "Home",
    link: "/dashboard",
  },
  {
    name: "People",
    link: "/dashboard/people",
  },
  {
    name: "Logs",
    link: "/dashboard/logs",
  },
];

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  return (
    <html lang="en">
      <body>
        {" "}
        <div>
          <Navbar>
            {/* Desktop Navigation */}
            <NavBody>
              <NavItems items={navItems} />
              <div className="flex items-center gap-4">
                <NavbarButton variant="secondary">
                  {" "}
                  <LogoutButton />
                </NavbarButton>
              </div>
            </NavBody>

            {/* Mobile Navigation */}
            <MobileNav>
              <MobileNavHeader>
                <MobileNavToggle
                  isOpen={isMobileMenuOpen}
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                />
              </MobileNavHeader>

              <MobileNavMenu
                isOpen={isMobileMenuOpen}
                onClose={() => setIsMobileMenuOpen(false)}
              >
                {navItems.map((item, idx) => (
                  <a
                    key={`mobile-link-${idx}`}
                    href={item.link}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="relative text-neutral-600 dark:text-neutral-300"
                  >
                    <span className="block">{item.name}</span>
                  </a>
                ))}
                <div className="flex w-full flex-col gap-4">
                  <LogoutButton />
                </div>
              </MobileNavMenu>
            </MobileNav>
          </Navbar>{" "}
        </div>
        <div> {children}</div>
      </body>
    </html>
  );
}
