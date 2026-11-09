import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { useEffect, useState } from "react";
import { type PageableProps } from "../scripts/Types";
import { Table } from "../components/Tables/Table";
import {
  getActiveAssignments,
  getAssignmentHistory,
  type FilterHistoryAssignments,
  type FilterActiveAssignments,
  type AssignmentPage,
  type ActiveAssignmentResponse,
  type HistoryAssignmentResponse,
} from "../api/assignments/assignments";
import { useToastStore } from "../api/ToastStore";
import { ActiveAssignmentFilter } from "../components/Filters/ActiveAssignmentFilter";
import { HistoryAssignmentFilter } from "../components/Filters/HistoryAssignmentFilter";

export const AssignmentV = () => {
  const [assignments, setAssignments] =
    useState<AssignmentPage<ActiveAssignmentResponse>>();
  const [assignmentHistory, setAssignmentHistory] =
    useState<AssignmentPage<HistoryAssignmentResponse>>();
  const [historyAssignments, setHistoryAssignments] = useState<boolean>(false);
  const [needFilter, setNeedFilter] = useState<FilterActiveAssignments | null>(
    null,
  );
  const [needHistoryFilter, setNeedHistoryFilter] =
    useState<FilterHistoryAssignments | null>(null);
  const showToast = useToastStore((state) => state.showToast);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getActiveAssignments({
          page: 0,
          sortBy: "id",
          ascending: true,
          size: 5,
          request: null,
        });

        setAssignments(response);
      } catch (error) {
        console.log(error);
      }
    };

    loadData();
  }, []);

  const ChangePage = async (obj: PageableProps) => {
    try {
      if (historyAssignments) {
        const pageData = await getAssignmentHistory({
          ...obj,
          ...needHistoryFilter,
        });
        setAssignmentHistory(pageData);
      } else {
        const pageData = await getActiveAssignments({ ...obj, ...needFilter });
        setAssignments(pageData);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const changeAssignmentTable = async (isHistory: boolean) => {
    try {
      const request = {
        page: 0,
        sortBy: "id",
        ascending: true,
        size: 5,
        request: null,
      };

      if (isHistory) {
        setAssignmentHistory(await getAssignmentHistory(request));
      } else {
        setAssignments(await getActiveAssignments(request));
      }
      setHistoryAssignments(isHistory);
    } catch (error) {
      console.log(error);
    }
  };

  const loadData = async () => {
    try {
      const request = {
        page: 0,
        size: 5,
        sortBy: "id",
        ascending: true,
        request: null,
      };

      if (historyAssignments) {
        setAssignmentHistory(await getAssignmentHistory(request));
      } else {
        setAssignments(await getActiveAssignments(request));
      }

      if (historyAssignments) {
        setNeedHistoryFilter(null);
      } else {
        setNeedFilter(null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const FilterItems = async (data: FilterActiveAssignments) => {
    const newFilter = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== ""),
    ) as FilterActiveAssignments;

    setNeedFilter(newFilter);

    try {
      const res = await getActiveAssignments({
        page: 0,
        size: 5,
        sortBy: "id",
        ascending: true,
        request: null,
        ...newFilter,
      });

      console.log("FILTER RESPONSE:", res);

      setAssignments(res);

      if (res.content.length > 0) {
        showToast("Uspešno izvršeno filtriranje!", "success");
      } else {
        showToast("Nema traženih podataka", "error");
      }
    } catch (error) {
      console.log("FILTER ERROR:", error);
    }
  };

  const FilterHistoryItems = async (data: FilterHistoryAssignments) => {
    const newFilter = Object.fromEntries(
      Object.entries(data).filter(([, value]) => value !== ""),
    ) as FilterHistoryAssignments;

    console.log("NEW HISTORY FILTER:", newFilter);

    setNeedHistoryFilter(newFilter);

    try {
      const res = await getAssignmentHistory({
        page: 0,
        size: 5,
        sortBy: "id",
        ascending: true,
        request: null,
        ...newFilter,
      });


      setAssignmentHistory(res);

      if (res.content.length > 0) {
        showToast("Uspešno izvršeno filtriranje!", "success");
      } else {
        showToast("Nema traženih podataka", "error");
      }
    } catch (error) {
      console.log("HISTORY FILTER ERROR:", error);
    }
  };

  return (
    <div className="app-shell">
      <Header />
      <div className="app-layout">
        <AsideBar />
        <main className="app-main">
          <h1 className="page-title">Zaduženja</h1>
          <div className="mb-8 flex justify-end gap-2 border-b border-slate-200">
            <button
              onClick={() => changeAssignmentTable(false)}
              className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
                !historyAssignments
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Aktivna zaduženja
            </button>

            <button
              onClick={() => changeAssignmentTable(true)}
              className={`px-5 py-2.5 text-sm font-medium transition-all duration-200 border-b-2 ${
                historyAssignments
                  ? "border-brand-600 text-brand-700"
                  : "border-transparent text-slate-500 hover:text-slate-700"
              }`}
            >
              Istorija zaduženja
            </button>
          </div>
          <div className="space-y-6">
            {assignmentHistory && historyAssignments ? (
              <div>
                <HistoryAssignmentFilter
                  FilterItems={FilterHistoryItems}
                  ResetItems={loadData}
                />
                <Table
                  data={assignmentHistory.content}
                  labels={{
                    id: "ID zaduženja",
                    userUsername: "Korisničko ime",
                    userFirstName: "Ime",
                    userLastName: "Prezime",
                    equipmentName: "Naziv opreme",
                    accessories: "Dodatna oprema",
                    eventType: "Tip događaja",
                    oldValue: "Stara vrednost",
                    newValue: "Nova vrednost",
                    performedAt: "Odradjeno",
                    note: "Napomena",
                  }}
                  tableType="assignment"
                  changePageFunction={ChangePage}
                  totalPageNumber={assignmentHistory.totalPages}
                />
              </div>
            ) : !historyAssignments && assignments ? (
              <div>
                <ActiveAssignmentFilter
                  FilterItems={FilterItems}
                  ResetItems={loadData}
                />
                <Table
                  data={assignments.content}
                  labels={{
                    id: "ID Zaduženja",
                    userUsername: "Korisničko ime",
                    userFirstName: "Ime",
                    userLastName: "Prezime",
                    equipmentName: "Naziv opreme",
                    projectOrTask: "Projekat ili zadatak",
                    assignedAt: "Zaduzeno",
                    accessories: "Dodatna oprema",
                    assignmentNote: "Napomena",
                  }}
                  tableType="assignment"
                  changePageFunction={ChangePage}
                  totalPageNumber={assignments.totalPages}
                />
              </div>
            ) : null}
          </div>
        </main>
      </div>
      <Footer />
    </div>
  );
};
