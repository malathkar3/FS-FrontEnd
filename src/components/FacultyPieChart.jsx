import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Sector,
} from 'recharts';

const COLORS = [
  '#6366F1', // Indigo 500
  '#10B981', // Emerald 500
  '#F59E0B', // Amber 500
  '#EF4444', // Red 500
  '#8B5CF6', // Violet 500
  '#EC4899', // Pink 500
  '#06B6D4', // Cyan 500
  '#F97316', // Orange 500
  '#14B8A6', // Teal 500
  '#3B82F6', // Blue 500
];

const renderActiveShape = (props) => {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle, fill } = props;
  return (
    <g>
      <Sector
        cx={cx}
        cy={cy}
        innerRadius={innerRadius}
        outerRadius={outerRadius + 15}
        startAngle={startAngle}
        endAngle={endAngle}
        fill={fill}
        style={{ filter: `drop-shadow(0 0 8px ${fill}44)` }}
      />
      <Sector
        cx={cx}
        cy={cy}
        startAngle={startAngle}
        endAngle={endAngle}
        innerRadius={outerRadius + 20}
        outerRadius={outerRadius + 25}
        fill={fill}
      />
    </g>
  );
};

const FacultyPieChart = React.memo(({ data, onFacultySelect, selectedFaculty }) => {
  const [activeIndex, setActiveIndex] = React.useState(-1);

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-4 opacity-70">
        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center border border-dashed border-gray-200">
           <span className="text-2xl font-black text-gray-200">!</span>
        </div>
        <p className="font-bold tracking-tight text-sm">No workload data mapped.</p>
      </div>
    );
  }

  // Sort data to make it look nicer
  const sortedData = [...data].sort((a, b) => b.value - a.value);
  
  // Update active index if external selectedFaculty changes
  const currentActiveIndex = sortedData.findIndex(d => d.name === selectedFaculty);

  const onPieEnter = (_, index) => {
    setActiveIndex(index);
  };

  const onPieLeave = () => {
    setActiveIndex(-1);
  };

  const handleClick = (entry) => {
    if (onFacultySelect) {
      onFacultySelect(entry.name);
    }
  };

  return (
    <div className="w-full relative" style={{ height: '450px', minHeight: '450px' }}>
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none z-0">
         <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1">Scale</span>
         <span className="text-3xl font-black text-indigo-600">
           {sortedData[currentActiveIndex >= 0 ? currentActiveIndex : 0]?.value || 0}
         </span>
         <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Sessions</span>
      </div>
      <ResponsiveContainer width="100%" height="100%" debounce={1}>
        <PieChart>
          <Pie
            activeIndex={currentActiveIndex >= 0 ? currentActiveIndex : activeIndex}
            activeShape={renderActiveShape}
            data={sortedData}
            cx="50%"
            cy="50%"
            innerRadius={90}
            outerRadius={130}
            paddingAngle={8}
            dataKey="value"
            onMouseEnter={onPieEnter}
            onMouseLeave={onPieLeave}
            onClick={handleClick}
            animationBegin={0}
            animationDuration={1000}
            stroke="none"
            className="cursor-pointer outline-none"
          >
            {sortedData.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[index % COLORS.length]} 
                className="transition-all duration-300 outline-none"
              />
            ))}
          </Pie>
          <Tooltip 
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                return (
                  <div className="bg-white/80 backdrop-blur-xl p-4 border border-white shadow-2xl rounded-3xl animate-in zoom-in-95 duration-200">
                    <p className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-1">{payload[0].name}</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl font-black text-slate-800">{payload[0].value}</span>
                      <span className="text-xs font-bold text-slate-500 uppercase">Sessions</span>
                    </div>
                  </div>
                );
              }
              return null;
            }}
          />
          <Legend 
            verticalAlign="bottom" 
            align="center"
            iconType="circle"
            iconSize={10}
            wrapperStyle={{ 
              paddingTop: '20px',
              paddingBottom: '10px'
            }}
            formatter={(value) => (
              <span className={`text-[9px] font-black uppercase tracking-tight transition-colors duration-300 ${value === selectedFaculty ? 'text-indigo-600' : 'text-gray-400'}`}>
                {value}
              </span>
            )}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
});

export default FacultyPieChart;
