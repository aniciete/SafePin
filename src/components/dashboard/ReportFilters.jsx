import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const incidentTypes = [
  'Theft', 'Assault', 'Vandalism', 'Harassment', 'Robbery', 'Burglary', 'Fire',
  'Medical Emergency', 'Suspicious Activity', 'Environmental Hazard', 'Road Accident', 'Other'
];

const ReportFilters = ({ onFilterChange }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { register, handleSubmit, control, reset, watch } = useForm();
  const [activeFilterCount, setActiveFilterCount] = useState(0);

  // Watch the value of the incidentType dropdown
  const incidentTypeSelection = watch('incidentType');

  const onSubmit = (data) => {
    const activeFilters = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value && value !== 'all' && value !== '')
    );
    setActiveFilterCount(Object.keys(activeFilters).length);
    onFilterChange(activeFilters);
  };

  const handleClearFilters = () => {
    reset({
      startDate: '', endDate: '', incidentType: 'all', otherIncidentType: '', status: 'all', severity: 'all',
    });
    handleSubmit(data => {
      onFilterChange({});
      setActiveFilterCount(0);
    })();
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader
        className="flex flex-row items-center justify-between p-4 cursor-pointer bg-primary text-primary-foreground"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <CardTitle>Filters</CardTitle>
          {activeFilterCount > 0 && (
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-background text-primary text-xs font-bold">
              {activeFilterCount}
            </span>
          )}
        </div>
        <motion.div animate={{ rotate: isExpanded ? 180 : 0 }}><ChevronDown className="h-5 w-5" /></motion.div>
      </CardHeader>
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <CardContent className="p-4">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  <div className="space-y-1"><Label htmlFor="startDate">Start Date</Label><Input id="startDate" type="date" {...register('startDate')} /></div>
                  <div className="space-y-1"><Label htmlFor="endDate">End Date</Label><Input id="endDate" type="date" {...register('endDate')} /></div>
                  <div className="space-y-1"><Label htmlFor="status">Status</Label>
                    <Controller name="status" control={control} defaultValue="all" render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="status"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="pending_verification">Pending</SelectItem>
                          <SelectItem value="verified">Verified</SelectItem>
                          <SelectItem value="resolved">Resolved</SelectItem>
                        </SelectContent>
                      </Select>
                    )}/>
                  </div>
                  <div className="space-y-1"><Label htmlFor="severity">Severity</Label>
                    <Controller name="severity" control={control} defaultValue="all" render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="severity"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                          <SelectItem value="critical">Critical</SelectItem>
                        </SelectContent>
                      </Select>
                    )}/>
                  </div>
                  <div className="space-y-1"><Label htmlFor="incidentType">Incident Type</Label>
                    <Controller name="incidentType" control={control} defaultValue="all" render={({ field }) => (
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger id="incidentType"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          {incidentTypes.map(type => <SelectItem key={type} value={type}>{type}</SelectItem>)}
                        </SelectContent>
                      </Select>
                    )}/>
                  </div>
                  {/* Conditionally render the 'Other' input field */}
                  {incidentTypeSelection === 'Other' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-1">
                      <Label htmlFor="otherIncidentType">Specify Type</Label>
                      <Input id="otherIncidentType" placeholder="e.g., Noise Complaint" {...register('otherIncidentType')} />
                    </motion.div>
                  )}
                </div>
                <div className="mt-6 flex items-center justify-between">
                  {activeFilterCount > 0 ? (<Button type="button" variant="ghost" onClick={handleClearFilters}>Clear Filters</Button>) : <div />}
                  <Button type="submit">Apply Filters</Button>
                </div>
              </form>
            </CardContent>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
};

export default ReportFilters;