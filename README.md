# TeamTrack

Prototipo web para organizar equipos deportivos, temporadas, plantilla, entrenamientos, partidos y registros. El alcance funcional sigue los requisitos de producto acordados para el Incremento 2.

## Empezar

Abre `index.html` en un navegador moderno. No hay que instalar dependencias ni configurar un servidor para probar el prototipo.

La primera apertura muestra información de ejemplo de un equipo de baloncesto. Se puede cambiar, añadir equipos y gestionar sus integrantes y actividad. Los cambios se guardan en el almacenamiento local del navegador.

## Funciones

- Crear y editar equipos, deportes y temporadas; incluye baloncesto, voleibol, fútbol y deporte configurable.
- Añadir, editar, desactivar y reactivar integrantes sin borrar el historial.
- Programar, editar y cancelar entrenamientos y partidos.
- Registrar asistencia como presente, ausente, tarde o justificado; lo no registrado permanece pendiente.
- Guardar notas manuales y resultados con componentes etiquetados (puntos, sets, goles, etc.).
- Consultar resumen, calendario e historial con estados vacíos y datos ausentes explícitos.
- Descargar una copia JSON de los datos del navegador.

## Alcance actual

Este es un prototipo de interfaz con persistencia local. No incorpora cuentas, sincronización entre dispositivos, API ni base de datos compartida. Por ello, los datos guardados en un navegador no son privados frente a otras personas que usan el mismo perfil y no sirven como control de acceso multiusuario. El diseño de autenticación, autorización en servidor y persistencia compartida queda para una etapa técnica posterior.

El asistente de IA está fuera del alcance mínimo y no se ha conectado ningún proveedor externo.

## Documentación

- `PRODUCT_DEFINITION.md`: visión, usuarios, límites y alcance.
- `REQUIREMENTS.md`: backlog priorizado y criterios de aceptación del Incremento 2.
- `DESIGN.md`: casos de uso y diseño de arquitectura y dominio.
- `entregables_clase/`: documentos de los incrementos y recursos gráficos.
