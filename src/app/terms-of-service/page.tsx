'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function TermsOfService() {
  const [acceptedTerms, setAcceptedTerms] = useState(false);

  useEffect(() => {
    // Check if user has accepted terms
    const accepted = localStorage.getItem('terms_accepted');
    if (accepted === 'true') {
      setAcceptedTerms(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('terms_accepted', 'true');
    localStorage.setItem('terms_accepted_date', new Date().toISOString());
    setAcceptedTerms(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Términos de Servicio</h1>
          <p className="text-muted-foreground/80">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        {/* Content */}
        <div className="bg-secondary/50 rounded-lg p-8 space-y-8 mb-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Aceptación de los Términos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Al acceder y utilizar este servicio, aceptas estos términos y condiciones en su totalidad. 
              Si no estás de acuerdo con alguna parte de estos términos, no debes utilizar el servicio.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Descripción del Servicio</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Ofrecemos una plataforma para buscar y comparar vehículos de subastas. El servicio permite:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Búsqueda de vehículos en tiempo real</li>
              <li>Filtros y criterios de búsqueda avanzados</li>
              <li>Comparación de múltiples vehículos</li>
              <li>Guardado de favoritos y búsquedas</li>
              <li>Almacenamiento de datos locales (offline)</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Derechos de Acceso</h2>
            <p className="text-muted-foreground leading-relaxed">
              Los datos mostrados provienen de fuentes públicas de subastas. No somos propietarios de 
              esta información y solo la presentamos como herramienta de búsqueda. El acceso a los datos 
              está sujeto a los términos y condiciones de los proveedores originales.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Limitaciones de Responsabilidad</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Este servicio se proporciona "tal cual" sin garantías. No nos responsabilizamos por:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Inexactitud o incompletitud de datos</li>
              <li>Interrupciones del servicio</li>
              <li>Pérdida de datos o información</li>
              <li>Daños directos o indirectos derivados del uso del servicio</li>
              <li>Decisiones tomadas basadas en información del servicio</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Uso Aceptable</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">No está permitido:</p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Scraping automatizado del servicio (excepto nuestras APIs públicas)</li>
              <li>Acceso no autorizado a sistemas o datos</li>
              <li>Interferencia con el funcionamiento del servicio</li>
              <li>Spam o abuso del servicio</li>
              <li>Violación de derechos de propiedad intelectual</li>
              <li>Reventa de acceso al servicio</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Protección de Datos</h2>
            <p className="text-muted-foreground leading-relaxed mb-4">
              Recopilamos datos de sesión limitados (búsquedas, filtros) que se almacenan:
            </p>
            <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
              <li>Localmente en tu navegador (no se envía a servidores)</li>
              <li>Persistentemente durante 7 días</li>
              <li>Puedes eliminar estos datos en cualquier momento</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Modificación de Términos</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nos reservamos el derecho de modificar estos términos en cualquier momento. 
              Los cambios serán efectivos inmediatamente. Tu uso continuado del servicio 
              implica aceptación de los términos modificados.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Terminación</h2>
            <p className="text-muted-foreground leading-relaxed">
              Podemos terminar o suspender tu acceso al servicio sin previo aviso por 
              violación de estos términos o por abuso del servicio.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">9. Contacto</h2>
            <p className="text-muted-foreground leading-relaxed">
              Para preguntas sobre estos términos, contáctanos a:{' '}
              <a href="mailto:legal@sumtrading.us" className="text-blue-400 hover:text-blue-300">
                legal@sumtrading.us
              </a>
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">10. Ley Aplicable</h2>
            <p className="text-muted-foreground leading-relaxed">
              Estos términos se rigen por las leyes de los Estados Unidos. 
              Cualquier disputa será resuelta en los tribunales competentes.
            </p>
          </section>
        </div>

        {/* Acceptance Box */}
        <div className="bg-slate-700 rounded-lg p-8">
          {acceptedTerms ? (
            <div className="flex items-center space-x-3 text-green-400">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-semibold">Has aceptado los términos de servicio</span>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-muted-foreground">
                Al continuar usando este servicio, aceptas haber leído y estar de acuerdo 
                con todos los términos y condiciones anteriores.
              </p>
              <button
                onClick={handleAccept}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition duration-200"
              >
                Aceptar Términos de Servicio
              </button>
              <p className="text-sm text-muted-foreground/80">
                <Link href="/" className="text-blue-400 hover:text-blue-300">
                  ← Volver al inicio
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

