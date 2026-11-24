# Team Track — Requisitos del producto

**Estado:** borrador inicial para revisión  
**Base:** [PRODUCT_DEFINITION.md](PRODUCT_DEFINITION.md)  
**Versión:** 0.1

## 1. Propósito

Este documento convierte la visión de Team Track en requisitos que se puedan diseñar, implementar y comprobar. La primera entrega académica debe demostrar un flujo mínimo para un equipo deportivo y usar baloncesto como ejemplo, sin fijar el modelo común a las reglas de ese deporte.

## 2. Alcance de la primera versión

La primera versión cubrirá:

- crear un equipo y asociarlo a una temporada y un deporte;
- gestionar integrantes de la plantilla;
- programar entrenamientos y partidos;
- registrar asistencia, notas y resultados;
- consultar un panel resumido del equipo.

El asistente de IA es **opcional** para el prototipo funcional. Si se incluye, solo resumirá o propondrá contenido basado en datos disponibles, y no modificará registros ni tomará decisiones deportivas automáticamente.

Fuera del alcance: análisis de vídeo, predicción de lesiones, estadísticas exhaustivas, pagos, sincronización con federaciones, roles de jugadores/familiares y soporte completo de todos los deportes.

## 3. Actores

| Actor | Descripción | Permisos previstos en el prototipo |
|---|---|---|
| Entrenador | Usuario principal que organiza la actividad deportiva. | Crear y consultar equipo, temporada, plantilla, eventos y registros. |
| Coordinador | Responsable que puede supervisar varios equipos. | Se pospone; en la primera versión puede usar las mismas funciones que el entrenador. |
| Jugador | Integrante de la plantilla. | Sin acceso directo en la primera versión. |
| Familiar/tutor | Consulta información autorizada de un jugador. | Fuera del alcance inicial. |

**Supuesto inicial:** el prototipo puede trabajar con un entrenador y un equipo. El diseño deberá permitir que el requisito de varios equipos por usuario se añada sin cambiar el significado de los datos.

## 4. Prioridades

- **P0 — imprescindible:** sin esto no se cumple el flujo mínimo del producto.
- **P1 — importante:** aporta valor, pero puede quedar para una iteración posterior si limita el prototipo.
- **P2 — futuro:** idea documentada, no necesaria para la primera entrega.

## 5. Requisitos funcionales

### Gestión del equipo y la temporada

| ID | Prioridad | Requisito | Criterio de aceptación |
|---|---|---|---|
| FR-01 | P0 | El sistema permitirá crear un equipo indicando, como mínimo, su nombre y deporte. | Al guardar datos válidos, el equipo aparece en la lista y conserva el deporte seleccionado al volver a abrirlo. |
| FR-02 | P0 | El sistema permitirá crear o seleccionar una temporada para el equipo. | El entrenador puede identificar a qué temporada pertenece el equipo; no se crea una temporada duplicada al elegir una existente. |
| FR-03 | P0 | El sistema mostrará los datos básicos del equipo y su temporada. | Desde la lista se puede abrir el equipo correcto y consultar ambos datos. |
| FR-04 | P1 | El sistema permitirá editar el nombre del equipo y los datos básicos de temporada. | Tras guardar, la vista muestra los nuevos datos y mantiene los registros asociados. |

### Plantilla

| ID | Prioridad | Requisito | Criterio de aceptación |
|---|---|---|---|
| FR-05 | P0 | El entrenador podrá añadir un integrante a la plantilla con nombre y, opcionalmente, dorsal, posición o función. | Un integrante con nombre válido queda asociado al equipo y aparece en la plantilla. |
| FR-06 | P0 | El entrenador podrá consultar la plantilla del equipo. | La lista muestra los integrantes activos y sus datos registrados; si no hay integrantes, informa que la plantilla está vacía. |
| FR-07 | P1 | El entrenador podrá editar los datos básicos de un integrante. | Los cambios se reflejan al volver a abrir el perfil y no crean otro integrante. |
| FR-08 | P1 | El entrenador podrá marcar a un integrante como inactivo sin borrar su historial. | El integrante deja de aparecer como activo y sus registros previos siguen consultables. |
| FR-09 | P1 | Los campos específicos de deporte serán opcionales y se mostrarán según la configuración del deporte. | Un equipo de otro deporte puede registrar integrantes sin introducir una posición o un dorsal de baloncesto. |

### Calendario y actividad

| ID | Prioridad | Requisito | Criterio de aceptación |
|---|---|---|---|
| FR-10 | P0 | El entrenador podrá crear un evento como entrenamiento o partido con fecha, hora y equipo. | El evento válido aparece en el calendario y se identifica por su tipo. |
| FR-11 | P0 | El entrenador podrá consultar próximos eventos y eventos anteriores del equipo. | La lista ordena los eventos por fecha y diferencia los futuros de los pasados. |
| FR-12 | P1 | El entrenador podrá editar o cancelar un evento. | El evento actualizado aparece con sus datos nuevos; el cancelado queda claramente señalado o deja de figurar como próximo. |
| FR-13 | P1 | El evento podrá incluir lugar y notas, si el entrenador dispone de esa información. | Los campos pueden dejarse vacíos y, si se guardan, se muestran en el detalle del evento. |

### Registros de entrenamiento y partido

| ID | Prioridad | Requisito | Criterio de aceptación |
|---|---|---|---|
| FR-14 | P0 | El entrenador podrá registrar la asistencia de los integrantes a un entrenamiento. | Para cada integrante se puede guardar un estado de asistencia definido por el prototipo; al volver a abrir la sesión se conserva. |
| FR-15 | P0 | El entrenador podrá guardar notas generales de una sesión. | Las notas introducidas se muestran en el detalle de la sesión y no se generan automáticamente. |
| FR-16 | P0 | El entrenador podrá registrar el resultado de un partido con los datos básicos que correspondan al deporte configurado. | Para el ejemplo de baloncesto se pueden guardar los puntos de ambos equipos; el sistema no exige un formato de marcador común a todos los deportes. |
| FR-17 | P1 | El entrenador podrá consultar el historial de sesiones y resultados. | El historial muestra eventos previos y solo los registros asociados al equipo seleccionado. |
| FR-18 | P1 | El sistema indicará cuándo un registro todavía no contiene datos. | La ausencia de asistencia, resultado o notas se muestra como “sin registrar” o equivalente, no como cero ni como un dato inferido. |

### Panel del equipo

| ID | Prioridad | Requisito | Criterio de aceptación |
|---|---|---|---|
| FR-19 | P0 | El sistema mostrará un panel con información básica del equipo, próximos eventos y actividad reciente. | El panel corresponde al equipo seleccionado y los datos enlazan a sus registros de origen. |
| FR-20 | P1 | El panel mostrará contadores o resúmenes calculados a partir de datos registrados. | Cada cifra puede explicarse por los registros usados y se distingue de los datos introducidos manualmente. |
| FR-21 | P1 | El sistema mostrará estados vacíos útiles cuando aún no existan sesiones o resultados. | El panel comunica qué falta por registrar y no presenta valores inventados. |

### Asistente de IA (opcional)

| ID | Prioridad | Requisito | Criterio de aceptación |
|---|---|---|---|
| FR-22 | P2 | El usuario podrá pedir un resumen o hacer una pregunta sobre el equipo seleccionado. | La respuesta se limita a la información disponible para ese equipo y declara si faltan datos relevantes. |
| FR-23 | P2 | El asistente podrá generar una propuesta de planificación como borrador. | La propuesta se identifica como contenido generado y no cambia calendario, plantilla ni registros. |
| FR-24 | P2 | El usuario deberá confirmar por separado cualquier acción que convierta una propuesta en un registro del sistema. | Sin una acción explícita de confirmación, no se crea ni modifica ningún registro. |
| FR-25 | P2 | El sistema distinguirá datos registrados, cálculos y texto generado por IA. | En la interfaz se puede reconocer el origen de la información presentada. |

## 6. Requisitos no funcionales

| ID | Prioridad | Requisito de calidad | Criterio de aceptación propuesto |
|---|---|---|---|
| NFR-01 | P0 | **Usabilidad:** los flujos principales serán comprensibles para un entrenador con conocimientos técnicos básicos. | En una demostración, el usuario puede crear equipo, añadir un integrante y programar una sesión siguiendo la interfaz sin instrucciones técnicas. |
| NFR-02 | P0 | **Integridad:** el sistema validará los campos obligatorios y los formatos básicos antes de guardar. | Una entrada inválida muestra un mensaje claro y no crea un registro parcial. |
| NFR-03 | P0 | **Privacidad:** cada operación de lectura o escritura se limitará al equipo autorizado del usuario. | Un usuario no autorizado no puede consultar ni modificar registros del equipo mediante la interfaz ni mediante una petición directa. |
| NFR-04 | P0 | **Trazabilidad:** los resúmenes deben poder relacionarse con los registros que los originaron. | Para cada resumen se identifican los datos usados o se explica su cálculo. |
| NFR-05 | P0 | **Honestidad de datos:** el sistema no sustituirá datos ausentes por ceros ni generará observaciones como si fueran hechos. | Si un dato no se ha registrado, la interfaz lo presenta como ausente o pendiente. |
| NFR-06 | P0 | **Separación por deporte:** el núcleo del sistema no requerirá conceptos exclusivos de un deporte. | Se puede crear y administrar un equipo sin completar campos propios de baloncesto. |
| NFR-07 | P1 | **Compatibilidad:** las páginas principales serán utilizables en un navegador de escritorio y en una pantalla estrecha. | Los flujos de consulta y registro no requieren desplazamiento horizontal en los tamaños elegidos para la evaluación. |
| NFR-08 | P1 | **Rendimiento:** las operaciones habituales responderán en un tiempo adecuado para una demostración académica. | En el entorno de demostración acordado, las vistas principales cargan en menos de 3 segundos con un conjunto de datos pequeño. |
| NFR-09 | P1 | **Fiabilidad:** repetir una acción por error no debería duplicar datos. | El prototipo evita duplicados mediante validación, actualización del mismo registro o una confirmación antes de repetir una creación. |
| NFR-10 | P1 | **Mantenibilidad:** las entidades comunes y específicas estarán documentadas y separadas. | El modelo de datos explica qué campos son comunes y cuáles dependen del deporte. |
| NFR-11 | P2 | **Accesibilidad:** formularios y estados principales serán operables con etiquetas y controles legibles. | Los campos tienen etiquetas comprensibles y el estado no se comunica solo mediante color. |

## 7. Reglas de negocio

1. Un equipo pertenece a una temporada y tiene un deporte seleccionado.
2. Un evento es un entrenamiento o un partido; ambos comparten datos básicos, pero pueden tener datos propios.
3. La plantilla puede cambiar durante la temporada. Desactivar a un integrante no debe borrar sus registros anteriores.
4. La asistencia, los resultados y las observaciones son datos introducidos o confirmados por una persona.
5. Un valor ausente no equivale a cero.
6. Las métricas específicas de un deporte no se aplican a equipos de otros deportes.
7. El contenido de IA es asesoramiento o borrador. No constituye un hecho registrado ni se aplica sin confirmación explícita.
8. Un usuario solo puede acceder a equipos para los que tiene permiso.

## 8. Flujos principales de aceptación

### Flujo A — Preparar equipo

1. El entrenador crea o selecciona una temporada.
2. Crea un equipo e indica nombre y deporte.
3. Abre el equipo y confirma que temporada y deporte son correctos.

**Resultado esperado:** el equipo está disponible para añadir integrantes y programar actividad.

### Flujo B — Registrar entrenamiento

1. El entrenador abre el equipo.
2. Programa un entrenamiento con fecha y hora.
3. Añade integrantes a la plantilla si es necesario.
4. Tras la sesión, registra asistencia y notas.
5. Abre el evento y comprueba el registro guardado.

**Resultado esperado:** el evento y sus datos aparecen en el historial del equipo, sin inventar valores ausentes.

### Flujo C — Registrar partido

1. El entrenador programa un partido.
2. Registra el resultado usando el formato de marcador del deporte configurado.
3. Consulta el panel o historial.

**Resultado esperado:** el resultado aparece asociado al partido y al equipo correctos.

### Flujo D — Consultar resumen

1. El entrenador abre el panel del equipo.
2. Revisa próximos eventos, actividad reciente y los registros existentes.
3. Identifica qué información está pendiente.

**Resultado esperado:** el panel resume datos disponibles y diferencia claramente datos faltantes.

### Flujo E — Consultar una propuesta de IA (solo si se implementa)

1. El entrenador pregunta por el equipo seleccionado.
2. El sistema presenta una respuesta basada en datos disponibles y explica límites relevantes.
3. Si se ofrece una propuesta, el entrenador puede revisarla sin aplicarla.
4. Solo una confirmación separada la convierte en un borrador o registro.

**Resultado esperado:** ninguna pregunta o respuesta de IA cambia datos deportivos por sí sola.

## 9. Datos mínimos propuestos

| Entidad | Campos comunes iniciales | Campos opcionales o dependientes del deporte |
|---|---|---|
| Temporada | nombre, fecha de inicio, fecha de fin opcional | división o competición |
| Equipo | nombre, deporte, temporada | categoría, color, sede |
| Integrante | nombre, estado activo/inactivo | dorsal, posición, función, fecha de nacimiento (evitar en el prototipo salvo necesidad) |
| Evento | tipo, fecha, hora, equipo | lugar, rival, notas |
| Asistencia | integrante, estado, evento | motivo o comentario |
| Resultado | evento, marcador registrado | periodos, sets, mangas u otros componentes específicos |
| Nota | evento, contenido, autor | etiquetas |

Este esquema es conceptual. La etapa de diseño decidirá tipos concretos, relaciones y qué campos se implementan realmente.

## 10. Trazabilidad con la visión

| Objetivo de producto | Requisitos relacionados |
|---|---|
| Organizar equipo y temporada | FR-01 a FR-04 |
| Mantener la plantilla | FR-05 a FR-09 |
| Planificar y registrar actividad | FR-10 a FR-18 |
| Consultar un resumen del equipo | FR-19 a FR-21 |
| Probar apoyo de IA con control humano | FR-22 a FR-25 |
| Asegurar privacidad, claridad y adaptación multideporte | NFR-01 a NFR-11; reglas 5 a 8 |

## 11. Riesgos y preguntas para cerrar antes del diseño

- **Público objetivo:** concretar si se trata de equipos amateurs, escolares o academias; cambia permisos y lenguaje.
- **Multiplicidad:** decidir si el prototipo gestiona un equipo o varios equipos por entrenador.
- **Deportes del ejemplo:** decidir qué segundo deporte, además del baloncesto, se usará para comprobar que el modelo no es específico.
- **Campos sensibles:** confirmar que no es necesario guardar fecha de nacimiento u otros datos personales sensibles para la práctica.
- **IA real o simulada:** decidir si se conecta un proveedor, se usa un prototipo sin conexión o se deja solo especificada.
- **Entorno de ejecución:** fijar tecnologías exigidas por la asignatura antes de convertir requisitos en tareas técnicas.

## 12. Próxima etapa

Los casos de uso, el modelo de datos y la arquitectura mínima se concretan en [DESIGN.md](DESIGN.md). La siguiente etapa es seleccionar el entorno permitido por la asignatura y comenzar el prototipo con ese diseño, resolviendo antes las restricciones de tecnología y entrega que afecten a la implementación.
