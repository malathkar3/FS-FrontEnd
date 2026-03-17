import React from 'react';
import { Clock } from 'lucide-react';

const ScheduleTable = ({ schedule }) => {
  // Transform schedule array into a mapping of day -> period -> subject if it's an array
  let scheduleMap = {};
  
  if (Array.isArray(schedule)) {
    schedule.forEach(entry => {
      const { day, period, subject } = entry;
      if (!scheduleMap[day]) scheduleMap[day] = {};
      scheduleMap[day][period] = subject;
    });
  } else {
    // If it's already an object, use it directly
    scheduleMap = schedule;
  }

  if (!scheduleMap || Object.keys(scheduleMap).length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-12 text-center text-gray-500 bg-white rounded-2xl shadow-sm border border-dashed border-gray-300 animate-in fade-in duration-500">
        <Clock className="h-12 w-12 text-gray-300 mb-4 animate-pulse" />
        <p className="text-lg font-bold text-gray-700">No active classes scheduled</p>
        <p className="text-sm">This faculty member has a clear schedule for this period.</p>
      </div>
    );
  }

  const days = Object.keys(scheduleMap);
  // Sort days based on standard week order
  const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  days.sort((a, b) => dayOrder.indexOf(a) - dayOrder.indexOf(b));

  const slotsSet = new Set();
  days.forEach(day => {
    Object.keys(scheduleMap[day]).forEach(slot => slotsSet.add(slot));
  });
  
  // Sort slots (P1, P2, ...)
  const slots = Array.from(slotsSet).sort((a, b) => {
    const aNum = parseInt(a.replace(/\D/g, '')) || 0;
    const bNum = parseInt(b.replace(/\D/g, '')) || 0;
    return aNum - bNum;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden fade-in">
      <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
        <h3 className="text-lg leading-6 font-semibold text-gray-900">Weekly Schedule</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider sticky left-0 bg-gray-50 z-10 w-32 border-r border-gray-200 shadow-sm">
                Day \ Slot
              </th>
              {slots.map(slot => (
                <th key={slot} scope="col" className="px-4 py-4 text-center text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap min-w-[120px]">
                  {slot}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {days.map((day, dIdx) => (
              <tr key={day} className={dIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50 hover:bg-indigo-50/30 transition-colors'}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 sticky left-0 border-r border-gray-200 z-10 bg-inherit shadow-sm">
                  {day}
                </td>
                {slots.map(slot => {
                  const val = scheduleMap[day][slot];
                  const hasClass = val && val.trim() !== '' && val.toLowerCase() !== 'free';
                  
                  return (
                    <td 
                      key={slot} 
                      className={`px-4 py-4 text-sm text-center border-l border-gray-100 transition-colors ${
                        hasClass 
                          ? 'bg-indigo-100 text-indigo-800 font-medium' 
                          : 'text-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-center w-full h-full min-h-[2.5rem] rounded">
                        {hasClass ? val : '-'}
                      </div>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ScheduleTable;
