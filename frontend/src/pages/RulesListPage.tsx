// src/pages/RulesListPage.tsx
import React, { useEffect, useState } from "react";
import { getRules } from "../api/rules";
import type { Rule } from "../types/rule";

const RulesListPage: React.FC = () => {
  const [rules, setRules] = useState<Rule[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getRules({ page: 1, limit: 20 });
        setRules(data.items);
      } catch (err) {
        console.error("Failed to load rules:", err);
        setError("Failed to load rules. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  return (
    <div className="space-y-4">
      {/* Page title */}
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="text-lg md:text-xl font-semibold text-slate-900">
            Rules
          </h2>
          <p className="text-sm text-slate-500">
            View and manage your business rules.
          </p>
        </div>

        {/* Tiny placeholder button (no click logic yet) */}
        <button className="inline-flex items-center gap-1 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white text-sm px-3 py-1.5 shadow-sm transition">
          <span className="text-base leading-none">＋</span>
          <span>Create Rule</span>
        </button>
      </div>

      {/* Status / loading / error */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700 flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
          Loading rules…
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {!loading && !error && (
        <>
          {/* Summary */}
          <div className="text-sm text-slate-600">
            {rules.length === 0 ? (
              <span>No rules found. Create your first rule to get started.</span>
            ) : (
              <span>
                Found{" "}
                <span className="font-semibold text-slate-900">
                  {rules.length}
                </span>{" "}
                rule{rules.length > 1 ? "s" : ""}.
              </span>
            )}
          </div>

          {/* List */}
          {rules.length > 0 && (
            <div className="mt-2">
              <div className="overflow-hidden rounded-2xl border border-slate-200/90 shadow-sm bg-slate-50">
                <table className="min-w-full border-collapse text-sm">
                  <thead className="bg-slate-100">
                    <tr className="text-left text-slate-600">
                      <th className="px-4 py-2.5 font-medium">Name</th>
                      <th className="px-4 py-2.5 font-medium">Priority</th>
                      <th className="px-4 py-2.5 font-medium">Active</th>
                      <th className="px-4 py-2.5 font-medium">Conditions</th>
                      <th className="px-4 py-2.5 font-medium hidden md:table-cell">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rules.map((rule) => (
                      <tr
                        key={rule._id}
                        className="border-t border-slate-200/80 bg-white hover:bg-indigo-50/40 transition"
                      >
                        {/* Name + description */}
                        <td className="px-4 py-3 align-top">
                          <div className="font-medium text-slate-900">
                            {rule.name}
                          </div>
                          {rule.description && (
                            <div className="text-xs text-slate-500 mt-0.5 line-clamp-2">
                              {rule.description}
                            </div>
                          )}
                          {rule.tags && rule.tags.length > 0 && (
                            <div className="mt-1 flex flex-wrap gap-1">
                              {rule.tags.map((tag) => (
                                <span
                                  key={tag}
                                  className="inline-flex items-center rounded-full bg-indigo-50 text-indigo-700 border border-indigo-100 px-2 py-0.5 text-[11px] font-medium"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          )}
                        </td>

                        {/* Priority */}
                        <td className="px-4 py-3 align-top">
                          <span className="inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-2.5 py-0.5 text-xs font-medium text-slate-700">
                            {rule.priority ?? 0}
                          </span>
                        </td>

                        {/* Active */}
                        <td className="px-4 py-3 align-top">
                          {rule.active ? (
                            <span className="inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 px-2.5 py-0.5 text-xs font-medium">
                              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-emerald-500" />
                              Active
                            </span>
                          ) : (
                            <span className="inline-flex items-center rounded-full bg-slate-100 text-slate-500 border border-slate-200 px-2.5 py-0.5 text-xs font-medium">
                              <span className="mr-1 h-1.5 w-1.5 rounded-full bg-slate-400" />
                              Inactive
                            </span>
                          )}
                        </td>

                        {/* Conditions count */}
                        <td className="px-4 py-3 align-top text-xs text-slate-600">
                          {rule.conditions?.length ?? 0} condition
                          {(rule.conditions?.length ?? 0) === 1 ? "" : "s"}
                        </td>

                        {/* Action summary */}
                        <td className="px-4 py-3 align-top text-xs text-slate-600 hidden md:table-cell">
                          {rule.action && typeof rule.action === "object" ? (
                            <div>
                              <div className="font-medium text-slate-800">
                                {rule.action.type ?? "action"}
                              </div>
                              {"value" in rule.action && (
                                <div className="text-slate-500">
                                  value:{" "}
                                  <span className="font-mono">
                                    {String(rule.action.value)}
                                  </span>
                                </div>
                              )}
                            </div>
                          ) : (
                            <span className="text-slate-400 italic">
                              (no action summary)
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RulesListPage;
