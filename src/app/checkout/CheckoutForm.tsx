'use client';

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useCart } from "@/context/CartContext";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

const formSchema = z.object({
  name: z.string().min(3, { message: "الاسم يجب أن يكون 3 أحرف على الأقل" }),
  phone1: z.string().min(10, { message: "رقم الهاتف الأول غير صالح" }),
  phone2: z.string().optional().or(z.literal('')),
  governorate: z.string().min(3, { message: "يرجى إدخال اسم المحافظة" }),
  city: z.string().min(3, { message: "يرجى إدخال اسم المدينة" }),
  village: z.string().optional().or(z.literal('')),
  street: z.string().min(5, { message: "يرجى إدخال اسم الشارع" }),
});

export default function CheckoutForm() {
  const { cartItems, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [whatsappUrl, setWhatsappUrl] = useState('');

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

  const handlePrepareOrder = async () => {
    setIsSubmitting(true);
    const isValid = await form.trigger();
    if (!isValid) {
      toast({
        title: "خطأ في البيانات",
        description: "يرجى مراجعة الحقول المطلوبة والتأكد من إدخالها بشكل صحيح.",
        variant: "destructive",
      });
      setIsSubmitting(false);
      return;
    }
    
    const values = form.getValues();
    const whatsappNumber = "201557219572";
    
    const productDetails = cartItems.map(item => 
      `- ${item.name} (الكمية: ${item.quantity}) - السعر: ${(item.price * item.quantity).toLocaleString('ar-EG')} جنيه`
    ).join('\n');

    const message = `
طلب جديد من متجر Matgar.tech 🛍️
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
🛒 *الطلبات:*
${productDetails}
-----------------------------------
💰 *المبلغ الإجمالي:* ${totalPrice.toLocaleString('ar-EG')} جنيه
`.trim().replace(/^\s+/gm, '');

    const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    setWhatsappUrl(url);

    toast({
      title: "تم تجهيز طلبك!",
      description: "الآن اضغط على زر 'إرسال عبر واتساب' لإتمام العملية.",
      variant: 'default',
    });

    setIsSubmitting(false);
  }
  
  const handleOrderSent = () => {
    setTimeout(() => {
        clearCart();
        form.reset();
        setWhatsappUrl('');
    }, 1500);
  }

  return (
    <Form {...form}>
      <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
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
        
        {!whatsappUrl ? (
          <Button onClick={handlePrepareOrder} size="lg" className="w-full" disabled={isSubmitting || cartItems.length === 0}>
            {isSubmitting ? (
              <Loader2 className="ml-2 h-4 w-4 animate-spin" />
            ) : (
              "تجهيز الطلب"
            )}
          </Button>
        ) : (
          <Button asChild size="lg" className="w-full bg-green-500 hover:bg-green-600 text-white">
            <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" onClick={handleOrderSent}>
              إرسال عبر واتساب
            </a>
          </Button>
        )}
      </form>
    </Form>
  );
}
