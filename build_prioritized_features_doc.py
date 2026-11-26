from pathlib import Path
import re

from docx import Document
from docx.enum.table import WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.shared import Inches, Pt, RGBColor


ROOT = Path(__file__).parent
SOURCE = ROOT / "entregables_clase" / "TeamTrack_Increment_5_Prioritized_Feature_List.md"
OUTPUT = ROOT / "entregables_clase" / "TeamTrack_Increment_5_Prioritized_Feature_List.docx"


def shade(cell, fill):
    props = cell._tc.get_or_add_tcPr()
    shd = OxmlElement("w:shd")
    shd.set(qn("w:fill"), fill)
    props.append(shd)


def borders(table):
    tbl_pr = table._tbl.tblPr
    borders_el = OxmlElement("w:tblBorders")
    for edge in ("top", "left", "bottom", "right", "insideH", "insideV"):
        edge_el = OxmlElement(f"w:{edge}")
        edge_el.set(qn("w:val"), "single")
        edge_el.set(qn("w:sz"), "5")
        edge_el.set(qn("w:color"), "D9E1DD")
        borders_el.append(edge_el)
    tbl_pr.append(borders_el)


def add_rich_text(paragraph, text):
    parts = re.split(r"(\*\*.+?\*\*|`.+?`|\*.+?\*)", text)
    for part in parts:
        if part.startswith("**") and part.endswith("**"):
            paragraph.add_run(part[2:-2]).bold = True
        elif part.startswith("`") and part.endswith("`"):
            r = paragraph.add_run(part[1:-1])
            r.font.name = "Consolas"
            r.font.size = Pt(8.8)
        elif part.startswith("*") and part.endswith("*") and len(part) > 2:
            paragraph.add_run(part[1:-1]).italic = True
        elif part:
            paragraph.add_run(part)


def build_docx(source_path: Path = SOURCE, output_path: Path = OUTPUT):
    doc = Document()
    section = doc.sections[0]
    section.top_margin = Inches(0.72)
    section.bottom_margin = Inches(0.7)
    section.left_margin = Inches(0.78)
    section.right_margin = Inches(0.78)

    normal = doc.styles["Normal"]
    normal.font.name = "Aptos"
    normal.font.size = Pt(9.5)
    normal.font.color.rgb = RGBColor(54, 64, 73)
    normal.paragraph_format.space_after = Pt(5.5)
    normal.paragraph_format.line_spacing = 1.12
    for name, size in (("Title", 25), ("Heading 1", 17), ("Heading 2", 12.5), ("Heading 3", 10.5)):
        style = doc.styles[name]
        style.font.name = "Aptos Display"
        style.font.size = Pt(size)
        style.font.bold = True
        style.font.color.rgb = RGBColor(25, 35, 49)
        style.paragraph_format.keep_with_next = True
        style.paragraph_format.space_before = Pt(11 if name != "Title" else 0)
        style.paragraph_format.space_after = Pt(4.5)

    lines = source_path.read_text(encoding="utf-8").splitlines()
    i = 0
    while i < len(lines):
        line = lines[i].strip()
        if not line or line == "---":
            i += 1
            continue
        if line.startswith("# "):
            title = doc.add_paragraph(style="Title")
            title.add_run(line[2:])
            i += 1
            continue
        if line.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].strip().startswith("|"):
                cells = [c.strip() for c in lines[i].strip().strip("|").split("|")]
                if not all(re.fullmatch(r":?-{3,}:?", c) for c in cells):
                    rows.append(cells)
                i += 1
            table = doc.add_table(rows=len(rows), cols=max(map(len, rows)))
            table.autofit = True
            table.style = "Table Grid"
            borders(table)
            for ri, row in enumerate(rows):
                for ci, value in enumerate(row):
                    cell = table.cell(ri, ci)
                    cell.vertical_alignment = WD_CELL_VERTICAL_ALIGNMENT.CENTER
                    cell.text = ""
                    p = cell.paragraphs[0]
                    p.paragraph_format.space_after = Pt(3)
                    p.paragraph_format.space_before = Pt(3)
                    add_rich_text(p, value)
                    for run in p.runs:
                        run.font.size = Pt(8.2)
                    if ri == 0:
                        shade(cell, "244D40")
                        for run in p.runs:
                            run.font.bold = True
                            run.font.color.rgb = RGBColor(255, 255, 255)
                if ri == 0:
                    tr_pr = table.rows[0]._tr.get_or_add_trPr()
                    repeat = OxmlElement("w:tblHeader")
                    repeat.set(qn("w:val"), "true")
                    tr_pr.append(repeat)
            doc.add_paragraph().paragraph_format.space_after = Pt(1)
            continue
        if line.startswith("#### "):
            doc.add_heading(line[5:], level=3)
            i += 1
            continue
        if line.startswith("### "):
            doc.add_heading(line[4:], level=2)
            i += 1
            continue
        if line.startswith("## "):
            doc.add_heading(line[3:], level=1)
            i += 1
            continue
        if line.startswith("- "):
            p = doc.add_paragraph(style="List Bullet")
            add_rich_text(p, line[2:])
            i += 1
            continue
        if re.match(r"\d+\. ", line):
            p = doc.add_paragraph(style="List Number")
            add_rich_text(p, re.sub(r"^\d+\. ", "", line))
            i += 1
            continue
        p = doc.add_paragraph()
        add_rich_text(p, line.replace("  ", " "))
        i += 1

    doc.core_properties.title = "TeamTrack User Stories"
    doc.core_properties.subject = "Increment 4 user stories and acceptance criteria for TeamTrack"
    doc.core_properties.author = "TeamTrack"
    doc.save(output_path)
    return output_path


if __name__ == "__main__":
    out = build_docx()
    print("Generated:", out)

