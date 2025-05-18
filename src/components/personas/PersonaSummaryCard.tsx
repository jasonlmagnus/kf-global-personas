import React from "react";
import { Persona } from "../../types/personas";
import { getRegionBackground, getRoleCardTitle } from "../../lib/personaUtils";

interface PersonaSummaryCardProps {
  persona: Persona;
  viewType: "role" | "region";
  isSelected: boolean;
  onClick: () => void;
}

const PersonaSummaryCard: React.FC<PersonaSummaryCardProps> = ({
  persona: p, // alias for brevity if preferred, or use persona directly
  viewType,
  isSelected,
  onClick,
}) => {
  return (
    <div
      key={p.id} // Key should ideally be handled by the parent list mapping
      className={`persona-nav-item ${isSelected ? "selected" : ""}`}
      onClick={onClick}
    >
      <div
        className="persona-nav-bg"
        style={{
          backgroundImage: getRegionBackground(
            p.region,
            viewType,
            p.department
          ),
        }}
      ></div>
      <div className="persona-nav-content">
        <h3 className="persona-nav-title">
          {viewType === "role" ? getRoleCardTitle(p, viewType) : p.title}
        </h3>
        <button className="persona-nav-button">
          {isSelected ? "Selected" : "View Details"}
          <svg
            className="ml-1"
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M5 12H19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M12 5L19 12L12 19"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default PersonaSummaryCard;
