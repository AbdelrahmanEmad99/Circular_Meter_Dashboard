interface CircularMeterProps {
  value: number;
  title: string;
  color: string;
}

export default function CircularMeter({ value, title, color }: CircularMeterProps) {
  const radius = 80;
  const circumference = 2 * Math.PI * radius;
  const percentage = (value / 10) * 100;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-white rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300">
      <h2 className="text-xl font-semibold text-gray-700 mb-6">{title}</h2>

      <div className="relative">
        <svg width="200" height="200" className="transform -rotate-90">
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke="#e5e7eb"
            strokeWidth="16"
            fill="none"
          />
          <circle
            cx="100"
            cy="100"
            r={radius}
            stroke={color}
            strokeWidth="16"
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="transition-all duration-1000 ease-out"
          />
        </svg>

        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-4xl font-bold" style={{ color }}>
            {value.toFixed(1)}
          </span>
          <span className="text-sm text-gray-500 mt-1">Average Rating</span>
        </div>
      </div>
    </div>
  );
}
