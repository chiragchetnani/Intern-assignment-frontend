"use client";

import { apiFetch } from "@/components/services/api";
import { useState, useEffect } from "react";
import { ChevronDown } from "lucide-react";

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border border-neutral-800 rounded-xl bg-neutral-900/60 backdrop-blur-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 text-left text-neutral-200 hover:bg-neutral-800/60 transition rounded-t-xl"
      >
        <span className="font-semibold">{title}</span>
        <ChevronDown
          size={18}
          className={`transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 text-neutral-300 text-sm leading-relaxed">
          {children}
        </div>
      )}
    </div>
  );
}

export default function StructuredResponse({ data }: { data: any }) {
  const rawConfidence = data?.confidence_score ?? 0;
  const confidence =
    rawConfidence > 1 ? rawConfidence : Math.round(rawConfidence * 100);

  const [bookmarked, setBookmarked] = useState(
    data?.isBookmarked || false
  );

  useEffect(() => {
    setBookmarked(data?.isBookmarked || false);
  }, [data]);

  const confidenceColor =
    confidence >= 80
      ? "bg-green-500"
      : confidence >= 50
      ? "bg-yellow-500"
      : "bg-red-500";

  const toggleBookmark = async () => {
    try {
      await apiFetch(`/chat/bookmark/${data.messageId}`, {
        method: "PATCH",
      });
      setBookmarked(!bookmarked);
    } catch (err) {
      console.error(err);
    }
  };

  const downloadPDF = () => {
    window.print();
  };

  return (
    <div className="space-y-6 print-area">

      {/* Actions */}
      <div className="flex justify-between items-center">
        <div className="flex gap-3">
          <button
            onClick={toggleBookmark}
            className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-sm transition"
          >
            {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
          </button>

          <button
            onClick={downloadPDF}
            className="px-3 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-sm transition"
          >
            Download PDF
          </button>
        </div>
      </div>

      {/* Conflict */}
      {data?.conflicts_detected && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
          ⚠ Conflict detected in legal sources. Review carefully.
        </div>
      )}

      {/* Confidence */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-neutral-400">
          <span>Confidence Score</span>
          <span className="font-semibold text-neutral-200">
            {confidence}%
          </span>
        </div>

        <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${confidenceColor} transition-all duration-500`}
            style={{ width: `${confidence}%` }}
          />
        </div>
      </div>

      {/* Issue Summary */}
      <Section title="Issue Summary">
        <p>{data?.issue_summary}</p>
      </Section>

      {/* Relevant Legal Provisions */}
      <Section title="Relevant Legal Provisions">
        {data?.relevant_legal_provisions?.map(
          (item: any, index: number) => (
            <div key={index} className="mb-4">
              <p className="font-semibold text-neutral-200">
                {item.act_name ?? "Unknown Act"}{" "}
                {item.section && `– ${item.section}`}
              </p>
              <p className="text-neutral-400 mt-1">
                {item.explanation ||
                  item.description ||
                  "No explanation available."}
              </p>
            </div>
          )
        )}
      </Section>

      {/* Applicable Sections */}
      <Section title="Applicable Sections">
        <div className="space-y-4">
          {data?.applicable_sections?.map(
            (sec: any, index: number) => {
              if (typeof sec === "string") {
                return (
                  <p key={index} className="text-neutral-400">
                    {sec}
                  </p>
                );
              }

              return (
                <div
                  key={index}
                  className="border-b border-neutral-800 pb-3"
                >
                  <p className="font-semibold text-neutral-200">
                    {sec.section_number ?? "N/A"} –{" "}
                    {sec.section_title ?? "Untitled"}
                  </p>
                  <p className="text-neutral-400 text-sm mt-1">
                    {sec.section_summary ??
                      "No summary available."}
                  </p>
                </div>
              );
            }
          )}
        </div>
      </Section>

      {/* Case References */}
      <Section title="Case References">
        {data?.case_references?.map(
          (c: any, index: number) => (
            <div key={index} className="mb-4">
              <p className="font-semibold text-neutral-200">
                {c.case_name ||
                  c.case_title ||
                  "Unknown Case"}
              </p>

              {c.court && (
                <p className="text-neutral-500 text-sm">
                  {c.court}{" "}
                  {c.year && `(${c.year})`}
                </p>
              )}

              <p className="text-neutral-400 mt-1">
                {c.citation_reference ||
                  c.holding_summary ||
                  ""}
              </p>
            </div>
          )
        )}
      </Section>

      {/* Key Observations */}
      <Section title="Key Observations">
        <ul className="list-disc pl-5 space-y-1 text-neutral-400">
          {data?.key_observations?.map(
            (obs: string, index: number) => (
              <li key={index}>{obs}</li>
            )
          )}
        </ul>
      </Section>

      {/* Legal Interpretation */}
      <Section title="Legal Interpretation">
        <p className="text-neutral-400">
          {data?.legal_interpretation}
        </p>
      </Section>

      {/* Precedents */}
      <Section title="Precedents">
        {data?.precedents?.map(
          (p: any, index: number) => {
            if (typeof p === "string") {
              return (
                <p key={index} className="text-neutral-400">
                  {p}
                </p>
              );
            }

            return (
              <div key={index} className="mb-3">
                <p className="font-semibold text-neutral-200">
                  {p.case_title || "Unknown Case"}
                </p>
                <p className="text-neutral-400 text-sm">
                  {p.principle_established ||
                    ""}
                </p>
              </div>
            );
          }
        )}
      </Section>

      {/* Conclusion */}
      <Section title="Conclusion">
        <p className="text-neutral-300 font-medium">
          {data?.conclusion}
        </p>
      </Section>

      {/* Citations */}
      <Section title="Citations">
        {data?.citations?.map(
          (cit: any, index: number) => (
            <div
              key={index}
              className="mb-4 border-b border-neutral-800 pb-3"
            >
              <p className="font-semibold text-neutral-200">
                {cit.title ||
                  cit.citation_reference ||
                  "Unknown Citation"}
              </p>

              {cit.court && (
                <p className="text-neutral-500 text-sm">
                  {cit.court}{" "}
                  {cit.year && `(${cit.year})`}
                </p>
              )}

              {cit.source && (
                <p className="text-neutral-400 text-sm">
                  {cit.source}
                </p>
              )}

              {(cit.url || cit.source_url) && (
                <a
                  href={cit.url || cit.source_url}
                  target="_blank"
                  className="text-blue-400 hover:text-blue-300 text-sm underline mt-1 inline-block"
                >
                  View Source →
                </a>
              )}
            </div>
          )
        )}
      </Section>

    </div>
  );
}