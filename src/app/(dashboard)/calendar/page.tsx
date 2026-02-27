import PageConponentsAdmin from "@/components/page-components";
import { Calendar } from "./components/calendar";
import { events, eventDates } from "./data";

export default function CalendarPage() {
  return (
    <PageConponentsAdmin
      breadcrumb={[
        {
          label: "Calendar",
          href: "/calendar",
        },
      ]}
      title="Calendar"
      description="Manage your calendar"
    >
      <div className="px-4 lg:px-6">
        <Calendar events={events} eventDates={eventDates} />
      </div>
    </PageConponentsAdmin>
  );
}
