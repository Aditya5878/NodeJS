export enum UserRole {
  ADMIN = "admin",
  PROJECT_ADMIN = "project_admin",
  MEMBER = "member"
}

export const AvailableUserRoles = Object.values(UserRole) as UserRole[];


export enum TaskStatus {
    TODO = "todo",
    IN_PROGRESS = "in_progress",
    DONE = "done"
}

export const AvailableTaskStatus = Object.values(TaskStatus) as TaskStatus[];