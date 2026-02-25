"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/", label: "Home" },
    { href: "/messages", label: "Messages" },
    { href: "/organizations", label: "Organizations" },
    { href: "/notifications", label: "Notifications" },
    { href: "/events", label: "Events" },
  ];

  return (
    <aside className="w-72 h-screen bg-zinc-200 text-zinc-800 p-4">
      <nav>
        <ul className="space-y-2">
          {links.map(({ href, label }) => {
            const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  className={`block px-4 py-1 rounded-lg hover:bg-sky-400 ${isActive && "bg-sky-300"} ${label === 'Home' ? "text-2xl font-bold mb-12" : "text-sm"}`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
