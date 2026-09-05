"use client";
import { useEffect, useState, useTransition } from "react";
import { Flame } from "lucide-react";
import { encenderVela } from "@/lib/actions/memorial";

export default function VelaButton({
  memorialId,
  slug,
  velasIniciales,
}: {
  memorialId: string;
  slug: string;
  velasIniciales: number;
}) {
  const [velas, setVelas] = useState(velasIniciales);
  const [yaEncendio, setYaEncendio] = useState(false);
  const [isPending, start] = useTransition();

  useEffect(() => {
    setYaEncendio(localStorage.getItem(`memorial_vela_${slug}`) === "1");
  }, [slug]);

  const handleClick = () => {
    if (yaEncendio || isPending) return;
    start(async () => {
      const res = await encenderVela(memorialId);
      if (res?.success) {
        setVelas(res.velas_count ?? velas + 1);
        setYaEncendio(true);
        localStorage.setItem(`memorial_vela_${slug}`, "1");
      }
    });
  };

  return (
    <div className="flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        disabled={yaEncendio || isPending}
        className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium text-sm transition-colors ${
          yaEncendio
            ? "bg-amber-50 text-amber-600 cursor-default"
            : "bg-stone-800 text-white hover:bg-stone-900"
        }`}
      >
        <Flame size={18} className={yaEncendio ? "text-amber-500" : "text-amber-300"} />
        {yaEncendio ? "Encendiste una vela" : "Encender una vela"}
      </button>
      <p className="text-xs text-gray-500">
        {velas} {velas === 1 ? "vela encendida" : "velas encendidas"}
      </p>
    </div>
  );
}
