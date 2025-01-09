interface loadingspinnersProps {
  text: string;
}

const loadingSpinner = ({ text }: loadingspinnersProps) => {
  return (
    <div className="loading-container flex flex-col items-center justify-center gap-4">
      <div className="loading-spinner animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-[var(--theme)]"></div>
      <p className="loading-text text-lg">{text}</p>
    </div>
  );
};

export default loadingSpinner;
