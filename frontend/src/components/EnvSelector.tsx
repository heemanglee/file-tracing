export type EnvName = "local" | "dev" | "prod";

const ENV_CONFIG: Record<EnvName, { label: string; color: string; bgColor: string; borderColor: string }> = {
  local: { label: "Local", color: "text-gray-700", bgColor: "bg-gray-100", borderColor: "border-gray-300" },
  dev: { label: "Dev", color: "text-blue-700", bgColor: "bg-blue-50", borderColor: "border-blue-300" },
  prod: { label: "Production", color: "text-red-700", bgColor: "bg-red-50", borderColor: "border-red-300" },
};

const STORAGE_KEY = "file-tracer-env";

interface Props {
  value: EnvName;
  onChange: (env: EnvName) => void;
  availableEnvs: EnvName[];
}

function EnvSelector({ value, onChange, availableEnvs }: Props): React.ReactElement {
  const config = ENV_CONFIG[value];

  return (
    <div className="flex items-center gap-2">
      <select
        value={value}
        onChange={(e) => {
          const env = e.target.value as EnvName;
          onChange(env);
          localStorage.setItem(STORAGE_KEY, env);
        }}
        className={`px-3 py-2.5 rounded-lg text-sm font-medium border ${config.bgColor} ${config.borderColor} ${config.color} focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer`}
      >
        {(["local", "dev", "prod"] as EnvName[]).map((env) => (
          <option key={env} value={env} disabled={!availableEnvs.includes(env)}>
            {ENV_CONFIG[env].label}{!availableEnvs.includes(env) ? " (unavailable)" : ""}
          </option>
        ))}
      </select>
    </div>
  );
}

export function getStoredEnv(): EnvName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "local" || stored === "dev" || stored === "prod") {
    return stored;
  }
  return "dev";
}

export default EnvSelector;
