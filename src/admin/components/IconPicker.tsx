import { useState, useEffect, useRef } from "react";
import { Search, X } from "lucide-react";
import {
  COMMON_TECH_ICONS,
  getIconByName,
  searchIcons,
} from "../../utils/iconMap";

interface IconPickerProps {
  value: string;
  onChange: (iconName: string) => void;
  category?: string;
}

export default function IconPicker({
  value,
  onChange,
  category,
}: IconPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Search icons
  useEffect(() => {
    if (searchTerm) {
      const results = searchIcons(searchTerm);
      setSearchResults(results);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const filteredCommonIcons = category
    ? COMMON_TECH_ICONS.filter((icon) => icon.category === category)
    : COMMON_TECH_ICONS;

  const SelectedIcon = value ? getIconByName(value) : null;

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Selected Icon / Trigger */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 flex items-center gap-2 hover:bg-gray-50 transition-colors"
      >
        <div className="flex-1 flex items-center gap-2">
          {SelectedIcon ? (
            <>
              <SelectedIcon className="w-5 h-5 text-gray-700" />
              <span className="text-sm font-mono">{value}</span>
            </>
          ) : (
            <span className="text-gray-500">Choose an icon...</span>
          )}
        </div>
        {value && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onChange("");
            }}
            className="p-1 hover:bg-gray-200 rounded transition-colors"
          >
            <X size={14} className="text-gray-600" />
          </button>
        )}
      </button>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-96 overflow-y-auto">
          {/* Search */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-3">
            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search icons... (e.g., 'react', 'node')"
                className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                autoFocus
              />
            </div>
          </div>

          {/* Search Results */}
          {searchTerm && searchResults.length > 0 ? (
            <div className="p-2">
              <p className="text-xs text-gray-500 px-2 py-1 font-medium">
                Search Results ({searchResults.length})
              </p>
              <div className="grid grid-cols-4 gap-1">
                {searchResults.map((iconName) => {
                  const IconComponent = getIconByName(iconName);
                  if (!IconComponent) return null;

                  return (
                    <button
                      key={iconName}
                      type="button"
                      onClick={() => {
                        onChange(iconName);
                        setIsOpen(false);
                        setSearchTerm("");
                      }}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title={iconName}
                    >
                      <IconComponent className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                      <span className="text-[10px] text-gray-600 truncate max-w-full font-mono">
                        {iconName}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : searchTerm && searchResults.length === 0 ? (
            <div className="p-4 text-center text-sm text-gray-500">
              No icons found for "{searchTerm}"
            </div>
          ) : (
            /* Common Icons */
            <div className="p-2">
              <p className="text-xs text-gray-500 px-2 py-1 font-medium">
                {category ? `Popular ${category} Icons` : "Popular Icons"}
              </p>
              <div className="grid grid-cols-4 gap-1">
                {filteredCommonIcons.map((item) => {
                  const IconComponent = getIconByName(item.icon);
                  if (!IconComponent) return null;

                  return (
                    <button
                      key={item.icon}
                      type="button"
                      onClick={() => {
                        onChange(item.icon);
                        setIsOpen(false);
                      }}
                      className="flex flex-col items-center gap-1 p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                      title={item.icon}
                    >
                      <IconComponent className="w-6 h-6 text-gray-700 group-hover:text-blue-600 transition-colors" />
                      <span className="text-[10px] text-gray-600 truncate max-w-full">
                        {item.name}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
