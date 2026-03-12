interface Props {
  step: number;
  title: string;
  subtitle: string;
  status: "found" | "not_found" | "error";
  error?: string;
  children: React.ReactNode;
}

const statusColors = {
  found: "border-green-300 bg-green-50",
  not_found: "border-gray-300 bg-gray-50",
  error: "border-red-300 bg-red-50",
};

const statusBadge = {
  found: "bg-green-100 text-green-800",
  not_found: "bg-gray-100 text-gray-600",
  error: "bg-red-100 text-red-800",
};

const statusLabel = {
  found: "Found",
  not_found: "Not Found",
  error: "Error",
};

function StageCard({ step, title, subtitle, status, error, children }: Props): React.ReactElement {
  return (
    <div className={`border rounded-lg p-5 ${statusColors[status]}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span className="flex items-center justify-center w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold">
            {step}
          </span>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{title}</h3>
            <p className="text-xs text-gray-500">{subtitle}</p>
          </div>
        </div>
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${statusBadge[status]}`}>
          {statusLabel[status]}
        </span>
      </div>
      {status === "error" && error && (
        <p className="mt-2 text-xs text-red-700 font-mono break-all">{error}</p>
      )}
      {status === "found" && <div className="mt-3">{children}</div>}
    </div>
  );
}

export default StageCard;
