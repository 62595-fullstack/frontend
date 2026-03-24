"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/login");
  }

  const toggleTheme = () => {
    const isLight = document.body.classList.toggle("light");
    localStorage.setItem("theme", isLight ? "light" : "dark");
  };

  const links = [
    { href: "/", label: "Home" },
    { href: "/messages", label: "Messages" },
    { href: "/organizations", label: "Organizations" },
    { href: "/notifications", label: "Notifications" },
    { href: "/events", label: "Events" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <aside className="w-72 h-screen bg-bg text-text p-4 flex flex-col">
      <div className="flex-1">
        <nav>
          <ul className="space-y-2">
            {links.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    className={`btn-sidebar ${isActive && "bg-brand text-bg-dark"} ${label === 'Home' ? "text-2xl font-bold mb-12" : ""}`}
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

      <button onClick={toggleTheme} className="btn-brand">
        Dark mode / Light mode
      </button>
    </aside>
  );
}
