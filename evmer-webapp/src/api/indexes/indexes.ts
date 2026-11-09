import type { PageableProps } from "../../scripts/Types";
import { getRequest } from "../ApiFunctions";
import type { Assignment } from "../assignments/assignments";
import type { Calibration, Equipment } from "../equipments/equipments";
import type { Reservation } from "../reservations/reservations";
import type { LoginResponse } from "../users/users";


export interface DashboardData {
  equipments: Equipment[];
  users: LoginResponse[];
  assignments: Assignment[];
  reservations: Reservation[];
}

export interface PageResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface Activities {
  id: number;
  equipmentName: string;
  eventType: string;
  oldValue: string;
  newValue: string;
  performedAt: string;
  note: string;

}

export type IndexSummary = {
  numTotalEquipment: number;
  numAssignedEquipment: number;
  numAvailableEquipment: number;
  numBrokenEquipment: number;
};

function toSpringPageParams(obj: PageableProps) {
  return {
    page: obj.page,
    size: obj.size,
    sort: `${obj.sortBy},${obj.ascending ? "asc" : "desc"}`,
  };
}

export async function getIndexSummary() {
  return await getRequest<IndexSummary>("/index/summary");
}

export async function getIndexAssignments(obj: PageableProps) {
  return await getRequest<PageResponse<Assignment>>(
    "/index/assignments",
    toSpringPageParams(obj),
  );
}

export async function getIndexReservations(obj: PageableProps) {
  return await getRequest<PageResponse<Reservation>>(
    "/index/reservations",
    toSpringPageParams(obj),
  );
}

export async function getIndexCalibrations(obj: PageableProps) {
  return await getRequest<PageResponse<Calibration>>(
    "/index/calibrations",
    toSpringPageParams(obj),
  );
}

export async function getIndexActivities(obj: PageableProps) {
  return await getRequest<PageResponse<Activities>>(
    "/index/activities",
    toSpringPageParams(obj),
  );
}
