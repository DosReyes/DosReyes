# Reyes Hermanos — Control del negocio

Página web para manejar el negocio de milanesas: lo que entra, lo que sale, lo que queda de ganancia, los clientes, los pedidos y la plata que se separa como sueldo. Funciona en la compu y en el celular.

## Qué tiene

- **Resumen**: ganancia, ventas y gastos por día, semana o mes; kilos vendidos; costo del pollo por kg; lo que te deben; gráfico; en qué se va la plata; ventas por producto. Arriba, avisos de pedidos para hoy, clientes para volver a escribir y plata que falta separar.
- **Caja**: cuánta plata debería haber en efectivo, en la cuenta (transferencia) y en el fondo separado.
- **Plata separada / sueldo**: separás un monto por día (por ejemplo $30.000) a un fondo, y a fin de mes lo cobrás como sueldo.
- **Cargar**: gastos, ventas (en kg o en gramos) y plata separada.
- **Pedidos**: pedidos con uno o varios productos, quién lo cargó, lista de lo que hay que preparar hoy, y "Entregar", que carga la venta solo. También podés repetir un pedido.
- **Clientes**: nombre, teléfono, zona y notas; cuánto compró cada uno, cuánto debe y cuándo compró por última vez; botones de WhatsApp y de repetir compra; aviso de los clientes que dejaron de comprar.
- **Movimientos**: todo el historial, con filtros y búsqueda. Tocás un movimiento para editarlo o borrarlo.
- **Objetivos**: metas mensuales o trimestrales de ventas, ganancia y kilos, y si a este ritmo llegás.
- **Ajustes** (ruedita de arriba): nombres de los socios, productos y precios por kg, monto a separar por día, mensaje de WhatsApp, conexión con la planilla y copias de seguridad.

**Lo primero que tenés que hacer:** entrar a Ajustes y poner los nombres reales de los socios y los precios por kg (por menor y por mayor).

## 1. Usarla ya (solo en tu dispositivo)

Abrí `index.html` con el navegador (Chrome, Safari). Todo lo que cargues queda guardado en ese navegador. Si borrás los datos del navegador, se pierde: usá **Ajustes → Descargar copia** de vez en cuando.

## 2. Compartirla con tus socios (Google Sheets, gratis)

Así todos cargan y ven lo mismo, y además queda todo guardado en una planilla de Google.

1. Entrá a [sheets.new](https://sheets.new) y creá una planilla. Ponele de nombre "Reyes Hermanos – Datos".
2. Menú **Extensiones → Apps Script**.
3. Borrá lo que aparece y pegá todo el contenido de `Codigo.gs`.
4. En la línea `const CLAVE = 'cambiar-esta-clave';` poné una clave propia (por ejemplo `milas-reyes-2026`). Guardá (ícono del disquete).
5. Arriba, elegí la función **prepararPlanilla** y tocá **▶ Ejecutar**. Google te va a pedir permisos: aceptá (si dice "app no verificada", tocá *Configuración avanzada → Ir a…*). Se crean las hojas `gastos`, `ventas`, `objetivos`, `clientes`, `pedidos` y `separaciones`.
6. Tocá **Implementar → Nueva implementación** → tipo **Aplicación web**:
   - Ejecutar como: **Yo**
   - Quién tiene acceso: **Cualquier usuario**
7. Copiá la **URL de la aplicación web** (termina en `/exec`).
8. En la página: **Ajustes → Compartir con tus socios** → pegá la URL y la clave → **Conectar y sincronizar**.
9. Pasales la URL y la clave a tu hermano y a los socios para que hagan lo mismo en su celular.

Si más adelante cambiás el código del script: **Implementar → Administrar implementaciones → editar → Versión nueva**. Así la URL sigue siendo la misma. Las columnas nuevas se agregan solas.

> La clave es lo que protege los datos: el link de la página puede ser público, pero sin la clave nadie puede leer ni cargar nada. No la publiques.

## 3. Subirla a GitHub Pages (para abrirla con un link desde cualquier lado)

1. Creá una cuenta en [github.com](https://github.com) si no tenés.
2. **New repository** → nombre `reyes-hermanos` → Public → Create.
3. **Add file → Upload files** → subí `index.html` (y si querés, este LEEME). **Commit changes**.
4. **Settings → Pages** → Source: *Deploy from a branch* → Branch: `main` / `(root)` → Save.
5. En 1 o 2 minutos queda en `https://TU-USUARIO.github.io/reyes-hermanos/`. El link también aparece en **Settings → Pages**, arriba de todo.
6. En el celular, abrí ese link y usá **Compartir → Agregar a pantalla de inicio** para tenerla como una app.

**Para actualizarla:** en el repositorio, **Add file → Upload files**, subí el `index.html` nuevo (reemplaza al anterior) y **Commit changes**. En 1 o 2 minutos se actualiza. Si en el celular sigue viéndose la versión vieja, cerrá la página y abrila de nuevo.

No subas `Codigo.gs` con tu clave real a un repositorio público.

## Cómo calcula

- **Ganancia** = lo vendido − lo gastado en ese período (según la fecha de cada carga).
- **Te deben** = ventas marcadas como "No, me debe". Cuando te paguen, editá la venta y marcala como cobrada.
- **Caja / "Hoy hay"** = todo lo cobrado menos todo lo gastado, separado en efectivo y transferencia, sin contar lo que pasaste al fondo (eso figura en su propia fila).
- **Ventas en gramos**: podés cargar en kg o en g (100 g, 250 g, 500 g…). El precio siempre es por kg y el total se calcula solo.
- **Costo del pollo por kg** sale de los gastos de "Pollo / pechugas" donde pusiste la cantidad en kg.
- **Plata separada (fondo)**: separar NO es un gasto, así que no baja la ganancia; la plata pasa de la caja al fondo. "Cobrar sueldo" la saca del fondo y del negocio (es tuya). "Volver a caja" la devuelve al negocio. La página calcula cuánto deberías llevar separado según el monto por día y te avisa si separás más de lo que gana el negocio en el mes.
- **Pedidos**: al tocar *Entregar* y confirmar, el pedido se convierte solo en venta (una por producto), con la fecha de hoy.
- **Repetir compra**: arma un pedido nuevo con los mismos productos y cantidades de la última compra del cliente, con los precios actuales de Ajustes.
- **Clientes que dejaron de comprar**: aparecen los que hace más de X días (lo elegís en Ajustes) que no compran y no tienen pedido pendiente, con un botón para mandarles un WhatsApp ya escrito.
- **Objetivos**: la rayita negra en la barra marca dónde deberías estar hoy para llegar a la meta a tiempo.
