import React, { useState } from 'react';
import {
  Calendar as CalendarIcon,
  Clock,
  Globe,
  X,
  Sparkles,
  CheckCircle2,
  Zap,
} from 'lucide-react';

interface ScheduleModalProps {
  onConfirmSchedule: (dateTimeStr: string, timeZone: string) => void;
  onClose: () => void;
}

export const ScheduleModal: React.FC<ScheduleModalProps> = ({
  onConfirmSchedule,
  onClose,
}) => {
  // Default tomorrow at 14:00
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultDate = tomorrow.toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(defaultDate);
  const [selectedTime, setSelectedTime] = useState('14:00');
  const [timeZone, setTimeZone] = useState('UTC (Coordinated Universal Time)');

  const handleSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const formatted = `${selectedDate} at ${selectedTime} (${timeZone})`;
    onConfirmSchedule(formatted, timeZone);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-lg animate-in fade-in">
      <div className="w-full max-w-md rounded-2xl glass-panel bg-slate-900 border border-cyan-500/40 shadow-2xl p-6 space-y-5 relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-5 h-5 text-cyan-400" />
            <h3 className="text-base font-bold text-white font-mono">
              SCHEDULE CYBER BROADCAST
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* AI Engagement Recommendation Box */}
        <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex items-center gap-2.5 text-xs text-cyan-300">
          <Sparkles className="w-4 h-4 text-cyan-400 shrink-0" />
          <span>
            <strong>AI Optimization:</strong> 2:00 PM is projected to yield +38% higher engagement across Twitter & LinkedIn.
          </span>
        </div>

        {/* Schedule Form */}
        <form onSubmit={handleSchedule} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <CalendarIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Date:</span>
            </label>
            <input
              type="date"
              required
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-cyan-400" />
              <span>Select Time:</span>
            </label>
            <input
              type="time"
              required
              value={selectedTime}
              onChange={(e) => setSelectedTime(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-mono text-slate-300 flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>Time Zone:</span>
            </label>
            <select
              value={timeZone}
              onChange={(e) => setTimeZone(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            >
              <option value="UTC">UTC (Coordinated Universal Time)</option>
              <option value="EST">EST (Eastern Standard Time - NY)</option>
              <option value="PST">PST (Pacific Standard Time - LA)</option>
              <option value="GMT">GMT (Greenwich Mean Time - London)</option>
              <option value="CET">CET (Central European Time - Paris)</option>
              <option value="SGT">SGT (Singapore Time)</option>
            </select>
          </div>

          <div className="pt-3 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:text-white text-xs font-mono font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-mono font-bold text-xs hover:brightness-110 shadow-lg glow-cyan flex items-center gap-2 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Confirm Schedule</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
