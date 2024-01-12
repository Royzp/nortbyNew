export interface ICuenta {
  grupo: string;
  cliente: string;
  nombre: string;
  cuenta: string;
  nombreComercial: string;
  activo: string;
}

export type CuentaResponse = Array<ICuenta>;
