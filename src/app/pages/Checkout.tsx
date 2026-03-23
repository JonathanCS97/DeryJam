import { useState } from "react";
import { useNavigate } from "react-router";
import { useCart } from "../context/CartContext";
import { CreditCard, Truck, CheckCircle, ChevronLeft, ChevronRight } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";

type CheckoutStep = "cart" | "shipping" | "payment" | "confirmation";

export function Checkout() {
  const navigate = useNavigate();
  const { items, getTotalPrice, clearCart, updateQuantity, removeFromCart } = useCart();
  const [currentStep, setCurrentStep] = useState<CheckoutStep>("cart");
  const [orderNumber, setOrderNumber] = useState("");

  const [shippingData, setShippingData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    notes: ""
  });

  const [paymentData, setPaymentData] = useState({
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    paymentMethod: "card"
  });

  const subtotal = getTotalPrice();
  const shipping = subtotal > 500 ? 0 : 80;
  const tax = subtotal * 0.16;
  const total = subtotal + shipping + tax;

  const handleShippingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setShippingData({
      ...shippingData,
      [e.target.name]: e.target.value
    });
  };

  const handlePaymentChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value
    });
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep("payment");
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Generate order number
    const orderNum = "DRJ" + Date.now().toString().slice(-8);
    setOrderNumber(orderNum);
    setCurrentStep("confirmation");
  };

  const handleFinish = () => {
    clearCart();
    navigate("/");
  };

  if (items.length === 0 && currentStep !== "confirmation") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-2xl mb-4 text-gray-700">Tu carrito está vacío</h2>
          <button
            onClick={() => navigate("/productos")}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-lg transition-colors"
          >
            Ver Productos
          </button>
        </div>
      </div>
    );
  }

  const steps = [
    { id: "cart", label: "Carrito", icon: "🛒" },
    { id: "shipping", label: "Envío", icon: "📦" },
    { id: "payment", label: "Pago", icon: "💳" },
    { id: "confirmation", label: "Confirmación", icon: "✅" }
  ];

  const currentStepIndex = steps.findIndex(s => s.id === currentStep);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-3xl mx-auto">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-12 h-12 rounded-full flex items-center justify-center text-xl mb-2 ${
                      index <= currentStepIndex
                        ? "bg-emerald-600 text-white"
                        : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {step.icon}
                  </div>
                  <span
                    className={`text-sm ${
                      index <= currentStepIndex ? "text-emerald-600" : "text-gray-500"
                    }`}
                  >
                    {step.label}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 ${
                      index < currentStepIndex ? "bg-emerald-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Cart Review Step */}
        {currentStep === "cart" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl mb-6 text-emerald-900">Revisar Carrito</h2>
                <div className="space-y-4">
                  {items.map((item) => (
                    <div key={item.id} className="flex gap-4 pb-4 border-b">
                      <div className="w-24 h-24 flex-shrink-0 rounded overflow-hidden">
                        <ImageWithFallback
                          src={item.image}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="mb-1">{item.name}</h3>
                        <p className="text-gray-600 text-sm mb-2">{item.description}</p>
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                              className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                            >
                              -
                            </button>
                            <span className="w-8 text-center">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="p-1 bg-gray-100 rounded hover:bg-gray-200"
                            >
                              +
                            </button>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 text-sm hover:text-red-700"
                          >
                            Eliminar
                          </button>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-emerald-600 text-lg">
                          ${(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl mb-4 text-emerald-900">Resumen</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span>{shipping === 0 ? "¡Gratis!" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA (16%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span>Total:</span>
                    <span className="text-emerald-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                <button
                  onClick={() => setCurrentStep("shipping")}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                >
                  Continuar al Envío
                  <ChevronRight className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Shipping Step */}
        {currentStep === "shipping" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <Truck className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-2xl text-emerald-900">Información de Envío</h2>
                </div>

                <form onSubmit={handleShippingSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Nombre Completo *</label>
                      <input
                        type="text"
                        name="fullName"
                        required
                        value={shippingData.fullName}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Juan Pérez"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Email *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={shippingData.email}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="tu@email.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Teléfono *</label>
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={shippingData.phone}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="(55) 1234 5678"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Dirección *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={shippingData.address}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="Calle, número, colonia"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-gray-700 mb-2">Ciudad *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={shippingData.city}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Ciudad"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Estado *</label>
                      <input
                        type="text"
                        name="state"
                        required
                        value={shippingData.state}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="Estado"
                      />
                    </div>

                    <div>
                      <label className="block text-gray-700 mb-2">Código Postal *</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={shippingData.postalCode}
                        onChange={handleShippingChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                        placeholder="12345"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-gray-700 mb-2">Notas de Entrega (Opcional)</label>
                    <textarea
                      name="notes"
                      rows={3}
                      value={shippingData.notes}
                      onChange={handleShippingChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                      placeholder="Referencias, instrucciones especiales, etc."
                    />
                  </div>

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("cart")}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Continuar al Pago
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl mb-4 text-emerald-900">Resumen del Pedido</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span>{shipping === 0 ? "¡Gratis!" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA (16%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-lg">
                    <span>Total:</span>
                    <span className="text-emerald-600">${total.toFixed(2)}</span>
                  </div>
                </div>
                {subtotal < 500 && (
                  <p className="text-sm text-gray-600 bg-emerald-50 p-3 rounded">
                    ¡Agrega ${(500 - subtotal).toFixed(2)} más para envío gratis!
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Step */}
        {currentStep === "payment" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-md p-6">
                <div className="flex items-center gap-3 mb-6">
                  <CreditCard className="h-6 w-6 text-emerald-600" />
                  <h2 className="text-2xl text-emerald-900">Información de Pago</h2>
                </div>

                <form onSubmit={handlePaymentSubmit} className="space-y-6">
                  <div>
                    <label className="block text-gray-700 mb-3">Método de Pago</label>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="card"
                          checked={paymentData.paymentMethod === "card"}
                          onChange={handlePaymentChange}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-semibold">Tarjeta</p>
                          <p className="text-sm text-gray-500">Crédito/Débito</p>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="paypal"
                          checked={paymentData.paymentMethod === "paypal"}
                          onChange={handlePaymentChange}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-semibold">PayPal</p>
                          <p className="text-sm text-gray-500">Pago seguro</p>
                        </div>
                      </label>

                      <label className="flex items-center p-4 border-2 border-gray-300 rounded-lg cursor-pointer hover:border-emerald-500">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="oxxo"
                          checked={paymentData.paymentMethod === "oxxo"}
                          onChange={handlePaymentChange}
                          className="mr-3"
                        />
                        <div>
                          <p className="font-semibold">OXXO</p>
                          <p className="text-sm text-gray-500">Pago en efectivo</p>
                        </div>
                      </label>
                    </div>
                  </div>

                  {paymentData.paymentMethod === "card" && (
                    <>
                      <div>
                        <label className="block text-gray-700 mb-2">Nombre en la Tarjeta *</label>
                        <input
                          type="text"
                          name="cardName"
                          required
                          value={paymentData.cardName}
                          onChange={handlePaymentChange}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="JUAN PEREZ"
                        />
                      </div>

                      <div>
                        <label className="block text-gray-700 mb-2">Número de Tarjeta *</label>
                        <input
                          type="text"
                          name="cardNumber"
                          required
                          value={paymentData.cardNumber}
                          onChange={handlePaymentChange}
                          maxLength={19}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                          placeholder="1234 5678 9012 3456"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 mb-2">Fecha de Vencimiento *</label>
                          <input
                            type="text"
                            name="expiryDate"
                            required
                            value={paymentData.expiryDate}
                            onChange={handlePaymentChange}
                            maxLength={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="MM/AA"
                          />
                        </div>

                        <div>
                          <label className="block text-gray-700 mb-2">CVV *</label>
                          <input
                            type="text"
                            name="cvv"
                            required
                            value={paymentData.cvv}
                            onChange={handlePaymentChange}
                            maxLength={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                            placeholder="123"
                          />
                        </div>
                      </div>
                    </>
                  )}

                  {paymentData.paymentMethod === "paypal" && (
                    <div className="bg-blue-50 p-6 rounded-lg text-center">
                      <p className="text-gray-700 mb-4">
                        Serás redirigido a PayPal para completar tu pago de forma segura.
                      </p>
                      <div className="text-4xl mb-2">💳</div>
                    </div>
                  )}

                  {paymentData.paymentMethod === "oxxo" && (
                    <div className="bg-yellow-50 p-6 rounded-lg">
                      <p className="text-gray-700 mb-4">
                        Al confirmar, recibirás una ficha de pago para pagar en cualquier tienda OXXO.
                      </p>
                      <ul className="text-sm text-gray-600 space-y-2">
                        <li>• Válido por 3 días</li>
                        <li>• Tu pedido se procesará al confirmar el pago</li>
                        <li>• Recibirás la ficha por email</li>
                      </ul>
                    </div>
                  )}

                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setCurrentStep("shipping")}
                      className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <ChevronLeft className="h-5 w-5" />
                      Volver
                    </button>
                    <button
                      type="submit"
                      className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      Confirmar Pedido
                      <CheckCircle className="h-5 w-5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>

            <div>
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-24">
                <h3 className="text-xl mb-4 text-emerald-900">Total a Pagar</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Envío:</span>
                    <span>{shipping === 0 ? "¡Gratis!" : `$${shipping.toFixed(2)}`}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>IVA (16%):</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-3 flex justify-between text-xl">
                    <span>Total:</span>
                    <span className="text-emerald-600">${total.toFixed(2)}</span>
                  </div>
                </div>

                <div className="bg-emerald-50 p-4 rounded-lg">
                  <p className="text-sm text-emerald-800">
                    🔒 Pago 100% seguro y protegido
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Confirmation Step */}
        {currentStep === "confirmation" && (
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-8 text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>

              <h2 className="text-3xl mb-4 text-emerald-900">¡Pedido Confirmado!</h2>
              <p className="text-gray-600 mb-6">
                Gracias por tu compra. Tu pedido ha sido procesado exitosamente.
              </p>

              <div className="bg-gray-50 p-6 rounded-lg mb-6">
                <p className="text-sm text-gray-600 mb-2">Número de Pedido</p>
                <p className="text-2xl text-emerald-600 mb-4">{orderNumber}</p>
                
                <div className="border-t pt-4 space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Pagado:</span>
                    <span className="text-lg">${total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Método de Pago:</span>
                    <span>
                      {paymentData.paymentMethod === "card" && "Tarjeta"}
                      {paymentData.paymentMethod === "paypal" && "PayPal"}
                      {paymentData.paymentMethod === "oxxo" && "OXXO"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-left">
                <h3 className="font-semibold mb-2 text-gray-800">Información de Envío:</h3>
                <p className="text-sm text-gray-600">{shippingData.fullName}</p>
                <p className="text-sm text-gray-600">{shippingData.address}</p>
                <p className="text-sm text-gray-600">
                  {shippingData.city}, {shippingData.state} {shippingData.postalCode}
                </p>
                <p className="text-sm text-gray-600 mt-2">{shippingData.email}</p>
                <p className="text-sm text-gray-600">{shippingData.phone}</p>
              </div>

              <p className="text-gray-600 mb-6">
                Hemos enviado un correo de confirmación a <strong>{shippingData.email}</strong> con
                los detalles de tu pedido.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={handleFinish}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg transition-colors"
                >
                  Volver al Inicio
                </button>
                <button
                  onClick={() => navigate("/productos")}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 rounded-lg transition-colors"
                >
                  Seguir Comprando
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
