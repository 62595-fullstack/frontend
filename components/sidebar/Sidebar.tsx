"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "@/lib/NotificationsContext";
export default function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();
  const { unreadCount } = useNotifications();

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
    { href: "/profile", label: "My Profile" },
  ];

  return (
    <aside className="w-72 h-full bg-bg text-text p-4 flex flex-col flex-shrink-0">
      <div className="flex-1">
        <nav>
          <ul className="space-y-2 xl:space-y-3 2xl:space-y-4">
            {links.map(({ href, label }) => {
              const isActive = href === "/" ? pathname === "/" : pathname.startsWith(href);
              const showBadge = href === "/notifications" && unreadCount > 0;
              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={onClose}
                    className={`btn-sidebar ${isActive && "bg-brand text-bg-dark"} ${label === 'Home' ? "text-2xl font-bold mb-8 mt-22 lg:mt-4 lg:mb-12" : ""} ${showBadge ? "flex items-center justify-between" : ""}`}
                  >
                    <span>{label}</span>
                    {showBadge && (
                      <span className="ml-2 inline-flex items-center justify-center min-w-6 h-6 px-2 rounded-full bg-danger text-white text-xs font-semibold">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
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

    </aside>
  );
}
