"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { LoadingSpinner } from "@/components/ui";

export default function ClientePerfilPage() {
  const [cliente, setCliente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [telefono, setTelefono] = useState("");
  const [editTel, setEditTel] = useState(false);
  const [savingTel, setSavingTel] = useState(false);
  const [msgTel, setMsgTel] = useState("");
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const [savingPass, setSavingPass] = useState(false);
  const [msgPass, setMsgPass] = useState("");

  useEffect(() => {
    const load = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const dni = user.email?.replace("@evenser.internal", "");
      const { data } = await supabase
        .from("clients")
        .select("*")
        .eq("dni", dni)
        .single();
      setCliente(data);
      setTelefono(data?.telefono ?? "");
      setLoading(false);
    };
    load();
  }, []);

  const handleSaveTelefono = async () => {
    setSavingTel(true);
    setMsgTel("");
    const supabase = createClient();
    const { error } = await supabase
      .from("clients")
      .update({ telefono })
      .eq("id", cliente.id);
    setSavingTel(false);
    if (error) { setMsgTel("Error al guardar"); return; }
    setMsgTel("Teléfono actualizado ✓");
    setEditTel(false);
  };

  const handleChangePassword = async () => {
    if (password !== password2) { setMsgPass("Las contraseñas no coinciden"); return; }
    if (password.length < 6) { setMsgPass("Mínimo 6 caracteres"); return; }
    setSavingPass(true);
    setMsgPass("");
    const supabase = createClient();
    const { error } = await supabase.auth.updateUser({ password });
    setSavingPass(false);
    if (error) { setMsgPass("Error al cambiar contraseña"); return; }
    setMsgPass("Contraseña actualizada ✓");
    setPassword("");
    setPassword2("");
  };

  if (loading) return <div className="p-8"><LoadingSpinner /></div>;
  if (!cliente) return null;

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-semibold text-brand-950 pt-1 pb-2">Mi perfil</h1>

      {/* Avatar + nombre */}
      <div className="card p-5 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center text-lg font-semibold text-brand-700 shrink-0">
          {cliente.nombre[0]}{cliente.apellido[0]}
        </div>
        <div>
          <p className="font-semibold text-brand-950">{cliente.nombre} {cliente.apellido}</p>
          <p className="text-sm text-brand-400">DNI {cliente.dni}</p>
          <p className="text-xs text-brand-400 mt-0.5">{cliente.localidad}</p>
        </div>
      </div>

      {/* Datos personales */}
      <div className="card p-5 space-y-0">
        <p className="text-xs text-brand-400 uppercase tracking-wider font-medium mb-3">Datos personales</p>
        {[
          ["Obra social", cliente.obra_social || "—"],
        ].map(([label, value]) => (
          <div key={label} className="flex justify-between py-2 border-b border-brand-50">
            <span className="text-sm text-brand-500">{label}</span>
            <span className="text-sm font-medium text-brand-900">{value}</span>
          </div>
        ))}

        {/* Teléfono editable */}
        <div className="flex justify-between items-center py-2">
          <span className="text-sm text-brand-500">Teléfono</span>
          {editTel ? (
            <div className="flex items-center gap-2">
              <input
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="input text-sm w-36"
              />
              <button onClick={handleSaveTelefono} disabled={savingTel} className="btn-primary text-xs px-2 py-1">
                {savingTel ? "..." : "Guardar"}
              </button>
              <button onClick={() => setEditTel(false)} className="text-xs text-brand-400">Cancelar</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-brand-900">{cliente.telefono}</span>
              <button onClick={() => setEditTel(true)} className="text-xs text-brand-600 underline">Editar</button>
            </div>
          )}
        </div>
        {msgTel && <p className="text-xs text-green-600 mt-1">{msgTel}</p>}
      </div>

      {/* Cambiar contraseña */}
      <div className="card p-5 space-y-3">
        <p className="text-xs text-brand-400 uppercase tracking-wider font-medium">Cambiar contraseña</p>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="input"
          placeholder="Nueva contraseña"
        />
        <input
          type="password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
          className="input"
          placeholder="Confirmar contraseña"
        />
        {msgPass && (
          <p className={`text-xs ${msgPass.includes("✓") ? "text-green-600" : "text-red-600"}`}>{msgPass}</p>
        )}
        <button onClick={handleChangePassword} disabled={savingPass} className="btn-primary w-full">
          {savingPass ? "Guardando..." : "Cambiar contraseña"}
        </button>
      </div>
    </div>
  );
}
