
'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import type { Product } from "@/lib/types";

const formSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  phone1: z.string().min(10, { message: "رقم الهاتف الأول غير صالح" }),
  phone2: z.string().optional().or(z.literal('')),
  governorate: z.string().min(3, { message: "يرجى إدخال اسم المحافظة" }),
  city: z.string().min(3, { message: "يرجى إدخال اسم المدينة" }),
  village: z.string().optional().or(z.literal('')),
  street: z.string().min(5, { message: "يرجى إدخال اسم الشارع" }),
});

interface QuickCheckoutFormProps {
  product: Product;
}

export default function QuickCheckoutForm({ product }: QuickCheckoutFormProps) {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone1: "",
      phone2: "",
      governorate: "",
      city: "",
      village: "",
      street: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsSubmitting(true);
    const whatsappNumber = "201557219572";
    
    const productDetails = `- ${product.name} (الكمية: 1) - السعر: ${product.price.toLocaleString('ar-EG')} جنيه`;

    const message = `
طلب سريع لمنتج واحد من متجر Matgar.tech 🛍️
-----------------------------------
👤 *الاسم:* ${values.name}
📱 *رقم الهاتف (1):* ${values.phone1}
${values.phone2 ? `📱 *رقم الهاتف (2):* ${values.phone2}` : ''}
📍 *العنوان:*
- المحافظة: ${values.governorate}
- المدينة: ${values.city}
${values.village ? `- القرية: ${values.village}`: ''}
- الشارع: ${values.street}
-----------------------------------
🛒 *المنتج المطلوب:*
${productDetails}
-----------------------------------
💰 *المبلغ الإجمالي:* ${product.price.toLocaleString('ar-EG')} جنيه
`.trim().replace(/^\s+/gm, '');

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    
    toast({
      title: "تم تجهيز طلبك!",
      description: "سيتم الآن توجيهك إلى واتساب لإرسال الطلب. فقط اضغط على زر الإرسال.",
      variant: 'default',
    });
    
    // افتح واتساب في نافذة جديدة لتجنب مغادرة الصفحة
    window.open(whatsappUrl, '_blank');

    // إعادة تعيين النموذج والحالة بعد فترة قصيرة للسماح بفتح واتساب
    setTimeout(() => {
        form.reset();
        setIsSubmitting(false);
    }, 2000);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الاسم الثلاثي</FormLabel>
              <FormControl>
                <Input placeholder="مثال: أحمد محمد علي" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="phone1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم الهاتف الأساسي</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: 01012345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>رقم هاتف إضافي (اختياري)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: 01112345678" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="governorate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المحافظة</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: القاهرة" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="city"
            render={({ field }) => (
              <FormItem>
                <FormLabel>المدينة / المركز</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: مدينة نصر" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
         <FormField
            control={form.control}
            name="village"
            render={({ field }) => (
              <FormItem>
                <FormLabel>القرية / المنطقة (اختياري)</FormLabel>
                <FormControl>
                  <Input placeholder="مثال: الحى السابع" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <FormField
          control={form.control}
          name="street"
          render={({ field }) => (
            <FormItem>
              <FormLabel>الشارع ورقم المبنى/الشقة</FormLabel>
              <FormControl>
                <Input placeholder="مثال: شارع عباس العقاد، مبنى 5، شقة 10" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" size="lg" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isSubmitting}>
          {isSubmitting ? (
            <Loader2 className="ml-2 h-4 w-4 animate-spin" />
          ) : (
            "إرسال الطلب عبر واتساب"
          )}
        </Button>
      </form>
    </Form>
  );
}
