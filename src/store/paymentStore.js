import { defineStore } from 'pinia';
import { useAuthStore } from './authStore';
import { useTripStore } from './tripStore';

export const usePaymentStore = defineStore('payment', {
  state: () => ({
    transactions: [],
    invoices: [],
    paymentMethods: [
      {
        id: 1,
        type: 'card',
        brand: 'Visa',
        last4: '4242',
        expiryMonth: 12,
        expiryYear: 2026,
        isDefault: true
      },
      {
        id: 2,
        type: 'card',
        brand: 'Mastercard',
        last4: '5555',
        expiryMonth: 8,
        expiryYear: 2025,
        isDefault: false
      }
    ],

    // Tarifes i preus
    baseFare: {
      'Normal': 5.00,
      'Assisted': 8.50,
      'Adapted': 12.00
    },
    perKmRate: {
      'Normal': 1.20,
      'Assisted': 1.50,
      'Adapted': 2.00
    },
    timeRate: 0.35, // per minut
    serviceMultiplier: {
      'Cultura': 1.0,
      'Família': 1.0,
      'Salut': 1.1,
      'Compres': 0.95, // descompte compres
      'Natura': 1.05
    },
    emergencyMultiplier: 1.5,

    // Descuentos y promociones
    discounts: [
      {
        id: 1,
        code: 'WELCOME10',
        description: 'Bienvenida 10%',
        percentage: 10,
        maxUses: 1,
        used: 0,
        active: true
      },
      {
        id: 2,
        code: 'REGULAR15',
        description: 'Clientes regulares 15%',
        percentage: 15,
        minTrips: 5,
        active: true
      },
      {
        id: 3,
        code: 'VIVA20',
        description: 'Viva Pass 20%',
        percentage: 20,
        requiresSubscription: 'viva-pass-monthly',
        active: true
      }
    ]
  }),

  getters: {
    getTransactions: (state) => state.transactions,
    getInvoices: (state) => state.getInvoices,
    getPaymentMethods: (state) => state.paymentMethods
  },

  actions: {
    // Calcular precio del viaje
    calculateTripPrice(trip) {
      const basePrice = this.baseFare[trip.vehicleType] || 5.00;
      const kmPrice = (trip.totalKm || 0) * (this.perKmRate[trip.vehicleType] || 1.20);
      const serviceMultiplier = this.serviceMultiplier[trip.service] || 1.0;
      
      let price = (basePrice + kmPrice) * serviceMultiplier;
      
      if (trip.isEmergency) {
        price *= this.emergencyMultiplier;
      }
      
      return {
        baseFare: basePrice,
        kmCharge: kmPrice,
        subtotal: price,
        tax: price * 0.21,
        total: price * 1.21
      };
    },

    // Aplicar descuento
    applyDiscount(tripPrice, discountCode, userProfile) {
      const discount = this.discounts.find(d => d.code === discountCode && d.active);
      
      if (!discount) {
        return { ...tripPrice, discount: 0, discountApplied: null };
      }

      // Validaciones
      if (discount.maxUses && discount.used >= discount.maxUses) {
        return { ...tripPrice, discount: 0, error: 'Aquest codi ja s\'ha utilitzat' };
      }

      if (discount.minTrips && (userProfile.totalTrips || 0) < discount.minTrips) {
        return { ...tripPrice, discount: 0, error: 'No compleix requisits mínims' };
      }

      if (discount.requiresSubscription && userProfile.subscriptionType !== discount.requiresSubscription) {
        return { ...tripPrice, discount: 0, error: 'Requereix subscripció Viva Pass' };
      }

      const discountAmount = (tripPrice.total * discount.percentage) / 100;
      discount.used++;

      return {
        ...tripPrice,
        discountCode,
        discountPercentage: discount.percentage,
        discount: discountAmount,
        finalTotal: tripPrice.total - discountAmount
      };
    },

    // Procesar pago
    processPayment(trip, paymentMethod, discountCode = null) {
      const authStore = useAuthStore();
      const user = authStore.currentUser;

      const tripPrice = this.calculateTripPrice(trip);
      const pricingWithDiscount = discountCode 
        ? this.applyDiscount(tripPrice, discountCode, user)
        : tripPrice;

      const finalAmount = pricingWithDiscount.finalTotal || pricingWithDiscount.total;

      // Crear transacción
      const transaction = {
        id: `TXN-${Date.now()}`,
        tripId: trip.id,
        userId: user.id,
        amount: finalAmount,
        currency: 'EUR',
        paymentMethod: paymentMethod,
        status: 'completed',
        description: `Viaje ${trip.service} - ${trip.pickup}`,
        timestamp: new Date(),
        pricing: pricingWithDiscount,
        receipt: this.generateReceipt(trip, pricingWithDiscount)
      };

      this.transactions.push(transaction);
      
      // Actualizar balance del usuario
      authStore.updateBalance(-finalAmount);

      // Crear factura
      this.createInvoice(transaction);

      return transaction;
    },

    // Crear factura
    createInvoice(transaction) {
      const authStore = useAuthStore();
      const user = authStore.currentUser;

      const invoice = {
        id: `INV-${Date.now()}`,
        transactionId: transaction.id,
        userId: user.id,
        issueDate: new Date(),
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        items: [
          {
            description: transaction.description,
            quantity: 1,
            unitPrice: transaction.pricing.subtotal,
            total: transaction.pricing.subtotal
          }
        ],
        subtotal: transaction.pricing.subtotal,
        tax: transaction.pricing.tax,
        discount: transaction.pricing.discount || 0,
        total: transaction.amount,
        status: 'paid',
        clientName: user.name,
        clientEmail: user.email,
        companyInfo: {
          name: 'RURAL-GO VIVA',
          address: 'Carrer Major, 1',
          taxId: 'ES123456789',
          phone: '+34 934 567 890'
        }
      };

      this.invoices.push(invoice);
      return invoice;
    },

    // Generar recibo
    generateReceipt(trip, pricing) {
      return {
        tripId: trip.id,
        date: new Date(),
        service: trip.service,
        pickup: trip.pickup,
        vehicleType: trip.vehicleType,
        km: trip.totalKm,
        duration: trip.duration || '15 min',
        driver: trip.driver?.name || 'Asignado',
        baseFare: pricing.baseFare?.toFixed(2),
        kmCharge: pricing.kmCharge?.toFixed(2),
        subtotal: pricing.subtotal?.toFixed(2),
        discount: pricing.discount?.toFixed(2),
        tax: pricing.tax?.toFixed(2),
        total: (pricing.finalTotal || pricing.total)?.toFixed(2)
      };
    },

    // Retirada para conductores
    requestWithdrawal(amount, bankAccount) {
      const withdrawal = {
        id: `WTH-${Date.now()}`,
        amount,
        bankAccount,
        status: 'pending',
        requestDate: new Date(),
        expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        description: 'Retirada de ganancias'
      };

      this.transactions.push(withdrawal);
      return withdrawal;
    },

    // Historial de pagos
    getUserTransactions(userId) {
      return this.transactions.filter(t => t.userId === userId);
    },

    // Historial de facturas
    getUserInvoices(userId) {
      return this.invoices.filter(inv => inv.userId === userId);
    },

    // Estadísticas de pagos
    getPaymentStats(userId) {
      const userTransactions = this.getUserTransactions(userId);
      
      return {
        totalSpent: userTransactions.reduce((sum, t) => sum + (t.amount || 0), 0),
        totalTrips: userTransactions.length,
        averageTrip: userTransactions.length > 0 
          ? userTransactions.reduce((sum, t) => sum + (t.amount || 0), 0) / userTransactions.length 
          : 0,
        lastTransaction: userTransactions[userTransactions.length - 1] || null
      };
    }
  }
});
