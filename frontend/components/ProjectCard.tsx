import Link from "next/link";

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  manager: string;
  status: "Planned" | "In Progress" | "Completed" | "On Hold";
  progress: number;
  deadline: string;
  teamSize?: number;
  tasksCompleted?: number;
  totalTasks?: number;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function ProjectCard({
  id,
  name,
  description,
  manager,
  status,
  progress,
  deadline,
  teamSize,
  tasksCompleted,
  totalTasks,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const getStatusBadgeClass = () => {
    switch (status) {
      case "Completed":
        return "badge-success";
      case "In Progress":
        return "badge-primary";
      case "Planned":
        return "badge-secondary";
      case "On Hold":
        return "badge-warning";
      default:
        return "";
    }
  };

  const getProgressColor = () => {
    if (progress >= 75) return "progress-success";
    if (progress >= 50) return "progress-primary";
    if (progress >= 25) return "progress-warning";
    return "progress-error";
  };

  const isOverdue = new Date(deadline) < new Date() && status !== "Completed";

  return (
    <div className="card card-primary hover:shadow-lg">
      <div className="card-body">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="card-title text-lg">{name}</h3>
          <span className={`badge ${getStatusBadgeClass()}`}>{status}</span>
        </div>

        <p className="text-muted text-sm mb-4">{description}</p>

        <div className="space-y-3">
          {/* Manager and Team */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              <span className="text-neutral">
                <span className="font-medium">{manager}</span>
              </span>
            </div>
            {teamSize && (
              <span className="text-muted">
                {teamSize} member{teamSize !== 1 ? "s" : ""}
              </span>
            )}
          </div>

          {/* Tasks Progress */}
          {totalTasks !== undefined && tasksCompleted !== undefined && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4 text-muted"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <span className="text-neutral">Tasks</span>
              </div>
              <span className="font-medium">
                {tasksCompleted}/{totalTasks} completed
              </span>
            </div>
          )}

          {/* Deadline */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 text-muted"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <span className="text-neutral">Deadline</span>
            </div>
            <span className={`font-medium ${isOverdue ? "text-error" : ""}`}>
              {new Date(deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {isOverdue && (
                <span className="ml-1 text-error text-xs">(Overdue)</span>
              )}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-neutral font-medium">Progress</span>
              <span className="text-primary font-semibold">{progress}%</span>
            </div>
            <div className={`progress ${getProgressColor()}`}>
              <div
                className="progress-bar"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="card-actions mt-4">
          <Link href={`/projects/${id}`} className="btn btn-primary btn-sm">
            View Details
          </Link>
          {onEdit && (
            <button 
              className="btn btn-outline btn-sm" 
              onClick={() => onEdit(id)}
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button 
              className="btn btn-error btn-outline btn-sm" 
              onClick={() => onDelete(id)}
            >
              Delete
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
