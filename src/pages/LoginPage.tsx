import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { LogIn, UserPlus, Zap } from 'lucide-react';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../contexts/ToastContext';

export default function LoginPage() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const { showToast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        await signIn(formData.email, formData.password);
        navigate('/dashboard/mapa', { state: { fromLogin: true } });
      } else {
        await signUp(formData.email, formData.password);
        showToast('Cuenta creada exitosamente', 'success');
        navigate('/dashboard/mapa', { state: { fromLogin: true } });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Error en la autenticación';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzAwMCIgc3Ryb2tlLW9wYWNpdHk9IjAuMDMiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-40" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-slate-200/50 overflow-hidden">
          <div className="relative bg-gradient-to-br from-[#157A5A] via-[#0f6448] to-[#0B3D2E] p-8 text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />

            <div className="relative flex items-center gap-4 mb-1">
              <div className="w-14 h-14 bg-white/95 backdrop-blur rounded-xl flex items-center justify-center shadow-lg">
                <Zap className="w-8 h-8 text-[#157A5A]" />
              </div>
              <div>
                <h1 className="text-3xl font-bold tracking-tight">LINERGY</h1>
                <p className="text-sm text-white/70 font-medium">Sistema de Gestión CFE</p>
              </div>
            </div>
          </div>

          <div className="p-8">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                {isLogin ? 'Bienvenido de nuevo' : 'Crear cuenta nueva'}
              </h2>
              <p className="text-sm text-slate-600">
                {isLogin
                  ? 'Ingresa tus credenciales para continuar'
                  : 'Completa el registro para acceder al sistema'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Input
                  label="Correo electrónico"
                  type="email"
                  placeholder="usuario@cfe.mx"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div>
                <Input
                  label="Contraseña"
                  type="password"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                />
              </div>

              <motion.div
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
              >
                <Button
                  type="submit"
                  variant="primary"
                  icon={isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                  className="w-full py-3 text-base font-semibold shadow-lg hover:shadow-xl transition-all"
                  disabled={loading}
                >
                  {loading ? 'Cargando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                </Button>
              </motion.div>
            </form>

            <div className="mt-8 text-center">
              <button
                type="button"
                onClick={() => setIsLogin(!isLogin)}
                className="text-sm text-[#157A5A] hover:text-[#0B3D2E] font-medium transition-colors inline-flex items-center gap-1 group"
              >
                {isLogin ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-200">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="w-full text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center justify-center gap-2 group"
              >
                <span className="group-hover:-translate-x-1 transition-transform">←</span>
                Volver al inicio
              </button>
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-6 text-center"
        >
          <div className="bg-white/60 backdrop-blur-lg rounded-2xl p-5 shadow-lg border border-slate-200/50">
            <p className="text-xs font-semibold text-slate-900 mb-2 flex items-center justify-center gap-2">
              <span className="w-2 h-2 bg-[#157A5A] rounded-full" />
              Información para administradores
            </p>
            <p className="text-xs text-slate-600 leading-relaxed">
              Los nuevos usuarios se crean automáticamente con permisos básicos. Para acceso administrativo,
              contacta al administrador del sistema.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
