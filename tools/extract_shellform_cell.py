"""Extract one ShellForm design pair (gravity-only and seismic-aware forms) for the home-page viewer.

Reads ShellForm's frozen explorer data (tag freeze-2026-11-09, built from results/batch_all.csv)
and writes a compact JSON: the seismic-aware form's nodes and, per node, the height change dz (mm)
from the gravity-only form of the same span, supports, rise and Sa. Nothing is recomputed.

Usage: python -I tools/extract_shellform_cell.py <path/to/ShellForm/explorer/explorer_data.js> [span supports rise sa]
"""
import json
import sys
from pathlib import Path

src = Path(sys.argv[1])
span, supports, rise, sa = (float(sys.argv[2]), sys.argv[3], float(sys.argv[4]), float(sys.argv[5])) if len(sys.argv) > 5 else (None, None, None, None)
text = src.read_text(encoding="utf8")
data = json.loads(text[text.index("{"): text.rindex("}") + 1])
designs = data["designs"]


def get(L, s, r, strat, a):
    return next(d for d in designs if d["span_m"] == L and d["supports"] == s and d["rise_ratio"] == r and d["strategy"] == strat and d["sa_g"] == a)


def max_dz(g, q):
    return max(abs(q["nodes"][i] - g["nodes"][i]) for i in range(2, len(g["nodes"]), 3))


if span is None:  # report the cell with the largest height change at the top Sa, for the record
    best = max(((d["span_m"], d["supports"], d["rise_ratio"]) for d in designs if d["strategy"] == "gravity" and d["sa_g"] == 0.6),
               key=lambda k: max_dz(get(*k, "gravity", 0.6), get(*k, "seismic", 0.6)))
    span, supports, rise = best
    sa = 0.6
g, q = get(span, supports, rise, "gravity", sa), get(span, supports, rise, "seismic", sa)
dz = [round(1000 * (q["nodes"][i] - g["nodes"][i]), 1) for i in range(2, len(g["nodes"]), 3)]
# symmetric colour limit as in the ShellForm explorer: largest |dz| over all Sa for this span, supports and rise
sas = sorted({d["sa_g"] for d in designs})
lim = max(max_dz(get(span, supports, rise, "gravity", a), get(span, supports, rise, "seismic", a)) for a in sas)
out = {
    "source": "ShellForm v0.1.0, explorer data (results/batch_all.csv)",
    "freeze_tag": data["freeze_tag"], "shellbench_tag": data["shellbench_tag"], "code_commit": data["code_commit"][:7],
    "id": q["id"], "span_m": span, "supports": supports, "rise_ratio": rise, "sa_g": sa, "n": q["n"],
    "thickness_mm": {"gravity": round(g["thickness_m"] * 1000), "seismic": round(q["thickness_m"] * 1000)},
    "carbon_kgco2e_m2": {"gravity": round(g["carbon_kgco2e_m2"], 1), "seismic": round(q["carbon_kgco2e_m2"], 1)},
    "governing": {"gravity": g["governing"], "seismic": q["governing"]},
    "dz_limit_mm": round(lim * 1000, 1),
    "nodes": [round(v, 3) for v in q["nodes"]],
    "dz_mm": dz,
}
dest = Path(__file__).resolve().parent.parent / "src" / "assets" / "models" / "shellform-cell.json"
dest.write_text(json.dumps(out, separators=(",", ":")), encoding="utf8")
print(dest.name, out["id"], "max|dz| mm", max(map(abs, dz)), "limit", out["dz_limit_mm"], out["thickness_mm"], out["carbon_kgco2e_m2"], out["governing"], dest.stat().st_size, "bytes")
