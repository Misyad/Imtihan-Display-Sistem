'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import questionsData from '@/data/questions.json';
import { PAGE_BREAKS } from '@/lib/quran/page-breaks';

interface Box {
  page: number;
  x: number;
  y: number;
  w: number;
  h: number;
}

type CoordsMap = Record<string, Box[]>;

interface Unit {
  surah: number;
  ayah: number;
  page: number;
  key: string;
}

const IMG_W = 1080;
const IMG_H = 1745;

const COLORS = [
  '#10b981',
  '#f59e0b',
  '#ef4444',
  '#3b82f6',
  '#8b5cf6',
  '#ec4899',
  '#14b8a6',
  '#f97316',
];

function pad3(n: number) {
  return String(n).padStart(3, '0');
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

function pageOf(surah: number, ayah: number): number {
  let p = 1;
  for (const [pnum, ps, pa] of PAGE_BREAKS) {
    if (surah > ps || (surah === ps && ayah >= pa)) {
      p = pnum;
    } else {
      break;
    }
  }
  return p;
}

function parseAyat(s: string): number[] {
  if (s.includes(',')) {
    return s
      .split(',')
      .map((x) => parseInt(x.trim()))
      .filter((n) => !isNaN(n));
  }
  if (s.includes('-')) {
    const [a, b] = s.split('-').map((x) => parseInt(x.trim()));
    const arr: number[] = [];
    for (let i = a; i <= b; i++) arr.push(i);
    return arr;
  }
  const n = parseInt(s.trim());
  return isNaN(n) ? [] : [n];
}

function pointInBox(p: { x: number; y: number }, b: Box) {
  return p.x >= b.x && p.x <= b.x + b.w && p.y >= b.y && p.y <= b.y + b.h;
}

const HANDLES = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

function hitHandle(b: Box, p: { x: number; y: number }): string | null {
  const t = 14;
  for (const h of HANDLES) {
    const cx = h.includes('w') ? b.x : h.includes('e') ? b.x + b.w : b.x + b.w / 2;
    const cy = h.includes('n') ? b.y : h.includes('s') ? b.y + b.h : b.y + b.h / 2;
    if (Math.abs(p.x - cx) <= t && Math.abs(p.y - cy) <= t) return h;
  }
  return null;
}

function resizeBox(b: Box, h: string, p: { x: number; y: number }): Box {
  let { x, y, w, h: bh } = b;
  const min = 20;
  if (h.includes('w')) {
    const nx = Math.min(p.x, b.x + b.w - min);
    x = Math.max(0, nx);
    w = b.x + b.w - x;
  }
  if (h.includes('e')) {
    w = clamp(p.x - b.x, min, IMG_W - b.x);
  }
  if (h.includes('n')) {
    const ny = Math.min(p.y, b.y + b.h - min);
    y = Math.max(0, ny);
    bh = b.y + b.h - y;
  }
  if (h.includes('s')) {
    bh = clamp(p.y - b.y, min, IMG_H - b.y);
  }
  return { page: b.page, x, y, w, h: bh };
}

export default function AnnotateQuranPage() {
  const [coords, setCoords] = useState<CoordsMap>({});
  const [currentPage, setCurrentPage] = useState<number | null>(null);
  const [selectedKey, setSelectedKey] = useState<string | null>(null);
  const [activeBoxIdx, setActiveBoxIdx] = useState<number | null>(null);
  const [displayScale, setDisplayScale] = useState(1);
  const [draft, setDraft] = useState<{ x1: number; y1: number; x2: number; y2: number } | null>(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const modeRef = useRef<'draw' | 'move' | 'resize' | null>(null);
  const handleRef = useRef<string | null>(null);
  const dragOriginRef = useRef<{ x: number; y: number } | null>(null);
  const dragStartBoxRef = useRef<Box | null>(null);
  const drawStartRef = useRef<{ x: number; y: number } | null>(null);

  const units: Unit[] = useMemo(() => {
    const out: Unit[] = [];
    for (const q of questionsData as any[]) {
      const r = q?.quranRef;
      if (!r || !r.surah || !r.ayat) continue;
      for (const a of parseAyat(String(r.ayat))) {
        out.push({ surah: r.surah, ayah: a, page: pageOf(r.surah, a), key: `${r.surah}:${a}` });
      }
    }
    return out;
  }, []);

  const unitsByPage = useMemo(() => {
    const m = new Map<number, Unit[]>();
    for (const u of units) {
      const arr = m.get(u.page) ?? [];
      arr.push(u);
      m.set(u.page, arr);
    }
    return m;
  }, [units]);

  const pages = useMemo(() => [...unitsByPage.keys()].sort((a, b) => a - b), [unitsByPage]);

  const completed = useMemo(
    () => units.filter((u) => (coords[u.key] ?? []).some((b) => b.page === u.page)).length,
    [units, coords]
  );

  useEffect(() => {
    fetch('/api/quran-coords')
      .then((r) => r.json())
      .then((j: CoordsMap) => setCoords(j && typeof j === 'object' ? j : {}))
      .catch(() => setCoords({}));
  }, []);

  useEffect(() => {
    if (currentPage === null && pages.length > 0) {
      setCurrentPage(pages[0]);
      setSelectedKey(unitsByPage.get(pages[0])?.[0]?.key ?? null);
    }
  }, [pages, unitsByPage, currentPage]);

  useEffect(() => {
    const el = wrapperRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      const r = el.getBoundingClientRect();
      setDisplayScale(r.width / IMG_W);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, [currentPage]);

  const toNatural = useCallback(
    (clientX: number, clientY: number) => {
      const r = wrapperRef.current?.getBoundingClientRect();
      if (!r) return { x: 0, y: 0 };
      return { x: (clientX - r.left) / displayScale, y: (clientY - r.top) / displayScale };
    },
    [displayScale]
  );

  const boxesOnPage = useMemo(() => {
    const res: { key: string; box: Box; idx: number; color: string }[] = [];
    const pageUnits = currentPage === null ? [] : (unitsByPage.get(currentPage) ?? []);
    pageUnits.forEach((u, ui) => {
      const color = COLORS[ui % COLORS.length];
      (coords[u.key] ?? []).forEach((b, i) => {
        if (b.page === currentPage) res.push({ key: u.key, box: b, idx: i, color });
      });
    });
    return res;
  }, [coords, currentPage, unitsByPage]);

  const updateBox = useCallback((key: string, idx: number, box: Box) => {
    setCoords((prev) => {
      const arr = [...(prev[key] ?? [])];
      arr[idx] = { ...box };
      return { ...prev, [key]: arr };
    });
  }, []);

  const addBox = useCallback((key: string, box: Box) => {
    setCoords((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), box] }));
  }, []);

  const removeBox = useCallback((key: string, idx: number) => {
    setCoords((prev) => ({ ...prev, [key]: (prev[key] ?? []).filter((_, i) => i !== idx) }));
    setActiveBoxIdx(null);
  }, []);

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!selectedKey || currentPage === null) return;
    const p = toNatural(e.clientX, e.clientY);
    const el = wrapperRef.current;
    if (!el) return;

    if (activeBoxIdx !== null) {
      const activeBox = (coords[selectedKey] ?? [])[activeBoxIdx];
      if (activeBox && activeBox.page === currentPage) {
        const h = hitHandle(activeBox, p);
        if (h) {
          modeRef.current = 'resize';
          handleRef.current = h;
          dragStartBoxRef.current = { ...activeBox };
          dragOriginRef.current = p;
          el.setPointerCapture(e.pointerId);
          return;
        }
      }
    }

    for (let i = boxesOnPage.length - 1; i >= 0; i--) {
      const entry = boxesOnPage[i];
      if (pointInBox(p, entry.box)) {
        setSelectedKey(entry.key);
        setActiveBoxIdx(entry.idx);
        modeRef.current = 'move';
        dragOriginRef.current = p;
        dragStartBoxRef.current = { ...entry.box };
        el.setPointerCapture(e.pointerId);
        return;
      }
    }

    modeRef.current = 'draw';
    drawStartRef.current = p;
    setActiveBoxIdx(null);
    el.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const p = toNatural(e.clientX, e.clientY);
    if (modeRef.current === 'draw' && drawStartRef.current) {
      setDraft({ x1: drawStartRef.current.x, y1: drawStartRef.current.y, x2: p.x, y2: p.y });
    } else if (
      modeRef.current === 'move' &&
      activeBoxIdx !== null &&
      dragOriginRef.current &&
      dragStartBoxRef.current &&
      selectedKey
    ) {
      const dx = p.x - dragOriginRef.current.x;
      const dy = p.y - dragOriginRef.current.y;
      const b = dragStartBoxRef.current;
      updateBox(selectedKey, activeBoxIdx, {
        ...b,
        x: clamp(b.x + dx, 0, IMG_W - b.w),
        y: clamp(b.y + dy, 0, IMG_H - b.h),
      });
    } else if (
      modeRef.current === 'resize' &&
      activeBoxIdx !== null &&
      handleRef.current &&
      dragStartBoxRef.current &&
      selectedKey
    ) {
      updateBox(selectedKey, activeBoxIdx, resizeBox(dragStartBoxRef.current, handleRef.current, p));
    }
  };

  const handlePointerUp = () => {
    if (modeRef.current === 'draw' && draft && selectedKey && currentPage !== null) {
      const bx = Math.min(draft.x1, draft.x2);
      const by = Math.min(draft.y1, draft.y2);
      const bw = Math.abs(draft.x2 - draft.x1);
      const bh = Math.abs(draft.y2 - draft.y1);
      if (bw > 8 && bh > 8) {
        addBox(selectedKey, {
          page: currentPage,
          x: clamp(bx, 0, IMG_W),
          y: clamp(by, 0, IMG_H),
          w: clamp(bw, 0, IMG_W),
          h: clamp(bh, 0, IMG_H),
        });
      }
    }
    setDraft(null);
    modeRef.current = null;
    handleRef.current = null;
    dragOriginRef.current = null;
    dragStartBoxRef.current = null;
    drawStartRef.current = null;
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (selectedKey === null || activeBoxIdx === null) return;
      const b = (coords[selectedKey] ?? [])[activeBoxIdx];
      if (!b || b.page !== currentPage) return;
      const step = e.shiftKey ? 10 : 1;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        removeBox(selectedKey, activeBoxIdx);
      } else if (e.key.startsWith('Arrow')) {
        e.preventDefault();
        const d =
          e.key === 'ArrowLeft'
            ? [-step, 0]
            : e.key === 'ArrowRight'
            ? [step, 0]
            : e.key === 'ArrowUp'
            ? [0, -step]
            : [0, step];
        updateBox(selectedKey, activeBoxIdx, {
          ...b,
          x: clamp(b.x + d[0], 0, IMG_W - b.w),
          y: clamp(b.y + d[1], 0, IMG_H - b.h),
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedKey, activeBoxIdx, coords, currentPage, updateBox, removeBox]);

  const save = async () => {
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/quran-coords', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(coords),
      });
      const j = await res.json();
      setStatus(j.ok ? 'Tersimpan ✓' : 'Gagal: ' + (j.error || ''));
    } catch (err) {
      setStatus('Gagal: ' + String(err));
    }
    setSaving(false);
  };

  const pageUnits = currentPage === null ? [] : (unitsByPage.get(currentPage) ?? []);
  const hasBox = (key: string) => (coords[key] ?? []).some((b) => b.page === currentPage);

  return (
    <div className="min-h-screen bg-zinc-900 text-zinc-100 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
          <div>
            <h1 className="text-xl font-bold">Anotasi Referensi Al-Qur&apos;an</h1>
            <p className="text-sm text-zinc-400">
              Tandai area ayat pada gambar halaman Kemenag ({IMG_W}×{IMG_H}). Progress:{' '}
              <span className="text-emerald-400 font-semibold">{completed}</span>/{units.length} ayat
            </p>
          </div>
          <div className="flex items-center gap-3">
            {status && <span className="text-sm text-zinc-300">{status}</span>}
            <button
              onClick={save}
              disabled={saving}
              className="px-4 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 font-semibold"
            >
              {saving ? 'Menyimpan…' : 'Simpan Semua'}
            </button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <button
            onClick={() =>
              currentPage &&
              setCurrentPage(pages[Math.max(0, pages.indexOf(currentPage) - 1)])
            }
            disabled={currentPage === null}
            className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40"
          >
            ←
          </button>
          <select
            value={currentPage ?? ''}
            onChange={(e) => {
              const p = Number(e.target.value);
              setCurrentPage(p);
              setSelectedKey(unitsByPage.get(p)?.[0]?.key ?? null);
              setActiveBoxIdx(null);
            }}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-1.5"
          >
            {pages.map((p) => (
              <option key={p} value={p}>
                Halaman {p} — {unitsByPage.get(p)?.length} ref
              </option>
            ))}
          </select>
          <button
            onClick={() =>
              currentPage &&
              setCurrentPage(pages[Math.min(pages.length - 1, pages.indexOf(currentPage) + 1)])
            }
            disabled={currentPage === null}
            className="px-3 py-1.5 rounded-lg bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40"
          >
            →
          </button>
          <span className="text-xs text-zinc-500 ml-2">
            Drag buat kotak · drag kotak untuk pindah · drag sudut resize · <kbd className="px-1 bg-zinc-700 rounded">Del</kbd> hapus · panah geser
          </span>
        </div>

        <div className="flex gap-4">
          <div className="flex-1 bg-zinc-800 rounded-xl p-3 min-h-[70vh] flex items-start justify-center overflow-auto">
            {currentPage === null ? (
              <p className="text-zinc-400 mt-10">Pilih halaman…</p>
            ) : (
              <div
                ref={wrapperRef}
                className="relative inline-block select-none"
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                style={{ touchAction: 'none' }}
              >
                <img
                  src={`https://media.qurankemenag.net/khat2/QK_${pad3(currentPage)}.webp`}
                  alt={`Halaman ${currentPage}`}
                  className="max-h-[78vh] w-auto rounded-lg shadow-xl"
                  draggable={false}
                />
                {boxesOnPage.map((entry, i) => {
                  const active = entry.key === selectedKey && entry.idx === activeBoxIdx;
                  const { box } = entry;
                  return (
                    <div
                      key={`${entry.key}-${entry.idx}`}
                      className="absolute pointer-events-none"
                      style={{
                        left: box.x * displayScale,
                        top: box.y * displayScale,
                        width: box.w * displayScale,
                        height: box.h * displayScale,
                        border: active ? '3px solid #ffffff' : `2px solid ${entry.color}`,
                        background: active ? 'rgba(16,185,129,0.18)' : `${entry.color}1f`,
                        borderRadius: 4,
                      }}
                    >
                      <span
                        className="absolute -top-5 left-0 text-[11px] font-bold px-1 rounded"
                        style={{ background: entry.color, color: '#000' }}
                      >
                        {entry.key}
                      </span>
                      {active && (
                        <span className="absolute -bottom-5 right-0 text-[10px] px-1 rounded bg-zinc-700 text-zinc-200">
                          {Math.round(box.w)}×{Math.round(box.h)} @{Math.round(box.x)},{Math.round(box.y)}
                        </span>
                      )}
                    </div>
                  );
                })}
                {draft && (
                  <div
                    className="absolute pointer-events-none border-2 border-dashed border-white/80 bg-white/10"
                    style={{
                      left: Math.min(draft.x1, draft.x2) * displayScale,
                      top: Math.min(draft.y1, draft.y2) * displayScale,
                      width: Math.abs(draft.x2 - draft.x1) * displayScale,
                      height: Math.abs(draft.y2 - draft.y1) * displayScale,
                    }}
                  />
                )}
              </div>
            )}
          </div>

          <div className="w-72 shrink-0 space-y-2">
            <h3 className="text-sm font-semibold text-zinc-300">Ayat di halaman ini</h3>
            {pageUnits.map((u) => {
              const done = hasBox(u.key);
              const active = selectedKey === u.key;
              return (
                <button
                  key={u.key}
                  onClick={() => {
                    setSelectedKey(u.key);
                    setActiveBoxIdx(null);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg border text-sm ${
                    active ? 'bg-zinc-700 border-emerald-500' : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'
                  }`}
                >
                  <span className="flex items-center justify-between">
                    <span className="font-mono">
                      QS {u.surah}:{u.ayah}
                    </span>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${
                        done ? 'bg-emerald-500/20 text-emerald-300' : 'bg-zinc-600 text-zinc-300'
                      }`}
                    >
                      {done ? '✓' : '—'}
                    </span>
                  </span>
                  <span className="text-[11px] text-zinc-400">
                    {(coords[u.key] ?? []).filter((b) => b.page === currentPage).length} kotak
                  </span>
                </button>
              );
            })}
            <p className="text-[11px] text-zinc-500 leading-relaxed mt-2">
              Pilih ayat di panel ini lalu buat kotak pada gambarnya. Klik &quot;Simpan Semua&quot; secara berkala.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
