from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_CELL_VERTICAL_ALIGNMENT
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

ROOT = Path(__file__).parent
OUT = ROOT / "entregables_clase"
ASSETS = OUT / "assets"
OUT.mkdir(exist_ok=True)
ASSETS.mkdir(exist_ok=True)

NAVY = "17324D"
TEAL = "187C78"
GOLD = "D89B38"
INK = "243447"
MUTED = "627487"
PALE = "EEF4F7"
PALE_TEAL = "EAF5F3"
PALE_GOLD = "FBF4E8"
WHITE = "FFFFFF"
LINE = "D8E2E9"

FONT_DIR = Path(r"C:\Windows\Fonts")
def font(size, bold=False):
    p = FONT_DIR / ("arialbd.ttf" if bold else "arial.ttf")
    if not p.exists(): p = FONT_DIR / ("calibrib.ttf" if bold else "calibri.ttf")
    return ImageFont.truetype(str(p), size)

def draw_round_box(draw, box, fill, outline, radius=24, width=3):
    draw.rounded_rectangle(box, radius=radius, fill="#"+fill, outline="#"+outline, width=width)

def make_architecture(path):
    w,h=1500,440
    im=Image.new("RGB",(w,h),"white"); d=ImageDraw.Draw(im)
    labels=[("WEB UI","Pages and forms",NAVY),("USE CASES / API","Validate and coordinate",TEAL),("DOMAIN RULES","Team and sport logic",NAVY),("PERSISTENCE","Authorized operations",TEAL),("DATABASE","Relational storage",NAVY)]
    x0=20; gap=28; bw=270; bh=175; y=105
    for i,(title,sub,color) in enumerate(labels):
        x=x0+i*(bw+gap)
        draw_round_box(d,(x,y,x+bw,y+bh),color,color)
        d.text((x+bw/2,y+49),title,font=font(28,True),fill="white",anchor="mm")
        d.text((x+bw/2,y+111),sub,font=font(21),fill="white",anchor="mm")
        if i<len(labels)-1:
            ax=x+bw+5; ay=y+bh/2; ex=ax+gap-8
            d.line((ax,ay,ex,ay),fill="#"+GOLD,width=8)
            d.polygon([(ex,ay),(ex-18,ay-14),(ex-18,ay+14)],fill="#"+GOLD)
    d.text((w/2,35),"Request path for the prototype",font=font(29,True),fill="#"+INK,anchor="mm")
    d.text((w/2,350),"Authentication and team ownership are checked on every protected read and write",font=font(22),fill="#"+MUTED,anchor="mm")
    im.save(path)

def make_domain(path):
    w,h=1500,610
    im=Image.new("RGB",(w,h),"white"); d=ImageDraw.Draw(im)
    boxes={
        "USER":(65,80,310,185), "SEASON":(430,80,675,185), "TEAM":(800,80,1045,185),
        "MEMBER":(1170,70,1430,175), "EVENT":(800,370,1045,475),
        "ATTENDANCE":(1170,330,1430,435), "NOTE / RESULT":(430,370,675,475),
        "RESULT COMPONENT":(65,370,310,475)
    }
    for label,b in boxes.items():
        fill=TEAL if label in ("TEAM","EVENT") else NAVY
        draw_round_box(d,b,fill,fill,22,3)
        d.text(((b[0]+b[2])/2,(b[1]+b[3])/2),label,font=font(25,True),fill="white",anchor="mm")
    def conn(a,b,label):
        x1,y1=(a[0]+a[2],(a[1]+a[3])/2) if a[0]<b[0] else (a[0],(a[1]+a[3])/2)
        x2,y2=(b[0],(b[1]+b[3])/2) if a[0]<b[0] else (b[2],(b[1]+b[3])/2)
        d.line((x1,y1,x2,y2),fill="#"+GOLD,width=6)
        d.ellipse((x1-6,y1-6,x1+6,y1+6),fill="#"+GOLD)
        d.text(((x1+x2)/2,(y1+y2)/2-22),label,font=font(18,True),fill="#"+INK,anchor="mm")
    conn(boxes["USER"],boxes["SEASON"],"owns")
    conn(boxes["SEASON"],boxes["TEAM"],"groups")
    conn(boxes["TEAM"],boxes["MEMBER"],"has")
    conn(boxes["TEAM"],boxes["EVENT"],"schedules")
    conn(boxes["EVENT"],boxes["ATTENDANCE"],"records")
    conn(boxes["MEMBER"],boxes["ATTENDANCE"],"receives")
    conn(boxes["EVENT"],boxes["NOTE / RESULT"],"documents")
    conn(boxes["NOTE / RESULT"],boxes["RESULT COMPONENT"],"contains")
    d.text((w/2,555),"An attendance record joins one team member to one training event",font=font(22),fill="#"+MUTED,anchor="mm")
    im.save(path)

def shade(cell, color):
    tcPr=cell._tc.get_or_add_tcPr(); shd=OxmlElement("w:shd"); shd.set(qn("w:fill"),color); tcPr.append(shd)

def set_cell_margins(cell, top=90, start=105, bottom=90, end=105):
    tc=cell._tc; tcPr=tc.get_or_add_tcPr(); mar=OxmlElement('w:tcMar')
    for m,v in (("top",top),("start",start),("bottom",bottom),("end",end)):
        node=OxmlElement('w:'+m); node.set(qn('w:w'),str(v)); node.set(qn('w:type'),'dxa'); mar.append(node)
    tcPr.append(mar)

def set_repeat_table_header(row):
    trPr=row._tr.get_or_add_trPr(); el=OxmlElement('w:tblHeader'); el.set(qn('w:val'),'true'); trPr.append(el)

def set_keep(paragraph, next=False):
    pPr=paragraph._p.get_or_add_pPr(); el=OxmlElement('w:keepNext' if next else 'w:keepLines'); pPr.append(el)

def add_page_num(p):
    r=p.add_run(); fld=OxmlElement('w:fldSimple'); fld.set(qn('w:instr'),'PAGE'); r._r.addnext(fld)

def setup_doc(title, subtitle, short):
    d=Document(); sec=d.sections[0]
    sec.page_width=Inches(8.27); sec.page_height=Inches(11.69)
    sec.top_margin=Inches(.62); sec.bottom_margin=Inches(.62); sec.left_margin=Inches(.7); sec.right_margin=Inches(.7)
    styles=d.styles
    normal=styles['Normal']; normal.font.name='Arial'; normal.font.size=Pt(9.5); normal.font.color.rgb=RGBColor.from_string(INK)
    normal.paragraph_format.space_after=Pt(5); normal.paragraph_format.line_spacing=1.08
    for s,size,col in [('Title',26,NAVY),('Heading 1',17,NAVY),('Heading 2',11,TEAL),('Heading 3',10,TEAL)]:
        st=styles[s]; st.font.name='Arial'; st.font.size=Pt(size); st.font.bold=True; st.font.color.rgb=RGBColor.from_string(col)
        st.paragraph_format.space_before=Pt(7); st.paragraph_format.space_after=Pt(4)
    title_pr=styles['Title']._element.get_or_add_pPr()
    for border in title_pr.findall(qn('w:pBdr')):
        title_pr.remove(border)
    styles['Title'].font.color.rgb=RGBColor(0,0,0)
    header=sec.header.paragraphs[0]; header.alignment=WD_ALIGN_PARAGRAPH.RIGHT
    rr=header.add_run('TEAM TRACK  /  SOFTWARE ENGINEERING'); rr.bold=True; rr.font.size=Pt(8); rr.font.color.rgb=RGBColor.from_string(MUTED)
    footer=sec.footer.paragraphs[0]; footer.alignment=WD_ALIGN_PARAGRAPH.RIGHT
    r=footer.add_run(short+'   |   '); r.font.size=Pt(8); r.font.color.rgb=RGBColor.from_string(MUTED); add_page_num(footer)
    p=d.add_paragraph(style='Title'); p.paragraph_format.space_after=Pt(3); p.add_run(title)
    p=d.add_paragraph(); p.paragraph_format.space_after=Pt(3)
    r=p.add_run(subtitle); r.bold=True; r.font.size=Pt(12); r.font.color.rgb=RGBColor.from_string(TEAL)
    p=d.add_paragraph(); p.paragraph_format.space_after=Pt(10)
    r=p.add_run('INCREMENTO '+short[0]+'   •   TEAM TRACK   •   CURSO DE INGENIERÍA DEL SOFTWARE'); r.bold=True; r.font.size=Pt(8); r.font.color.rgb=RGBColor.from_string(MUTED)
    return d

def add_callout(doc, label, text, color=PALE_TEAL):
    t=doc.add_table(rows=1,cols=1); t.alignment=WD_TABLE_ALIGNMENT.CENTER; c=t.cell(0,0); shade(c,color); set_cell_margins(c,130,170,130,170)
    p=c.paragraphs[0]; p.paragraph_format.space_after=Pt(0)
    r=p.add_run(label+'  '); r.bold=True; r.font.color.rgb=RGBColor.from_string(TEAL)
    p.add_run(text)
    doc.add_paragraph().paragraph_format.space_after=Pt(0)

def add_bullet(doc, text, level=0):
    p=doc.add_paragraph(style='List Bullet' if level==0 else 'List Bullet 2'); p.paragraph_format.space_after=Pt(2); p.add_run(text); return p

def add_table(doc, headers, rows, widths=None, size=8.5):
    t=doc.add_table(rows=1, cols=len(headers)); t.alignment=WD_TABLE_ALIGNMENT.CENTER; t.autofit=False
    t.style='Table Grid'
    if widths:
        for c,w in zip(t.columns,widths): c.width=Inches(w)
    hdr=t.rows[0]; set_repeat_table_header(hdr)
    for i,h in enumerate(headers):
        c=hdr.cells[i]; shade(c,NAVY); set_cell_margins(c)
        p=c.paragraphs[0]; p.paragraph_format.space_after=Pt(0); r=p.add_run(h); r.bold=True; r.font.size=Pt(size); r.font.color.rgb=RGBColor(255,255,255)
    for idx,row in enumerate(rows):
        cells=t.add_row().cells
        if widths:
            for c,w in zip(cells,widths): c.width=Inches(w)
        for i,val in enumerate(row):
            c=cells[i]; c.vertical_alignment=WD_CELL_VERTICAL_ALIGNMENT.CENTER; set_cell_margins(c)
            if idx%2==1: shade(c,'F5F8FA')
            p=c.paragraphs[0]; p.paragraph_format.space_after=Pt(0); p.paragraph_format.line_spacing=1.0
            r=p.add_run(str(val)); r.font.size=Pt(size)
    doc.add_paragraph().paragraph_format.space_after=Pt(0)
    return t

def add_heading(doc, text, level=1):
    p=doc.add_paragraph(text,style=f'Heading {level}'); set_keep(p,True); return p

def build_requirements():
    d=setup_doc('Agile Requirements','Historias, escenarios, requisitos y backlog de Team Track','2')
    add_callout(d,'Objetivo','Convertir la visión del producto en trabajo priorizado y comprobable para el prototipo. El entrenador organiza un equipo; el sistema conserva datos fieles y separa conceptos deportivos específicos.')
    add_heading(d,'Alcance del incremento',1)
    d.add_paragraph('Este incremento concreta qué necesita hacer la primera versión de Team Track y cómo sabremos si cada función funciona. El entrenador es el usuario principal. El flujo académico se limita a un equipo de demostración y usa baloncesto como ejemplo, aunque el modelo evita exigir campos exclusivos de ese deporte.')
    add_table(d,['Dentro del MVP','Pospuesto o fuera'],[
        ('Equipo, temporada y deporte','Portales de jugadores y familiares'),
        ('Plantilla y actividad del equipo','Análisis automático de vídeo y predicción de lesiones'),
        ('Asistencia, notas y resultado','Pagos e integración con federaciones'),
        ('Panel con datos registrados','Asistente de IA: P2, opcional'),
    ],[3.45,3.45],9)
    add_heading(d,'Usuarios y prioridades',1)
    add_table(d,['Perfil','Necesidad en esta versión'],[
        ('Entrenador','Crear el equipo, mantener la plantilla, programar eventos y revisar registros.'),
        ('Coordinador','Puede supervisar varios equipos en el futuro; se pospone como perfil diferenciado.'),
        ('Jugador y familiar','Sin acceso directo en el prototipo inicial.'),
    ],[1.65,5.25],8.5)
    add_table(d,['Prioridad','Significado','Tratamiento'],[
        ('P0','Imprescindible para el flujo mínimo','Se implementa primero.'),
        ('P1','Importante, pero puede esperar','Se añade si el tiempo lo permite.'),
        ('P2','Idea futura u opcional','Se documenta, no bloquea la entrega.'),
    ],[1.0,3.0,2.9],8.5)
    d.add_page_break()
    add_heading(d,'Historias de usuario',1)
    d.add_paragraph('Las historias expresan el resultado que busca cada usuario. Los criterios de aceptación convierten esas necesidades en comprobaciones concretas.')
    add_table(d,['Historia','Valor esperado','Requisitos'],[
        ('Como entrenador, quiero crear un equipo y una temporada para organizar el trabajo del grupo.','Contexto estable para la actividad.','FR-01 a FR-04'),
        ('Como entrenador, quiero añadir integrantes para mantener una plantilla vigente.','Plantilla consultable y actualizable.','FR-05 a FR-09'),
        ('Como entrenador, quiero programar entrenamientos y partidos para consultar la actividad próxima.','Calendario del equipo.','FR-10 a FR-13'),
        ('Como entrenador, quiero registrar asistencia, notas y resultados para conservar el historial.','Registros deportivos fiables.','FR-14 a FR-18'),
        ('Como entrenador, quiero revisar un panel para entender la actividad reciente y próxima.','Resumen trazable del equipo.','FR-19 a FR-21'),
        ('Como entrenador, quiero pedir resúmenes o propuestas que pueda revisar antes de aplicarlas.','Apoyo opcional con control humano.','FR-22 a FR-25 (P2)'),
    ],[3.25,2.3,1.35],8)
    add_heading(d,'Escenario de uso',1)
    add_callout(d,'Registrar una sesión','El entrenador abre su equipo, programa un entrenamiento con fecha y hora, y consulta la plantilla activa. Después de la sesión marca la asistencia y añade una nota. Al volver al evento, comprueba que los datos están guardados. Si una asistencia no se registró, el sistema la muestra como pendiente; no la convierte en ausencia ni en cero.',PALE_GOLD)
    d.add_paragraph('Este escenario conecta las historias de calendario, plantilla y registro. De él se derivan FR-10, FR-14, FR-15 y las reglas de honestidad de datos.',style=None)
    add_heading(d,'Backlog funcional',1)
    add_table(d,['Área','P0 primero','P1 después'],[
        ('Equipo y temporada','Crear, seleccionar y consultar (FR-01–03)','Editar datos (FR-04)'),
        ('Plantilla','Añadir y consultar integrantes (FR-05–06)','Editar, desactivar y campos de deporte (FR-07–09)'),
        ('Calendario','Crear y consultar eventos (FR-10–11)','Editar, cancelar, lugar y notas (FR-12–13)'),
        ('Registros','Asistencia, notas y resultado (FR-14–16)','Historial y estado pendiente (FR-17–18)'),
        ('Panel','Información, próximos eventos y actividad (FR-19)','Resúmenes y estados vacíos (FR-20–21)'),
    ],[1.25,2.9,2.75],7.7)
    d.add_page_break()
    add_heading(d,'Criterios de aceptación',1)
    d.add_paragraph('Cada requisito funcional incluye un criterio verificable. Estos ejemplos muestran cómo se comprobará el flujo principal durante la demostración.')
    add_table(d,['Requisito','Comprobación observable'],[
        ('FR-01 Crear equipo','Al guardar nombre y deporte válidos, el equipo aparece en la lista y conserva el deporte al abrirlo.'),
        ('FR-02 Temporada','El entrenador identifica la temporada del equipo y no se duplica una temporada ya seleccionada.'),
        ('FR-05 Añadir integrante','Un nombre válido crea un integrante asociado al equipo y visible en la plantilla.'),
        ('FR-10 Crear evento','Un entrenamiento o partido con fecha y hora aparece identificado en el calendario.'),
        ('FR-14 Asistencia','Los estados elegidos se conservan al volver a abrir la sesión.'),
        ('FR-16 Resultado','El marcador de baloncesto puede guardarse sin imponer el mismo formato a todos los deportes.'),
        ('FR-19 Panel','El panel muestra el equipo seleccionado; cada dato enlaza a su registro de origen.'),
    ],[1.7,5.2],8)
    add_heading(d,'Requisitos de calidad',1)
    add_table(d,['Prioridad','Condición de calidad','Evidencia esperada'],[
        ('P0','Usabilidad e integridad (NFR-01/02)','Flujos entendibles; entradas inválidas no guardan datos parciales.'),
        ('P0','Privacidad y trazabilidad (NFR-03/04)','Acceso limitado al equipo autorizado; resúmenes explicables.'),
        ('P0','Datos honestos y multideporte (NFR-05/06)','Ausencias visibles como pendientes; los campos de baloncesto no son obligatorios para otros deportes.'),
        ('P1','Compatibilidad y rendimiento (NFR-07/08)','Pantalla estrecha sin scroll horizontal; vistas principales en menos de 3 s en la demo acordada.'),
        ('P1','Fiabilidad y mantenibilidad (NFR-09/10)','Acciones repetidas no duplican datos; entidades comunes y específicas se distinguen.'),
        ('P2','Accesibilidad (NFR-11)','Controles etiquetados y estados que no dependen solo del color.'),
    ],[.7,2.15,4.05],7.7)
    add_heading(d,'Reglas que protegen los registros',1)
    for s in ['El entrenador conserva la decisión sobre cualquier propuesta de IA.','Los resúmenes se basan en registros visibles; un valor ausente no equivale a cero.','Las métricas y los campos propios de un deporte no se imponen a los demás.','Un usuario solo accede a los equipos para los que tiene permiso.']:
        add_bullet(d,s)
    d.add_page_break()
    add_heading(d,'Riesgos y decisiones pendientes',1)
    add_table(d,['Pregunta','Por qué afecta el diseño'],[
        ('¿El producto se dirige a equipos amateurs, escolares o academias?','Afecta el lenguaje, los permisos y los datos necesarios.'),
        ('¿La demo gestiona uno o varios equipos por entrenador?','Afecta navegación, propiedad y alcance de la interfaz.'),
        ('¿Qué segundo deporte se usará junto al baloncesto?','Permite comprobar que el modelo común es realmente multideporte.'),
        ('¿La IA será real, simulada o solo especificada?','Determina si FR-22 a FR-25 entran en el prototipo.'),
        ('¿Qué plataforma y modo de entrega exige la asignatura?','Debe resolverse antes de elegir tecnología e implementar.'),
    ],[3.25,3.65],8)
    add_heading(d,'Resultado del incremento',1)
    add_callout(d,'Entregable','Un backlog priorizado con 25 requisitos funcionales, 11 requisitos de calidad, reglas de negocio y criterios de aceptación. El diseño de arquitectura puede partir de este alcance; las decisiones sobre plataforma y audiencia siguen abiertas.')
    add_heading(d,'Siguiente incremento',1)
    d.add_paragraph('Architecture & Design: concretar los casos de uso, el modelo de dominio, la arquitectura lógica y los controles de acceso que dan soporte a estos requisitos.')
    add_heading(d,'Material de referencia',2)
    p=d.add_paragraph('Ian Sommerville, Engineering Software Products, “Features, Scenarios and Stories”. https://iansommerville.com/engineering-software-products/presentations/3-features/')
    p.runs[0].font.size=Pt(8); p.runs[0].font.color.rgb=RGBColor.from_string(MUTED)
    return d

def build_design():
    d=setup_doc('Architecture and Design','Arquitectura, casos de uso y modelo de datos','3')
    add_callout(d,'Objetivo','Traducir los requisitos del entrenador en una estructura técnica comprensible. Este diseño conserva un prototipo pequeño, con acceso controlado por equipo y un núcleo de datos que puede admitir más de un deporte.')
    add_heading(d,'Alcance y decisiones de diseño',1)
    add_table(d,['Decisión','Elección para el prototipo','Motivo'],[
        ('Flujo de demostración','Un entrenador y un equipo.','Acota la entrega; el modelo conserva propietario y relaciones.'),
        ('Temporadas','Una temporada puede agrupar varios equipos.','Permite ampliar el producto sin cambiar el concepto.'),
        ('Deporte','Identificador configurable; campos deportivos opcionales.','Evita hacer obligatorio el modelo de baloncesto.'),
        ('Resultados','Componentes etiquetados por lado.','Admite puntos, sets u otros formatos.'),
        ('IA y tecnología','IA fuera del MVP; tecnología pendiente.','Ninguna de las dos bloquea el flujo que se puede demostrar.'),
    ],[1.25,2.5,3.15],8)
    add_heading(d,'Arquitectura lógica',1)
    d.add_paragraph('La interfaz solicita una operación; la capa de aplicación valida y coordina; las reglas de dominio protegen las relaciones; la persistencia ejecuta lecturas y escrituras autorizadas.')
    d.add_picture(str(ASSETS/'arquitectura.png'),width=Inches(6.85))
    p=d.add_paragraph('Figura 1. Recorrido lógico de una operación. La identidad y la propiedad del equipo se comprueban en las operaciones protegidas.')
    p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.runs[0].italic=True; p.runs[0].font.size=Pt(8); p.runs[0].font.color.rgb=RGBColor.from_string(MUTED)
    add_heading(d,'Por qué esta organización',1)
    add_bullet(d,'La separación entre interfaz, reglas y persistencia facilita cambiar una capa sin mezclarla con las demás.')
    add_bullet(d,'La comprobación de permisos en servidor evita confiar en filtros que solo estén en la interfaz.')
    add_bullet(d,'Una aplicación web con base de datos relacional en un único entorno basta para el MVP; el documento no exige microservicios.')
    d.add_page_break()
    add_heading(d,'Modelo de dominio',1)
    d.add_paragraph('El equipo y la temporada forman el contexto organizativo. Integrantes y eventos pertenecen al equipo. La asistencia relaciona un integrante con un entrenamiento. Las notas y resultados se conservan junto al evento.')
    d.add_picture(str(ASSETS/'dominio.png'),width=Inches(6.85))
    p=d.add_paragraph('Figura 2. Relaciones principales del modelo. El detalle de resultado se divide en componentes con etiqueta y valor.')
    p.alignment=WD_ALIGN_PARAGRAPH.CENTER; p.runs[0].italic=True; p.runs[0].font.size=Pt(8); p.runs[0].font.color.rgb=RGBColor.from_string(MUTED)
    add_table(d,['Entidad','Responsabilidad y regla clave'],[
        ('User / Season','El entrenador es propietario; la temporada tiene nombre y fechas coherentes.'),
        ('Team','Tiene nombre, deporte y temporada; la temporada y el propietario deben coincidir.'),
        ('Member','Nombre y estado activo/inactivo; los detalles de deporte son opcionales.'),
        ('Event','Entrenamiento o partido, fecha con zona horaria y estado programado/cancelado.'),
        ('Attendance','Estado presente, ausente, tarde o justificado. Si no hay fila, está “sin registrar”.'),
        ('EventResult / ResultComponent','Un resultado por partido; valores etiquetados por lado, sin inventar un marcador ausente.'),
    ],[1.7,5.2],7.8)
    d.add_page_break()
    add_heading(d,'Casos de uso',1)
    add_table(d,['ID','Actor y objetivo','Resultado'],[
        ('UC-01','Preparar equipo','Temporada y equipo asociados al entrenador.'),
        ('UC-02','Gestionar plantilla','Integrantes añadidos, editables o inactivos sin perder historial.'),
        ('UC-03','Programar actividad','Entrenamiento o partido aparece en la lista ordenada.'),
        ('UC-04','Registrar entrenamiento','Asistencia y notas quedan asociadas al evento.'),
        ('UC-05','Registrar resultado','Componentes del resultado quedan asociados al partido.'),
        ('UC-06','Consultar panel e historial','Datos recientes y próximos enlazan a sus registros.'),
    ],[.65,2.55,3.7],8.5)
    add_heading(d,'Flujo de ejemplo UC-04',1)
    add_table(d,['Paso','Acción del entrenador','Respuesta del sistema'],[
        ('1','Abre un entrenamiento del equipo.','Muestra los integrantes activos.'),
        ('2','Marca presente, ausente, tarde o justificado.','Valida que cada integrante pertenezca al equipo.'),
        ('3','Añade notas manuales, si hacen falta.','Guarda las notas asociadas al evento.'),
        ('4','Vuelve a abrir la sesión.','Conserva estados; lo no registrado queda pendiente.'),
    ],[.55,3.1,3.25],8.2)
    add_heading(d,'Operaciones principales',1)
    d.add_paragraph('Crear temporada y equipo; listar equipos autorizados; gestionar integrantes; crear, editar o cancelar eventos; registrar asistencia, notas y resultados; consultar el panel. Las escrituras devuelven el registro persistido y las restricciones únicas evitan duplicar asistencia o resultados.')
    add_callout(d,'Regla de acceso','El navegador no decide quién es propietario. Cada lectura y escritura obtiene la identidad autenticada y verifica el acceso al equipo en el servidor.',PALE_GOLD)
    d.add_page_break()
    add_heading(d,'Calidad, privacidad y trazabilidad',1)
    add_table(d,['Necesidad','Decisión de diseño','Requisito relacionado'],[
        ('Privacidad','Comprobar propietario en el servidor en cada operación; no confiar en `owner_id` enviado por el cliente.','NFR-03'),
        ('Integridad','Validar relaciones y fechas; usar transacciones y claves únicas.','NFR-02 / NFR-09'),
        ('Datos honestos','No convertir filas ausentes en ceros; panel enlaza a registros.','NFR-04 / NFR-05'),
        ('Multideporte','`sport_key` configurable y resultado por componentes etiquetados.','NFR-06 / NFR-10'),
        ('Simplicidad','Aplicación y almacenamiento en un entorno para la demo; sin servicios adicionales en el MVP.','Alcance P0'),
    ],[1.15,4.15,1.6],7.8)
    add_heading(d,'Trazabilidad con el backlog',1)
    add_table(d,['Requisitos','Elementos de diseño'],[
        ('FR-01 a FR-04','Season, Team, UC-01'),
        ('FR-05 a FR-09','Member, UC-02'),
        ('FR-10 a FR-13','Event, UC-03'),
        ('FR-14 a FR-18','Attendance, SessionNote, EventResult, UC-04 y UC-05'),
        ('FR-19 a FR-21','UC-06, consultas del panel y estados vacíos'),
        ('FR-22 a FR-25','Fuera del MVP de diseño; requieren alcance separado si se incorporan.'),
    ],[2.0,4.9],8.2)
    add_heading(d,'Decisiones pendientes',1)
    for s in ['Confirmar el lenguaje y plataforma permitidos, el entorno de entrega y si se exige despliegue.','Elegir motor de base de datos y mecanismo de autenticación después de confirmar esas restricciones.','Acordar si el prototipo opera con un equipo o varios por entrenador.','Resolver si las notas pertenecen a cualquier evento o solo a entrenamientos; concretar también los campos deportivos opcionales.','Validar el modelo con baloncesto y un segundo deporte, por ejemplo voleibol con sets.']:
        add_bullet(d,s)
    add_callout(d,'Siguiente incremento','Software Development: seleccionar el entorno de la asignatura y construir primero preparación del equipo, plantilla, calendario y panel; después incorporar asistencia y resultados.')
    add_heading(d,'Material de referencia',2)
    p=d.add_paragraph('Ian Sommerville, Engineering Software Products, “Software Architecture”. https://iansommerville.com/engineering-software-products/presentations/4-architecture/')
    p.runs[0].font.size=Pt(8); p.runs[0].font.color.rgb=RGBColor.from_string(MUTED)
    return d

if __name__=='__main__':
    make_architecture(ASSETS/'arquitectura.png')
    make_domain(ASSETS/'dominio.png')
    build_requirements().save(OUT/'TeamTrack_Incremento_2_Agile_Requirements.docx')
    build_design().save(OUT/'TeamTrack_Incremento_3_Architecture_and_Design.docx')
    print('created', OUT)
