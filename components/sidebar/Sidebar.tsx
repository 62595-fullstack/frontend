"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/lib/useTheme";

export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();

  async function handleSignOut() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  const links = [
    { href: "/", label: "Home" },
    { href: "/messages", label: "Messages" },
    { href: "/organizations", label: "Organizations" },
    { href: "/notifications", label: "Notifications" },
    { href: "/events", label: "Events" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <aside className="w-72 h-full bg-bg text-text p-4 flex flex-col flex-shrink-0">
      <div className="flex-1">
        <nav>
          <ul className="space-y-2 xl:space-y-3 2xl:space-y-4">
            {links.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`btn-sidebar ${isActive && "bg-brand text-bg-dark"} ${label === 'Home' ? "text-2xl font-bold mb-8 mt-22 lg:mt-4 lg:mb-12" : ""}`}
                  >
                    {label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
        <button
          onClick={handleSignOut}
          className="btn-sidebar mt-12"
        >
          Sign out
        </button>
      </div>

      <button onClick={toggleTheme} className="btn-brand w-min">
        {theme === "dark" ? "☀️" : "🌙"}
      </button>
    </aside>
  );
}
