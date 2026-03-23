import React from 'react';
import { Clock, Calendar, CheckCircle } from 'lucide-react';

const ScheduleTable = ({ schedule, freeSlots }) => {
  // Debug log before rendering
  console.log("Rendering ScheduleTable with schedule:", schedule, "and freeSlots:", freeSlots);

  // Pre-process schedule and freeSlots into a unified day -> time -> { type, content } map
  const unifiedMap = {};

  // Track all unique days and times found in BOTH datasets
  const daysSet = new Set();
  const timesSet = new Set();

  // 1. Process Schedule (Classes)
  if (Array.isArray(schedule)) {
    schedule.forEach(item => {
      const { day, time, subject } = item;
      if (!unifiedMap[day]) unifiedMap[day] = {};
      unifiedMap[day][time] = { type: 'class', content: subject };
      daysSet.add(day);
      timesSet.add(time);
    });
  }

  // 2. Process Free Slots
  if (Array.isArray(freeSlots)) {
    freeSlots.forEach(item => {
      const { day, time } = item;
      if (!unifiedMap[day]) unifiedMap[day] = {};
      // Only set as FREE if not already occupied by a class (in case of data overlap)
      if (!unifiedMap[day][time]) {
        unifiedMap[day][time] = { type: 'free', content: 'FREE' };
        daysSet.add(day);
        timesSet.add(time);
      }
    });
  }

  if (daysSet.size === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-16 text-center text-gray-400 bg-white rounded-2xl animate-in fade-in duration-500">
        <Clock className="h-16 w-16 text-gray-100 mb-6" />
        <p className="text-2xl font-black text-gray-800 tracking-tight">Schedule is Clear</p>
        <p className="text-gray-400 font-medium max-w-xs mt-2">No data found in the uploaded document for this faculty.</p>
      </div>
    );
  }

  const dayOrder = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
  
  // Sort days based on dayOrder
  const sortedDays = Array.from(daysSet).sort((a, b) => {
    const idxA = dayOrder.indexOf(a.toUpperCase());
    const idxB = dayOrder.indexOf(b.toUpperCase());
    return (idxA === -1 ? 99 : idxA) - (idxB === -1 ? 99 : idxB);
  });

  // Unique chronologically sorted times for columns
  const allTimes = Array.from(timesSet).sort((a, b) => {
    const getMinutes = (t) => {
      const start = t.split('-')[0].trim();
      let [h, m] = start.split(':').map(Number);
      // Heuristic: If hour is 1-7, assume PM (add 12h). 12 is Noon, 8-11 are AM.
      if (h < 8) h += 12;
      return h * 60 + m;
    };
    return getMinutes(a) - getMinutes(b);
  });

  return (
    <div className="w-full overflow-x-auto scrollbar-hide px-1 pb-6">
      <div className="min-w-full inline-block align-middle">
        <table className="w-full border-collapse table-auto">
          <thead>
            <tr className="bg-slate-50/50">
              <th className="px-5 py-6 text-left text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 bg-slate-50 z-20 w-32 min-w-[120px]">
                Day \ Time
              </th>
              {allTimes.map(time => (
                <th key={time} className="px-4 py-6 text-center text-[11px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-100 min-w-[140px]">
                  {time}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {sortedDays.map((day) => (
              <tr key={day} className="group hover:bg-slate-50/30 transition-colors duration-300">
                <td className="px-5 py-8 whitespace-nowrap text-sm font-black text-slate-800 border-r border-slate-50 bg-white group-hover:bg-slate-50/30">
                  {day}
                </td>
                {allTimes.map(time => {
                  const data = unifiedMap[day]?.[time];
                  
                  if (!data) {
                    return (
                      <td key={time} className="px-4 py-3 text-center border-r border-slate-50 last:border-r-0 italic text-slate-200">
                        -
                      </td>
                    );
                  }

                  const isClass = data.type === 'class';
                  
                  return (
                    <td key={time} className="px-3 py-4 text-center border-r border-slate-50 last:border-r-0">
                      {isClass ? (
                        <div className="mx-auto w-full max-w-[160px] px-3 py-4 rounded-2xl bg-indigo-600 text-white text-[11px] font-bold shadow-lg shadow-indigo-100 flex items-center justify-center break-words min-h-[52px] leading-relaxed transform hover:scale-[1.03] transition-transform">
                          {data.content}
                        </div>
                      ) : (
                        <div className="mx-auto w-full max-w-[130px] px-3 py-3 rounded-xl bg-emerald-50 border border-emerald-100/40 text-emerald-600 text-[10px] font-black tracking-widest flex items-center justify-center gap-2 uppercase opacity-90 group-hover:opacity-100 transition-opacity">
                          <CheckCircle className="w-3.5 h-3.5" />
                          {data.content}
                        </div>
                      )}
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
