"use client";

import AdminOverview from "./views/AdminOverview";
import AdminAccounts from "./views/AdminAccounts";
import AdminStorage from "./views/AdminStorage";
import AdminPayments from "./views/AdminPayments";

const VIEWS = { overview: AdminOverview, accounts: AdminAccounts, storage: AdminStorage, payments: AdminPayments };

export default function AdminPage({ view = "overview" }) {
  const View = VIEWS[view] || AdminOverview;
  return (
    <div className="relative mx-auto max-w-[1500px] space-y-4 px-4 py-4 sm:px-6 lg:px-8 lg:py-5">
      <View />
    </div>
  );
}
