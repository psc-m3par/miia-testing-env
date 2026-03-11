'use client';

import { useState, useRef, useEffect } from 'react';
import { CriterionResult } from '@/lib/mockCorrection';

interface TooltipData {
  x: number;
  y: number;
  criterionNumber: number;
  criterionName: string;
  color: string;
  highlightedText: string;
  comment: string;
}

interface ImageHighlight {
  id: string;
  criterionNumber: number;
  top: string;
  left: string;
  width: string;
  height: string;
  color: string;
  highlightedText: string;
  comment: string;
}

function seededRandom(seed: string, index: number): number {
  const str = seed + index.toString();
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const c = str.charCodeAt(i);
    hash = (hash << 5) - hash + c;
    hash = hash & hash;
  }
  return Math.abs(hash % 10000) / 10000;
}

function generateImageHighlights(testId: string, criteria: CriterionResult[]): ImageHighlight[] {
  const result: ImageHighlight[] = [];
  let idx = 0;
  criteria.forEach(c => {
    for (let i = 0; i < 3; i++) {
      const r1 = seededRandom(testId, idx++);
      const r2 = seededRandom(testId, idx++);
      const r3 = seededRandom(testId, idx++);
      const r4 = seededRandom(testId, idx++);
      const hlData = c.highlights[i % c.highlights.length];
      result.push({
        id: `img_${c.number}_${i}`,
        criterionNumber: c.number,
        top: `${5 + r1 * 68}%`,
        left: `${3 + r2 * 55}%`,
        width: `${18 + r3 * 22}%`,
        height: `${2.5 + r4 * 4}%`,
        color: c.color,
        highlightedText: hlData.highlightedText,
        comment: hlData.comment,
      });
    }
  });
  return result;
}

interface TextSegment {
  text: string;
  highlight: { criterionNumber: number; color: string; id: string; comment: string } | null;
}

function buildTextSegments(paragraphs: string[], criteria: CriterionResult[]): TextSegment[][] {
  return paragraphs.map((para, paraIdx) => {
    const len = para.length;
    if (len < 40) return [{ text: para, highlight: null }];

    const c1 = criteria[(paraIdx * 2) % criteria.length];
    const c2 = criteria[(paraIdx * 2 + 1) % criteria.length];
    const hl1Data = c1.highlights[paraIdx % c1.highlights.length];
    const hl2Data = c2.highlights[(paraIdx + 1) % c2.highlights.length];

    const s1 = Math.floor(len * 0.12);
    const e1 = Math.floor(len * 0.32);
    const s2 = Math.floor(len * 0.55);
    const e2 = Math.floor(len * 0.80);

    return [
      { text: para.slice(0, s1), highlight: null },
      { text: para.slice(s1, e1), highlight: { criterionNumber: c1.number, color: c1.color, id: `th_${paraIdx}_0`, comment: hl1Data.comment } },
      { text: para.slice(e1, s2), highlight: null },
      { text: para.slice(s2, e2), highlight: { criterionNumber: c2.number, color: c2.color, id: `th_${paraIdx}_1`, comment: hl2Data.comment } },
      { text: para.slice(e2), highlight: null },
    ].filter(seg => seg.text.length > 0);
  });
}

interface Props {
  mode: 'text' | 'image';
  essayText: string;
  essayImageUrl: string | null;
  criteria: CriterionResult[];
  testId: string;
}

export default function EssayViewer({ mode, essayText, essayImageUrl, criteria, testId }: Props) {
  const [zoom, setZoom] = useState(1);
  const [tooltip, setTooltip] = useState<TooltipData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const imageHighlights = generateImageHighlights(testId, criteria);
  const paragraphs = essayText.split(/\n+/).filter(p => p.trim().length > 0);
  const textSegments = buildTextSegments(paragraphs, criteria);

  useEffect(() => {
    function handleClick() { setTooltip(null); }
    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, []);

  function handleHighlightClick(
    e: React.MouseEvent,
    criterionNumber: number,
    color: string,
    criterionName: string,
    highlightedText: string,
    comment: string,
  ) {
    e.stopPropagation();
    setTooltip({ x: e.clientX, y: e.clientY, criterionNumber, criterionName, color, highlightedText, comment });
  }

  const criterionByNumber = Object.fromEntries(criteria.map(c => [c.number, c]));

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden flex flex-col">
      {/* Toolbar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-gray-100 bg-gray-50">
        <span className="text-xs font-semibold text-gray-600 mr-auto">
          {mode === 'image' ? 'Imagem manuscrita' : 'Texto digitado'}
        </span>
        <button
          onClick={() => setZoom(z => Math.min(z + 0.25, 3))}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Zoom in"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
          </svg>
        </button>
        <button
          onClick={() => setZoom(1)}
          className="text-xs px-2 py-1 rounded hover:bg-gray-200 transition-colors text-gray-600"
          title="Reset zoom"
        >
          {Math.round(zoom * 100)}%
        </button>
        <button
          onClick={() => setZoom(z => Math.max(z - 0.25, 0.5))}
          className="p-1.5 rounded hover:bg-gray-200 transition-colors"
          title="Zoom out"
        >
          <svg className="w-4 h-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM13 10H7" />
          </svg>
        </button>
      </div>

      {/* Content area */}
      <div ref={containerRef} className="overflow-auto flex-1" style={{ maxHeight: '560px' }}>
        <div style={{ transform: `scale(${zoom})`, transformOrigin: 'top left', width: `${100 / zoom}%` }}>
          {mode === 'image' && essayImageUrl ? (
            <div className="relative inline-block w-full">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={essayImageUrl} alt="Redação" className="w-full h-auto block" />
              {imageHighlights.map(h => {
                const crit = criterionByNumber[h.criterionNumber];
                return (
                  <div
                    key={h.id}
                    onClick={e =>
                      handleHighlightClick(e, h.criterionNumber, h.color, crit?.name ?? '', h.highlightedText, h.comment)
                    }
                    className="absolute cursor-pointer rounded"
                    style={{
                      top: h.top,
                      left: h.left,
                      width: h.width,
                      height: h.height,
                      backgroundColor: h.color + '4D',
                      border: `1.5px solid ${h.color}99`,
                    }}
                  />
                );
              })}
            </div>
          ) : (
            <div className="p-5 space-y-4">
              {textSegments.length === 0 ? (
                <p className="text-sm text-gray-400 italic">Nenhum texto enviado.</p>
              ) : (
                textSegments.map((segs, pi) => (
                  <p key={pi} className="text-sm text-gray-800 leading-relaxed">
                    {segs.map((seg, si) =>
                      seg.highlight ? (
                        <span
                          key={si}
                          onClick={e => {
                            const crit = criterionByNumber[seg.highlight!.criterionNumber];
                            handleHighlightClick(
                              e,
                              seg.highlight!.criterionNumber,
                              seg.highlight!.color,
                              crit?.name ?? '',
                              seg.text,
                              seg.highlight!.comment,
                            );
                          }}
                          className="cursor-pointer rounded px-0.5"
                          style={{ backgroundColor: seg.highlight.color + '33' }}
                        >
                          {seg.text}
                        </span>
                      ) : (
                        <span key={si}>{seg.text}</span>
                      ),
                    )}
                  </p>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
        <p className="text-xs text-gray-400">
          Clique em um trecho destacado para ver o comentário · Zoom: {Math.round(zoom * 100)}%
        </p>
      </div>

      {/* Tooltip */}
      {tooltip && (
        <div
          className="fixed z-50 w-72 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden"
          style={{
            left: Math.min(tooltip.x + 12, (typeof window !== 'undefined' ? window.innerWidth : 800) - 300),
            top: Math.max(tooltip.y - 120, 8),
          }}
          onClick={e => e.stopPropagation()}
        >
          <div className="px-4 py-2.5 text-white text-sm font-semibold" style={{ backgroundColor: tooltip.color }}>
            C{tooltip.criterionNumber} {tooltip.criterionName}
          </div>
          <div className="p-4 space-y-3">
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Trecho destacado:</p>
              <div className="bg-gray-50 rounded-lg px-3 py-2">
                <p className="text-sm text-gray-700 italic">&ldquo;{tooltip.highlightedText}&rdquo;</p>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500 mb-1">Comentário:</p>
              <p className="text-sm text-gray-700">{tooltip.comment}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
