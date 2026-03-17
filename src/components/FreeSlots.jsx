import React from 'react';
import { Coffee, Tag } from 'lucide-react';

const FreeSlots = ({ slots }) => {
  // Handle both array format [{ day, period }] and object format { Day: [...] }
  const groupedSlots = React.useMemo(() => {
    if (!slots) return {};

    // If slots is already an object (grouped), use it directly
    if (!Array.isArray(slots)) {
      return slots;
    }

    // If slots is an array of { day, period } objects, group them by day
    return slots.reduce((acc, slot) => {
      const day = slot.day;
      if (!acc[day]) acc[day] = [];
      acc[day].push(slot.period);
      return acc;
    }, {});
  }, [slots]);

  const days = Object.keys(groupedSlots);
  const totalFreeSlots = days.reduce((sum, day) => sum + (groupedSlots[day]?.length || 0), 0);

  if (!slots || totalFreeSlots === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 mt-6 bg-white rounded-xl border border-gray-200">
        <Coffee className="h-10 w-10 text-gray-300 mb-3" />
        <h4 className="text-gray-500 font-medium">No free slots this week</h4>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <div className="p-2 bg-green-100 rounded-lg mr-3">
            <Coffee className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900">Free Time Slots</h3>
        </div>
        <span className="text-sm font-semibold px-3 py-1 bg-green-50 text-green-700 rounded-full border border-green-200">
          {totalFreeSlots} free periods this week
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {days.map((day) => {
          const availableSlots = groupedSlots[day];

          if (!availableSlots || availableSlots.length === 0) return null;

          return (
            <div
              key={day}
              className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
            >
              <h4 className="flex justify-between items-center mb-4 text-gray-900 font-semibold text-lg border-b border-gray-100 pb-2">
                {day}
                <span className="text-xs font-bold px-2 py-1 bg-green-50 text-green-700 rounded-full">
                  {availableSlots.length} slots
                </span>
              </h4>

              <ul className="space-y-3">
                {availableSlots.map((slot, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm font-medium text-gray-700 bg-gray-50 rounded-lg px-3 py-2 border border-gray-100"
                  >
                    <Tag className="w-4 h-4 mr-2 text-indigo-400 shrink-0" />
                    {/* Handle both string "P1" and object { period: "P1" } */}
                    {typeof slot === 'object' ? slot.period : slot}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default FreeSlots;