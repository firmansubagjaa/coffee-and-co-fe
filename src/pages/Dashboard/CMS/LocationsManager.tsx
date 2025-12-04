import React, { useState } from "react";
import { Store, Plus, Search, Phone, Edit2, Trash2, Clock } from "lucide-react";
import { Button } from "../../../components/common/Button";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import { toast } from "sonner";
import { useLanguage } from "../../../contexts/LanguageContext";
import { useNavigate } from "react-router-dom";
import { MOCK_LOCATIONS, Location } from "../../../data/mockLocations";

export const LocationsManager: React.FC = () => {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<Location[]>(MOCK_LOCATIONS);
  const [search, setSearch] = useState("");

  const filteredLocations = locations.filter(
    (l) =>
      l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.address.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    setLocations((prev) => prev.filter((l) => l.id !== id));
    toast.success(t("dashboard.locations.toast.removed"));
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-coffee-900 dark:text-white flex items-center gap-3">
            <Store className="w-8 h-8 text-coffee-600 dark:text-coffee-400" />
            {t("dashboard.locations.title")}
          </h1>
          <p className="text-coffee-500 dark:text-coffee-400 mt-1">
            {t("dashboard.locations.subtitle")}
          </p>
        </div>
        <Button
          onClick={() => navigate("/dashboard/cms/locations/new")}
          className="gap-2 shadow-lg"
        >
          <Plus className="w-4 h-4" /> {t("dashboard.locations.addLocation")}
        </Button>
      </div>

      <div className="bg-white dark:bg-coffee-900 rounded-[2rem] border border-coffee-100 dark:border-coffee-800 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-coffee-100 dark:border-coffee-800">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-coffee-400 dark:text-coffee-500" />
            <Input
              placeholder={t("dashboard.locations.searchPlaceholder")}
              className="pl-10 bg-white dark:bg-coffee-800 border-coffee-200 dark:border-coffee-700"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-coffee-50/50 dark:bg-coffee-800/50 text-coffee-500 dark:text-coffee-400 font-bold uppercase tracking-wider border-b border-coffee-100 dark:border-coffee-800">
              <tr>
                <th className="px-6 py-4">
                  {t("dashboard.locations.table.storeName")}
                </th>
                <th className="px-6 py-4">
                  {t("dashboard.locations.table.address")}
                </th>
                <th className="px-6 py-4">
                  {t("dashboard.locations.table.contact")}
                </th>
                <th className="px-6 py-4">
                  {t("dashboard.locations.table.status")}
                </th>
                <th className="px-6 py-4 text-right">
                  {t("dashboard.locations.table.actions")}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-coffee-50 dark:divide-coffee-800">
              {filteredLocations.map((loc) => (
                <tr
                  key={loc.id}
                  className="hover:bg-coffee-50/30 dark:hover:bg-coffee-800/30 transition-colors"
                >
                  <td className="px-6 py-4">
                    <p className="font-bold text-coffee-900 dark:text-white">
                      {loc.name}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-coffee-500 dark:text-coffee-400 mt-1">
                      <Clock className="w-3 h-3" /> {loc.hours}
                    </div>
                  </td>
                  <td
                    className="px-6 py-4 text-coffee-700 dark:text-coffee-300 max-w-xs truncate"
                    title={loc.address}
                  >
                    {loc.address}
                  </td>
                  <td className="px-6 py-4 text-coffee-600 dark:text-coffee-400 flex items-center gap-1">
                    <Phone className="w-3 h-3" /> {loc.phone}
                  </td>
                  <td className="px-6 py-4">
                    <Badge
                      variant={
                        loc.status === "Open"
                          ? "success"
                          : loc.status === "Renovation"
                          ? "warning"
                          : "neutral"
                      }
                    >
                      {loc.status === "Open"
                        ? t("dashboard.locations.status.open")
                        : loc.status === "Renovation"
                        ? t("dashboard.locations.status.renovation")
                        : t("dashboard.locations.status.comingSoon")}
                    </Badge>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() =>
                          navigate(`/dashboard/cms/locations/${loc.id}`, {
                            state: loc,
                          })
                        }
                        className="p-2 text-coffee-400 dark:text-coffee-500 hover:text-coffee-900 dark:hover:text-white hover:bg-coffee-100 dark:hover:bg-coffee-800 rounded-lg"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(loc.id)}
                        className="p-2 text-coffee-400 dark:text-coffee-500 hover:text-error hover:bg-error/10 dark:hover:bg-error/20 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
