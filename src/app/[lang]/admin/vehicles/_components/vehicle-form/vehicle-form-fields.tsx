'use client';

import { useFormContext } from 'react-hook-form';
import { FormField, FormControl, FormItem, FormLabel, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Wand2, Loader2, Eye, ShieldQuestion, Trash2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertDialog, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogCancel } from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from '@/components/ui/scroll-area';
import { fuelTypes } from '@/lib/schemas';

interface VehicleFormFieldsProps {
  dict: any;
  transmissionTypes: readonly string[];
  carTypes: readonly string[];
  titleTypes: readonly string[];
  engineStatusTypes: readonly string[];
  primaryDamageTypes: readonly string[];
  isVinValid: boolean;
  isDecodingVin: boolean;
  handleDecodeVin: () => void;
  isGeneratingDesc: boolean;
  handleGenerateDescription: () => void;
  rawVinData: any | null;
  isRawDataDialogOpen: boolean;
  setIsRawDataDialogOpen: (isOpen: boolean) => void;
}

const RequiredIndicator = () => <span className="text-destructive ml-1">*</span>;

const FormSection = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <Card>
    <CardHeader>
      <CardTitle className='font-headline'>{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-6">
      {children}
    </CardContent>
  </Card>
)

const SortedDataView = ({ data, dict }: { data: any[], dict: any }) => {
    const filteredAndSortedData = data
      .filter(item => item.Value !== null && item.Value !== '' && item.Value !== 'Not Applicable')
      .sort((a, b) => a.Variable.localeCompare(b.Variable));
  
    return (
      <ScrollArea className="h-96">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">{dict.vin_modal.variable}</TableHead>
              <TableHead>{dict.vin_modal.value}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedData.map(item => (
              <TableRow key={item.VariableId}>
                <TableCell className="font-medium">{item.Variable}</TableCell>
                <TableCell>{item.Value}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </ScrollArea>
    );
  };

export default function VehicleFormFields({ 
  dict, 
  transmissionTypes, 
  carTypes, 
  titleTypes, 
  engineStatusTypes, 
  primaryDamageTypes,
  isVinValid,
  isDecodingVin,
  handleDecodeVin,
  isGeneratingDesc,
  handleGenerateDescription,
  rawVinData,
  isRawDataDialogOpen,
  setIsRawDataDialogOpen
}: VehicleFormFieldsProps) {
  const { control, watch } = useFormContext();
  const t_vin_modal = dict.vin_modal;

  const watchType = watch('type');
  const watchTitleType = watch('titleType');
  const watchPrimaryDamage = watch('primaryDamage');
  const watchSecondaryDamage = watch('secondaryDamage');

  return (
    <>
    <div className='space-y-8'>
      <FormSection title={dict.sections.basic_info}>
        <div className='grid md:grid-cols-2 gap-6'>
            <FormField
                control={control}
                name="lotNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.fields.lotNumber}</FormLabel>
                    <FormControl>
                      <Input placeholder={dict.placeholders.lotNumber} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <div className="relative">
              <FormField
                control={control}
                name="vin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.fields.vin}<RequiredIndicator /></FormLabel>
                    <div className="relative flex items-center">
                      <Input placeholder={dict.placeholders.vin} {...field} className="pr-48" />
                      <div className='absolute right-1 flex items-center gap-1'>
                        {rawVinData && (
                            <Button
                                type="button"
                                variant="secondary"
                                onClick={() => setIsRawDataDialogOpen(true)}
                                size="sm"
                                className="h-8 px-3"
                                disabled={isDecodingVin}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                {t_vin_modal.view_data_button}
                            </Button>
                        )}
                        <Button 
                          type="button" 
                          onClick={handleDecodeVin} 
                          disabled={!isVinValid || isDecodingVin}
                          className="h-8 px-3"
                          size="sm"
                        >
                          {isDecodingVin ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                          {dict.buttons.decode_vin}
                        </Button>
                      </div>
                    </div>
                    <FormDescription>
                      {dict.fields.vin_description}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="make"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.make}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Input placeholder={dict.placeholders.make} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="model"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.model}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Input placeholder={dict.placeholders.model} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
           <FormField
            control={control}
            name="year"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.year}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Input type="number" placeholder={dict.placeholders.year} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <FormField
            control={control}
            name="provenance.country"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.provenance_country}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Input placeholder={dict.placeholders.provenance_country} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="provenance.city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.provenance_city}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Input placeholder={dict.placeholders.provenance_city} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="relative">
          <FormField
            control={control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.description}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Textarea placeholder={dict.placeholders.description} {...field} className="min-h-[120px]" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button 
            type="button" 
            onClick={handleGenerateDescription} 
            disabled={isGeneratingDesc}
            variant="ghost"
            size="sm"
            className="absolute right-2 bottom-2 text-primary hover:text-primary"
          >
            {isGeneratingDesc ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
            {dict.buttons.generate_description}
          </Button>
        </div>
         <FormField
            control={control}
            name="highlights"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.highlights}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.placeholders.highlights} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
      </FormSection>

      <FormSection title={dict.sections.specifications}>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FormField
            control={control}
            name="price"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.price}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Input type="number" placeholder={dict.placeholders.price} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="estimatedRetailValue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.estimatedRetailValue}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={dict.placeholders.estimatedRetailValue} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="mileage"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.mileage}<RequiredIndicator /></FormLabel>
                  <div className="flex gap-2">
                      <FormControl>
                        <Input type="number" placeholder={dict.placeholders.mileage} {...field} />
                      </FormControl>
                      <FormField
                          control={control}
                          name="mileageUnit"
                          render={({ field: unitField }) => (
                              <Select onValueChange={unitField.onChange} defaultValue={unitField.value}>
                                  <FormControl>
                                      <SelectTrigger className="w-24">
                                          <SelectValue />
                                      </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                      <SelectItem value="mi">mi</SelectItem>
                                      <SelectItem value="km">km</SelectItem>
                                  </SelectContent>
                              </Select>
                          )}
                      />
                  </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.color}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Input placeholder={dict.placeholders.color} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="cylinders"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.cylinders}</FormLabel>
                <FormControl>
                  <Input type="number" placeholder={dict.placeholders.cylinders} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="horsepower"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.horsepower}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Input type="number" placeholder={dict.placeholders.horsepower} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="engine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.engine}<RequiredIndicator /></FormLabel>
                <FormControl>
                  <Input placeholder={dict.placeholders.engine} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="transmission"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.transmission}<RequiredIndicator /></FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={dict.placeholders.transmission} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {transmissionTypes.map(type => (
                      <SelectItem key={type} value={type}>{dict.fields.transmission_types[type.toLowerCase() as keyof typeof dict.fields.transmission_types]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="drive"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.drive}</FormLabel>
                <FormControl>
                  <Input placeholder={dict.placeholders.drive} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={control}
            name="fuel"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{dict.fields.fuel}</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                    <SelectTrigger>
                        <SelectValue placeholder={dict.placeholders.fuel} />
                    </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                    {fuelTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                    </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="lg:col-span-3">
            <FormField
                control={control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.fields.type}<RequiredIndicator /></FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={dict.placeholders.type} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {carTypes.map(type => (
                          <SelectItem key={type} value={type}>{type === 'Other' ? dict.fields.other_option : type}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {watchType === 'Other' && (
                <FormField
                  control={control}
                  name="otherType"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>{dict.fields.otherType_label}<RequiredIndicator /></FormLabel>
                      <FormControl>
                        <Input placeholder={dict.placeholders.otherType} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
          </div>
        </div>
      </FormSection>

      <FormSection title={dict.sections.condition_report}>
          <div className="grid md:grid-cols-2 gap-6">
            <FormField
                control={control}
                name="titleCode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dict.fields.titleCode}</FormLabel>
                    <FormControl>
                      <Input placeholder={dict.placeholders.titleCode} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
            />
            <div>
              <FormField
                  control={control}
                  name="titleType"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>{dict.fields.titleType}<RequiredIndicator /></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder={dict.placeholders.titleType} />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                          {titleTypes.map(type => (
                              <SelectItem key={type} value={type}>{type === 'Other' ? dict.fields.other_option : dict.fields.titleType_types[type.replace(/\s+/g, '_').toLowerCase() as keyof typeof dict.fields.titleType_types]}</SelectItem>
                          ))}
                          </SelectContent>
                      </Select>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                {watchTitleType === 'Other' && (
                <FormField
                  control={control}
                  name="otherTitleType"
                  render={({ field }) => (
                    <FormItem className="mt-6">
                      <FormLabel>{dict.fields.otherTitleType_label}<RequiredIndicator /></FormLabel>
                      <FormControl>
                        <Input placeholder={dict.placeholders.otherTitleType} {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <FormField
                  control={control}
                  name="primaryDamage"
                  render={({ field }) => (
                      <FormItem>
                      <FormLabel>{dict.fields.primaryDamage}<RequiredIndicator /></FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                          <SelectTrigger>
                              <SelectValue placeholder={dict.placeholders.primaryDamage} />
                          </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                          {primaryDamageTypes.map(type => (
                              <SelectItem key={type} value={type}>{type === 'Other' ? dict.fields.other_option : dict.fields.primaryDamage_types[type.replace(/[\s/]+/g, '_').toLowerCase() as keyof typeof dict.fields.primaryDamage_types]}</SelectItem>
                          ))}
                          </SelectContent>
                      </Select>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
                {watchPrimaryDamage === 'Other' && (
                  <FormField
                  control={control}
                  name="otherPrimaryDamage"
                  render={({ field }) => (
                      <FormItem className="mt-6">
                      <FormLabel>{dict.fields.otherPrimaryDamage_label}<RequiredIndicator /></FormLabel>
                      <FormControl>
                          <Input placeholder={dict.placeholders.otherPrimaryDamage} {...field} />
                      </FormControl>
                      <FormMessage />
                      </FormItem>
                  )}
                  />
              )}
            </div>
            <div>
              <FormField
                control={control}
                name="secondaryDamage"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{dict.fields.secondaryDamage}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                        <SelectTrigger>
                            <SelectValue placeholder={dict.placeholders.secondaryDamage} />
                        </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                        {primaryDamageTypes.map(type => (
                            <SelectItem key={type} value={type}>{type === 'Other' ? dict.fields.other_option : dict.fields.primaryDamage_types[type.replace(/[\s/]+/g, '_').toLowerCase() as keyof typeof dict.fields.primaryDamage_types]}</SelectItem>
                        ))}
                        </SelectContent>
                    </Select>
                    <FormMessage />
                    </FormItem>
                )}
                />
              {watchSecondaryDamage === 'Other' && (
                <FormField
                control={control}
                name="otherSecondaryDamage"
                render={({ field }) => (
                    <FormItem className="mt-6">
                    <FormLabel>{dict.fields.otherSecondaryDamage_label}<RequiredIndicator /></FormLabel>
                    <FormControl>
                        <Input placeholder={dict.placeholders.otherSecondaryDamage} {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
              )}
            </div>
          </div>
            
          <FormField
              control={control}
              name="damageDescription"
              render={({ field }) => (
                  <FormItem>
                  <FormLabel>{dict.fields.damageDescription}</FormLabel>
                  <FormControl>
                      <Input placeholder={dict.placeholders.damageDescription} {...field} />
                  </FormControl>
                  <FormMessage />
                  </FormItem>
              )}
          />
          <FormField
              control={control}
              name="engineStatus"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dict.fields.engineStatus}<RequiredIndicator /></FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={dict.placeholders.engineStatus} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {engineStatusTypes.map(status => (
                        <SelectItem key={status} value={status}>
                          {dict.fields.engineStatus_types[status.replace(/\s+/g, '_').toLowerCase() as keyof typeof dict.fields.engineStatus_types]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
          />
          <FormField
            control={control}
            name="hasKeys"
            render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                <FormLabel className="text-base">
                    {dict.fields.hasKeys}<RequiredIndicator />
                </FormLabel>
                <p className="text-sm text-muted-foreground">
                    {dict.fields.hasKeys_desc}
                </p>
                </div>
                <FormControl>
                <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                />
                </FormControl>
            </FormItem>
            )}
        />
        </FormSection>

        <FormSection title={dict.sections.internal_notes}>
             <FormField
                control={control}
                name="internalNotes"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>{dict.fields.internalNotes_label}</FormLabel>
                    <FormControl>
                        <Textarea placeholder={dict.placeholders.internalNotes} {...field} className="min-h-[100px]" />
                    </FormControl>
                    <FormDescription>{dict.fields.internalNotes_desc}</FormDescription>
                    <FormMessage />
                    </FormItem>
                )}
            />
        </FormSection>
        
        <FormSection title={dict.sections.publishing}>
             <FormField
                control={control}
                name="isFeatured"
                render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                    <div className="space-y-0.5">
                    <FormLabel className="text-base">
                        {dict.fields.isFeatured}
                    </FormLabel>
                    <p className="text-sm text-muted-foreground">
                        {dict.fields.isFeatured_desc}
                    </p>
                    </div>
                    <FormControl>
                    <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                    />
                    </FormControl>
                </FormItem>
                )}
            />
        </FormSection>

    </div>
    
    <AlertDialog open={isRawDataDialogOpen} onOpenChange={setIsRawDataDialogOpen}>
        <AlertDialogContent className="max-w-3xl">
            <AlertDialogHeader>
                <AlertDialogTitle>{t_vin_modal.title}</AlertDialogTitle>
                <AlertDialogDescription>
                    {t_vin_modal.description}
                </AlertDialogDescription>
            </AlertDialogHeader>
            <Tabs defaultValue="sorted">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="sorted">{t_vin_modal.sorted_data_tab}</TabsTrigger>
                    <TabsTrigger value="raw">{t_vin_modal.raw_data_tab}</TabsTrigger>
                </TabsList>
                <TabsContent value="sorted">
                    <SortedDataView data={rawVinData || []} dict={dict} />
                </TabsContent>
                <TabsContent value="raw">
                    <ScrollArea className="h-96">
                        <pre className="text-xs p-4 bg-secondary rounded-md whitespace-pre-wrap">
                            <code>
                                {JSON.stringify(rawVinData, null, 2)}
                            </code>
                        </pre>
                    </ScrollArea>
                </TabsContent>
            </Tabs>
            <AlertDialogFooter>
                <AlertDialogCancel>{t_vin_modal.close_button}</AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    </AlertDialog>
    </>
  );
}
