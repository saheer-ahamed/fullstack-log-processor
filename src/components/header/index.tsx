"use client";
import Image from "next/image";
import Link from "next/link";
import { useUser } from "../context";

const Header = () => {
  const { user } = useUser();

  return (
    <header>
      <nav className="bg-gray-800">
        <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between">
            <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
              <div className="flex shrink-0 items-center">
                <Image
                  className="h-8 w-auto"
                  src="/logo_48x48.png"
                  alt="IntuCloud Assessment"
                  width={48}
                  height={48}
                  sizes="48px"
                />
              </div>
              <div className="sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <Link
                    href="/dashboard"
                    className="rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white"
                  >
                    Dashboard
                  </Link>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <div className="relative ml-3 flex gap-3 items-center">
                {user?.user_metadata?.name && (
                  <h3>Hi, {user?.user_metadata?.name}</h3>
                )}
                <div>
                  <button
                    type="button"
                    className="relative flex rounded-full bg-gray-800 text-sm"
                  >
                    <Image
                      width={32}
                      height={32}
                      className="size-8 rounded-full"
                      src="/profile_icon_32x32.png"
                      alt="Profile Placeholder"
                      sizes="32px"
                    />
                  </button>
                </div>
                <Link
                  href="/logout"
                  className="text-white bg-gray-800 px-4 py-2 rounded-md border border-gray-700 hover:bg-gray-700"
                >
                  Logout
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
