import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      // El dataset de prueba (empresa + 30 clientes + 25 productos +
      // 15 cotizaciones con ítems) en .xlsx supera el límite por defecto (1mb).
      bodySizeLimit: "10mb",
    },
  },
};

export default nextConfig;
