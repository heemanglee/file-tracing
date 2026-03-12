import type { TraceResponse } from "../api/trace";
import StageCard from "./StageCard";
import OriginalFile from "./OriginalFile";
import ExtractedText from "./ExtractedText";
import ChunkList from "./ChunkList";

interface Props {
  data: TraceResponse;
}

function TraceResult({ data }: Props): React.ReactElement {
  const { knowledge_hub, file_ingress, opensearch } = data.stages;

  return (
    <div className="mt-8 space-y-4">
      <div className="text-sm text-gray-500 font-mono mb-2">
        file_unique_id: <span className="text-gray-900 font-semibold">{data.file_unique_id}</span>
      </div>

      {/* Pipeline visualization */}
      <div className="flex items-center gap-2 mb-6 text-xs text-gray-400">
        <span className={`px-2 py-1 rounded ${knowledge_hub.status === "found" ? "bg-green-100 text-green-700" : knowledge_hub.status === "error" ? "bg-red-100 text-red-700" : "bg-gray-100"}`}>
          knowledge-hub
        </span>
        <span>→</span>
        <span className={`px-2 py-1 rounded ${file_ingress.status === "found" ? "bg-green-100 text-green-700" : file_ingress.status === "error" ? "bg-red-100 text-red-700" : "bg-gray-100"}`}>
          file-ingress
        </span>
        <span>→</span>
        <span className={`px-2 py-1 rounded ${opensearch.status === "found" ? "bg-green-100 text-green-700" : opensearch.status === "error" ? "bg-red-100 text-red-700" : "bg-gray-100"}`}>
          OpenSearch
        </span>
      </div>

      <StageCard step={1} title="knowledge-hub" subtitle="Original file metadata" status={knowledge_hub.status} error={knowledge_hub.error}>
        {knowledge_hub.data && <OriginalFile data={knowledge_hub.data} />}
      </StageCard>

      <StageCard step={2} title="file-ingress" subtitle="Text extraction" status={file_ingress.status} error={file_ingress.error}>
        {file_ingress.data && <ExtractedText data={file_ingress.data} />}
      </StageCard>

      <StageCard step={3} title="OpenSearch" subtitle="Indexed chunks" status={opensearch.status} error={opensearch.error}>
        <ChunkList totalChunks={opensearch.total_chunks} chunks={opensearch.chunks} />
      </StageCard>
    </div>
  );
}

export default TraceResult;
