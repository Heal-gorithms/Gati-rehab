
/**
 * Utility to generate dynamic AI insights for doctors based on patient data
 */
export const generateDoctorInsights = (patients) => {
    if (!patients || patients.length === 0) {
        return [
            {
                id: 'no-data',
                type: 'info',
                title: 'Data Collection',
                message: 'Add patients to begin receiving neural insights and recovery alerts.',
                color: 'blue'
            }
        ];
    }

    const insights = [];

    // 1. Adherence Alerts
    const lowAdherencePatients = patients.filter(p => p.adherenceRate < 60);
    if (lowAdherencePatients.length > 0) {
        insights.push({
            id: 'adherence-alert',
            type: 'warning',
            title: 'Adherence Alert',
            message: `${lowAdherencePatients.length} patient${lowAdherencePatients.length > 1 ? 's' : ''} fell below 60% adherence today. Consider sending a nudge.`,
            color: 'blue'
        });
    }

    // 2. Recovery Peaks (Randomly selected from high performers for variety)
    const highPerformers = patients.filter(p => p.adherenceRate >= 90);
    if (highPerformers.length > 0) {
        const randomPatient = highPerformers[Math.floor(Math.random() * highPerformers.length)];
        insights.push({
            id: 'recovery-peak',
            type: 'success',
            title: 'Recovery Peak',
            message: `${randomPatient.name} has maintained a 90%+ adherence for the past week. Excellent progress!`,
            color: 'emerald'
        });
    }

    // 3. Activity Trends
    const activeToday = patients.filter(p => p.lastActive === 'Just now' || p.lastActive?.includes('min')).length;
    if (activeToday > 0) {
        insights.push({
            id: 'activity-trend',
            type: 'info',
            title: 'Activity Trend',
            message: `${activeToday} patient${activeToday > 1 ? 's are' : ' is'} currently active or recently completed a session.`,
            color: 'indigo'
        });
    }

    // Fallback if not enough insights
    if (insights.length < 2) {
        insights.push({
            id: 'general-tip',
            type: 'info',
            title: 'Clinical Tip',
            message: 'Consistent monitoring of ROM trends can help predict recovery velocity.',
            color: 'slate'
        });
    }

    return insights;
};
