import { useEffect, useState } from "react";
import { fetchTrace, fetchAvailableEnvs, type TraceResponse } from "./api/trace";
import SearchInput from "./components/SearchInput";
import TraceResult from "./components/TraceResult";
import EnvSelector, { getStoredEnv, type EnvName } from "./components/EnvSelector";

function App(): React.ReactElement {
  const [env, setEnv] = useState<EnvName>(getStoredEnv);
  const [availableEnvs, setAvailableEnvs] = useState<EnvName[]>(["dev"]);
  const [result, setResult] = useState<TraceResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvailableEnvs().then((envs) => setAvailableEnvs(envs as EnvName[]));
  }, []);

  const handleSearch = async (fileUniqueId: string): Promise<void> => {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await fetchTrace(fileUniqueId, env);
      setResult(data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">File Tracer</h1>
          <EnvSelector value={env} onChange={setEnv} availableEnvs={availableEnvs} />
        </div>
        <SearchInput onSearch={handleSearch} loading={loading} />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
            {error}
          </div>
        )}

        {loading && (
          <div className="mt-8 text-center text-gray-500">Loading...</div>
        )}

        {result && !loading && <TraceResult data={result} />}
      </div>
    </div>
  );
}

export default App;
