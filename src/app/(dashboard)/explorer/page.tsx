"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { 
  Search, ChevronDown, ArrowUpDown, Download, 
  Briefcase, MapPin, Clock, Plus, CheckCircle2, Calendar, 
  Columns, Maximize2, X, FilterX
} from 'lucide-react';
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { Dropdown, DropdownItem } from "@/components/ui/dropdown";
import { Modal } from "@/components/ui/modal";
import { BulkCompareDrawer } from "@/components/explorer/bulk-compare-drawer";

export default function ExplorerPage() {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [totalCount, setTotalCount] = useState(0);

  // Filters State
  const [filters, setFilters] = useState({ 
    company: '', 
    role: '', 
    location: '', 
    level: '', 
    verified: false 
  });
  
  // Sort State
  const [sort, setSort] = useState({ by: 'totalCompensation', dir: 'desc' });
  
  // Selection State
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isCompareOpen, setIsCompareOpen] = useState(false);

  // Save Filter State
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [filterName, setFilterName] = useState("");

  const fetchData = useCallback(async () => {
    setIsLoading(true);
    const params = new URLSearchParams();
    if (filters.company) params.set('company', filters.company);
    if (filters.role) params.set('role', filters.role);
    if (filters.location) params.set('location', filters.location);
    if (filters.level) params.set('level', filters.level);
    if (filters.verified) params.set('verified', 'true');
    params.set('sortBy', sort.by);
    params.set('sortDir', sort.dir);

    try {
      const res = await fetch(`/api/compensations?${params.toString()}`);
      const json = await res.json();
      setData(json.entries || []);
      setTotalCount(json.pagination?.total || 0);
    } catch (e) {
      console.error(e);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  }, [filters, sort]);

  useEffect(() => {
    // Basic debounce for typing in the search box
    const timer = setTimeout(() => {
      fetchData();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchData]);

  const toggleSort = (column: string) => {
    setSort(prev => ({
      by: column,
      dir: prev.by === column && prev.dir === 'desc' ? 'asc' : 'desc'
    }));
  };

  const toggleSelection = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedIds(newSet);
  };

  const handleBulkCompare = () => {
    if (selectedIds.size >= 2) {
      setIsCompareOpen(true);
    }
  };

  const resetFilters = () => {
    setFilters({ company: '', role: '', location: '', level: '', verified: false });
    setSort({ by: 'totalCompensation', dir: 'desc' });
    setSelectedIds(new Set());
  };

  const handleExportCSV = () => {
    if (data.length === 0) return;

    const headers = ['Company', 'Role', 'Level', 'Location', 'Base Salary', 'Stock', 'Total Compensation', 'Years Experience', 'Verified'];
    
    const csvRows = data.map(entry => {
      return [
        `"${entry.company.name}"`,
        `"${entry.roleFamily.name}"`,
        `"${entry.level.name}"`,
        `"${entry.location.city}"`,
        entry.baseSalary,
        entry.stock,
        entry.totalCompensation,
        entry.yearsExperience,
        entry.isVerified ? 'Yes' : 'No'
      ].join(',');
    });

    const csvContent = [headers.join(','), ...csvRows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `compensation_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const selectedEntries = data.filter(d => selectedIds.has(d.id));

  // Dynamic Market Context Calculations based on current fetched data
  const medianSalary = data.length > 0 
    ? [...data].sort((a,b) => a.totalCompensation - b.totalCompensation)[Math.floor(data.length / 2)].totalCompensation 
    : 0;
    
  const p90Salary = data.length > 0 
    ? [...data].sort((a,b) => a.totalCompensation - b.totalCompensation)[Math.floor(data.length * 0.9)].totalCompensation 
    : 0;

  const topCompany = data.length > 0
    ? [...data].reduce((prev, current) => (prev.totalCompensation > current.totalCompensation) ? prev : current).company.name
    : "N/A";

  const topLocation = data.length > 0
    ? [...data].reduce((prev, current) => (prev.totalCompensation > current.totalCompensation) ? prev : current).location.city
    : "N/A";

  return (
    <div className="flex flex-col gap-6 relative">

      {/* 1. Advanced Filters Bar */}
      <Card className="p-4 border-none shadow-sm bg-card sticky top-0 z-30">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input 
              type="text"
              placeholder="Search companies, roles, locations..."
              className="w-full h-10 bg-[#0B1020] border border-border rounded-xl pl-10 pr-4 text-sm focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 outline-none transition-all text-white placeholder:text-slate-500"
              value={filters.company}
              onChange={(e) => setFilters(f => ({ ...f, company: e.target.value }))}
            />
          </div>

          <div className="flex items-center gap-2">
            <Dropdown 
              trigger={
                <button className={`h-10 px-4 border border-border rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${filters.role ? 'bg-blue-900/30 text-blue-400 border-blue-500/50' : 'bg-card text-slate-400 hover:bg-[#172033]'}`}>
                  <Briefcase className="h-3.5 w-3.5" />
                  <span>{filters.role || 'Role Family'}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </button>
              }
            >
              <DropdownItem onClick={() => setFilters(f => ({ ...f, role: '' }))}>Any Role</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, role: 'Data Analyst' }))}>Data Analyst</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, role: 'Data Engineer' }))}>Data Engineer</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, role: 'Data Scientist' }))}>Data Scientist</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, role: 'Machine Learning Engineer' }))}>ML Engineer</DropdownItem>
            </Dropdown>

            <Dropdown 
              trigger={
                <button className={`h-10 px-4 border border-border rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${filters.location ? 'bg-blue-900/30 text-blue-400 border-blue-500/50' : 'bg-card text-slate-400 hover:bg-[#172033]'}`}>
                  <MapPin className="h-3.5 w-3.5" />
                  <span>{
                    filters.location === 'US' ? 'United States' :
                    filters.location === 'GB' ? 'United Kingdom' :
                    filters.location === 'CA' ? 'Canada' :
                    filters.location === 'IN' ? 'India' :
                    filters.location || 'Location'
                  }</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </button>
              }
            >
              <DropdownItem onClick={() => setFilters(f => ({ ...f, location: '' }))}>Any Location</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, location: 'US' }))}>United States</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, location: 'GB' }))}>United Kingdom</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, location: 'CA' }))}>Canada</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, location: 'IN' }))}>India</DropdownItem>
            </Dropdown>

            <Dropdown 
              trigger={
                <button className={`h-10 px-4 border border-border rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm ${filters.level ? 'bg-blue-900/30 text-blue-400 border-blue-500/50' : 'bg-card text-slate-400 hover:bg-[#172033]'}`}>
                  <Clock className="h-3.5 w-3.5" />
                  <span>{filters.level || 'Level'}</span>
                  <ChevronDown className="h-3.5 w-3.5 opacity-50" />
                </button>
              }
            >
              <DropdownItem onClick={() => setFilters(f => ({ ...f, level: '' }))}>Any Level</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, level: 'Entry Level' }))}>Entry Level</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, level: 'Mid Level' }))}>Mid Level</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, level: 'Senior' }))}>Senior</DropdownItem>
              <DropdownItem onClick={() => setFilters(f => ({ ...f, level: 'Executive' }))}>Executive</DropdownItem>
            </Dropdown>
          </div>

          <div className="h-6 w-px bg-[#111827] mx-1" />

          <button 
            onClick={() => setFilters(f => ({ ...f, verified: !f.verified }))}
            className={`h-10 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-sm border ${
              filters.verified 
                ? 'bg-blue-600 border-blue-600 text-white' 
                : 'bg-card border-border text-slate-400 hover:bg-[#172033]'
            }`}
          >
            <CheckCircle2 className={`h-3.5 w-3.5 ${filters.verified ? 'text-white' : 'text-slate-400'}`} />
            <span>Verified Only</span>
          </button>

          <div className="ml-auto flex items-center gap-2">
            <button onClick={resetFilters} className="text-[10px] font-black uppercase text-slate-400 hover:text-blue-400 transition-colors px-2 flex items-center gap-1">
              <FilterX className="h-3 w-3" /> Reset
            </button>
            <button onClick={() => setIsSaveModalOpen(true)} className="h-10 px-5 bg-[#1F2937] text-white rounded-xl text-xs font-black uppercase tracking-widest shadow-lg hover:bg-[#111827] transition-all active:scale-95">
              Save Filter
            </button>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
        {/* 2. Main Salary Table (Left) */}
        <div className="xl:col-span-9 space-y-4">
          <Card className="border-none shadow-sm bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between bg-[#0B1020]">
               <div className="flex items-center gap-4">
                  <span className="text-xs font-black text-slate-400 uppercase tracking-widest">
                    {selectedIds.size > 0 ? `${selectedIds.size} Selected` : 'Explorer'}
                  </span>
               </div>
               <div className="flex items-center gap-3">
                  <button 
                    onClick={handleExportCSV}
                    disabled={data.length === 0}
                    className="h-8 px-3 bg-card border border-border rounded-lg text-[10px] font-black uppercase text-slate-400 hover:bg-[#172033] flex items-center gap-2 shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="h-3 w-3" />
                    Export CSV
                  </button>
                  <button 
                    onClick={handleBulkCompare}
                    disabled={selectedIds.size < 2}
                    className={`h-8 px-3 rounded-lg text-[10px] font-black uppercase flex items-center gap-2 shadow-md transition-all ${
                      selectedIds.size >= 2 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                    }`}
                  >
                    <Columns className="h-3 w-3" />
                    Bulk Compare
                  </button>
               </div>
            </div>

            <div className="overflow-x-auto min-h-[500px]">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#111827]">
                    <th className="px-4 py-4 border-b border-border w-10">
                       <div className="h-4 w-4 rounded border border-slate-600"></div>
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-border cursor-pointer hover:text-white" onClick={() => toggleSort('company')}>
                      <div className="flex items-center gap-1">Company <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-border cursor-pointer hover:text-white" onClick={() => toggleSort('role')}>
                      <div className="flex items-center gap-1">Role <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-border cursor-pointer hover:text-white" onClick={() => toggleSort('level')}>
                      <div className="flex items-center gap-1">Level <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-border text-right cursor-pointer hover:text-white" onClick={() => toggleSort('baseSalary')}>
                      <div className="flex items-center justify-end gap-1">Base <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-border text-right cursor-pointer hover:text-white" onClick={() => toggleSort('stock')}>
                      <div className="flex items-center justify-end gap-1">Stock <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-blue-400 uppercase tracking-widest border-b border-border text-right cursor-pointer hover:text-white" onClick={() => toggleSort('totalCompensation')}>
                      <div className="flex items-center justify-end gap-1">Total Comp <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                    <th className="px-4 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-border text-center cursor-pointer hover:text-white" onClick={() => toggleSort('yearsExperience')}>
                      <div className="flex items-center justify-center gap-1">Exp <ArrowUpDown className="h-3 w-3" /></div>
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {isLoading ? (
                    Array(10).fill(0).map((_, i) => (
                      <tr key={i}>
                        <td colSpan={8} className="px-6 py-5">
                          <div className="h-6 bg-[#172033] rounded-md w-full animate-pulse" />
                        </td>
                      </tr>
                    ))
                  ) : data.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="px-6 py-20 text-center">
                        <div className="flex flex-col items-center justify-center text-slate-500">
                          <Search className="h-10 w-10 mb-4 opacity-20" />
                          <h3 className="text-lg font-bold text-white mb-2">No matching compensation records</h3>
                          <p className="text-sm">Try adjusting your filters or search terms.</p>
                          <button onClick={resetFilters} className="mt-6 px-6 py-2 bg-[#1F2937] text-white rounded-lg text-xs font-bold hover:bg-[#111827] transition-all">
                            Clear Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    data.map((entry: any) => {
                      const isSelected = selectedIds.has(entry.id);
                      return (
                        <tr 
                          key={entry.id} 
                          className={`transition-colors group cursor-pointer ${isSelected ? 'bg-[#1E3A8A]/30' : 'hover:bg-[#172033] bg-[#0B1020]'}`}
                          onClick={() => toggleSelection(entry.id)}
                        >
                          <td className="px-4 py-4" onClick={(e) => e.stopPropagation()}>
                             <input 
                               type="checkbox" 
                               checked={isSelected}
                               onChange={() => toggleSelection(entry.id)}
                               className="h-4 w-4 rounded border-slate-600 bg-transparent text-blue-600 focus:ring-blue-500/50"
                             />
                          </td>
                          <td className="px-4 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-lg bg-[#050816] border border-border flex items-center justify-center text-white font-bold text-[10px] shadow-sm">
                                {entry.company.name.charAt(0)}
                              </div>
                              <div>
                                <div className="font-bold text-white text-sm flex items-center gap-1.5">
                                  {entry.company.name}
                                  {entry.isVerified && <CheckCircle2 className="h-3 w-3 text-blue-500" />}
                                </div>
                                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">{entry.location.city}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4">
                             <div className="text-sm font-medium text-slate-200">{entry.roleFamily.name}</div>
                          </td>
                          <td className="px-4 py-4">
                             <div className="inline-flex items-center px-2 py-0.5 bg-[#111827] border border-border rounded text-[10px] font-black text-slate-300 uppercase tracking-widest">
                               {entry.level.name}
                             </div>
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-medium text-slate-400">
                            {formatCurrency(entry.baseSalary)}
                          </td>
                          <td className="px-4 py-4 text-right text-sm font-medium text-slate-400">
                            {formatCurrency(entry.stock)}
                          </td>
                          <td className="px-4 py-4 text-right">
                            <div className="text-sm font-black text-white">{formatCurrency(entry.totalCompensation)}</div>
                          </td>
                          <td className="px-4 py-4 text-center">
                             <div className="text-xs font-bold text-slate-500">{entry.yearsExperience}y</div>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {data.length > 0 && (
              <div className="p-4 border-t border-border flex items-center justify-between bg-card">
                <span className="text-xs text-slate-500 font-medium">Showing <span className="font-bold text-white">{data.length}</span> of <span className="font-bold text-white">{totalCount}</span> results</span>
                <div className="flex items-center gap-1">
                   {/* Simplified pagination for demo */}
                   <button className="h-8 w-8 rounded-lg text-xs font-bold bg-blue-600 text-white shadow-md">1</button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* 3. Right Insights Panel */}
        <div className="xl:col-span-3 space-y-6">
          <Card className="p-6 border-none shadow-sm bg-card">
            <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-6">Market Context</h3>
            
            <div className="space-y-6">
              <div className="p-4 bg-[#1E3A8A]/20 rounded-2xl border border-[#2563EB]/30">
                 <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 block">Median Salary</span>
                 <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(medianSalary)}</div>
                 <div className="flex items-center gap-1.5 mt-1 text-[10px] font-bold text-emerald-500">
                    <ArrowUpDown className="h-3 w-3" />
                    Filtered Dataset
                 </div>
              </div>

              <div className="p-4 bg-violet-900/20 rounded-2xl border border-violet-500/30">
                 <span className="text-[10px] font-black text-violet-400 uppercase tracking-widest mb-1 block">90th Percentile</span>
                 <div className="text-2xl font-black text-white tracking-tight">{formatCurrency(p90Salary)}</div>
                 <div className="mt-2 h-1.5 w-full bg-[#111827] rounded-full overflow-hidden">
                    <div className="h-full bg-violet-500" style={{ width: '90%' }} />
                 </div>
              </div>

              <div className="space-y-4 pt-2">
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Top Company</span>
                    <span className="text-xs font-black text-white">{topCompany}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-500">Growth Hotspot</span>
                    <span className="text-xs font-black text-white">{topLocation}</span>
                 </div>
              </div>
            </div>

            <button className="w-full mt-8 py-3 bg-[#1F2937] text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-[#111827] transition-all shadow-lg active:scale-95">
              Generate Detailed Report
            </button>
          </Card>
          
          {data.length > 0 && (
            <Card className="p-6 border border-border shadow-sm bg-[#0B1020]">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4">Mini Insights</h3>
              <ul className="space-y-4">
                <li className="text-sm text-slate-300 leading-relaxed border-l-2 border-blue-500 pl-3">
                  <span className="font-bold text-white">{topLocation}</span> remains the highest-paying location in the current filter context.
                </li>
                <li className="text-sm text-slate-300 leading-relaxed border-l-2 border-violet-500 pl-3">
                  <span className="font-bold text-white">{topCompany}</span> compensation exceeds the median by {medianSalary ? (((data.find(d => d.company.name === topCompany)?.totalCompensation || 0) / medianSalary - 1) * 100).toFixed(0) : 0}%.
                </li>
              </ul>
            </Card>
          )}
        </div>
      </div>

      <BulkCompareDrawer 
        isOpen={isCompareOpen} 
        onClose={() => setIsCompareOpen(false)} 
        selectedEntries={selectedEntries} 
      />

      <Modal 
        isOpen={isSaveModalOpen} 
        onClose={() => setIsSaveModalOpen(false)}
        title="Save Current Filter"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Filter Name</label>
            <input 
              type="text" 
              placeholder="e.g. SF Senior Engineers" 
              className="w-full h-10 bg-[#050816] border border-border rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-white"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Visibility</label>
            <select className="w-full h-10 bg-[#050816] border border-border rounded-lg px-4 text-sm focus:ring-2 focus:ring-blue-500/50 outline-none text-white">
              <option>Private</option>
              <option>Shared with Team</option>
            </select>
          </div>
          <button 
            onClick={() => {
              setIsSaveModalOpen(false);
              alert('Filter saved successfully! (Demo)');
            }}
            className="w-full mt-4 h-10 bg-blue-600 text-white rounded-lg text-xs font-black uppercase tracking-widest hover:bg-blue-700 transition-all"
          >
            Save Filter
          </button>
        </div>
      </Modal>
    </div>
  );
}

function InfoIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 16v-4" />
      <path d="M12 8h.01" />
    </svg>
  );
}
