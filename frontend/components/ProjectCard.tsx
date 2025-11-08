import Link from "next/link";

export interface ProjectCardProps {
  id: string;
  name: string;
  description: string;
  manager: string;
  managerPhoto?: string;
  status: "Planned" | "In Progress" | "Completed" | "On Hold";
  priority?: "Low" | "Medium" | "High" | "Critical";
  progress: number;
  coverImage?: string;
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
  managerPhoto,
  status,
  priority,
  progress,
  coverImage,
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

  const getProgressBarColor = () => {
    if (progress >= 75) return "bg-[#16A34A]"; // green
    if (progress >= 50) return "bg-[#2563EB]"; // blue
    if (progress >= 25) return "bg-[#F59E0B]"; // amber
    return "bg-[#DC2626]"; // red
  };

  const getPriorityBadgeClass = () => {
    switch (priority) {
      case "Critical":
        return "badge-error";
      case "High":
        return "badge-warning";
      case "Medium":
        return "badge-info";
      case "Low":
        return "badge-neutral";
      default:
        return "badge-ghost";
    }
  };

  const getPriorityIcon = () => {
    switch (priority) {
      case "Critical":
        return "🔥";
      case "High":
        return "⚡";
      case "Medium":
        return "⚠️";
      case "Low":
        return "📌";
      default:
        return "";
    }
  };

  const isOverdue = new Date(deadline) < new Date() && status !== "Completed";

  return (
    <div className="card bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      {/* Cover Image */}
      {coverImage && (
        <figure className="h-40 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={name}
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      
      <div className="card-body">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="text-lg font-semibold text-[#1E293B]">{name}</h3>
          <div className="flex gap-1 flex-wrap">
            <span className={`badge ${getStatusBadgeClass()}`}>{status}</span>
            {priority && (
              <span className={`badge badge-sm ${getPriorityBadgeClass()}`}>
                {getPriorityIcon()} {priority}
              </span>
            )}
          </div>
        </div>

        <p className="text-sm mb-4 text-[#64748B] leading-relaxed line-clamp-3">{description}</p>

        <div className="space-y-3">
          {/* Manager and Team */}
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {managerPhoto ? (
                <div className="avatar">
                  <div className="w-6 h-6 rounded-full ring-2 ring-blue-500">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={managerPhoto} alt={manager} />
                  </div>
                </div>
              ) : (
                <div className="avatar placeholder">
                  <div className="w-6 h-6 rounded-full bg-blue-500 text-white">
                    <span className="text-xs">{manager[0]?.toUpperCase()}</span>
                  </div>
                </div>
              )}
              <span className="text-[#1E293B] font-medium">{manager}</span>
            </div>
            {teamSize && (
              <span className="text-[#64748B]">
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
                  className="h-4 w-4 text-[#64748B]"
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
                <span className="text-[#1E293B]">Tasks</span>
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
                className="h-4 w-4 text-[#64748B]"
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
              <span className="text-[#1E293B]">Deadline</span>
            </div>
            <span className={`font-medium ${isOverdue ? "text-error" : "text-[#1E293B]"}`}>
              {new Date(deadline).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
              {isOverdue && (
                <span className="ml-1 text-error text-xs font-semibold">(Overdue)</span>
              )}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-[#1E293B] font-medium">Progress</span>
              <span className="text-[#2563EB] font-semibold">{progress}%</span>
            </div>
            <div className="h-2 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
              <div className={`h-full ${getProgressBarColor()} transition-all duration-500`} style={{ width: `${progress}%` }} />
            </div>
          </div>
        </div>

  <div className="card-actions mt-4 flex flex-wrap gap-2">
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
