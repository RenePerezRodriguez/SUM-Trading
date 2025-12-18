'use client';

import { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Upload, Edit2, History, Search, FileSpreadsheet, AlertCircle, CheckCircle2, RefreshCw, Plus, Trash2, MapPin, Building, DollarSign } from 'lucide-react';

interface CityRate {
    name: string;
    price: number;
}

interface StateData {
    name: string;
    cities: CityRate[];
}

interface TowingRates {
    destinations: {
        [key: string]: {
            [stateKey: string]: StateData;
        };
    };
    updatedAt?: string;
    fileName?: string;
}

interface UploadPreview {
    data: TowingRates;
    stats: { destinations: number; states: number; cities: number };
    diff: {
        added: any[];
        removed: any[];
        changed: any[];
    };
}

export default function TowingRatesClient({ lang }: { lang: string }) {
    const [data, setData] = useState<TowingRates | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [activeDestination, setActiveDestination] = useState<string>('');
    const [searchQuery, setSearchQuery] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadPreview, setUploadPreview] = useState<UploadPreview | null>(null);
    const [showUploadDialog, setShowUploadDialog] = useState(false);
    const [showHistoryDialog, setShowHistoryDialog] = useState(false);
    const [history, setHistory] = useState<any[]>([]);

    // CRUD dialogs
    const [showAddDestination, setShowAddDestination] = useState(false);
    const [showAddState, setShowAddState] = useState(false);
    const [showAddCity, setShowAddCity] = useState(false);
    const [showEditDialog, setShowEditDialog] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    // Form state
    const [newDestination, setNewDestination] = useState('');
    const [newState, setNewState] = useState('');
    const [newCity, setNewCity] = useState('');
    const [newPrice, setNewPrice] = useState('');
    const [selectedState, setSelectedState] = useState('');
    const [editingCity, setEditingCity] = useState<{ destination: string; stateKey: string; stateName: string; city: CityRate } | null>(null);
    const [deleteTarget, setDeleteTarget] = useState<{ type: 'destination' | 'state' | 'city'; destination: string; state?: string; city?: string } | null>(null);

    const { toast } = useToast();

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('/api/admin/towing-rates');
            if (!response.ok) throw new Error('Error al cargar datos');
            const result = await response.json();
            setData(result);
            if (result.destinations && Object.keys(result.destinations).length > 0) {
                setActiveDestination(Object.keys(result.destinations)[0]);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    // CRUD Operations
    const crudAction = async (method: 'POST' | 'PUT' | 'DELETE', body: any) => {
        try {
            const response = await fetch('/api/admin/towing-rates/crud', {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error);
            toast({ title: 'Éxito', description: result.message });
            fetchData();
            return true;
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
            return false;
        }
    };

    const handleAddDestination = async () => {
        if (!newDestination.trim()) return;
        const success = await crudAction('POST', { action: 'createDestination', destination: newDestination });
        if (success) {
            setShowAddDestination(false);
            setNewDestination('');
        }
    };

    const handleAddState = async () => {
        if (!newState.trim()) return;
        const success = await crudAction('POST', { action: 'createState', destination: activeDestination, state: newState });
        if (success) {
            setShowAddState(false);
            setNewState('');
        }
    };

    const handleAddCity = async () => {
        if (!newCity.trim() || !newPrice || !selectedState) return;
        const success = await crudAction('POST', {
            action: 'createCity',
            destination: activeDestination,
            state: selectedState,
            city: newCity,
            price: parseFloat(newPrice)
        });
        if (success) {
            setShowAddCity(false);
            setNewCity('');
            setNewPrice('');
            setSelectedState('');
        }
    };

    const handleEditPrice = async () => {
        if (!editingCity || !newPrice) return;
        const success = await crudAction('PUT', {
            action: 'updateCityPrice',
            destination: editingCity.destination,
            state: editingCity.stateName,
            city: editingCity.city.name,
            newPrice: parseFloat(newPrice)
        });
        if (success) {
            setShowEditDialog(false);
            setEditingCity(null);
            setNewPrice('');
        }
    };

    const handleDelete = async () => {
        if (!deleteTarget) return;
        let action = '';
        if (deleteTarget.type === 'destination') action = 'deleteDestination';
        else if (deleteTarget.type === 'state') action = 'deleteState';
        else action = 'deleteCity';

        const success = await crudAction('DELETE', {
            action,
            destination: deleteTarget.destination,
            state: deleteTarget.state,
            city: deleteTarget.city
        });
        if (success) {
            setShowDeleteConfirm(false);
            setDeleteTarget(null);
        }
    };

    // Excel upload handlers
    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('/api/admin/towing-rates?preview=true', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Error al procesar archivo');
            }

            const result = await response.json();
            setUploadPreview(result);
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setIsUploading(false);
        }
    };

    const confirmUpload = async () => {
        if (!uploadPreview) return;
        setIsUploading(true);
        try {
            await fetch('/api/admin/towing-rates', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ saveAll: true, data: uploadPreview.data })
            });
            toast({ title: 'Éxito', description: 'Tarifas actualizadas correctamente' });
            setShowUploadDialog(false);
            setUploadPreview(null);
            fetchData();
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        } finally {
            setIsUploading(false);
        }
    };

    const fetchHistory = async () => {
        try {
            const response = await fetch('/api/admin/towing-rates/history');
            if (!response.ok) throw new Error('Error al cargar historial');
            const result = await response.json();
            setHistory(result.history || []);
        } catch (err) {
            console.error(err);
        }
    };

    const restoreVersion = async (versionId: string) => {
        try {
            const response = await fetch('/api/admin/towing-rates/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ versionId })
            });
            if (!response.ok) throw new Error((await response.json()).error);
            toast({ title: 'Versión restaurada', description: 'Las tarifas han sido restauradas' });
            setShowHistoryDialog(false);
            fetchData();
        } catch (err: any) {
            toast({ variant: 'destructive', title: 'Error', description: err.message });
        }
    };

    // Filter
    const getFilteredStates = () => {
        if (!data?.destinations[activeDestination]) return [];
        const stateData = data.destinations[activeDestination];
        if (!searchQuery) {
            return Object.entries(stateData).map(([key, state]) => ({ key, ...state }));
        }
        const query = searchQuery.toLowerCase();
        return Object.entries(stateData)
            .map(([key, state]) => ({
                key,
                ...state,
                cities: state.cities.filter(c =>
                    c.name.toLowerCase().includes(query) || state.name.toLowerCase().includes(query)
                )
            }))
            .filter(state => state.cities.length > 0);
    };

    if (isLoading) {
        return (
            <div className="space-y-4">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    if (error) {
        return (
            <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
            </Alert>
        );
    }

    const destinations = data?.destinations ? Object.keys(data.destinations) : [];
    const hasData = destinations.length > 0;
    const currentStates = activeDestination && data?.destinations[activeDestination]
        ? Object.entries(data.destinations[activeDestination]).map(([key, state]) => ({ key, name: state.name }))
        : [];

    return (
        <div className="space-y-6">
            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row gap-3 justify-between">
                <div className="flex gap-2 flex-wrap">
                    {/* Add Destination */}
                    <Dialog open={showAddDestination} onOpenChange={setShowAddDestination}>
                        <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Plus className="mr-1 h-4 w-4" />
                                <MapPin className="mr-1 h-4 w-4" />
                                Destino
                            </Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Agregar Destino</DialogTitle>
                                <DialogDescription>Ej: Miami, Houston, Delaware</DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label>Nombre del Destino</Label>
                                <Input value={newDestination} onChange={(e) => setNewDestination(e.target.value)} placeholder="Miami" className="mt-2" />
                            </div>
                            <DialogFooter>
                                <Button variant="outline" onClick={() => setShowAddDestination(false)}>Cancelar</Button>
                                <Button onClick={handleAddDestination}>Agregar</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    {/* Add State (only if destination selected) */}
                    {hasData && (
                        <Dialog open={showAddState} onOpenChange={setShowAddState}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" title={`Agregar estado a ${activeDestination}`}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    <Building className="mr-1 h-4 w-4" />
                                    Estado
                                    <Badge variant="secondary" className="ml-2 capitalize text-xs">{activeDestination}</Badge>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Agregar Estado a "{activeDestination}"</DialogTitle>
                                    <DialogDescription>Ej: Texas, California, Florida</DialogDescription>
                                </DialogHeader>
                                <div className="py-4">
                                    <Label>Nombre del Estado</Label>
                                    <Input value={newState} onChange={(e) => setNewState(e.target.value)} placeholder="California" className="mt-2" />
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowAddState(false)}>Cancelar</Button>
                                    <Button onClick={handleAddState}>Agregar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                    {/* Add City */}
                    {currentStates.length > 0 && (
                        <Dialog open={showAddCity} onOpenChange={setShowAddCity}>
                            <DialogTrigger asChild>
                                <Button variant="outline" size="sm" title={`Agregar ciudad a ${activeDestination}`}>
                                    <Plus className="mr-1 h-4 w-4" />
                                    <DollarSign className="mr-1 h-4 w-4" />
                                    Ciudad
                                    <Badge variant="secondary" className="ml-2 capitalize text-xs">{activeDestination}</Badge>
                                </Button>
                            </DialogTrigger>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>Agregar Ciudad</DialogTitle>
                                </DialogHeader>
                                <div className="py-4 space-y-4">
                                    <div>
                                        <Label>Estado</Label>
                                        <select
                                            value={selectedState}
                                            onChange={(e) => setSelectedState(e.target.value)}
                                            className="w-full mt-2 p-2 border rounded-md"
                                        >
                                            <option value="">Seleccionar estado...</option>
                                            {currentStates.map(s => (
                                                <option key={s.key} value={s.name}>{s.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Nombre de la Ciudad</Label>
                                        <Input value={newCity} onChange={(e) => setNewCity(e.target.value)} placeholder="Los Angeles" className="mt-2" />
                                    </div>
                                    <div>
                                        <Label>Precio (USD)</Label>
                                        <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} placeholder="500" className="mt-2" />
                                    </div>
                                </div>
                                <DialogFooter>
                                    <Button variant="outline" onClick={() => setShowAddCity(false)}>Cancelar</Button>
                                    <Button onClick={handleAddCity}>Agregar</Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    )}

                    <div className="border-l mx-2" />

                    {/* Upload Excel */}
                    <Dialog open={showUploadDialog} onOpenChange={setShowUploadDialog}>
                        <DialogTrigger asChild>
                            <Button><Upload className="mr-2 h-4 w-4" />Subir Excel</Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Subir Tarifas Excel</DialogTitle>
                                <DialogDescription>Sube un archivo Excel con las nuevas tarifas.</DialogDescription>
                            </DialogHeader>
                            {!uploadPreview ? (
                                <div className="space-y-4">
                                    <div className="border-2 border-dashed rounded-lg p-8 text-center">
                                        <FileSpreadsheet className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                                        <Label htmlFor="excel-upload" className="cursor-pointer">
                                            <span className="text-primary font-medium">Selecciona un archivo</span>
                                            <span className="text-muted-foreground"> o arrastra aquí</span>
                                        </Label>
                                        <Input id="excel-upload" type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFileUpload} disabled={isUploading} />
                                        <p className="text-xs text-muted-foreground mt-2">.xlsx, .xls</p>
                                    </div>
                                    {isUploading && (
                                        <div className="flex items-center justify-center gap-2">
                                            <RefreshCw className="h-4 w-4 animate-spin" /><span>Procesando...</span>
                                        </div>
                                    )}
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <Alert>
                                        <CheckCircle2 className="h-4 w-4" />
                                        <AlertTitle>Vista Previa</AlertTitle>
                                        <AlertDescription>
                                            {uploadPreview.stats.destinations} destinos, {uploadPreview.stats.states} estados, {uploadPreview.stats.cities} ciudades
                                        </AlertDescription>
                                    </Alert>
                                    {(uploadPreview.diff.added.length > 0 || uploadPreview.diff.changed.length > 0 || uploadPreview.diff.removed.length > 0) && (
                                        <div className="flex gap-2 flex-wrap">
                                            {uploadPreview.diff.added.length > 0 && <Badge>+{uploadPreview.diff.added.length} nuevos</Badge>}
                                            {uploadPreview.diff.changed.length > 0 && <Badge variant="secondary">~{uploadPreview.diff.changed.length} modificados</Badge>}
                                            {uploadPreview.diff.removed.length > 0 && <Badge variant="destructive">-{uploadPreview.diff.removed.length} eliminados</Badge>}
                                        </div>
                                    )}
                                    <DialogFooter>
                                        <Button variant="outline" onClick={() => setUploadPreview(null)}>Cancelar</Button>
                                        <Button onClick={confirmUpload} disabled={isUploading}>{isUploading ? 'Guardando...' : 'Confirmar'}</Button>
                                    </DialogFooter>
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>

                    {/* History */}
                    <Dialog open={showHistoryDialog} onOpenChange={(open) => { setShowHistoryDialog(open); if (open) fetchHistory(); }}>
                        <DialogTrigger asChild>
                            <Button variant="outline"><History className="mr-2 h-4 w-4" />Historial</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Historial de Versiones</DialogTitle>
                            </DialogHeader>
                            {history.length === 0 ? (
                                <p className="text-muted-foreground text-center py-4">No hay versiones anteriores</p>
                            ) : (
                                <div className="space-y-2 max-h-64 overflow-y-auto">
                                    {history.map((v) => (
                                        <div key={v.id} className="flex items-center justify-between p-2 border rounded">
                                            <div>
                                                <p className="text-sm font-medium">{v.archivedBy || v.fileName || 'Cambio manual'}</p>
                                                <p className="text-xs text-muted-foreground">{new Date(v.archivedAt).toLocaleString()}</p>
                                            </div>
                                            <Button size="sm" variant="outline" onClick={() => restoreVersion(v.id)}>Restaurar</Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>

                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Buscar..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 w-full sm:w-64" />
                </div>
            </div>

            {/* Info */}
            {data?.updatedAt && (
                <p className="text-sm text-muted-foreground">
                    Última actualización: {new Date(data.updatedAt).toLocaleString()}
                </p>
            )}

            {/* No Data */}
            {!hasData && (
                <Card>
                    <CardContent className="py-12 text-center">
                        <FileSpreadsheet className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
                        <h3 className="text-lg font-semibold mb-2">Sin datos</h3>
                        <p className="text-muted-foreground mb-4">Sube un Excel o agrega un destino manualmente.</p>
                        <div className="flex gap-2 justify-center">
                            <Button onClick={() => setShowUploadDialog(true)}><Upload className="mr-2 h-4 w-4" />Subir Excel</Button>
                            <Button variant="outline" onClick={() => setShowAddDestination(true)}><Plus className="mr-2 h-4 w-4" />Agregar Destino</Button>
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Rates Table */}
            {hasData && (
                <Tabs value={activeDestination} onValueChange={setActiveDestination}>
                    <div className="flex items-center gap-2 mb-4 flex-wrap">
                        <TabsList>
                            {destinations.map(dest => (
                                <TabsTrigger key={dest} value={dest} className="capitalize">{dest}</TabsTrigger>
                            ))}
                        </TabsList>
                        {/* Delete current destination */}
                        <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => {
                                setDeleteTarget({ type: 'destination', destination: activeDestination });
                                setShowDeleteConfirm(true);
                            }}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>

                    {destinations.map(dest => (
                        <TabsContent key={dest} value={dest}>
                            <Card>
                                <CardHeader className="pb-3">
                                    <CardTitle className="capitalize">{dest}</CardTitle>
                                    <CardDescription>
                                        {Object.keys(data!.destinations[dest] || {}).length} estados
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="overflow-x-auto">
                                    <Table className="min-w-[600px]">
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Estado</TableHead>
                                                <TableHead>Ciudad</TableHead>
                                                <TableHead className="text-right">Precio</TableHead>
                                                <TableHead className="w-24">Acciones</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {getFilteredStates().flatMap(state =>
                                                state.cities.map((city, idx) => (
                                                    <TableRow key={`${state.key}-${city.name}`}>
                                                        {idx === 0 ? (
                                                            <TableCell rowSpan={state.cities.length} className="font-medium align-top border-r">
                                                                <div className="flex items-center gap-2">
                                                                    {state.name}
                                                                    <Button
                                                                        size="icon"
                                                                        variant="ghost"
                                                                        className="h-6 w-6 text-destructive hover:text-destructive"
                                                                        onClick={() => {
                                                                            setDeleteTarget({ type: 'state', destination: dest, state: state.name });
                                                                            setShowDeleteConfirm(true);
                                                                        }}
                                                                    >
                                                                        <Trash2 className="h-3 w-3" />
                                                                    </Button>
                                                                </div>
                                                            </TableCell>
                                                        ) : null}
                                                        <TableCell>{city.name}</TableCell>
                                                        <TableCell className="text-right font-mono">${city.price.toLocaleString()}</TableCell>
                                                        <TableCell>
                                                            <div className="flex gap-1">
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    onClick={() => {
                                                                        setEditingCity({ destination: dest, stateKey: state.key, stateName: state.name, city });
                                                                        setNewPrice(city.price.toString());
                                                                        setShowEditDialog(true);
                                                                    }}
                                                                >
                                                                    <Edit2 className="h-4 w-4" />
                                                                </Button>
                                                                <Button
                                                                    size="icon"
                                                                    variant="ghost"
                                                                    className="text-destructive hover:text-destructive"
                                                                    onClick={() => {
                                                                        setDeleteTarget({ type: 'city', destination: dest, state: state.name, city: city.name });
                                                                        setShowDeleteConfirm(true);
                                                                    }}
                                                                >
                                                                    <Trash2 className="h-4 w-4" />
                                                                </Button>
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))
                                            )}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    ))}
                </Tabs>
            )}

            {/* Edit Price Dialog */}
            <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Editar Precio</DialogTitle>
                        <DialogDescription>
                            {editingCity && `${editingCity.city.name} - Actual: $${editingCity.city.price}`}
                        </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                        <Label>Nuevo Precio (USD)</Label>
                        <Input type="number" value={newPrice} onChange={(e) => setNewPrice(e.target.value)} className="mt-2" />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancelar</Button>
                        <Button onClick={handleEditPrice}>Guardar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle className="text-destructive">Confirmar Eliminación</DialogTitle>
                        <DialogDescription>
                            {deleteTarget?.type === 'destination' && `¿Eliminar destino "${deleteTarget.destination}" y todos sus estados/ciudades?`}
                            {deleteTarget?.type === 'state' && `¿Eliminar estado "${deleteTarget.state}" y todas sus ciudades?`}
                            {deleteTarget?.type === 'city' && `¿Eliminar ciudad "${deleteTarget.city}"?`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancelar</Button>
                        <Button variant="destructive" onClick={handleDelete}>Eliminar</Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
