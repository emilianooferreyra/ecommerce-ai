"use client";

import Link from "next/link";
import Image from "next/image";
import { Menu, Package, ShoppingBag, User, X } from "lucide-react";
import { SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { useCartActions, useTotalItems } from "@/lib/store/cart-store-provider";
import { SearchBar } from "@/components/app/SearchBar";
import { useState } from "react";

export function Header() {
  const { openCart } = useCartActions();
  const totalItems = useTotalItems();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-950/80">
        <div className="mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4 sm:px-6 lg:gap-4 lg:px-8">
          <div className="flex items-center gap-1 lg:gap-4">
            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>

            {/* Logo */}
            <Link href="/" className="flex shrink-0 items-center gap-2">
              {/* Desktop Logo - Icon + Text */}
              <div className="hidden items-center gap-2 md:flex">
                <Image
                  src="/eurodec-logo.png"
                  alt="Eurodec"
                  width={50}
                  height={50}
                  className="h-[60px] w-[60px]"
                  priority
                />
                <Image
                  src="/eurodec.png"
                  alt="Eurodec"
                  width={120}
                  height={40}
                  className="h-8 w-auto"
                  priority
                />
              </div>
              {/* Mobile/Tablet Logo */}
              <div className="md:hidden">
                <Image
                  src="/eurodec.png"
                  alt="Eurodec"
                  width={80}
                  height={30}
                  className="h-6 w-auto"
                  priority
                />
              </div>
            </Link>
          </div>

          {/* Search Bar */}
          <SearchBar
            placeholder="Buscar en Eurodec..."
            className="hidden flex-1 lg:flex"
          />

          {/* Actions */}
          <div className="flex items-center gap-2">
            {/* My Orders - Only when signed in */}
            <SignedIn>
              <Button asChild variant="ghost" className="hidden sm:flex">
                <Link href="/orders" className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span className="text-sm font-medium">My Orders</span>
                </Link>
              </Button>
            </SignedIn>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={openCart}
            >
              <ShoppingBag className="h-5 w-5" />
              {totalItems > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-zinc-900 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-900">
                  {totalItems > 99 ? "99+" : totalItems}
                </span>
              )}
              <span className="sr-only">Open cart ({totalItems} items)</span>
            </Button>

            {/* User */}
            <SignedIn>
              <UserButton
                afterSwitchSessionUrl="/"
                appearance={{
                  elements: {
                    avatarBox: "h-9 w-9",
                  },
                }}
              >
                <UserButton.MenuItems>
                  <UserButton.Link
                    label="My Orders"
                    labelIcon={<Package className="h-4 w-4" />}
                    href="/orders"
                  />
                </UserButton.MenuItems>
              </UserButton>
            </SignedIn>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                  <span className="sr-only">Sign in</span>
                </Button>
              </SignInButton>
            </SignedOut>
          </div>
        </div>

        {/* Mobile Search Bar - Below Header */}
        <div className="border-t border-zinc-200 bg-white dark:border-zinc-800 dark:bg-zinc-950 lg:hidden">
          <div className="px-4 py-3">
            <SearchBar placeholder="Search products & help..." />
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 top-[120px] z-40 animate-in fade-in slide-in-from-top-4 duration-300 bg-white dark:bg-zinc-950 lg:hidden">
          <div className="flex h-full flex-col p-6">
            {/* Mobile Navigation */}
            <nav className="flex flex-col border-b border-zinc-200 dark:border-zinc-800">
              <Link
                href="/products"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center justify-between border-b border-zinc-200 py-4 text-base font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:border-zinc-800 dark:text-zinc-100 dark:hover:text-zinc-400"
              >
                Products
              </Link>
              <SignedIn>
                <Link
                  href="/orders"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between border-b border-zinc-200 py-4 text-base font-medium text-zinc-900 transition-colors hover:text-zinc-600 dark:border-zinc-800 dark:text-zinc-100 dark:hover:text-zinc-400"
                >
                  My Orders
                </Link>
              </SignedIn>
            </nav>

            {/* Bottom Links */}
            <div className="mt-6 flex flex-col gap-4">
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-sm text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
                  >
                    <User className="h-4 w-4" />
                    My Account & Orders
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
