import { Box, Flex } from "@chakra-ui/react";
import { useColorModeValue } from "@/components/ui/color-mode";
import { LeadColumn } from "../../components/Professionals/LeadColumn";
import type { LeadColumnData, LeadCardData, OdooLead } from "../../types/index";
import { getMyLeads } from "@/api/ProfessionalsAPI";
import { useLoaderData } from "react-router-dom";

// Columnas estáticas de nuestro Kanban
const columns: LeadColumnData[] = [
  { id: "interesados", title: "Interesados" },
  { id: "citasReservadas", title: "Citas Reservadas" },
  { id: "serviciosRealizados", title: "Servicios Realizados" },
  { id: "citasCanceladas", title: "Citas Canceladas" },
];

// Función para mapear el nombre de la etapa de Odoo a nuestro ID de columna
const stageNameToColumnId = (stageName: string): LeadColumnData["id"] => {
  switch (stageName) {
    case "Interesado":
      return "interesados";
    case "Cita reservada":
      return "citasReservadas";
    case "Servicio realizado":
      return "serviciosRealizados";
    case "Cancelado":
      return "citasCanceladas";
    default:
      return "interesados"; // Columna por defecto
  }
};

// El loader ahora llama a nuestra API
export async function loader() {
  const odooLeads = await getMyLeads();
  return odooLeads;
}

export default function ProfessionnalLeadsView() {
  // Obtenemos los datos crudos de Odoo desde el loader
  const odooLeads = useLoaderData() as OdooLead[];

  const bgColor = useColorModeValue("bg.canvas", "bg.canvas");

  // Transformamos los datos de Odoo al formato que nuestros componentes necesitan
  const leads: LeadCardData[] = odooLeads.map((lead) => ({
    id: lead.id,
    columnId: stageNameToColumnId(lead.stage_id[1]), // Mapeamos el nombre de la etapa
    content: lead.name,
    clientName: lead.partner_id[1], // El nombre del cliente
    service: lead.name.split(" - ")[0] || "Servicio General", // Extraemos el servicio del título
  }));

  return (
    <Box p={{ base: 4, md: 8 }} bg={bgColor} minH="100vh" overflowX="auto">
      <Flex
        direction={{ base: "column", md: "row" }}
        gap={6}
        alignItems="stretch"
      >
        {columns.map((col) => (
          <LeadColumn
            key={col.id}
            column={col}
            // Filtramos las tareas transformadas para cada columna
            leads={leads.filter((lead) => lead.columnId === col.id)}
          />
        ))}
      </Flex>
    </Box>
  );
}
