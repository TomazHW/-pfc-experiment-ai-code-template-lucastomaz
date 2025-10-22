/**
 * refactor-code.js
 *
 * Versão refatorada do LegacyOrderProcessor
 *
 * - Código modularizado
 * - Funções auxiliares para cálculos (subtotal, descontos, frete, impostos, taxas de pagamento)
 * - Validação robusta e mensagens de erro descritivas
 * - Tratamento de erros
 * - Uso de const/let e comparações estritas (===)
 */

/**
 * Constantes / valores mágicos extraídos
 */
const USER_DISCOUNTS = {
  VIP: 0.15,
  GOLD: 0.10,
  SILVER: 0.05,
  BRONZE: 0.02,
  REGULAR: 0.0
};

const PROMO_CODES = {
  SAVE10: 0.10,
  SAVE20: 0.20,
  SAVE30: 0.30,
  SAVE50: 0.50,
  BOGO: 0.50, // mantido conforme legacy (50% no subtotal)
  FREESHIP: 'FREESHIP'
};

const SHIPPING_COSTS = {
  EXPRESS: 25,
  STANDARD: 15,
  ECONOMY: 8,
  PICKUP: 0
};

const STATE_TAX_RATES = {
  CA: 0.0875,
  NY: 0.08,
  TX: 0.0625,
  FL: 0.0,
  DEFAULT: 0.05
};

const PAYMENT_FEES = {
  CREDIT_CARD: 0.029,
  DEBIT_CARD: 0.015,
  PAYPAL: 0.034,
  BANK_TRANSFER: 0.0,
  CRYPTO: 0.01
};

/**
 * Utilities
 */
function roundTwo(value) {
  return Math.round(value * 100) / 100;
}

function safeGet(obj, prop, defaultValue = null) {
  try {
    if (!obj || typeof obj !== 'object') return defaultValue;
    return obj[prop] !== undefined ? obj[prop] : defaultValue;
  } catch {
    return defaultValue;
  }
}

/**
 * Calcula subtotal (soma de price * quantity)
 * @param {Object} orderData
 * @returns {number}
 */
function calculateSubtotal(orderData) {
  if (!orderData || !Array.isArray(orderData.items)) return 0;

  let subtotal = 0;
  for (const item of orderData.items) {
    if (!item || typeof item !== 'object') continue;
    const price = Number(item.price);
    const quantity = Number(item.quantity);

    if (!Number.isFinite(price) || !Number.isFinite(quantity)) continue;
    if (price <= 0 || quantity <= 0) continue;

    subtotal += price * quantity;
  }
  return subtotal;
}

/**
 * Determina desconto baseado no tipo do usuário
 * @param {Object} userInfo
 * @param {number} subtotal
 * @returns {number}
 */
function calculateUserDiscount(userInfo, subtotal) {
  if (!userInfo || typeof userInfo.type !== 'string') return 0;
  const key = userInfo.type.toUpperCase();
  const rate = USER_DISCOUNTS[key] !== undefined ? USER_DISCOUNTS[key] : 0;
  return subtotal * rate;
}

/**
 * Aplica cupom/promo ao subtotal (retorna desconto sobre subtotal e flag freeship)
 * @param {Object} promoInfo
 * @param {number} subtotal
 * @returns {{discount: number, freeship: boolean}}
 */
function applyPromo(promoInfo, subtotal) {
  let discount = 0;
  let freeship = false;
  if (!promoInfo || typeof promoInfo.code !== 'string') return { discount, freeship };

  const code = promoInfo.code.toUpperCase();
  if (code === PROMO_CODES.FREESHIP) {
    freeship = true;
  } else if (PROMO_CODES[code] !== undefined) {
    discount += subtotal * PROMO_CODES[code];
  }
  return { discount, freeship };
}

/**
 * Calcula custo de envio
 * @param {Object} shippingInfo
 * @param {boolean} freeShipFlag
 * @returns {number}
 */
function calculateShipping(shippingInfo, freeShipFlag = false) {
  if (freeShipFlag) return 0;
  if (!shippingInfo || typeof shippingInfo.type !== 'string') return 0;
  const key = shippingInfo.type.toUpperCase();
  return SHIPPING_COSTS[key] !== undefined ? SHIPPING_COSTS[key] : 0;
}

/**
 * Calcula imposto baseado no estado do usuário
 * @param {Object} userInfo
 * @param {number} taxableAmount
 * @returns {number}
 */
function calculateTax(userInfo, taxableAmount) {
  if (!userInfo || typeof userInfo.state !== 'string') {
    return taxableAmount * STATE_TAX_RATES.DEFAULT;
  }
  const state = userInfo.state.toUpperCase();
  const rate = STATE_TAX_RATES[state] !== undefined ? STATE_TAX_RATES[state] : STATE_TAX_RATES.DEFAULT;
  return taxableAmount * rate;
}

/**
 * Calcula taxa de pagamento
 * @param {Object} paymentInfo
 * @param {number} taxableAmount
 * @returns {number}
 */
function calculatePaymentFee(paymentInfo, taxableAmount) {
  if (!paymentInfo || typeof paymentInfo.method !== 'string') return 0;
  const method = paymentInfo.method.toUpperCase();
  const rate = PAYMENT_FEES[method] !== undefined ? PAYMENT_FEES[method] : 0;
  return taxableAmount * rate;
}

/**
 * Classe refatorada para processamento de pedidos
 */
class OrderProcessor {
  /**
   * Processa um pedido e retorna o total final (igual funcionalidade do legacy)
   * @param {Object} orderData
   * @param {Object} userInfo
   * @param {Object} paymentInfo
   * @param {Object} shippingInfo
   * @param {Object} promoInfo
   * @returns {number} finalTotal (arredondado com 2 casas)
   */
  processOrder(orderData, userInfo, paymentInfo, shippingInfo, promoInfo) {
    try {
      // Cálculos básicos
      const subtotal = calculateSubtotal(orderData);

      const userDiscount = calculateUserDiscount(userInfo, subtotal);
      const promoResult = applyPromo(promoInfo, subtotal);
      const couponDiscount = promoResult.discount;
      const freeship = promoResult.freeship;

      // shipping
      const shipping = calculateShipping(shippingInfo, freeship);

      // taxable is subtotal minus discounts
      const taxable = subtotal - userDiscount - couponDiscount;
      const tax = taxable > 0 ? calculateTax(userInfo, taxable) : 0;

      // pagamento
      const paymentFee = calculatePaymentFee(paymentInfo, Math.max(0, taxable));

      let finalTotal = subtotal - userDiscount - couponDiscount + tax + shipping + paymentFee;
      if (finalTotal < 0) finalTotal = 0;
      return roundTwo(finalTotal);
    } catch (err) {
      // Em caso de erro inesperado, lançar para que chamador trate ou logue
      throw new Error(`Erro ao processar pedido: ${err && err.message ? err.message : String(err)}`);
    }
  }

  /**
   * Calcula o total do pedido com uma interface alternativa (compatível em funcionalidade com calculateOrderTotal legacy)
   * @param {Object} order
   * @param {Object} customer
   * @param {Object} payment
   * @param {Object} delivery
   * @param {Object} coupon
   * @returns {number}
   */
  calculateOrderTotal(order, customer, payment, delivery, coupon) {
    // Reaproveita as mesmas funções internas para manter comportamento consistente
    try {
      // Construir um objeto compatível com processOrder para reaproveitar lógica
      const orderData = {
        items: Array.isArray(order && order.products) ? order.products.map(p => ({
          price: p.cost,
          quantity: p.count
        })) : []
      };

      const userInfo = {
        type: (customer && customer.level) ? customer.level : undefined,
        state: (customer && customer.location) ? customer.location : undefined
      };

      const paymentInfo = { method: payment && payment.type ? payment.type : undefined };
      const shippingInfo = { type: delivery && delivery.speed ? delivery.speed : undefined };
      const promoInfo = coupon && coupon.discount ? { code: null, discount: coupon.discount } : undefined;

      // Se couponInfo trouxe desconto em forma de fraction (ex: 0.1), aplicar manualmente:
      if (promoInfo && promoInfo.discount) {
        // aplica desconto direto ao subtotal no pipeline abaixo via applyPromo alternativa
        const subtotal = calculateSubtotal(orderData);
        const userDiscount = calculateUserDiscount(userInfo, subtotal);
        const couponDiscount = subtotal * promoInfo.discount;
        const shipping = calculateShipping(shippingInfo, false);
        const taxable = subtotal - userDiscount - couponDiscount;
        const tax = taxable > 0 ? calculateTax(userInfo, taxable) : 0;
        const paymentFee = calculatePaymentFee(paymentInfo, Math.max(0, taxable));
        let total = subtotal - userDiscount - couponDiscount + tax + shipping + paymentFee;
        if (total < 0) total = 0;
        return roundTwo(total);
      }

      // Caso sem coupon como fraction, reaproveitar processOrder
      // Se coupon não é nulo mas tem 'code', deixamos para processOrder tratar
      const promoWrapped = promoInfo && promoInfo.code ? promoInfo : undefined;
      return this.processOrder(orderData, userInfo, paymentInfo, shippingInfo, promoWrapped);
    } catch (err) {
      throw new Error(`Erro em calculateOrderTotal: ${err && err.message ? err.message : String(err)}`);
    }
  }

  /**
   * Validação e processamento do pedido (retorna objeto com isValid, errors, warnings)
   * Mantém a mesma ideia do método legacy, mas com validações mais claras e mensagens consistentes.
   *
   * @param {Object} order
   * @param {Object} user
   * @param {Object} payment
   * @param {Object} shipping
   * @param {Object} promo
   * @param {Object} inventory - objeto com método checkStock(id, qty) => boolean
   * @returns {{isValid: boolean, errors: string[], warnings: string[]}}
   */
  validateAndProcessOrder(order, user, payment, shipping, promo, inventory) {
    const errors = [];
    const warnings = [];
    let isValid = true;

    try {
      // order validations
      if (!order || typeof order !== 'object') {
        errors.push('Pedido não informado');
        return { isValid: false, errors, warnings };
      }

      if (!Array.isArray(order.items)) {
        errors.push('Itens do pedido não informados');
      } else if (order.items.length === 0) {
        errors.push('Pedido sem itens');
      } else {
        // valida cada item
        for (const item of order.items) {
          if (!item || typeof item !== 'object') {
            errors.push('Item inválido');
            continue;
          }
          if (!item.id) {
            errors.push('ID do item não informado');
            continue;
          }
          if (item.quantity === undefined || item.quantity === null) {
            errors.push(`Quantidade não informada para item ${item.id}`);
            continue;
          }
          if (!Number.isFinite(Number(item.quantity)) || Number(item.quantity) <= 0) {
            errors.push(`Quantidade inválida para item ${item.id}`);
            continue;
          }
          if (item.price === undefined || item.price === null) {
            errors.push(`Preço não informado para item ${item.id}`);
            continue;
          }
          if (!Number.isFinite(Number(item.price)) || Number(item.price) <= 0) {
            errors.push(`Preço inválido para item ${item.id}`);
            continue;
          }

          // checar estoque quando disponível
          if (inventory && typeof inventory.checkStock === 'function') {
            try {
              const available = inventory.checkStock(item.id, Number(item.quantity));
              if (!available) {
                errors.push(`Item ${item.id} não disponível`);
              }
            } catch (invErr) {
              warnings.push(`Erro ao verificar estoque do item ${item.id}`);
            }
          }
        }
      }

      // user validations
      if (!user || typeof user !== 'object') {
        errors.push('Usuário não informado');
      } else {
        if (!user.id) errors.push('ID do usuário não informado');
        if (!user.email) errors.push('Email do usuário não informado');
        if (!user.address) errors.push('Endereço do usuário não informado');
      }

      // payment validations
      if (!payment || typeof payment !== 'object') {
        errors.push('Informações de pagamento não fornecidas');
      } else {
        if (!payment.method) errors.push('Método de pagamento não informado');
        if (payment.amount === undefined || payment.amount === null) {
          errors.push('Valor do pagamento não informado');
        } else if (!Number.isFinite(Number(payment.amount)) || Number(payment.amount) <= 0) {
          errors.push('Valor do pagamento inválido');
        }
      }

      // Se houver erros, marcar como inválido
      if (errors.length > 0) isValid = false;

      return { isValid, errors, warnings };
    } catch (err) {
      // Em caso de erro inesperado durante validação, retornamos erro geral
      return { isValid: false, errors: [`Erro inesperado durante validação: ${err.message || String(err)}`], warnings };
    }
  }
}

module.exports = { OrderProcessor };


console.log("Início Tarefa 2 - [Chat GPT]")