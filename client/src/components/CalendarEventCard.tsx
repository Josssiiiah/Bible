import React from "react";

interface CalendarEvent {
  id: string;
  summary: string;
  start: string;
  end: string;
  location?: string;
  attendees?: Array<{
    email: string;
    responseStatus?: string;
  }>;
}

interface CalendarEventCardProps {
  events: CalendarEvent[];
  title?: string;
}

export function CalendarEventCard({
  events,
  title = "Calendar Events",
}: CalendarEventCardProps) {
  if (!events || events.length === 0) {
    return (
      <div className="bg-white p-4 rounded-lg shadow-md mb-3">
        <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-500">No events found.</p>
      </div>
    );
  }

  function formatDate(dateString: string) {
    try {
      const date = new Date(dateString);
      return date.toLocaleString(undefined, {
        weekday: "short",
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
      });
    } catch (e) {
      return dateString;
    }
  }

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-3">
      <h3 className="text-lg font-medium text-gray-800 mb-2">{title}</h3>
      <div className="space-y-3">
        {events.map((event) => (
          <div
            key={event.id}
            className="border-b border-gray-200 pb-2 last:border-b-0"
          >
            <h4 className="font-medium text-blue-600">{event.summary}</h4>
            <div className="text-sm text-gray-600">
              <div>
                <span className="font-medium">Start:</span>{" "}
                {formatDate(event.start)}
              </div>
              <div>
                <span className="font-medium">End:</span>{" "}
                {formatDate(event.end)}
              </div>
              {event.location && (
                <div>
                  <span className="font-medium">Location:</span>{" "}
                  {event.location}
                </div>
              )}
              {event.attendees && event.attendees.length > 0 && (
                <div className="mt-1">
                  <span className="font-medium">Attendees:</span>
                  <ul className="list-disc list-inside ml-2">
                    {event.attendees.map((attendee, index) => (
                      <li key={index} className="text-xs">
                        {attendee.email}{" "}
                        {attendee.responseStatus && (
                          <span className="text-gray-500">
                            ({attendee.responseStatus})
                          </span>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
