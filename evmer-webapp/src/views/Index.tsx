import { Card } from "../components/Cards/Card";
import { Header } from "../components/Headers/Header";
import { Footer } from "../components/Footers/Footer";
import { useEffect, useState } from "react";
import { type PageableProps } from "../scripts/Types";
import { Table } from "../components/Tables/Table";
import { AsideBar } from "../components/Asides/AsideButtonBar";
import { NoDataError } from "../components/Errors/NoDataError";
import {
  CalibrationStatusBadge,
  ReservationStatusBadge,
} from "../components/Badges/StatusBadge";
import {
  getIndexActivities,
  getIndexAssignments,
  getIndexCalibrations,
  getIndexReservations,
  getIndexSummary,
  type Activities,
  type IndexSummary,
  type PageResponse,
} from "../api/indexes/indexes";
import type { Assignment } from "../api/assignments/assignments";
import type { Calibration } from "../api/equipments/equipments";
import type { Reservation } from "../api/reservations/reservations";

const INITIAL_PAGE: PageableProps = {
  page: 0,
  size: 5,
  sortBy: "id",
  ascending: true,
  request: null,
};

export const IndexV = () => {
  const [summary, setSummary] = useState<IndexSummary | null>(null);
  const [assignments, setAssignments] =
    useState<PageResponse<Assignment> | null>(null);
  const [reservations, setReservations] =
    useState<PageResponse<Reservation> | null>(null);
  const [calibrations, setCalibrations] =
    useState<PageResponse<Calibration> | null>(null);
  const [activities, setActivities] =
    useState<PageResponse<Activities> | null>(null);

  useEffect(() => {
    void Promise.all([
      getIndexSummary(),
      getIndexAssignments(INITIAL_PAGE),
      getIndexReservations(INITIAL_PAGE),
      getIndexCalibrations(INITIAL_PAGE),
      getIndexActivities(INITIAL_PAGE),
    ]).then(
      ([
        summaryData,
        assignmentPage,
        reservationPage,
        calibrationPage,
        activityPage,
      ]) => {
        setSummary(summaryData);
        setAssignments(assignmentPage);
        setReservations(reservationPage);
        setCalibrations(calibrationPage);
        setActivities(activityPage);
      },
    );
  }, []);

  const changeAssignmentPage = async (obj: PageableProps) =>
    setAssignments(await getIndexAssignments(obj));

  const changeReservationPage = async (obj: PageableProps) =>
    setReservations(await getIndexReservations(obj));

  const changeCalibrationPage = async (obj: PageableProps) =>
    setCalibrations(await getIndexCalibrations(obj));

  const changeActivityPage = async (obj: PageableProps) =>
    setActivities(await getIndexActivities(obj));

  return (
    <>
      <div className="app-shell">
        <Header />
        <div className="app-layout">
          <AsideBar />
          <main className="app-main">
            <div className="mb-6">
              <h1 className="page-title">Pregled sistema</h1>
              <p className="mt-1 text-sm text-slate-500">
                Aktuelno stanje opreme, zaduženja, rezervacija i kalibracija.
              </p>
            </div>
            <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card
                title="Ukupan broj opreme"
                value={summary ? summary.numTotalEquipment : 0}
              />
              <Card
                title="Broj slobodnih stavki"
                value={summary ? summary.numAvailableEquipment : 0}
              />
              <Card
                title="Broj neispravnih stavki"
                value={summary ? summary.numBrokenEquipment : 0}
              />
              <Card
                title="Broj zauzetih stavki"
                value={summary ? summary.numAssignedEquipment : 0}
              />
            </div>

            <div>
              {assignments?.content.length ? (
                <Table
                  data={assignments.content}
                  labels={{
                    equipmentName: "Naziv Opreme",
                    assignedAt: "Datum zaduženja",
                    projectOrTask: "Projekat ili zadatak",
                    assignmentNote: "Napomena",
                  }}
                  tableType="assignment"
                  tableTitle="Tabela Zaduženja"
                  totalPageNumber={assignments.totalPages}
                  changePageFunction={changeAssignmentPage}
                />
              ) : (
                <NoDataError message="Nema podataka o zaduženjima..." />
              )}
            </div>

            <div className="mt-8 space-y-6">
              <div>
                {reservations?.content.length ? (
                  <Table
                    data={reservations.content}
                    labels={{
                      equipmentName: "Naziv Opreme",
                      userFirstName: "Ime korisnika",
                      userLastName: "Prezime Korisnika",
                      reservedAt: "datum i vreme rezervacije",
                      note: "napomena",
                    }}
                    cellRenderers={{
                      status: (status) => (
                        <ReservationStatusBadge status={status} />
                      ),
                    }}
                    tableType="reservation"
                    tableTitle="Tabela Rezervacije"
                    totalPageNumber={reservations.totalPages}
                    changePageFunction={changeReservationPage}
                  />
                ) : (
                  <NoDataError message="Nema podataka o rezervacijama..." />
                )}
              </div>
              <div>
                {calibrations?.content.length ? (
                  <Table
                    data={calibrations.content}
                    labels={{
                      name: "Naziv Opreme",
                      lastCalibration: "Poslednja kalibracija",
                      nextCalibration: "Sledeća kalibracija",
                      calibrationNote: "Napomena",
                      calibrationStatus: "Status kalibracije",
                    }}
                    cellRenderers={{
                      calibrationStatus: (status) => (
                        <CalibrationStatusBadge status={status} />
                      ),
                    }}
                    tableType="calibration"
                    tableTitle="Tabela Kalibracije"
                    totalPageNumber={calibrations.totalPages}
                    changePageFunction={changeCalibrationPage}
                  />
                ) : (
                  <NoDataError message="Nema podataka o kalibracijama..." />
                )}
              </div>
              <div>
                {activities?.content.length ? (
                  <Table
                    data={activities.content}
                    labels={{
                      equipmentName: "Naziv Opreme",
                      eventType: "Tip događaja",
                      oldValue: "Stara vrednost",
                      newValue: "Nova vrednost",
                      performedAt: "Obavljeno",
                      note: "Napomena",
                    }}
                    tableType="ACTIVITIES"
                    tableTitle="Tabela aktivnosti"
                    totalPageNumber={activities.totalPages}
                    changePageFunction={changeActivityPage}
                  />
                ) : (
                  <NoDataError message="Nema podataka o događajima..." />
                )}
              </div>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};
