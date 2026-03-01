interface BestMonthCardProps {
  month: string;
}

const BestMonthCard = ({ month }: BestMonthCardProps) => {
  return (
    <div className="bg-gradient-to-r from-emerald-100 to-emerald-50 p-8 rounded-2xl shadow-sm border border-emerald-200 flex items-center justify-center">
      <div className="text-center">
        <p className="text-sm text-emerald-700">
          Best Performing Month
        </p>
        <h2 className="text-3xl font-bold text-emerald-900 mt-2">
          {month}
        </h2>
      </div>
    </div>
  );
};

export default BestMonthCard;