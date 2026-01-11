"use client";

import { Search } from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect, useRef } from "react";
import { useQueryState } from "nuqs";
import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/lib/client";
import { AUTOCOMPLETE_SEARCH_QUERY } from "@/sanity/queries/products";
import { formatPrice } from "@/lib/utils";

type AutocompleteProduct = {
  _id: string;
  name: string | null;
  slug: string;
  price: number | null;
  image: {
    asset: {
      _id: string;
      url: string;
    } | null;
  } | null;
  category: {
    title: string | null;
  } | null;
};

interface SearchBarProps {
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  placeholder = "Search products & help...",
  className = "",
}: SearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const cacheRef = useRef<Map<string, AutocompleteProduct[]>>(new Map());

  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
    shallow: false,
  });

  const [inputValue, setInputValue] = useState(searchQuery);
  const [suggestions, setSuggestions] = useState<AutocompleteProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);

  // EFFECT #1: Sync URL changes to input value
  useEffect(() => {
    setInputValue(searchQuery);
  }, [searchQuery]);

  // EFFECT #2: Debounced search with AbortController + Cache
  useEffect(() => {
    const query = inputValue.trim();

    if (query.length < 2) {
      setSuggestions([]);
      setIsOpen(false);
      setSelectedIndex(-1);
      return;
    }

    // Check cache first
    const cached = cacheRef.current.get(query);
    if (cached) {
      setSuggestions(cached);
      setIsOpen(cached.length > 0);
      setSelectedIndex(-1);
      return;
    }

    setIsLoading(true);

    // Abort previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    abortControllerRef.current = new AbortController();

    const timeoutId = setTimeout(async () => {
      try {
        const results = await client.fetch(AUTOCOMPLETE_SEARCH_QUERY, {
          searchQuery: query,
        });

        setSuggestions(results);
        setIsOpen(results.length > 0);
        setSelectedIndex(-1);

        // Cache with limit (LRU-style)
        cacheRef.current.set(query, results);
        if (cacheRef.current.size > 50) {
          const firstKey = cacheRef.current.keys().next().value;
          if (firstKey) {
            cacheRef.current.delete(firstKey);
          }
        }
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          return;
        }
        console.error(
          "Search error:",
          error instanceof Error ? error.message : "Unknown error"
        );
        setSuggestions([]);
        setIsOpen(false);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => {
      clearTimeout(timeoutId);
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [inputValue]);

  // EFFECT #3: Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputValue.trim()) {
      setIsOpen(false);

      if (pathname !== "/products") {
        router.push(
          `/products?search=${encodeURIComponent(inputValue.trim())}`
        );
      } else {
        setSearchQuery(inputValue.trim());
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < suggestions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev > 0 ? prev - 1 : suggestions.length - 1
        );
        break;
      case "Escape":
        setIsOpen(false);
        setSelectedIndex(-1);
        break;
      case "Enter":
        if (selectedIndex >= 0 && suggestions[selectedIndex]) {
          e.preventDefault();
          const product = suggestions[selectedIndex];
          router.push(`/products/${product.slug}`);
          setIsOpen(false);
          setSelectedIndex(-1);
        } else {
          handleSubmit(e);
        }
        break;
    }
  };

  const handleSuggestionClick = (slug: string) => {
    setIsOpen(false);
    setSelectedIndex(-1);
    router.push(`/products/${slug}`);
  };

  const handleInputFocus = () => {
    if (inputValue.trim().length >= 2 && suggestions.length > 0) {
      setIsOpen(true);
    }
  };

  return (
    <div className={className}>
      <div className="relative w-full">
        <form onSubmit={handleSubmit} className="relative w-full">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder={placeholder}
              value={inputValue}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              onFocus={handleInputFocus}
              aria-expanded={isOpen}
              aria-autocomplete="list"
              aria-controls="search-dropdown"
              className="h-10 w-full rounded border border-zinc-200 bg-white pl-10 pr-4 text-sm text-zinc-900 placeholder:text-zinc-500 focus:border-zinc-900 focus:outline-none focus:ring-1 focus:ring-zinc-900 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:placeholder:text-zinc-400 dark:focus:border-zinc-100 dark:focus:ring-zinc-100"
            />
          </div>
        </form>

        {isOpen && (
          <div
            ref={dropdownRef}
            id="search-dropdown"
            role="listbox"
            className="absolute left-0 top-full z-50 mt-2 w-full max-h-96 overflow-y-auto rounded-lg border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-950"
          >
            {isLoading ? (
              <div className="p-4 text-center text-sm text-zinc-500">
                Searching...
              </div>
            ) : suggestions.length > 0 ? (
              <div className="py-2">
                {suggestions.map((product, index) => (
                  <button
                    key={product._id}
                    onClick={() => handleSuggestionClick(product.slug)}
                    role="option"
                    aria-selected={index === selectedIndex}
                    className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-colors ${
                      index === selectedIndex
                        ? "bg-zinc-100 dark:bg-zinc-900"
                        : "hover:bg-zinc-50 dark:hover:bg-zinc-900/50"
                    }`}
                  >
                    {product.image?.asset?.url && (
                      <div className="relative h-12 w-12 flex-shrink-0 overflow-hidden rounded bg-zinc-100 dark:bg-zinc-900">
                        <Image
                          src={product.image.asset.url}
                          alt={product.name ?? ""}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                    )}

                    <div className="flex-1 overflow-hidden">
                      <p className="truncate text-sm font-medium text-zinc-900 dark:text-zinc-100">
                        {product.name}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                          {formatPrice(product.price)}
                        </span>
                        {product.category?.title && (
                          <span className="text-xs text-zinc-500 dark:text-zinc-400">
                            • {product.category.title}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}

                <Link
                  href={`/products?search=${encodeURIComponent(inputValue)}`}
                  onClick={() => setIsOpen(false)}
                  className="block border-t border-zinc-200 px-4 py-3 text-center text-sm font-medium text-zinc-600 hover:bg-zinc-50 dark:border-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-900/50"
                >
                  View all results for "{inputValue}"
                </Link>
              </div>
            ) : (
              <div className="p-4 text-center text-sm text-zinc-500">
                No products found
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
