import * as yup from 'yup';

export const checkoutValidationSchema = yup.object().shape({
    // Sender
    senderName: yup
        .string()
        .required('Ad Soyad zorunludur.')
        .max(100, 'Ad Soyad en fazla 100 karakter olabilir.'),
    senderEmail: yup
        .string()
        .required('E-posta zorunludur.')
        .email('Geçerli bir e-posta adresi giriniz.')
        .max(150, 'E-posta en fazla 150 karakter olabilir.'),
    senderPhone: yup
        .string()
        .required('Telefon zorunludur.')
        .matches(/^05\d{9}$/, 'Geçerli bir Türk cep telefonu giriniz (05XXXXXXXXX).'),
    senderCity: yup
        .string()
        .required('Şehir seçimi zorunludur.'),
    senderAddress: yup
        .string()
        .required("Adres zorunludur.")
        .max(500, 'Adres en fazla 500 karakter olabilir.'), // Opsiyonel ama uzunluk limiti var

    // Delivery
    recipientName: yup
        .string()
        .required('Alıcı Ad Soyad / Firma Unvanı zorunludur.')
        .max(100, 'Alıcı Ad Soyad en fazla 100 karakter olabilir.'),
    deliveryDate: yup
        .string()
        .required('Teslim tarihi zorunludur.'),
    deliveryTime: yup
        .string()
        .required('Teslim saati zorunludur.'),
    recipientPhone: yup
        .string()
        .required('Telefon zorunludur.')
        .matches(/^05\d{9}$/, 'Geçerli bir Türk cep telefonu giriniz (05XXXXXXXXX).'),
    district: yup
        .string()
        .required('Semt seçimi zorunludur.'),
    deliveryAddress: yup
        .string()
        .required('Teslimat adresi zorunludur.')
        .max(500, 'Adres en fazla 500 karakter olabilir.'),
    deliveryNote: yup
        .string()
        .max(300, 'Teslimat notu en fazla 300 karakter olabilir.'),
    flowerNote: yup
        .string()
        .max(300, 'Çiçek notu en fazla 300 karakter olabilir.'),

    // Additional Options
    showNameOnCard: yup.string(),
    deliveryConfirmation: yup.string(),
    messageToFlorist: yup
        .string()
        .max(500, 'Mesaj en fazla 500 karakter olabilir.'),

    // Billing & Payment
    billingType: yup.string(),
    tckn: yup.string().when('billingType', {
        is: 'individual',
        then: (schema) => schema.required('TC Kimlik Numarası zorunludur.').length(11, 'TC Kimlik Numarası 11 haneli olmalıdır.').matches(/^[0-9]+$/, 'Sadece rakam giriniz.'),
        otherwise: (schema) => schema.notRequired()
    }),
    taxOffice: yup.string().when('billingType', {
        is: 'corporate',
        then: (schema) => schema.required('Vergi Dairesi zorunludur.'),
        otherwise: (schema) => schema.notRequired()
    }),
    taxNumber: yup.string().when('billingType', {
        is: 'corporate',
        then: (schema) => schema.required('Vergi Numarası zorunludur.').length(10, 'Vergi Numarası 10 haneli olmalıdır.').matches(/^[0-9]+$/, 'Sadece rakam giriniz.'),
        otherwise: (schema) => schema.notRequired()
    }),
    paymentMethod: yup.string(),
    cardHolderName: yup.string().when('paymentMethod', {
        is: 'credit_card',
        then: (schema) => schema.required('Kart üzerindeki isim zorunludur.'),
        otherwise: (schema) => schema.notRequired(),
    }),
    cardNumber: yup.string().when('paymentMethod', {
        is: 'credit_card',
        then: (schema) => schema.required('Kart numarası zorunludur.').min(16, 'Kart numarası en az 16 haneli olmalıdır.').max(19, 'Kart numarası en çok 19 haneli olabilir.'),
        otherwise: (schema) => schema.notRequired(),
    }),
    cardExpiry: yup.string().when('paymentMethod', {
        is: 'credit_card',
        then: (schema) => schema
            .required('Son kullanma tarihi zorunludur.')
            .matches(/^\d{2}\/\d{2}$/, 'Kart son kullanma tarihi AA/YY formatında olmalıdır.')
            .test('valid-month', 'Geçersiz ay bilgisi (01-12).', (value) => {
                if (!value) return false;
                const [month] = value.split('/');
                const m = parseInt(month, 10);
                return m >= 1 && m <= 12;
            })
            .test('is-future', 'Kartınızın son kullanma tarihi geçmiş.', (value) => {
                if (!value || !/^\d{2}\/\d{2}$/.test(value)) return true; // Let regex/month check handle format errors
                const [month, year] = value.split('/').map(item => parseInt(item, 10));

                const now = new Date();
                const currentYear = now.getFullYear() % 100; // last 2 digits
                const currentMonth = now.getMonth() + 1; // 0-indexed to 1-12

                if (year < currentYear) return false;
                if (year === currentYear && month < currentMonth) return false;

                return true;
            }),
        otherwise: (schema) => schema.notRequired(),
    }),
    cardCvv: yup.string().when('paymentMethod', {
        is: 'credit_card',
        then: (schema) => schema.required('CVV kodu zorunludur.').length(3, 'CVV kodu 3 haneli olmalıdır.'),
        otherwise: (schema) => schema.notRequired(),
    }),
    agreement: yup
        .boolean()
        .oneOf([true], 'Mesafeli satış sözleşmesini kabul etmelisiniz.'),
});

export type CheckoutFormErrors = Partial<Record<string, string>>;

export const validateCheckoutForm = async (
    formData: Record<string, unknown>
): Promise<CheckoutFormErrors> => {
    try {
        await checkoutValidationSchema.validate(formData, { abortEarly: false });
        return {};
    } catch (err) {
        if (err instanceof yup.ValidationError) {
            const errors: CheckoutFormErrors = {};
            err.inner.forEach((e) => {
                if (e.path && !errors[e.path]) {
                    errors[e.path] = e.message;
                }
            });
            return errors;
        }
        return {};
    }
};
