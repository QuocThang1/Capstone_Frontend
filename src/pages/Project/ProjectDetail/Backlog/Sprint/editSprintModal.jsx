import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import ButtonSpinner from '../../../../../components/ButtonSpinner';
import { X, Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { getOccupiedSprintsRangeApi } from '../../../../../utils/Api/sprintApi';

const formatToTimezoneDate = (isoString, timeZone) => {
    if (!isoString) return '';
    try {
        return new Intl.DateTimeFormat('en-CA', {
            timeZone: timeZone || 'UTC',
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).format(new Date(isoString));
    } catch (error) {
        return new Date(isoString).toISOString().split('T')[0];
    }
};

const getUtcStartOfDay = (dateString, timeZone) => {
    if (!dateString) return null;
    try {
        const tempDate = new Date(`${dateString}T00:00:00`);
        const tzStr = new Intl.DateTimeFormat('en-US', { timeZone: timeZone || 'UTC', timeZoneName: 'longOffset' }).format(tempDate);
        let offset = tzStr.split(' ').pop().replace('GMT', '');
        return new Date(`${dateString}T00:00:00${offset || '+00:00'}`).toISOString();
    } catch (e) {
        return new Date(dateString).toISOString();
    }
};

const getUtcEndOfDay = (dateString, timeZone) => {
    if (!dateString) return null;
    try {
        const tempDate = new Date(`${dateString}T23:59:59`);
        const tzStr = new Intl.DateTimeFormat('en-US', { timeZone: timeZone || 'UTC', timeZoneName: 'longOffset' }).format(tempDate);
        let offset = tzStr.split(' ').pop().replace('GMT', '');
        return new Date(`${dateString}T23:59:59${offset || '+00:00'}`).toISOString();
    } catch (e) {
        return new Date(dateString).toISOString();
    }
};

const EditSprintModal = ({ isOpen, onClose, onUpdate, loading, sprint, projectId, projectTimezone = "UTC" }) => {
    const { register, handleSubmit, formState: { errors }, reset, setValue, watch } = useForm();
    const [occupiedRanges, setOccupiedRanges] = useState([]);
    const [openPicker, setOpenPicker] = useState(null);

    const startDateValue = watch('startDate');
    const endDateValue = watch('endDate');

    useEffect(() => {
        if (!isOpen || !projectId) return;

        const fetchOccupiedRanges = async () => {
            try {
                const res = await getOccupiedSprintsRangeApi(projectId);
                if (res?.EC === 0) {
                    setOccupiedRanges(res.data || []);
                }
            } catch (error) {
                console.error('Failed to fetch occupied sprint ranges', error);
            }
        };

        fetchOccupiedRanges();
    }, [isOpen, projectId]);

    useEffect(() => {
        if (sprint) {
            reset({
                name: sprint.name || '',
                startDate: formatToTimezoneDate(sprint.startDate, projectTimezone),
                endDate: formatToTimezoneDate(sprint.endDate, projectTimezone),
                goal: sprint.goal || '',
            });
        }
    }, [sprint, reset, isOpen, projectTimezone]);

    if (!isOpen) return null;

    const onSubmit = (data) => {
        const payload = {
            ...data,
            startDate: getUtcStartOfDay(data.startDate, projectTimezone),
            endDate: getUtcEndOfDay(data.endDate, projectTimezone)
        };
        onUpdate(sprint._id, payload);
    };

    const isDateInRange = (date, range) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const currentStr = `${year}-${month}-${day}`;

        const startStr = formatToTimezoneDate(range.startDate, projectTimezone);
        const endStr = formatToTimezoneDate(range.endDate, projectTimezone);

        return currentStr >= startStr && currentStr <= endStr;
    };

    const isOccupiedDate = (date) => {
        return occupiedRanges.some(range => isDateInRange(date, range));
    };

    const handleSelectDate = (field, date) => {
        if (!date) return;

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');

        const formatted = `${year}-${month}-${day}`;

        if (isOccupiedDate(date)) {
            return;
        }

        setValue(field, formatted, { shouldValidate: true });
        setOpenPicker(null);
    };
    const inputStyle = "w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white dark:bg-slate-800 text-slate-900 dark:text-white";

    const parseLocalDay = (dateString) => {
        if (!dateString) return undefined;
        const [y, m, d] = dateString.split('-');
        return new Date(y, m - 1, d);
    };

    const DatePickerField = ({ label, value, field, alignRight }) => {
        const selectedDate = value ? parseLocalDay(value) : undefined;
        const isOccupied = value ? isOccupiedDate(selectedDate) : false;

        return (
            <div className="relative">
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    {label}
                </label>

                <button
                    type="button"
                    onClick={() => setOpenPicker(openPicker === field ? null : field)}
                    className={`${inputStyle} flex items-center justify-between ${isOccupied ? 'border-rose-500 text-rose-600' : ''}`}
                >
                    <span>{value || 'Select date'}</span>
                    <CalendarIcon className="w-4 h-4" />
                </button>

                {openPicker === field && (
                    <div
                        className={`absolute z-[100] mt-1 w-max rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xl p-2 ${alignRight ? 'right-0' : 'left-0'
                            }`}
                    >
                        <div className="[&_.rdp]:m-0 [&_.rdp-month]:space-y-1 [&_.rdp-cell]:w-7 [&_.rdp-cell]:h-7 [&_.rdp-button_reset]:w-7 [&_.rdp-button_reset]:h-7 [&_.rdp-day]:text-xs [&_.rdp-caption_label]:text-sm [&_.rdp-head_cell]:text-[10px] [&_.rdp-head_cell]:font-medium [&_.rdp-head_cell]:text-slate-500 [&_.rdp-nav_button]:w-6 [&_.rdp-nav_button]:h-6">
                            <DayPicker
                                mode="single"
                                selected={selectedDate}
                                onSelect={(date) => handleSelectDate(field, date)}
                                modifiers={{
                                    occupied: (day) => isOccupiedDate(day),
                                }}
                                modifiersClassNames={{
                                    occupied: 'bg-rose-500 text-white rounded-full font-bold shadow-sm',
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-900/50 dark:bg-slate-900/80 backdrop-blur-sm"
        >
            <motion.div
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.95, opacity: 0 }}
                transition={{ type: 'spring', stiffness: 280, damping: 22 }}
                className="bg-white dark:bg-slate-900 rounded-xl shadow-2xl w-full max-w-lg border border-slate-200 dark:border-slate-700 transition-all duration-300"
            >
                <form onSubmit={handleSubmit(onSubmit)} noValidate>
                    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 dark:border-slate-700">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-slate-50">
                            Edit Sprint
                        </h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-200 cursor-pointer"
                        >
                            <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                        </button>
                    </div>

                    <div className="p-6 max-h-[70vh] overflow-y-auto space-y-5 custom-scrollbar">
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sprint name</label>
                            <input
                                type="text"
                                {...register("name", { required: "Sprint name is required" })}
                                className={inputStyle}
                            />
                            {errors.name && <p className="text-rose-500 text-xs mt-1">{errors.name.message}</p>}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <DatePickerField label="Start date" value={startDateValue} field="startDate" />
                            {/* Truyền alignRight=true cho End Date */}
                            <DatePickerField label="End date" value={endDateValue} field="endDate" alignRight={true} />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Sprint goal (optional)</label>
                            <textarea
                                rows="3"
                                {...register("goal")}
                                className={inputStyle}
                            />
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 rounded-b-xl">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg disabled:bg-indigo-400 flex items-center justify-center cursor-pointer min-w-[100px] transition-all"
                        >
                            {loading ? <ButtonSpinner text="Updating..." /> : 'Update'}
                        </button>
                    </div>
                </form>
            </motion.div>
        </motion.div>
    );
};

export default EditSprintModal;