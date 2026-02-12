// NotificationsPanel - Display notifications and alerts for doctors
// Shows adherence alerts, patient updates, and system notifications

import { Bell, AlertTriangle, CheckCircle, Info, X } from 'lucide-react';

const NotificationsPanel = ({ notifications = [], onClearNotification }) => {
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'alert':
        return <AlertTriangle className="w-5 h-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'alert':
        return 'bg-red-50 border-red-200';
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Mock notifications if empty
  const displayNotifications = notifications.length > 0 ? notifications : [
    {
      id: 1,
      type: 'alert',
      title: 'Low Adherence Alert',
      message: 'Vikram Singh has not completed sessions for 7 days. Adherence rate: 45%',
      time: '5 minutes ago',
      patientId: 'P005',
    },
    {
      id: 2,
      type: 'alert',
      title: 'Session Missed',
      message: 'Meera Iyer missed scheduled session today',
      time: '2 hours ago',
      patientId: 'P006',
    },
    {
      id: 3,
      type: 'success',
      title: 'Goal Achieved',
      message: 'Priya Sharma completed all sessions for this week!',
      time: '5 hours ago',
      patientId: 'P002',
    },
    {
      id: 4,
      type: 'info',
      title: 'New Patient Assigned',
      message: 'You have been assigned a new patient: Amit Kumar',
      time: '1 day ago',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-5 h-5 text-blue-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <span className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-semibold rounded-full">
            {displayNotifications.filter(n => n.type === 'alert').length} urgent
          </span>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        {displayNotifications.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {displayNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-l-4 ${getNotificationBgColor(notification.type)} hover:bg-opacity-70 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  {getNotificationIcon(notification.type)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1">
                        <h3 className="text-sm font-semibold text-gray-900">
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-700 mt-1">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {notification.time}
                        </p>
                      </div>
                      {onClearNotification && (
                        <button
                          onClick={() => onClearNotification(notification.id)}
                          className="p-1 hover:bg-white rounded transition-colors"
                          title="Dismiss"
                        >
                          <X className="w-4 h-4 text-gray-400 hover:text-gray-600" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center">
            <Bell className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 text-sm">No new notifications</p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-gray-200 bg-gray-50">
        <button className="w-full text-sm text-blue-600 hover:text-blue-700 font-medium">
          View All Notifications
        </button>
      </div>
    </div>
  );
};

export default NotificationsPanel;
