import React from 'react';

interface MetricCircleProps {
  waterSaved: number;
  co2Saved: number;
  plasticSaved: number;
  totalScore: number;
}

const MetricCircle: React.FC<MetricCircleProps> = ({
  waterSaved,
  co2Saved,
  plasticSaved,
  totalScore,
}) => {
  // Calculate percentages for the rings (assuming max values)
  const maxWater = 1000; // liters
  const maxCo2 = 500; // kg
  const maxPlastic = 100; // kg

  const waterPercentage = (waterSaved / maxWater) * 100;
  const co2Percentage = (co2Saved / maxCo2) * 100;
  const plasticPercentage = (plasticSaved / maxPlastic) * 100;

  return (
    <div className="relative w-64 h-64">
      {/* Outer ring - Water */}
      <div className="absolute inset-0 rounded-full border-8 border-blue-500/30">
        <div
          className="absolute inset-0 rounded-full border-8 border-blue-500"
          style={{
            clipPath: `polygon(0 0, ${waterPercentage}% 0, ${waterPercentage}% 100%, 0 100%)`,
          }}
        />
      </div>

      {/* Middle ring - CO2 */}
      <div className="absolute inset-4 rounded-full border-8 border-green-500/30">
        <div
          className="absolute inset-0 rounded-full border-8 border-green-500"
          style={{
            clipPath: `polygon(0 0, ${co2Percentage}% 0, ${co2Percentage}% 100%, 0 100%)`,
          }}
        />
      </div>

      {/* Inner ring - Plastic */}
      <div className="absolute inset-8 rounded-full border-8 border-yellow-500/30">
        <div
          className="absolute inset-0 rounded-full border-8 border-yellow-500"
          style={{
            clipPath: `polygon(0 0, ${plasticPercentage}% 0, ${plasticPercentage}% 100%, 0 100%)`,
          }}
        />
      </div>

      {/* Center score */}
      <div className="absolute inset-16 flex items-center justify-center bg-white rounded-full shadow-lg">
        <div className="text-center">
          <div className="text-3xl font-bold text-gray-800">{totalScore}</div>
          <div className="text-sm text-gray-600">Total Score</div>
        </div>
      </div>

      {/* Legend */}
      <div className="absolute -bottom-20 left-0 right-0 flex justify-between text-sm">
        <div className="text-blue-500">
          <div className="font-semibold">{waterSaved}L</div>
          <div>Water Saved</div>
        </div>
        <div className="text-green-500">
          <div className="font-semibold">{co2Saved}kg</div>
          <div>CO2 Saved</div>
        </div>
        <div className="text-yellow-500">
          <div className="font-semibold">{plasticSaved}kg</div>
          <div>Plastic Saved</div>
        </div>
      </div>
    </div>
  );
};

export default MetricCircle;
