import { Clock } from "lucide-react";
import SessionItem from "../item";
import type { Session } from "@/validators/sessions";

const SessionSection = ({ sessions }: { sessions: Session[] }) => {
  const upcomingSessions = sessions.filter(
    (s) => new Date(s.startsAt) > new Date(),
  );
  const pastSessions = sessions.filter(
    (s) => new Date(s.startsAt) <= new Date(),
  );

  return (
    <div className="space-y-6">
      <div className="mb-6 flex items-center gap-2">
        <Clock className="text-primary h-6 w-6" />
        <h2 className="text-2xl font-bold">Sessions ({sessions.length})</h2>
      </div>

      {/* Upcoming Sessions */}
      {upcomingSessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-green-700 dark:text-green-400">
            Upcoming Sessions ({upcomingSessions.length})
          </h3>
          <ul className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {upcomingSessions.map((session) => (
              <SessionItem key={session.id} session={session} />
            ))}
          </ul>
        </div>
      )}

      {/* Past Sessions */}
      {pastSessions.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">
            Past Sessions ({pastSessions.length})
          </h3>
          <ul className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {pastSessions.map((session) => (
              <SessionItem key={session.id} session={session} />
            ))}
          </ul>
        </div>
      )}

      {/* Empty State */}
      {sessions.length === 0 && (
        <div className="py-12 text-center">
          <Clock className="text-muted-foreground mx-auto mb-4 h-12 w-12" />
          <h3 className="text-muted-foreground text-lg font-semibold">
            No sessions found
          </h3>
          <p className="text-muted-foreground text-sm">
            There are no sessions scheduled at the moment.
          </p>
        </div>
      )}
    </div>
  );
};

export default SessionSection;
