import { useState } from "react";
import type { FileIngressData } from "../api/trace";

interface Props {
  data: FileIngressData;
}

function Field({ label, value }: { label: string; value: React.ReactNode }): React.ReactElement {
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-gray-500 min-w-[140px] shrink-0">{label}</span>
      <span className="text-gray-900 break-all">{value ?? "-"}</span>
    </div>
  );
}

function ExtractedText({ data }: Props): React.ReactElement {
  const [showText, setShowText] = useState(false);

  return (
    <div className="space-y-2">
      <Field label="Status" value={
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${
          data.status === "completed"
            ? "bg-green-100 text-green-800"
            : data.status === "failed"
              ? "bg-red-100 text-red-800"
              : "bg-yellow-100 text-yellow-800"
        }`}>
          {data.status}
        </span>
      } />
      <Field label="S3 URI" value={<span className="font-mono text-xs">{data.s3_uri}</span>} />
      <Field label="File Name" value={data.file_name} />
      <Field label="MIME Type" value={data.mime_type} />
      <Field label="Text Length" value={data.text_length != null ? `${data.text_length.toLocaleString()} chars` : "-"} />
      <Field label="Processing Time" value={data.processing_time_ms != null ? `${(data.processing_time_ms / 1000).toFixed(1)}s` : "-"} />
      <Field label="User Email" value={data.user_email} />
      <Field label="Created" value={data.created_at} />

      {data.error_message && (
        <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm">
          <div className="font-medium text-red-800 mb-1">
            Error ({data.error_type} / {data.error_service})
          </div>
          <div className="text-red-700 text-xs">{data.error_message}</div>
        </div>
      )}

      {data.extracted_text_content && (
        <div className="mt-3">
          <button
            onClick={() => setShowText(!showText)}
            className="px-3 py-1.5 bg-gray-700 text-white rounded text-xs font-medium hover:bg-gray-800 transition-colors"
          >
            {showText ? "Hide Text" : "Show Extracted Text"}
          </button>
          {showText && (
            <pre className="mt-2 p-3 bg-white border border-gray-200 rounded text-xs text-gray-800 max-h-96 overflow-auto whitespace-pre-wrap font-mono">
              {data.extracted_text_content}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}

export default ExtractedText;
