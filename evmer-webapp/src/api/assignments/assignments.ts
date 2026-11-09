import type { PageableProps } from "../../scripts/Types";
import { getRequest } from "../ApiFunctions";

export interface Assignment {
  id: number;
  username: string;
  userFirstName: string;
  userLastName: string;
  equipmentName: string;
  assignedAt: string;
  projectOrTask: string;
  assignmentNote: string;
  accessories: string[];
}

export interface HistoryAssignmentResponse {
  id: number;
  userUsername: string;
  userFirstName: string;
  userLastName: string;
  equipmentName: string;
  accessories: string[];
  eventType: string;
  oldValue: string;
  newValue: string;
  performedAt: Date;
  note: string;
}

export interface ActiveAssignmentResponse {
  id: number;
  userUsername: string;
  userFirstName: string;
  userLastName: string;
  equipmentName: string;
  projectOrTask: string;
  assignedAt: Date;
  accessories: string[];
  assignmentNote: string;
}

export interface FilterActiveAssignments {
  userFirstName?: string;
  userLastName?: string;
  equipmentName?: string;
  projectOrTask?: string;
  from?: string;
  to?: string;
}

export interface FilterHistoryAssignments {
  equipmentName?: string;
  userFirstName?: string;
  userLastName?: string;
  eventType?: string;
  performedAt?: string;
}

export interface AssignmentPage<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;
}

export interface AssignmentFilterProps {
  FilterItems: (data: FilterActiveAssignments) => void;
  ResetItems: () => void;
}

type AssignmentPageRequest = PageableProps &
  Partial<FilterActiveAssignments & FilterHistoryAssignments>;

function toSpringPageParams(obj: AssignmentPageRequest) {
  const filters = Object.fromEntries(
    Object.entries(obj).filter(
      ([key]) =>
        !["page", "size", "sortBy", "ascending", "table", "request"].includes(
          key,
        ),
    ),
  );

  return {
    ...filters,
    page: obj.page,
    size: obj.size,
    sort: `${obj.sortBy},${obj.ascending ? "asc" : "desc"}`,
  };
}

export async function getActiveAssignments(obj: AssignmentPageRequest) {
  return await getRequest<AssignmentPage<ActiveAssignmentResponse>>(
    "/assignments/active",
    toSpringPageParams(obj),
  );
}

export async function getAssignmentHistory(obj: AssignmentPageRequest) {
  return await getRequest<AssignmentPage<HistoryAssignmentResponse>>(
    "/assignments/history",
    toSpringPageParams(obj),
  );
}
