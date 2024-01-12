export interface ISucursal {
  grupo: String;
  cliente: String;
  sucursal: String;
  nombre: String;
  provincia: String;
}

export interface ICuentaSucursal extends ISucursal {
  alias: String;
}

export type CuentaSucursalResponse = Array<ICuentaSucursal>;

export interface ICuentaSucursalAliasRequest {
  grupo: string;
  cuenta: string;
  sucursal: string;
  alias: string;
}
