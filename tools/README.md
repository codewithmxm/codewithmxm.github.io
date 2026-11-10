# Tools

- `extract_shellform_cell.py` writes `src/assets/models/shellform-cell.json` (one ShellForm design cell: nodes, height change, thickness, carbon) from the ShellForm results at a fixed tag. The viewer reads this file.
- `export_mesh.py` turns any mesh plus per-node values into a coloured `.glb`, for a future viewer that loads glTF.
