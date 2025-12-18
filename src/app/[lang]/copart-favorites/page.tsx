'use client';

import { useState, useEffect } from 'react';
import { useFavorites } from '@/hooks/use-favorites';
import { useParams, useRouter } from 'next/navigation';
import { Heart, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import type { Favorite } from '@/hooks/use-favorites';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';
import Link from 'next/link';

export default function CopartFavoritesPage() {
  const params = useParams();
  const router = useRouter();
  const { lang } = params as { lang: string };
  const { getFavorites, removeFavorite, isLoaded } = useFavorites();
  const { toast } = useToast();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (isLoaded) {
      const fav = getFavorites();
      setFavorites(fav);
      setIsLoading(false);
    }
  }, [isLoaded]);

  const handleRemoveFavorite = (lotNumber: string) => {
    removeFavorite(lotNumber);
    setFavorites(prev => prev.filter(f => f.lot_number !== lotNumber));
    toast({
      title: 'Removido de favoritos',
      description: 'El vehículo ha sido eliminado',
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin">
            <Heart className="w-12 h-12 text-red-500 mx-auto" />
          </div>
          <p className="mt-4 text-muted-foreground">Cargando favoritos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b sticky top-0 z-40 bg-background/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => router.back()}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Volver
              </Button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-2">
                  <Heart className="h-6 w-6 text-red-500" />
                  Mis Favoritos Copart
                </h1>
                <p className="text-sm text-muted-foreground">
                  {favorites.length} {favorites.length === 1 ? 'vehículo' : 'vehículos'} guardado{favorites.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        {favorites.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <Heart className="h-16 w-16 text-muted-foreground/50 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold mb-2">No tienes favoritos aún</h2>
            <p className="text-muted-foreground mb-6">
              Agrega vehículos a favoritos desde la búsqueda para guardarlos aquí
            </p>
            <Button asChild>
              <Link href={`/${lang}/search`}>
                Buscar Vehículos
              </Link>
            </Button>
          </motion.div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {favorites.map((favorite) => (
                <motion.div
                  key={favorite.lot_number}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3 }}
                  className="group border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <div className="relative h-64 bg-secondary overflow-hidden">
                    {favorite.imageUrl ? (
                      <Image
                        src={favorite.imageUrl}
                        alt={favorite.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        Sin imagen
                      </div>
                    )}

                    {/* Action buttons overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100">
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/${lang}/copart/${favorite.lot_number}`}>
                          Ver Detalles
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => handleRemoveFavorite(favorite.lot_number)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Info section */}
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">
                      {favorite.title}
                    </h3>
                    <p className="text-2xl font-bold text-primary mb-3">
                      ${favorite.current_bid?.toLocaleString('es-ES') || 'N/A'}
                    </p>
                    <p className="text-xs text-muted-foreground mb-4">
                      Lote: {favorite.lot_number}
                    </p>

                    <div className="flex gap-2">
                      <Button
                        asChild
                        size="sm"
                        className="flex-1"
                      >
                        <Link href={`/${lang}/copart/${favorite.lot_number}`}>
                          Ver
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRemoveFavorite(favorite.lot_number)}
                        className="gap-2"
                      >
                        <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </div>
  );
}
