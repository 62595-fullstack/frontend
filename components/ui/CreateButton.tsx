interface CreateButtonProps {
  onClick: () => void;
  label: string;
  size?: "sm" | "md" | "lg";
  className?: string;  // Additional classes
  icon?: "plus" | "edit" | "upload";  // Different icons
}

export default function CreateButton({ 
  onClick, 
  label, 
  size = "md",
  className = "",
  icon = "plus",
}: CreateButtonProps) {
  const sizes = {
    sm: { button: "w-10 h-10 p-2", iconSize: "w-4 h-4", stroke: 3 },
    md: { button: "w-12 h-12 p-3", iconSize: "w-6 h-6", stroke: 3 },
    lg: { button: "w-14 h-14 p-3", iconSize: "w-8 h-8", stroke: 4 },
  };

  const icons = {
    plus: "M16 2v28m14-14H2",
    edit: "M4 28h6l14-14-6-6L4 22v6zm18-18l4-4-6-6-4 4 6 6z",
    upload: "M16 4v20m-10-10l10-10 10 10",
  };

  const { button, iconSize, stroke } = sizes[size];

  return (
    <button
      onClick={onClick}
      aria-label={`Create new ${label}`}
      className={`btn-brand rounded-full flex items-center justify-center ${button} ${className}`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className={iconSize}
        fill="none"
        viewBox="0 0 32 32"
        stroke="currentColor"
        strokeWidth={stroke}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d={icons[icon]} />
      </svg>
    </button>
  );
}