import { getPagos } from "@/lib/actions/pagos";
import { getClientes } from "@/lib/actions/clientes";
import PagosView from "./PagosView";

export default async function PagosPage() {
  const [pagos, clientes] = await Promise.all([getPagos(), getClientes()]);

  return <PagosView initialPagos={pagos ?? []} clientes={clientes ?? []} />;
}
