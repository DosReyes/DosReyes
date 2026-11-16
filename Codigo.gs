/**
 * Reyes Hermanos — conexión entre la página y una planilla de Google Sheets.
 * Pegá este código en Extensiones → Apps Script de tu planilla.
 * Pasos completos en LEEME.md.
 */

// 1) Cambiá esta clave por una propia. Es la misma que van a poner tus socios en "Ajustes" de la página.
const CLAVE = 'cambiar-esta-clave';

const HOJAS = {
  gastos:    ['id','fecha','categoria','detalle','cantidad','unidad','monto','pagadoPor','creado','modificado'],
  ventas:    ['id','fecha','producto','canal','kg','precioKg','total','cliente','cobrado','vendidoPor','creado','modificado'],
  objetivos: ['id','tipo','periodo','metaVentas','metaGanancia','metaKg','nota','creado','modificado']
};
const COLUMNAS_TEXTO = ['id','fecha','periodo','creado','modificado'];

function doGet(e) {
  if ((e.parameter.clave || '') !== CLAVE) return json({ ok: false, error: 'Clave incorrecta' });
  const data = {};
  Object.keys(HOJAS).forEach(t => data[t] = leer(t));
  return json({ ok: true, data: data });
}

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(20000);
  try {
    const b = JSON.parse(e.postData.contents);
    if (b.clave !== CLAVE) return json({ ok: false, error: 'Clave incorrecta' });
    if (!HOJAS[b.tabla]) return json({ ok: false, error: 'Tabla desconocida' });
    const sh = hoja(b.tabla);
    const cols = HOJAS[b.tabla];
    const id = b.id || (b.registro && b.registro.id);
    const fila = buscar(sh, id);

    if (b.accion === 'guardar') {
      const valores = [cols.map(c => b.registro[c] === undefined ? '' : b.registro[c])];
      const destino = fila || sh.getLastRow() + 1;
      sh.getRange(destino, 1, 1, cols.length).setValues(valores);
    } else if (b.accion === 'borrar') {
      if (fila) sh.deleteRow(fila);
    }
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function hoja(nombre) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sh = ss.getSheetByName(nombre);
  if (!sh) {
    sh = ss.insertSheet(nombre);
    const cols = HOJAS[nombre];
    sh.getRange(1, 1, 1, cols.length).setValues([cols]).setFontWeight('bold');
    sh.setFrozenRows(1);
    cols.forEach((c, i) => {
      if (COLUMNAS_TEXTO.indexOf(c) >= 0) sh.getRange(1, i + 1, sh.getMaxRows(), 1).setNumberFormat('@');
    });
  }
  return sh;
}

function leer(nombre) {
  const sh = hoja(nombre);
  const cols = HOJAS[nombre];
  const n = sh.getLastRow();
  if (n < 2) return [];
  const tz = Session.getScriptTimeZone();
  return sh.getRange(2, 1, n - 1, cols.length).getValues()
    .filter(r => r[0] !== '')
    .map(r => {
      const o = {};
      cols.forEach((c, i) => {
        let v = r[i];
        if (v instanceof Date) v = Utilities.formatDate(v, tz, c === 'periodo' ? 'yyyy-MM' : 'yyyy-MM-dd');
        o[c] = v;
      });
      return o;
    });
}

function buscar(sh, id) {
  const n = sh.getLastRow();
  if (n < 2 || !id) return 0;
  const ids = sh.getRange(2, 1, n - 1, 1).getValues();
  for (let i = 0; i < ids.length; i++) if (String(ids[i][0]) === String(id)) return i + 2;
  return 0;
}

function json(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}

// Corré esta función una vez desde el editor (botón ▶) para crear las 3 hojas y dar permisos.
function prepararPlanilla() {
  Object.keys(HOJAS).forEach(hoja);
}
