import { useState } from "react";

interface Props {
  onSearch: (fileUniqueId: string) => void;
  loading: boolean;
}

function SearchInput({ onSearch, loading }: Props): React.ReactElement {
  const [value, setValue] = useState("");

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const trimmed = value.trim();
    if (trimmed) {
      onSearch(trimmed);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-3">
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="file_unique_id (UUID)"
        className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono"
        disabled={loading}
      />
      <button
        type="submit"
        disabled={loading || !value.trim()}
        className="px-6 py-2.5 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        {loading ? "..." : "Trace"}
      </button>
    </form>
  );
}

export default SearchInput;
