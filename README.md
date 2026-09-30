# Coroto Inventario — Demo

Demo interactivo de un sistema de caja e inventario para un club de arte.
Funciona completamente en el navegador — sin backend, sin base de datos,
los datos viven en memoria durante la sesion.

## Ver el demo

**[Abrir demo en vivo](https://kratosvil.github.io/Demos-Inventario/)**

O clonar y abrir `index.html` directo en el navegador.

## Credenciales de prueba

| Usuario | Contrasena | Rol | Ve |
|---|---|---|---|
| `admin` | cualquiera | Admin | Todo: venta, cuentas, productos, reportes, usuarios |
| `encargado` | cualquiera | Encargado | Venta rapida, cuentas de clientes, manual |

## Que incluye el demo

- **Venta rapida** — carrito de productos, metodo de pago, descuenta stock
- **Cuentas de clientes** — consumo acumulado, liquidacion, descuento de inversionista
- **Productos** — CRUD, conversion caja/unidad, entradas/devoluciones, historial
- **Reportes** — ventas por metodo de pago, por usuario, deuda pendiente
- **Usuarios** — gestion de roles admin/encargado
- **Manual integrado** — guia de cada modulo dentro de la app

## Stack del demo

HTML + CSS + JavaScript vanilla — sin framework, sin build step.
Los datos se simulan en memoria con un mock API completo.

## Proyecto original

El sistema completo incluye backend (FastAPI + SQLite), autenticacion JWT,
despliegue en AWS con Terraform, y HTTPS automatico con Caddy.
