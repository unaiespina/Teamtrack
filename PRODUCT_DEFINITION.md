# Team Track — Product Definition

**Estado:** primera definición para el proyecto académico  
**Tipo de producto:** sistema de gestión de equipos deportivos (Sports Team Management System)  
**Deporte de referencia para ejemplos y prototipo:** baloncesto  
**Alcance del producto:** equipos de cualquier deporte

## 1. Visión

Team Track ayuda a entrenadores y responsables deportivos a organizar la actividad de su equipo en un solo lugar: temporadas, plantilla, entrenamientos, partidos y seguimiento. El sistema reúne información introducida por las personas responsables y puede convertirla en resúmenes y propuestas comprensibles. El entrenador conserva la decisión sobre cualquier cambio deportivo.

**Promesa del producto:** menos tiempo coordinando información dispersa y más claridad para preparar y revisar el trabajo del equipo.

## 2. Problema y oportunidad

Muchos equipos coordinan jugadores, horarios, asistencia, sesiones y resultados mediante conversaciones, documentos y hojas de cálculo separados. Esto dificulta mantener la información actualizada y reconstruir qué ocurrió durante una temporada. Una herramienta compartida puede simplificar esas tareas sin exigir al equipo una infraestructura profesional ni automatizar decisiones que requieren criterio deportivo.

## 3. Usuarios principales

- **Entrenador/a:** organiza el equipo, prepara sesiones y revisa la actividad y el progreso registrado.
- **Coordinador/a o director/a deportivo/a:** supervisa varios equipos o temporadas y mantiene una visión organizativa común.
- **Jugador/a:** en una posible ampliación, consulta su calendario y la información que el equipo decide compartir.
- **Familiar/tutor:** en una posible ampliación para equipos juveniles, consulta horarios y avisos autorizados.

Para la primera versión académica, el usuario central será el entrenador. Los perfiles de jugador y familiar quedan fuera del producto mínimo.

## 4. Alcance multideporte

El producto no será una aplicación de baloncesto con otro nombre. El modelo central debe servir a deportes distintos y permitir que cada deporte aporte sus propios conceptos cuando sean necesarios.

### Núcleo común

- organización, equipo y temporada;
- integrantes y estado de la plantilla;
- calendario de entrenamientos y partidos;
- asistencia y notas de sesión;
- resultados y seguimiento básico;
- roles y permisos de usuario;
- panel con información del equipo.

### Información específica del deporte

Las posiciones, estadísticas, reglas y formatos de competición dependen del deporte. Team Track las tratará como configuración o módulos específicos, en vez de asumir que todos los deportes tienen posiciones, puntuaciones o métricas de baloncesto. El prototipo puede usar baloncesto para explicar estas variaciones, pero deberá señalar qué datos son propios de ese deporte.

## 5. Objetivos y límites

### Objetivos

1. Mantener la información básica de un equipo y su temporada.
2. Facilitar la planificación de entrenamientos y partidos.
3. Registrar asistencia, resultados y observaciones de forma consistente.
4. Mostrar resúmenes que expliquen de qué datos proceden.
5. Explorar cómo una IA puede ayudar con consultas o borradores sin inventar datos ni ejecutar decisiones deportivas.
6. Producir documentación suficiente para desarrollar y evaluar el proyecto en seis etapas.

### Fuera del alcance inicial

- análisis automático de vídeo;
- predicción de lesiones o diagnósticos;
- decisiones automáticas sobre convocatorias, roles, tácticas o minutos;
- integraciones con federaciones o sistemas de competición;
- facturación, pagos y gestión completa de instalaciones;
- soporte profundo de las reglas y estadísticas de todos los deportes;
- publicación comercial o preparación para tiendas de aplicaciones.

## 6. Producto mínimo propuesto

El primer prototipo se limitará a un flujo pequeño y verificable:

1. Crear una temporada y un equipo, seleccionando un deporte.
2. Añadir, consultar y actualizar integrantes de la plantilla.
3. Crear entrenamientos y partidos en un calendario sencillo.
4. Registrar asistencia y el resultado del partido; permitir notas manuales.
5. Consultar un panel de equipo con próximos eventos y resúmenes de lo registrado.
6. Ofrecer, como función opcional y claramente separada, un asistente que responda preguntas o redacte propuestas usando solo la información disponible. Toda propuesta deportiva requiere revisión humana.

El prototipo puede representar el baloncesto con campos y ejemplos propios, pero no debe hacer que las entidades comunes dependan de una cancha, quinteto o estadística exclusiva de ese deporte.

## 7. Principios de producto

- **El entrenador decide:** la IA puede resumir o proponer, pero no altera planes ni registros deportivos por sí sola.
- **Datos trazables:** los resúmenes deben basarse en registros visibles y mostrar cuándo faltan datos.
- **Diseño multideporte:** separar conceptos comunes de reglas y métricas específicas.
- **Privacidad por equipo:** cada usuario accede solo a los equipos y datos para los que tenga permiso.
- **Simplicidad académica:** priorizar flujos pequeños, demostrables y documentables.
- **Registro factual:** no inferir asistencia, rendimiento o estadísticas que el equipo no haya introducido o confirmado.

## 8. Requisitos de calidad iniciales

- La interfaz debe ser comprensible para un entrenador con conocimientos técnicos básicos.
- Las operaciones principales deben poder completarse desde web; la adaptación móvil se considera una mejora de diseño, no un requisito obligatorio del primer prototipo.
- El sistema debe validar entradas y evitar duplicar un registro al repetir una acción.
- Los datos de un equipo no deben mostrarse a usuarios sin autorización.
- Debe distinguirse entre datos registrados, cálculos derivados y contenido generado por IA.
- El diseño debe permitir añadir un deporte o una métrica específica sin cambiar el significado de los datos de otros deportes.

## 9. Historias de usuario iniciales

- Como entrenador, quiero crear una temporada y un equipo para organizar el trabajo del grupo.
- Como entrenador, quiero añadir integrantes y actualizar su estado para mantener una plantilla vigente.
- Como entrenador, quiero programar entrenamientos y partidos para consultar la actividad próxima.
- Como entrenador, quiero registrar asistencia y resultados para conservar el historial del equipo.
- Como coordinador, quiero revisar un resumen de actividad para conocer el estado de mis equipos.
- Como entrenador, quiero pedir un resumen basado en los registros del equipo y revisar cualquier propuesta antes de aplicarla.
- Como usuario de otro deporte, quiero que la aplicación no me obligue a introducir posiciones o estadísticas de baloncesto.

## 10. Relación con Basketball AI

La revisión de la documentación de Basketball AI muestra una afinidad alta en el flujo de gestión de equipos y en el papel del entrenador. Las ideas que probablemente servirán como **referencia funcional o de diseño** son:

| Área | Afinidad | Adaptación necesaria en Team Track |
|---|---|---|
| Equipos, temporadas y plantillas | Muy alta | Hacer que deporte y temporada formen parte de la organización desde el principio. |
| Entrenamientos, asistencia y notas | Muy alta | Generalizar las sesiones y dejar las métricas avanzadas para módulos específicos. |
| Panel de actividad e historial | Alta | Mostrar un resumen común; evitar indicadores exclusivamente de baloncesto. |
| Evaluaciones y seguimiento individual | Alta | Hacerlos opcionales y configurables; no asumir que cada deporte usa la misma escala. |
| IA de apoyo para entrenadores | Alta como concepto | Empezar por preguntas y resúmenes acotados; exigir revisión antes de cualquier cambio. |
| Cola de propuestas y aprobación | Alta como patrón de control | Mantener la separación entre sugerir, revisar y aplicar. |
| Aplicación web y móvil | Alta como dirección | Elegir una plataforma simple para el prototipo de seis etapas; evaluar móvil después. |
| Análisis de vídeo y alto rendimiento | Baja para el prototipo | Excluirlo del alcance inicial por complejidad, datos y validación. |

**Conclusión:** Basketball AI puede servir como referencia de necesidades, flujos de entrenador y patrones de control humano. Team Track comparte gran parte del dominio, pero amplía el producto a más deportes y debe tratar como configurables las posiciones, métricas y reglas. La reutilización prevista en este trabajo es conceptual: requisitos, lecciones y patrones. Basketball AI y Team Track se mantienen como proyectos separados; no se modificarán ni copiarán su código, secretos, datos, textos internos o activos.

## 11. Plan del trabajo en seis etapas

1. **Visión y alcance:** problema, usuarios, objetivos, límites y deporte de referencia.
2. **Requisitos:** historias de usuario, requisitos funcionales, calidad y criterios de aceptación.
3. **Diseño:** arquitectura sencilla, modelo de datos común y puntos de extensión por deporte.
4. **Prototipo:** flujo mínimo de equipo, plantilla, calendario y registros.
5. **IA y evaluación:** asistente opcional con datos acotados, control humano y casos de prueba documentados.
6. **Cierre:** evaluación frente a requisitos, limitaciones, privacidad, mantenimiento y presentación final.

## 12. Decisiones pendientes para las siguientes etapas

- nombre definitivo y público objetivo concreto (club amateur, academia, equipo escolar u otro);
- si el prototipo tendrá un solo equipo o varios equipos por usuario;
- qué campos mínimos tendrá una sesión común y qué campos serán específicos del deporte;
- si la IA se implementará realmente o solo se documentará/prototipará;
- tecnología y formato de entrega exigidos por la asignatura.

Estas decisiones no impiden usar esta definición como punto de partida; se cerrarán al convertir la visión en requisitos verificables.
