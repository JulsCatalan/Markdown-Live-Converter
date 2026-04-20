import { useNavigate, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { ArrowLeft, FileText, Shield, ScrollText } from "lucide-react";

type Tab = "privacidad" | "terminos";

export default function LegalPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initial = (searchParams.get("tab") as Tab) ?? "privacidad";
  const [tab, setTab] = useState<Tab>(initial);

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 flex flex-col">
      {/* Nav */}
      <nav className="flex items-center justify-between px-6 md:px-12 py-4 border-b border-stone-800 shrink-0">
        <span className="flex items-center gap-2 font-semibold text-stone-100">
          <FileText size={16} className="text-blue-400" />
          <span className="hidden sm:inline">Markdown Live Converter</span>
          <span className="sm:hidden">MLC</span>
        </span>
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-1.5 text-xs text-stone-400 hover:text-stone-100 transition-colors"
        >
          <ArrowLeft size={13} />
          Volver al editor
        </button>
      </nav>

      <main className="flex-1 px-6 py-10 max-w-2xl mx-auto w-full">

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-stone-900 border border-stone-800 mb-10">
          <TabBtn active={tab === "privacidad"} onClick={() => setTab("privacidad")} icon={Shield}>
            Política de Privacidad
          </TabBtn>
          <TabBtn active={tab === "terminos"} onClick={() => setTab("terminos")} icon={ScrollText}>
            Términos y Condiciones
          </TabBtn>
        </div>

        {tab === "privacidad" ? <Privacidad /> : <Terminos />}

      </main>

      <footer className="border-t border-stone-800 px-6 py-5 flex items-center justify-center gap-4 text-xs text-stone-600">
        <span>Markdown Live Converter — <span className="text-stone-500">última actualización: abril 2026</span></span>
        <span className="text-stone-700">·</span>
        <a
          href="https://github.com/JulsCatalan/Markdown-Live-Converter"
          target="_blank"
          rel="noopener noreferrer"
          className="text-stone-500 hover:text-stone-300 transition-colors"
        >
          Made by Juls
        </a>
      </footer>
    </div>
  );
}

function TabBtn({
  active, onClick, icon: Icon, children
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-xs font-medium transition-all ${
        active
          ? "bg-stone-800 text-stone-100 shadow-sm"
          : "text-stone-500 hover:text-stone-300"
      }`}
    >
      <Icon size={13} />
      {children}
    </button>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="text-sm font-semibold text-stone-200">{title}</h2>
      <p className="text-sm text-stone-400 leading-relaxed">{children}</p>
    </section>
  );
}

function Privacidad() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-xl font-bold text-stone-100 mb-1">Política de Privacidad</h1>
        <p className="text-xs text-stone-500">Última actualización: abril 2026</p>
      </div>

      <Section title="¿Qué datos recopilamos?">
        Ninguno. Markdown Live Converter no recopila, almacena ni transmite ningún dato personal. No hay cuentas de usuario, no hay analytics, no hay tracking.
      </Section>

      <Section title="¿A dónde van tus documentos?">
        Absolutamente a ningún lado. Todo el procesamiento ocurre íntegramente en tu navegador. Tus textos, archivos y documentos nunca abandonan tu dispositivo ni son enviados a ningún servidor.
      </Section>

      <Section title="Almacenamiento local">
        La aplicación guarda únicamente tus preferencias de estilo (tipografía, colores, márgenes) en el <code className="bg-stone-800 text-stone-300 px-1 rounded text-xs">localStorage</code> de tu navegador. Estos datos son locales, solo tú puedes acceder a ellos y puedes borrarlos en cualquier momento limpiando los datos del sitio en tu navegador.
      </Section>

      <Section title="Cookies">
        No usamos cookies de ningún tipo, ni propias ni de terceros.
      </Section>

      <Section title="Servicios de terceros">
        Durante la exportación a PDF la aplicación puede cargar librerías JavaScript desde CDNs públicos (como cdnjs.cloudflare.com). Esta carga es técnica y no implica el envío de tu contenido a dichos servicios.
      </Section>

      <Section title="Menores de edad">
        Esta aplicación no está dirigida a menores de 13 años ni recopila información de ellos de forma intencionada.
      </Section>

      <Section title="Cambios en esta política">
        Cualquier actualización a esta política se reflejará en esta misma página con la fecha de última modificación.
      </Section>

      <Section title="Contacto">
        Si tienes preguntas sobre esta política puedes abrir un issue en el repositorio de GitHub del proyecto.
      </Section>
    </div>
  );
}

function Terminos() {
  return (
    <div className="space-y-7">
      <div>
        <h1 className="text-xl font-bold text-stone-100 mb-1">Términos y Condiciones</h1>
        <p className="text-xs text-stone-500">Última actualización: abril 2026</p>
      </div>

      <Section title="1. Aceptación">
        Al usar Markdown Live Converter aceptas estos términos. Si no estás de acuerdo, por favor no uses la aplicación.
      </Section>

      <Section title="2. Descripción del servicio">
        Markdown Live Converter es una herramienta gratuita que convierte documentos Markdown a PDF directamente en el navegador, sin enviar datos a ningún servidor externo.
      </Section>

      <Section title="3. Uso permitido">
        Puedes usar esta herramienta para fines personales, educativos o comerciales. No está permitido usarla para generar contenido ilegal, difamatorio o que infrinja derechos de terceros.
      </Section>

      <Section title="4. Propiedad intelectual">
        El código fuente está disponible bajo licencia MIT. Los documentos que creas con esta herramienta son completamente tuyos — no reclamamos ningún derecho sobre tu contenido.
      </Section>

      <Section title="5. Sin garantías">
        La herramienta se ofrece "tal cual", sin garantías de ningún tipo. No nos hacemos responsables por pérdida de datos, interrupciones del servicio o resultados de exportación inesperados.
      </Section>

      <Section title="6. Limitación de responsabilidad">
        En ningún caso seremos responsables por daños directos, indirectos, incidentales o consecuentes derivados del uso o imposibilidad de uso de la aplicación.
      </Section>

      <Section title="7. Modificaciones">
        Nos reservamos el derecho de modificar estos términos en cualquier momento. Los cambios se publicarán en esta misma página con la fecha de actualización.
      </Section>

      <Section title="8. Ley aplicable">
        Estos términos se rigen por las leyes aplicables en el territorio donde opera el servicio.
      </Section>

      <Section title="9. Contacto">
        Para cualquier consulta sobre estos términos puedes abrir un issue en el repositorio de GitHub del proyecto.
      </Section>
    </div>
  );
}