'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [showDeletionForm, setShowDeletionForm] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const handleDataDeletion = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/gdpr/delete-data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setMessage('✅ Solicitud de eliminación enviada. Serás contactado en 30 días.');
        setEmail('');
      } else {
        setMessage('❌ Error en la solicitud. Intenta de nuevo.');
      }
    } catch (error) {
      setMessage('❌ Error al procesar la solicitud.');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">Política de Privacidad</h1>
          <p className="text-slate-400">Última actualización: {new Date().toLocaleDateString('es-ES')}</p>
        </div>

        {/* Content */}
        <div className="bg-slate-800 rounded-lg p-8 space-y-8 mb-8">
          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">1. Información que Recopilamos</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Recopilamos información limitada:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Datos de navegación:</strong> búsquedas, filtros, vehículos visitados</li>
              <li><strong>Datos de sesión:</strong> cookies técnicas, ID de sesión</li>
              <li><strong>Datos de dispositivo:</strong> tipo de navegador, SO, ID de dispositivo</li>
              <li><strong>Datos opcionales:</strong> solo si creas una cuenta (email, nombre)</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">2. Dónde se Almacenan tus Datos</h2>
            <div className="bg-slate-700 rounded p-4 mb-4 space-y-3">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">🖥️ Almacenamiento Local (Navegador)</h3>
                <p className="text-slate-300 text-sm">
                  <strong>Ubicación:</strong> Tu dispositivo (no se envía a servidores)<br/>
                  <strong>Duración:</strong> 7 días<br/>
                  <strong>Contenido:</strong> Búsquedas, filtros, favoritos<br/>
                  <strong>Control:</strong> Puedes eliminar manualmente o limpiar caché
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">📊 IndexedDB</h3>
                <p className="text-slate-300 text-sm">
                  <strong>Ubicación:</strong> Tu dispositivo<br/>
                  <strong>Duración:</strong> Indefinida (hasta que limpies datos)<br/>
                  <strong>Contenido:</strong> Datos de comparación de vehículos<br/>
                  <strong>Control:</strong> Gestiona en DevTools &gt; Application &gt; IndexedDB
                </p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">☁️ Servidores (Opcional)</h3>
                <p className="text-slate-300 text-sm">
                  <strong>Ubicación:</strong> AWS (Si creas cuenta)<br/>
                  <strong>Duración:</strong> Mientras mantengas la cuenta<br/>
                  <strong>Contenido:</strong> Email, preferencias<br/>
                  <strong>Control:</strong> Solicita eliminación en cualquier momento
                </p>
              </div>
            </div>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">3. Cómo Usamos tus Datos</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Mejorar el rendimiento del servicio</li>
              <li>Personalizar tu experiencia de búsqueda</li>
              <li>Análisis estadísticos anónimos</li>
              <li>Detección de abuso y fraude</li>
              <li>Cumplimiento de obligaciones legales</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">4. Derechos GDPR (Usuarios de UE)</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Si estás en la UE, tienes derecho a:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Acceso:</strong> Obtener una copia de tus datos</li>
              <li><strong>Rectificación:</strong> Corregir datos inexactos</li>
              <li><strong>Eliminación ("Derecho al olvido"):</strong> Solicitar eliminación de datos</li>
              <li><strong>Portabilidad:</strong> Descargar tus datos en formato legible</li>
              <li><strong>Oposición:</strong> Oponerte al procesamiento de datos</li>
              <li><strong>Restricción:</strong> Limitar cómo usamos tus datos</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">5. Cookies y Seguimiento</h2>
            <p className="text-slate-300 leading-relaxed mb-4">
              Utilizamos cookies para:
            </p>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li><strong>Técnicas (Necesarias):</strong> Mantener sesión, preferencias</li>
              <li><strong>Analytics (Opcionales):</strong> Entender cómo usas el servicio</li>
              <li><strong>Publicitarias:</strong> No utilizamos (por ahora)</li>
            </ul>
            <p className="text-slate-300 mt-4">
              Puedes deshabilitar cookies en la configuración de tu navegador.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">6. Retención de Datos</h2>
            <div className="bg-slate-700 rounded p-4 space-y-2">
              <p className="text-slate-300"><strong>LocalStorage:</strong> 7 días o hasta limpieza manual</p>
              <p className="text-slate-300"><strong>Cookies de sesión:</strong> Hasta cerrar navegador</p>
              <p className="text-slate-300"><strong>Datos de cuenta:</strong> Mientras mantengas la cuenta</p>
              <p className="text-slate-300"><strong>Logs del servidor:</strong> 30 días</p>
              <p className="text-slate-300"><strong>Datos de análisis:</strong> 1 año (anonimizados)</p>
            </div>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">7. Seguridad</h2>
            <ul className="list-disc list-inside text-slate-300 space-y-2 ml-4">
              <li>Encriptación HTTPS para toda comunicación</li>
              <li>Datos sensibles protegidos en tránsito y en reposo</li>
              <li>Auditorías de seguridad regulares</li>
              <li>No compartimos datos con terceros sin consentimiento</li>
            </ul>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-white mb-4">8. Cambios en esta Política</h2>
            <p className="text-slate-300 leading-relaxed">
              Nos reservamos el derecho de actualizar esta política. Te notificaremos 
              de cambios significativos mediante email o aviso en la plataforma.
            </p>
          </section>
        </div>

        {/* GDPR Data Management Section */}
        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-8 mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">🔐 Gestionar tus Datos (GDPR)</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">📥 Descargar mis Datos</h3>
              <p className="text-blue-100 text-sm mb-4">
                Obtén una copia de todos tus datos en formato JSON
              </p>
              <button className="w-full bg-blue-400 hover:bg-blue-300 text-white font-semibold py-2 rounded transition">
                Solicitar Descarga
              </button>
            </div>

            <div className="bg-blue-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">🔄 Rectificar Datos</h3>
              <p className="text-blue-100 text-sm mb-4">
                Corrige información incorrecta en tu perfil
              </p>
              <button className="w-full bg-blue-400 hover:bg-blue-300 text-white font-semibold py-2 rounded transition">
                Editar Perfil
              </button>
            </div>

            <div className="bg-blue-500/30 rounded-lg p-4">
              <h3 className="font-semibold text-white mb-2">🗑️ Eliminar mis Datos</h3>
              <p className="text-blue-100 text-sm mb-4">
                Solicita la eliminación completa de tu información
              </p>
              <button
                onClick={() => setShowDeletionForm(!showDeletionForm)}
                className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition"
              >
                Solicitar Eliminación
              </button>
            </div>
          </div>

          {/* Data Deletion Form */}
          {showDeletionForm && (
            <div className="bg-blue-500/20 rounded-lg p-6 border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-white mb-4">
                ⚠️ Solicitar Eliminación de Datos
              </h3>
              <form onSubmit={handleDataDeletion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-blue-100 mb-2">
                    Tu Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="tu@email.com"
                    required
                    className="w-full px-4 py-2 bg-blue-900/50 border border-blue-500 rounded text-white placeholder-blue-300 focus:outline-none focus:border-blue-300"
                  />
                </div>
                <p className="text-sm text-blue-100">
                  ℹ️ Procesaremos tu solicitud en 30 días según GDPR. 
                  Todos tus datos serán eliminados permanentemente.
                </p>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    className="flex-1 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 rounded transition"
                  >
                    Confirmar Eliminación
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDeletionForm(false)}
                    className="flex-1 bg-blue-800 hover:bg-blue-700 text-white font-semibold py-2 rounded transition"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
              {message && (
                <p className="mt-4 p-3 bg-blue-900/50 rounded text-blue-100 text-sm">
                  {message}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Contact */}
        <div className="bg-slate-700 rounded-lg p-8">
          <h3 className="text-xl font-bold text-white mb-4">📧 Preguntas sobre Privacidad</h3>
          <p className="text-slate-300 mb-4">
            Si tienes preguntas sobre cómo manejamos tus datos, contacta a nuestro Data Protection Officer:
          </p>
          <a
            href="mailto:privacy@sumtrading.us"
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition"
          >
            privacy@sumtrading.us
          </a>
          <p className="text-sm text-slate-400 mt-4">
            <Link href="/" className="text-blue-400 hover:text-blue-300">
              ← Volver al inicio
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
