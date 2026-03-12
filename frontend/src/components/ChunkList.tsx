import { useState } from "react";
import type { OpenSearchChunk } from "../api/trace";

interface Props {
  totalChunks: number;
  chunks: OpenSearchChunk[];
}

function ChunkList({ totalChunks, chunks }: Props): React.ReactElement {
  const [expandedChunks, setExpandedChunks] = useState<Set<number>>(new Set());

  const toggleChunk = (index: number): void => {
    setExpandedChunks((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  };

  const expandAll = (): void => {
    setExpandedChunks(new Set(chunks.map((_, i) => i)));
  };

  const collapseAll = (): void => {
    setExpandedChunks(new Set());
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm text-gray-600">
          Total <span className="font-semibold">{totalChunks}</span> chunks
          {chunks.length > 0 && chunks[0].type && (
            <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-800 rounded text-xs">
              {chunks[0].type}
            </span>
          )}
          {chunks.length > 0 && chunks[0].acl_emails?.length > 0 && (
            <span className="ml-2 text-xs text-gray-400">
              ACL: {chunks[0].acl_emails.join(", ")}
            </span>
          )}
        </div>
        <div className="flex gap-2">
          <button onClick={expandAll} className="text-xs text-blue-600 hover:underline">
            Expand All
          </button>
          <button onClick={collapseAll} className="text-xs text-blue-600 hover:underline">
            Collapse All
          </button>
        </div>
      </div>

      <div className="space-y-2">
        {chunks.map((chunk, i) => (
          <div key={i} className="border border-gray-200 rounded bg-white">
            <button
              onClick={() => toggleChunk(i)}
              className="w-full flex items-center justify-between px-3 py-2 text-left hover:bg-gray-50 transition-colors"
            >
              <span className="text-xs font-medium text-gray-700">
                Chunk {chunk.chunk_index}
                <span className="ml-2 text-gray-400 font-normal">
                  ({chunk.content?.length ?? 0} chars)
                </span>
              </span>
              <span className="text-gray-400 text-xs">
                {expandedChunks.has(i) ? "▲" : "▼"}
              </span>
            </button>
            {expandedChunks.has(i) && (
              <div className="px-3 pb-3 border-t border-gray-100">
                <pre className="mt-2 text-xs text-gray-800 whitespace-pre-wrap font-mono leading-relaxed">
                  {chunk.content}
                </pre>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default ChunkList;
