export type ActivityTemplate = {
  stepNumber: number;
  stepName: string;
  role: string;
  activityName: string;
};

const templates = [
  {
    step: 0,
    stepName: 'Project Charter',
    activities: [
      { role: 'GERENTE/COORDINADOR', name: 'Fecha de "lanzamiento del proyecto"' },
      { role: 'GERENTE/COORDINADOR', name: 'Carta del proyecto abierto' },
      { role: 'GERENTE/COORDINADOR', name: 'Definir criterios de éxito: Por que?' },
      { role: 'GERENTE/COORDINADOR', name: 'Definir la orden de inversion del proyecto (+-25%)' },
      { role: 'OSL', name: 'Fecha de "lanzamiento del proyecto"' },
      { role: 'OSL', name: 'Carta del proyecto abierto' },
      { role: 'SHE', name: 'Fecha de "Lanzamiento de proyecto"' },
      { role: 'SHE', name: 'Establecer metas de SHE en la Carta del Proyecto' }
    ]
  },
  {
    step: 1,
    stepName: 'New design',
    activities: [
      { role: 'GERENTE/COORDINADOR', name: 'Revisar referencias de proyectos y revisar estandares' },
      { role: 'GERENTE/COORDINADOR', name: 'identificar las partes interesadas' },
      { role: 'GERENTE/COORDINADOR', name: 'Desarrollar declaracion de alcance' },
      { role: 'GERENTE/COORDINADOR', name: 'Definir el plan de gestión de cambios' },
      { role: 'OSL', name: 'Evaluar el COA para medir los impactos en el cumplimiento' },
      { role: 'OSL', name: 'Desarrollar el plan de cumplimiento' }
    ]
  },
  {
    step: 2,
    stepName: 'Basic Design',
    activities: [
      { role: 'GERENTE/COORDINADOR', name: 'Grupo 3: Definir equipo de proyecto' },
      { role: 'GERENTE/COORDINADOR', name: 'Preparar WBS' },
      { role: 'GERENTE/COORDINADOR', name: 'Presupuestación (+ -10%) y gestión de costes' },
      { role: 'GERENTE/COORDINADOR', name: 'Identificar los principales riesgos' },
      { role: 'GERENTE/COORDINADOR', name: 'Definir criterios de éxito: QUÉ y CÓMO' },
      { role: 'GERENTE/COORDINADOR', name: 'realizar VSED' },
      { role: 'GERENTE/COORDINADOR', name: 'Elaborar proyecto civil/ Mecanico/ electrico' },
      { role: 'GERENTE/COORDINADOR', name: 'Diagrama de flujo de proceso elaborado' },
      { role: 'GERENTE/COORDINADOR', name: 'Análisis de riesgo cualitativo' },
      { role: 'GERENTE/COORDINADOR', name: 'Preparar RFQ del equipo principal' },
      { role: 'GERENTE/COORDINADOR', name: 'Desarrolle RFQ para RTI (SI APLICA)' },
      { role: 'GERENTE/COORDINADOR', name: 'Desarrolle RFQ para ATEX (SI APLICA)' },
      { role: 'GERENTE/COORDINADOR', name: 'Preparar RFQ para el informe final' },
      { role: 'GERENTE/COORDINADOR', name: 'Incluir la calibración de instrumentos en RFQ / alcance' },
      { role: 'GERENTE/COORDINADOR', name: 'Incluya prueba hidrostática / presión del sistema (SI APLICA)' },
      {
        role: 'GERENTE/COORDINADOR',
        name: 'Definir la necesidad de un Prerequisite para comisionamiento (si aplica)'
      },
      { role: 'OSL', name: 'Grupo 3: Definir miembros GTCI' },
      { role: 'OSL', name: 'Plan de suministro y evaluación de riesgos de tiempo de inactividad' },
      { role: 'OSL', name: 'Validar el plan de puesta en marcha integrado' },
      { role: 'OSL', name: 'Definir criterios para TPM en la RFQ de equipos' },
      { role: 'OSL', name: 'realizar VSED' },
      { role: 'OSL', name: 'Gestión de cambios abierta' },
      { role: 'SHE', name: 'Iniciar evaluaciones de riesgos' },
      { role: 'SHE', name: 'Integre SHE en el diseño (requisitos de riesgo y proceso)' }
    ]
  },
  {
    step: 3,
    stepName: 'Detail design',
    activities: [
      { role: 'GERENTE/COORDINADOR', name: 'Establecer programación base como ruta crítica' },
      { role: 'GERENTE/COORDINADOR', name: 'Gestión de cambios abierta' },
      { role: 'GERENTE/COORDINADOR', name: 'Equipo SAT' },
      { role: 'OSL', name: 'Detallar requisitos de producción/operación' },
      { role: 'SHE', name: 'Desarrollar el Plan SHE de Construcción/Instalación' }
    ]
  },
  {
    step: 4,
    stepName: 'Construction',
    activities: [
      { role: 'GERENTE/COORDINADOR', name: 'Realizar obra civil' },
      { role: 'OSL', name: 'Actualizar lista de riesgos' },
      { role: 'OSL', name: 'Solicitar Licencias CETESB (si aplica)' }
    ]
  },
  {
    step: 5,
    stepName: 'Installation',
    activities: [
      { role: 'GERENTE/COORDINADOR', name: 'Gestionar el envío y el despacho de aduanas.' },
      { role: 'OSL', name: 'Seguimiento y contratación de servicios / recursos (según necesidades)' }
    ]
  },
  {
    step: 6,
    stepName: 'Commissioning',
    activities: [
      { role: 'GERENTE/COORDINADOR', name: 'Hacer entrega de DATABOOK NR-12 al cliente / fábrica.' },
      { role: 'GERENTE/COORDINADOR', name: 'Hacer entrega de DATABOOK NR-10 al cliente / fábrica.' },
      { role: 'OSL', name: 'Liderar el equipo de producción' }
    ]
  },
  {
    step: 7,
    stepName: 'Qualification',
    activities: [
      { role: 'SHE', name: 'Cierre SHE para la calificación' },
      { role: 'SHE', name: 'AAR (Revisión posterior a la acción)' }
    ]
  },
  {
    step: 8,
    stepName: 'Verification',
    activities: [
      { role: 'GERENTE/COORDINADOR', name: 'Documentar y publicar lecciones aprendidas (PDA)' },
      { role: 'OSL', name: 'Verifique la capacidad de la operación.' }
    ]
  },
  {
    step: 9,
    stepName: 'Handover',
    activities: [
      { role: 'GERENTE/COORDINADOR', name: 'Elaborar relatórios de encerramento' },
      { role: 'GERENTE/COORDINADOR', name: 'Formalizar el traspaso' },
      { role: 'OSL', name: 'Finalizar la documentación del proyecto' }
    ]
  }
] as const;

export const activityTemplates: ActivityTemplate[] = templates.flatMap((step) =>
  step.activities.map((activity) => ({
    stepNumber: step.step,
    stepName: step.stepName,
    role: activity.role,
    activityName: activity.name
  }))
);
