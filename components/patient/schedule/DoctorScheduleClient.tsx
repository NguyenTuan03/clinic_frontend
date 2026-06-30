"use client";

import { useState } from "react";
import SearchComponent from "./SearchComponent";
import ScheduleListComponent from "./ScheduleList";

export default function DoctorScheduleClient() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <SearchComponent value={searchQuery} onChange={setSearchQuery} />
      </div>
      <ScheduleListComponent searchQuery={searchQuery} />
    </div>
  );
}
