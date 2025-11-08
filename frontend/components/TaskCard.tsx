import Link from "next/link";

export interface TaskCardProps {
  id: string;
  title: string;
  description?: string;
  project: string;
  projectId?: string;
  assignee: string;
  assigneeAvatar?: string;
  managerPhoto?: string;
  coverImage?: string;
  due: string;
  priority: "Low" | "Medium" | "High" | "Critical";
  state: "New" | "In Progress" | "Blocked" | "Done";
  tags?: string[];
  subtaskProgress?: { completed: number; total: number };
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export default function TaskCard({
  id,
  title,
  description,
  project,
  projectId,
  assignee,
  assigneeAvatar,
  managerPhoto,
  coverImage,
  due,
  priority,
  state,
  tags,
  subtaskProgress,
  onEdit,
  onDelete,
}: TaskCardProps) {
  const getStateBadgeClass = () => {
    switch (state) {
      case "Done":
        return "badge-success";
      case "In Progress":
        return "badge-primary";
      case "Blocked":
        return "badge-error";
      case "New":
        return "badge-neutral";
      default:
        return "";
    }
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
        return "";
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

  const isOverdue =
    new Date(due) < new Date() && state !== "Done" && state !== "Blocked";

  const getDueTextClass = () => {
    if (state === "Done") return "text-success";
    if (isOverdue) return "text-error";
    const daysLeft = Math.ceil(
      (new Date(due).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
    );
    if (daysLeft <= 2) return "text-warning";
    return "";
  };

  return (
    <div className="card bg-white border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all overflow-hidden">
      {/* Cover Image */}
      {coverImage && (
        <figure className="h-32 w-full overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-50">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={coverImage}
            alt={title}
            className="w-full h-full object-cover"
          />
        </figure>
      )}
      
      <div className="card-body">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="card-title text-base">{title}</h3>
          <div className="flex gap-1">
            <span className={`badge badge-sm ${getStateBadgeClass()}`}>
              {state}
            </span>
            <span className={`badge badge-sm ${getPriorityBadgeClass()}`}>
              {getPriorityIcon()} {priority}
            </span>
          </div>
        </div>

        {/* Description */}
        {description && (
          <p className="text-[#64748B] text-sm mb-3 line-clamp-2 leading-relaxed">{description}</p>
        )}

        {/* Project Link */}
        <div className="flex items-center gap-2 text-sm mb-3">
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
              d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z"
            />
          </svg>
          {projectId ? (
            <Link
              href={`/projects/${projectId}`}
              className="link link-primary text-sm"
            >
              {project}
            </Link>
          ) : (
            <span className="text-[#1E293B] text-sm">{project}</span>
          )}
        </div>

        {/* Assignee and Due Date */}
        <div className="space-y-2 mb-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              {/* Manager Photo */}
              {managerPhoto ? (
                <div className="avatar-group -space-x-3">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <div className="avatar">
                    <div className="w-6 h-6">
                      <img src={managerPhoto} alt="Manager" className="rounded-full ring-2 ring-blue-500" />
                    </div>
                  </div>
                  {assigneeAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <div className="avatar">
                      <div className="w-6 h-6">
                        <img
                          src={assigneeAvatar}
                          alt={assignee}
                          className="rounded-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="avatar placeholder">
                      <div className="w-6 h-6 rounded-full bg-[#2563EB] text-white">
                        <span className="text-xs">{assignee[0].toUpperCase()}</span>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {assigneeAvatar ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={assigneeAvatar}
                      alt={assignee}
                      className="w-5 h-5 rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-[#2563EB] text-white flex items-center justify-center text-xs font-semibold">
                      {assignee[0].toUpperCase()}
                    </div>
                  )}
                </>
              )}
              <span className="text-[#1E293B] text-xs">{assignee}</span>
            </div>
            <div
              className={`flex items-center gap-1 ${getDueTextClass()} font-medium`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
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
              <span className="text-xs">
                {new Date(due).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>

          {/* Subtask Progress */}
          {subtaskProgress && subtaskProgress.total > 0 && (
            <div>
              <div className="flex justify-between text-xs mb-1">
                <span className="text-[#64748B]">Subtasks</span>
                <span className="text-[#1E293B] font-medium">
                  {subtaskProgress.completed}/{subtaskProgress.total}
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-[#E2E8F0] overflow-hidden">
                <div
                  className="h-full bg-[#2563EB]"
                  style={{ width: `${(subtaskProgress.completed / subtaskProgress.total) * 100}%` }}
                />
              </div>
            </div>
          )}
        </div>

        {/* Tags */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {tags.map((tag, idx) => (
              <span key={idx} className="badge badge-sm badge-neutral">
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Actions */}
  <div className="card-actions justify-end">
          {onEdit && (
            <button 
              className="btn btn-ghost btn-sm"
              onClick={() => onEdit(id)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
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
          <Link href={`/tasks/${id}`} className="btn btn-primary btn-sm">
            Open
          </Link>
        </div>
      </div>
    </div>
  );
}
