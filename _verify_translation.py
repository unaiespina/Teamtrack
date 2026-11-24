from docx import Document
from pathlib import Path
from lxml import etree
import re
src=Document(r"C:\Users\Usuario\OneDrive\Documentos\ChatGPT\Teamtrack\TeamTrack_Incremento_2_Agile_Requirements_source.docx")
outpath=Path(r"C:\Users\Usuario\OneDrive\Documentos\ChatGPT\Teamtrack\entregables_clase\TeamTrack_Incremento_2_Agile_Requirements_EN.docx")
out=Document(outpath)
assert len(src.tables)==len(out.tables)
def sig(table):
    return (
      etree.tostring(table._tbl.tblPr),
      etree.tostring(table._tbl.tblGrid),
      tuple((etree.tostring(row._tr.trPr) if row._tr.trPr is not None else None,
             tuple(etree.tostring(cell._tc.tcPr) if cell._tc.tcPr is not None else None for cell in row.cells))
            for row in table.rows)
    )
for i,(a,b) in enumerate(zip(src.tables,out.tables)):
    assert len(a.rows)==len(b.rows) and len(a.columns)==len(b.columns)
    assert sig(a)==sig(b), f'Table geometry/formatting changed in table {i}'
texts=[p.text for p in out.paragraphs]
for table in out.tables:
    texts += [c.text for row in table.rows for c in row.cells]
texts += [p.text for s in out.sections for p in s.header.paragraphs]
texts += [p.text for s in out.sections for p in s.footer.paragraphs]
alltext='\n'.join(texts)
spanish=[' el entrenador ',' la plantilla ',' alcance ',' criterios de aceptación',' usuarios ',' siguientes ',' del incremento',' objetivo ',' dentro del MVP',' pospuesto',' temporada',' baloncesto',' siguiente incremento',' material de referencia',' por qué',' requisitos de calidad',' resultado del incremento',' se implementa',' se añade',' el producto',' ¿','á','é','í','ó','ú','ñ']
found=[x for x in spanish if x.lower() in alltext.lower()]
print('tables preserved:',len(out.tables),'rows/cols:',[(len(t.rows),len(t.columns)) for t in out.tables])
print('residual Spanish indicators:',found)
print('English document characters:',len(alltext))
print('output bytes:',outpath.stat().st_size)
