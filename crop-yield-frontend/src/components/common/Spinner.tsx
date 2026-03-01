interface SpinnerProps {
  size?: "sm" | "md";
}

const Spinner = ({ size = "md" }: SpinnerProps) => {
  const sizes = {
    sm: "w-4 h-4 border-2",
    md: "w-6 h-6 border-2",
  };

  return (
    <div
      className={`${sizes[size]} border-green-600 border-t-transparent rounded-full animate-spin`}
    />
  );
};

export default Spinner;