export type ProjectStatus =
  | "Waiting"
  | "In Progress"
  | "Done"
  | "Revision"
  | "Maintenance";

export interface Project {
  id: string;
  projectName: string;
  clientName: string;
  description: string;
  date: string;
  status: ProjectStatus;
  devNotes: string;
}
