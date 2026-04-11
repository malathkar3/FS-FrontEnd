import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { fetchFacultyList, fetchFacultyTimetable } from '../api/timetable.api';
import FacultyPieChart from '../components/FacultyPieChart';
import { Loader2, AlertCircle } from 'lucide-react';

const Dashboard = () => {
  const [workloadData, setWorkloadData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [facultyList, setFacultyList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Step 1: Fetch faculty data
        const response = await fetchFacultyList();
        
        // Safe check for array vs object (handling { success: true, data: [...] } pattern)
        let faculties = [];
        if (Array.isArray(response)) {
          faculties = response;
        } else if (response && typeof response === 'object') {
          if (Array.isArray(response.data)) {
             // If response has a data property that is an array, use it (standard pattern)
             faculties = response.data;
          } else if (response.faculties && Array.isArray(response.faculties)) {
             // Alternative property name
             faculties = response.faculties;
          } else {
            // If it's a generic object, convert it to an array but filter out non-string/non-object garbage
            const values = Object.values(response);
            faculties = values.filter(val => typeof val === 'string' || (val && typeof val === 'object' && !Array.isArray(val)));
            console.warn('API returned a generic object for faculty list. Filtered and converted to array.', response);
          }
        } else {
          console.error('Unexpected API response format for faculty list:', response);
        }

        setFacultyList(faculties);

        // Step 2: Fetch timetable for each faculty to calculate workload
        // Only attempt to map if faculties is an array with items
        const workloads = faculties.length > 0 
          ? await Promise.all(
              faculties.map(async (item) => {
                // Determine the identifier (handle both string names and objects)
                const facultyIdentifier = typeof item === 'string' ? item : (item.name || item.id);
                
                if (!facultyIdentifier) {
                  console.error('Could not determine faculty identifier from item:', item);
                  return null;
                }

                try {
                  const schedule = await fetchFacultyTimetable(facultyIdentifier);
                  return {
                    name: facultyIdentifier,
                    value: Array.isArray(schedule) ? schedule.length : 0,
                  };
                } catch (err) {
                  console.error(`Failed to fetch timetable for ${facultyIdentifier}:`, err);
                  return { name: facultyIdentifier, value: 0 };
                }
              })
            )
          : [];

        // Filter out nulls and zero values
        setWorkloadData(workloads.filter(w => w && w.value > 0));
        setError(null);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data. Please ensure the backend is running at http://localhost:5000');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin" />
        <p className="text-gray-600 font-medium animate-pulse">Calculating faculty workload distribution...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto mt-12 p-6 bg-red-50 rounded-xl border border-red-100 flex flex-col items-center gap-4 text-center">
        <AlertCircle className="w-12 h-12 text-red-500" />
        <h3 className="text-xl font-bold text-red-900">Connection Error</h3>
        <p className="text-red-700">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="mt-2 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition shadow-sm font-medium"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-700 to-indigo-900">
            Faculty Workload Dashboard
          </h1>
          <p className="text-gray-500 mt-2">Visualizing teaching hour distribution across departments.</p>
        </div>
        <div className="px-4 py-2 bg-blue-50 text-blue-700 border border-blue-100 rounded-lg text-sm font-semibold">
          Total Faculty Analyzed: {facultyList.length}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Chart Container */}
        <div className="lg:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Teaching Load Distribution</h2>
            <div className="flex gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-500"></span>
              <span className="w-3 h-3 rounded-full bg-green-500"></span>
              <span className="w-3 h-3 rounded-full bg-orange-500"></span>
            </div>
          </div>
          <div className="h-[450px]">
             <FacultyPieChart data={workloadData} />
          </div>
        </div>

        {/* Sidebar Statistics */}
        <div className="space-y-6">
          <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-6 rounded-3xl text-white shadow-lg">
            <h3 className="text-lg font-bold opacity-90">Quick Summary</h3>
            <div className="mt-4 space-y-4">
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="opacity-80">Total Sessions</span>
                <span className="text-2xl font-bold">{workloadData.reduce((acc, curr) => acc + curr.value, 0)}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/20 pb-2">
                <span className="opacity-80">Avg. Classes/Faculty</span>
                <span className="text-2xl font-bold">
                  {workloadData.length > 0 ? (workloadData.reduce((acc, curr) => acc + curr.value, 0) / workloadData.length).toFixed(1) : 0}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-xl shadow-gray-100 border border-gray-100 overflow-hidden">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Faculty Ranking</h3>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {workloadData
                .sort((a, b) => b.value - a.value)
                .map((faculty, idx) => (
                  <div key={faculty.name} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 hover:bg-gray-100 transition">
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full text-xs font-bold">
                        {idx + 1}
                      </span>
                      <span className="text-gray-800 font-medium">{faculty.name}</span>
                    </div>
                    <span className="font-bold text-blue-600">{faculty.value}h</span>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
