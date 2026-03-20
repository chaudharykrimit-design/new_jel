import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import type { Customer } from "@/lib/api";

const AdminCustomers = () => {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    api.admin.customers().then(({ customers }) => setCustomers(customers));
  }, []);

  return (
    <div>
      <h1 className="font-display text-2xl text-foreground mb-6">Customers</h1>

      <div className="bg-background border border-border overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Name</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Email</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Phone</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Orders</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Total Spent</th>
              <th className="text-left px-5 py-3 text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Joined</th>
            </tr>
          </thead>
          <tbody>
            {customers.map(c => (
              <tr key={c.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                <td className="px-5 py-3 font-semibold">{c.name}</td>
                <td className="px-5 py-3 text-foreground/70">{c.email}</td>
                <td className="px-5 py-3 text-foreground/70">{c.phone || "—"}</td>
                <td className="px-5 py-3">{c.orderCount}</td>
                <td className="px-5 py-3">₹{c.totalSpent.toLocaleString("en-IN")}</td>
                <td className="px-5 py-3 text-foreground/70">{new Date(c.created_at).toLocaleDateString("en-IN")}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <div className="p-8 text-center text-muted-foreground text-sm font-body">No customers yet</div>
        )}
      </div>
      <p className="text-xs text-muted-foreground font-body mt-3">{customers.length} customers</p>
    </div>
  );
};

export default AdminCustomers;
