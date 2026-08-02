"use client";

import { useRef, useState } from "react";
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
import { importarDatasetExcel } from "./import-actions";

export function ImportDatasetForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [mensaje, setMensaje] = useState<string | null>(null);
  const [importando, setImportando] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setImportando(true);
    setError(null);
    setMensaje(null);

    const formData = new FormData(event.currentTarget);
    const resultado = await importarDatasetExcel(formData);

    if (resultado.error) {
      setError(resultado.error);
    } else {
      setMensaje(
        `Empresa actualizada · ${resultado.clientes} clientes · ${resultado.productos} productos · ${resultado.cotizaciones} cotizaciones · ${resultado.items} ítems`
      );
      formRef.current?.reset();
    }
    setImportando(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Cargar dataset de prueba</CardTitle>
        <CardDescription>
          Sube el archivo ForjaRayo_Dataset_Completo_v2.xlsx. Esto
          reemplazará los datos actuales por el dataset completo (30
          clientes, 25 productos, 15 cotizaciones).
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          ref={formRef}
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="archivo">Archivo Excel</Label>
            <Input
              id="archivo"
              name="archivo"
              type="file"
              accept=".xlsx,.xls"
              required
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
          {mensaje && <p className="text-sm text-green-600">{mensaje}</p>}

          <Button
            type="submit"
            disabled={importando}
            className="mt-2 w-full sm:w-auto"
          >
            {importando ? "Importando..." : "Importar dataset"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
