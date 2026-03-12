export interface KnowledgeHubData {
  id: string;
  filename: string;
  content_type: string;
  size: number;
  s3_key: string;
  workspace_id: string | null;
  processing_status: string | null;
  processing_status_code: number | null;
  processing_message: string | null;
  processing_updated_at: string | null;
  user_email: string | null;
  user_name: string | null;
  upload_mode: string;
  visibility: string;
  is_deleted: boolean;
  created_at: string;
  updated_at: string;
  presigned_url: string | null;
}

export interface FileIngressData {
  id: string;
  job_id: string;
  file_unique_id: string;
  etag: string;
  s3_uri: string;
  file_name: string | null;
  file_size: number | null;
  mime_type: string | null;
  status: string;
  text_length: number | null;
  processing_time_ms: number | null;
  extracted_text_s3_uri: string | null;
  extracted_text_content: string | null;
  error_type: string | null;
  error_service: string | null;
  error_message: string | null;
  user_email: string;
  correlation_id: string | null;
  created_at: string;
  updated_at: string;
}

export interface OpenSearchChunk {
  file_unique_id: string;
  file_name: string;
  content: string;
  chunk_index: number;
  file_directory: string | null;
  type: string;
  time: string | null;
  status: number | null;
  acl_emails: string[];
}

export interface StageResult<T> {
  status: "found" | "not_found" | "error";
  data?: T;
  error?: string;
  total_chunks?: number;
  chunks?: OpenSearchChunk[];
}

export interface TraceResponse {
  file_unique_id: string;
  stages: {
    knowledge_hub: StageResult<KnowledgeHubData>;
    file_ingress: StageResult<FileIngressData>;
    opensearch: StageResult<null> & {
      total_chunks: number;
      chunks: OpenSearchChunk[];
    };
  };
}

export async function fetchTrace(fileUniqueId: string, env: string = "dev"): Promise<TraceResponse> {
  const res = await fetch(`/api/trace/${encodeURIComponent(fileUniqueId)}?env=${env}`);
  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

export async function fetchAvailableEnvs(): Promise<string[]> {
  const res = await fetch("/api/envs");
  if (!res.ok) {
    return ["dev"];
  }
  const data = await res.json();
  return data.envs;
}
