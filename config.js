/* ============================================================
   Configuración de la cuenta en la nube (Supabase)
   ------------------------------------------------------------
   Pega aquí los dos datos de tu proyecto de Supabase.
   Están en: Project Settings → Data API  (y → API Keys)

     url : la "Project URL", termina en .supabase.co
     key : la clave pública "anon" / "publishable"

   Mientras estén vacíos, la app funciona igual pero guardando
   solo en este dispositivo, sin cuentas.

   Esta clave es pública a propósito: no da acceso a nada por sí
   sola. Lo que protege los datos es la regla de seguridad que
   creas con el SQL del instructivo, que solo deja a cada usuario
   leer y escribir su propia fila.
   ============================================================ */
window.MC_CONFIG = {
  url: "",
  key: ""
};
