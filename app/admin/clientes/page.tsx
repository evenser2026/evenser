import { getClientes } from "@/lib/actions/clientes";
import { getAppConfig } from "@/lib/actions/config";
import ClientesView from "./ClientesView";

export default async function ClientesPage() {
  const [clientes, appConfig] = await Promise.all([getClientes(), getAppConfig()]);
  const localidadesActivas = appConfig.localidades.filter((l) => l.activo).map((l) => l.nombre);
  return <ClientesView initialClientes={clientes ?? []} localidades={localidadesActivas} />;
}
