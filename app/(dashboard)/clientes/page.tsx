import { getClientes } from "@/lib/actions/clientes";
import ClientesView from "./ClientesView";

export default async function ClientesPage() {
  const clientes = await getClientes();
  return <ClientesView initialClientes={clientes ?? []} />;
}
