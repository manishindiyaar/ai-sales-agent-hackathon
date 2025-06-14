import React from "react";
import { UserPlus, Star } from "lucide-react";

const LeadIcon = ({ size = 24, color = "currentColor", filled = false }) => {
  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Base circle/background */}
      <div
        className={`rounded-full ${filled ? "bg-blue-500" : "border-2 border-current"} flex items-center justify-center`}
        style={{ width: size, height: size, color: color }}
      >
        {/* User silhouette as main icon */}
        <UserPlus
          size={size * 0.6}
          color={filled ? "white" : color}
          strokeWidth={2.5}
          className="relative"
        />
      </div>

      {/* Star indicator in the corner */}
      <Star
        size={size * 0.4}
        color={filled ? "#FFD700" : color}
        fill={filled ? "#FFD700" : "none"}
        className="absolute -top-1 -right-1"
      />
    </div>
  );
};

export default LeadIcon;
