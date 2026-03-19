import React from "react";

interface RoleTabsProps {
  activeTab: "voter" | "admin";
  setActiveTab: (tab: "voter" | "admin") => void;
}

export default function RoleTabs({ activeTab, setActiveTab }: RoleTabsProps) {
  return (
    <div className="border-b border-gray-200">
      <div className="flex -mb-px">
        <button
          className={`py-2 px-4 border-b-2 font-medium ${
            activeTab === "voter"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("voter")}
        >
          Voter Access
        </button>
        <button
          className={`py-2 px-4 border-b-2 font-medium ${
            activeTab === "admin"
              ? "border-primary text-primary"
              : "border-transparent text-gray-500 hover:text-gray-700"
          }`}
          onClick={() => setActiveTab("admin")}
        >
          Administrator
        </button>
      </div>
    </div>
  );
}
