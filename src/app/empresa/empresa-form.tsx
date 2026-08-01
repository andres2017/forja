"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Empresa } from "@/types/database";
import { guardarEmpresa } from "./actions";

export function EmpresaForm({ empresa }: { empresa: Empresa | null }) {
  const [error, setError] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [guardando, setGuardando] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setGuardando(true);
    setError(null);
    setOk(false);

    const formData = new FormData(event.currentTarget);
    const resultado = await guardarEmpresa(formData);

    if (resultado.error) {
      setError(resultado.error);
    } else {
      setOk(true);
    }
    setGuardando(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Datos de la empresa</CardTitle>
        <CardDescription>
          Estos datos aparecerán en el PDF de tus cotizaciones.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nombre">Nombre de la empresa</Label>
            <Input
              id="nombre"
              name="nombre"
              placeholder="Mi Empresa S.A.S."
              defaultValue={empresa?.nombre ?? ""}
              required
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nit">NIT / ID fiscal</Label>
            <Input
              id="nit"
              name="nit"
              placeholder="900123456-7"
              defaultValue={empresa?.nit ?? ""}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="direccion">Dirección</Label>
            <Input
              id="direccion"
              name="direccion"
              placeholder="Calle 123 #45-67, Bogotá"
              defaultValue={empresa?.direccion ?? ""}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="telefono">Teléfono</Label>
            <Input
              id="telefono"
              name="telefono"
              placeholder="+57 300 000 0000"
              defaultValue={empresa?.telefono ?? ""}
            />
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
          {ok && (
            <p className="text-sm text-green-600">
              Datos de empresa guardados correctamente.
            </p>
          )}

          <Button
            type="submit"
            disabled={guardando}
            className="mt-2 w-full sm:w-auto"
          >
            {guardando ? "Guardando..." : "Guardar cambios"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
