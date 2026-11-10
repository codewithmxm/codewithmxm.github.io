"""Export a shell mesh with per-vertex values to a binary glTF (.glb) for the web viewer.

Usage:
    python tools/export_mesh.py nodes.csv tris.csv values.csv out.glb [--limit 349]

nodes.csv  : x,y,z per row (metres, z up)
tris.csv   : i,j,k per row (zero-based node indices)
values.csv : one value per node (e.g. height change in mm); coloured with the reversed
             RdBu ramp, symmetric about zero at +/- limit (default: max |value|).

Needs: pip install trimesh numpy matplotlib
The current site viewer reads a compact JSON (see tools/extract_shellform_cell.py);
use this script when a project needs an arbitrary mesh instead.
"""
import argparse

import numpy as np


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("nodes")
    ap.add_argument("tris")
    ap.add_argument("values")
    ap.add_argument("out")
    ap.add_argument("--limit", type=float, default=None)
    a = ap.parse_args()

    import trimesh
    from matplotlib import colormaps

    xyz = np.loadtxt(a.nodes, delimiter=",")
    tris = np.loadtxt(a.tris, delimiter=",", dtype=int)
    val = np.loadtxt(a.values, delimiter=",")
    lim = a.limit or float(np.abs(val).max()) or 1.0
    t = np.clip(0.5 + 0.5 * val / lim, 0, 1)
    rgba = (colormaps["RdBu_r"](t) * 255).astype(np.uint8)

    # glTF is y-up: (x, y, z) -> (x, z, -y)
    v = np.column_stack([xyz[:, 0], xyz[:, 2], -xyz[:, 1]])
    mesh = trimesh.Trimesh(vertices=v, faces=tris, vertex_colors=rgba, process=False)
    mesh.export(a.out)
    print(f"{a.out}: {len(v)} vertices, {len(tris)} triangles, colour limit +/-{lim:g}")


if __name__ == "__main__":
    main()
