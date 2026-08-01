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

export default function EmpresaPage() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-6 sm:px-6 sm:py-10">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          Configuración de empresa
        </h1>
        <p className="text-sm text-muted-foreground">
          Estos datos aparecerán en el PDF de tus cotizaciones.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la empresa</CardTitle>
          <CardDescription>
            Completa la información básica de tu negocio.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nombre">Nombre de la empresa</Label>
              <Input id="nombre" name="nombre" placeholder="Mi Empresa S.A.S." />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="nit">NIT / ID fiscal</Label>
              <Input id="nit" name="nit" placeholder="900123456-7" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="direccion">Dirección</Label>
              <Input
                id="direccion"
                name="direccion"
                placeholder="Calle 123 #45-67, Bogotá"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="telefono">Teléfono</Label>
              <Input id="telefono" name="telefono" placeholder="+57 300 000 0000" />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="logo">Logo</Label>
              <Input id="logo" name="logo" type="file" accept="image/*" disabled />
            </div>

            <Button type="button" disabled className="mt-2 w-full sm:w-auto">
              Guardar cambios
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
