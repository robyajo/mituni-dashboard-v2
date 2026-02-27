import { ChartAreaInteractive } from "./dashboard/components/chart-area-interactive";
import { DataTable } from "./dashboard/components/data-table";
import { SectionCards } from "./dashboard/components/section-cards";

import data from "./dashboard/data/data.json";
import pastPerformanceData from "./dashboard/data/past-performance-data.json";
import keyPersonnelData from "./dashboard/data/key-personnel-data.json";
import focusDocumentsData from "./dashboard/data/focus-documents-data.json";
import PageConponentsAdmin from "@/components/page-components";

export default function Page() {
  return (
    <>
      <PageConponentsAdmin
        breadcrumb={[
          {
            label: "Dashboard",
            href: "/dashboard",
          },
        ]}
        title="Dashboard"
        description="Welcome to your admin dashboard"
      >
        <div className="@container/main px-4 lg:px-6 space-y-6">
          <SectionCards />
          <ChartAreaInteractive />
          sdasd
        </div>
        <div className="@container/main">
          <DataTable
            data={data}
            pastPerformanceData={pastPerformanceData}
            keyPersonnelData={keyPersonnelData}
            focusDocumentsData={focusDocumentsData}
          />
        </div>
      </PageConponentsAdmin>
    </>
  );
}
