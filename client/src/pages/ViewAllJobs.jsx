import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Building2, Clock, Search, Eye, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Command, CommandInput, CommandEmpty, CommandGroup, CommandItem } from "@/components/ui/command";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useNavigate, useLocation } from "react-router-dom";
export default function ViewAllJobs() {
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(true);
    const [selectedWorkType, setSelectedWorkType] = useState('all');
    const [sortBy, setSortBy] = useState('match');
    const [isLocationOpen, setIsLocationOpen] = useState(false);
    const suggestedLocations = [
        'Bangalore', 'Remote', 'San Francisco', 'New York', 'London', 'Toronto', 'Sydney', 'Berlin', 'Singapore', 'Dubai'
    ];
    // Helper function to detect if a job is remote
    const isRemoteJob = (job) => {
        const location = job.location?.toLowerCase() || '';
        const title = job.title?.toLowerCase() || '';
        const description = job.description?.toLowerCase() || '';
        return location.includes('remote') ||
            title.includes('remote') ||
            description.includes('remote') ||
            location.includes('work from home') ||
            description.includes('work from home');
    };
    // Helper function to detect if a job is hybrid
    const isHybridJob = (job) => {
        const location = job.location?.toLowerCase() || '';
        const description = job.description?.toLowerCase() || '';
        return location.includes('hybrid') ||
            description.includes('hybrid');
    };
    // Helper function to get days since posted
    const getDaysSincePosted = (postedTime) => {
        const now = new Date();
        if (postedTime.includes('day ago') || postedTime.includes('days ago')) {
            const days = parseInt(postedTime.match(/\d+/)?.[0] || '0');
            return days;
        }
        else if (postedTime.includes('week ago') || postedTime.includes('weeks ago')) {
            const weeks = parseInt(postedTime.match(/\d+/)?.[0] || '0');
            return weeks * 7;
        }
        else if (postedTime.includes('month ago') || postedTime.includes('months ago')) {
            const months = parseInt(postedTime.match(/\d+/)?.[0] || '0');
            return months * 30;
        }
        return 0;
    };
    const [jobs] = useState(Array.isArray(location?.state?.jobs) && location.state.jobs.length > 0 ? location.state.jobs : defaultJobs);
    const csvDownload = null; // CSV removed in favor of location-based query
    // Count jobs for each filter category
    const remoteJobsCount = jobs.filter(isRemoteJob).length;
    const hybridJobsCount = jobs.filter(isHybridJob).length;
    const onSiteJobsCount = jobs.length - remoteJobsCount - hybridJobsCount;
    const filters = [
        { id: 'all', label: 'All Jobs', count: jobs.length },
        { id: 'remote', label: 'Remote', count: remoteJobsCount },
        { id: 'hybrid', label: 'Hybrid', count: hybridJobsCount },
        { id: 'high-match', label: 'High Match (90%+)', count: jobs.filter(job => job.matchPercentage >= 90).length }
    ];
    // Filter options for sidebar
    const workTypeOptions = [
        { id: 'all', label: 'All Types', count: jobs.length },
        { id: 'remote', label: 'Remote', count: remoteJobsCount },
        { id: 'hybrid', label: 'Hybrid', count: hybridJobsCount },
        { id: 'onsite', label: 'On-site', count: onSiteJobsCount }
    ];
    const jobTypes = [
        { id: 'all', label: 'All Types' },
        { id: 'Full-time', label: 'Full-time' },
        { id: 'Part-time', label: 'Part-time' },
        { id: 'Contract', label: 'Contract' },
        { id: 'Remote', label: 'Remote' }
    ];
    const sortOptions = [
        { id: 'match', label: 'Best Match' },
        { id: 'posted', label: 'Recently Posted' }
    ];
    // Add the filtering logic here
    const filteredJobs = jobs.filter(job => {
        // Quick filter tabs
        const matchesFilter = selectedFilter === 'all' ||
            (selectedFilter === 'new' && job.isNew) ||
            (selectedFilter === 'high-match' && job.matchPercentage >= 90) ||
            (selectedFilter === 'remote' && isRemoteJob(job)) ||
            (selectedFilter === 'hybrid' && isHybridJob(job));
        // Search query
        const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
            job.skills.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()));
        // Work type filter
        const matchesWorkType = selectedWorkType === 'all' ||
            (selectedWorkType === 'remote' && isRemoteJob(job)) ||
            (selectedWorkType === 'hybrid' && isHybridJob(job)) ||
            (selectedWorkType === 'onsite' && !isRemoteJob(job) && !isHybridJob(job));
        return matchesFilter && matchesSearch && matchesWorkType;
    });
    const sortedJobs = [...filteredJobs].sort((a, b) => {
        switch (sortBy) {
            case 'match':
                return b.matchPercentage - a.matchPercentage;
            case 'posted':
                return new Date(b.posted).getTime() - new Date(a.posted).getTime();
            default:
                return 0;
        }
    });
    const getMatchColor = (percentage) => {
        if (percentage >= 90)
            return 'bg-green-100 text-green-700 border-green-200';
        if (percentage >= 80)
            return 'bg-blue-100 text-blue-700 border-blue-200';
        if (percentage >= 70)
            return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        return 'bg-gray-100 text-gray-700 border-gray-200';
    };
    const clearAllFilters = () => {
        setSelectedFilter('all');
        setSelectedWorkType('all');
        setSearchQuery('');
    };
    return (<motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100">
                <ArrowLeft className="h-5 w-5"/>
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">All Job Recommendations</h1>
                <p className="text-gray-600">Discover your perfect career opportunities</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Popover open={isLocationOpen} onOpenChange={setIsLocationOpen}>
                <PopoverTrigger asChild>
                 
                </PopoverTrigger>
                <PopoverContent className="w-64 p-0">
                  <Command>
                    <CommandInput placeholder="Search location..."/>
                    <CommandEmpty>No results found.</CommandEmpty>
                    <CommandGroup>
                      {suggestedLocations.map((loc) => (<CommandItem key={loc} onSelect={() => setSearchQuery(loc)}>
                          <MapPin className="mr-2 h-4 w-4"/>
                          {loc}
                        </CommandItem>))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <Button variant="outline" size="sm" onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-2">
                <SlidersHorizontal className="h-4 w-4"/>
                {showFilters ? 'Hide' : 'Show'} Filters
              </Button>
              {/* CSV download removed per requirements */}
              <Button size="sm" onClick={() => navigate('/dashboard')} className="bg-blue-600 hover:bg-blue-700">
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <AnimatePresence>
              {showFilters && (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="bg-white rounded-lg shadow-md p-6 space-y-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
                    <Button variant="ghost" size="sm" onClick={clearAllFilters} className="text-blue-600 hover:text-blue-700">
                      Clear All
                    </Button>
                  </div>

                  {/* Search */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Search</label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400"/>
                      <input type="text" placeholder="Jobs, companies, skills..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"/>
                    </div>
                  </div>

                  {/* Work Type */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Work Type</label>
                    <select value={selectedWorkType} onChange={(e) => setSelectedWorkType(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {workTypeOptions.map((option) => (<option key={option.id} value={option.id}>
                          {option.label} ({option.count})
                        </option>))}
                    </select>
                  </div>


                  {/* Sort By */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Sort By</label>
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                      {sortOptions.map((option) => (<option key={option.id} value={option.id}>{option.label}</option>))}
                    </select>
                  </div>
                </motion.div>)}
            </AnimatePresence>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Quick Filter Tabs */}
            <Card className="border-0 shadow-md">
              <CardContent className="p-4">
                <div className="flex gap-2 overflow-x-auto">
                  {filters.map((filter) => (<button key={filter.id} onClick={() => setSelectedFilter(filter.id)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${selectedFilter === filter.id
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
                      {filter.label}
                      <span className="ml-2 bg-white/20 px-2 py-0.5 rounded-full text-xs">
                        {filter.count}
                      </span>
                    </button>))}
                </div>
              </CardContent>
            </Card>

            {/* Results Summary */}
            <div className="flex items-center justify-between">
              <p className="text-gray-600">
                Showing <span className="font-semibold">{sortedJobs.length}</span> of <span className="font-semibold">{jobs.length}</span> jobs
              </p>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              <AnimatePresence>
                {sortedJobs.map((job, index) => (<motion.div key={job.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ delay: index * 0.05 }} className="group">
                    <Card className="border-2 border-gray-100 hover:border-blue-200 transition-all duration-300 hover:shadow-lg cursor-pointer">
                      <CardContent className="p-6">
                        {/* Job Header */}
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors mb-2">
                              {job.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                              <div className="flex items-center gap-1">
                                <Building2 className="h-4 w-4"/>
                                {job.company}
                              </div>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4"/>
                                {job.location}
                              </div>
                              <div className="flex items-center gap-1">
                                <Clock className="h-4 w-4"/>
                                {job.posted}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={`mb-2 ${getMatchColor(job.matchPercentage)}`}>
                              {job.matchPercentage}% Match
                            </Badge>
                            <Badge variant="outline" className="text-xs mt-1">
                              {job.type}
                            </Badge>
                          </div>
                        </div>

                        {/* Job Details */}
                        <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                          <span>{job.location}</span>
                          <span className="text-gray-300">•</span>
                          <span>{job.type}</span>
                        </div>

                        {/* Skills */}
                        <div className="mb-4">
                          <div className="flex gap-2 flex-wrap">
                            {job.skills.map((skill) => (<Badge key={skill} variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 transition-colors">
                                {skill}
                              </Badge>))}
                          </div>
                        </div>

                        {/* Description */}
                        {job.description && (<p className="text-gray-600 mb-4 leading-relaxed">{job.description}</p>)}

                        

                        {/* Action Buttons */}
                        <div className="flex gap-3 pt-4 border-t border-gray-100">
                          <Button size="sm" className="flex-1 bg-blue-600 hover:bg-blue-700" onClick={() => {
                // Prioritize LinkedIn job URL for "View Details"
                const linkedinUrl = job.job_url || '';
                const applyUrl = job.apply_url || job.apply_link || job.applyLink || '';
                // Use LinkedIn URL if available, otherwise fall back to apply URL
                const link = linkedinUrl || applyUrl || '#';
                console.log('Job URL fields (ViewAllJobs):', {
                    job_url: job.job_url,
                    apply_url: job.apply_url,
                    apply_link: job.apply_link,
                    applyLink: job.applyLink,
                    finalLink: link,
                    isLinkedIn: linkedinUrl.includes('linkedin.com')
                });
                if (link && link !== '#' && link.trim() !== '') {
                    const w = window.open(link, '_blank', 'noopener,noreferrer');
                    if (w) {
                        w.opener = null;
                    }
                }
                else {
                    console.error('No valid URL found for job:', job);
                    alert('No valid job URL available');
                }
            }}>
                            <Eye className="h-4 w-4 mr-2"/>
                            View Details
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>))}
              </AnimatePresence>

              {sortedJobs.length === 0 && (<motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
                  <div className="text-gray-400 mb-4">
                    <Search className="h-16 w-16 mx-auto"/>
                  </div>
                  <h3 className="text-lg font-medium text-gray-600 mb-2">No jobs found</h3>
                  <p className="text-gray-500 mb-4">Try adjusting your search criteria or filters</p>
                  <Button variant="outline" onClick={clearAllFilters} className="text-blue-600 hover:text-blue-700">
                    Clear All Filters
                  </Button>
                </motion.div>)}
            </div>
          </div>
        </div>
      </div>
    </motion.div>);
}
