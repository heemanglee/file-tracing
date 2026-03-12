import type { KnowledgeHubData } from "../api/trace";

interface Props {
  data: KnowledgeHubData;
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function Field({ label, value }: { label: string; value: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-500 min-w-[140px] shrink-0">{label}</span>
      <span className="text-gray-900 break-all">{value ?? "-"}</span>
    </div>
  );
}

function OriginalFile({ data }: Props): React.ReactElement {
  return (
    <div className="space-y-2">
      <Field label="Filename" value={data.filename} />
      <Field label="Content Type" value={data.content_type} />
      <Field label="Size" value={formatBytes(data.size)} />
      <Field label="S3 Key" value={<span className="font-mono text-xs">{data.s3_key}</span>} />
      <Field label="Processing Status" value={
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          data.processing_status?.includes("success")
            ? "bg-green-100 text-green-800"
            : data.processing_status?.includes("error")
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
        }`}>
          {data.processing_status ?? "N/A"}
        </span>
      } />
      <Field label="Workspace" value={data.workspace_id} />
      <Field label="User" value={data.user_email ?? data.user_name} />
      <Field label="Upload Mode" value={data.upload_mode} />
      <Field label="Visibility" value={data.visibility} />
      <Field label="Deleted" value={data.is_deleted ? "Yes" : "No"} />
      <Field label="Created" value={data.created_at} />
      <Field label="Updated" value={data.updated_at} />

      {data.presigned_url && (
        <a
          href={data.presigned_url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-2 px-3 py-1.5 bg-blue-600 text-white rounded text-xs font-medium hover:bg-blue-700 transition-colors"
        >
          Download Original
        </a>
      )}
    </div>
  );
}

export default OriginalFile;
