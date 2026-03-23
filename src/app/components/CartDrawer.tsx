import { X, Plus, Minus, Trash2, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { Link } from "react-router";
import { ImageWithFallback } from "./figma/ImageWithFallback";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const { items, removeFromCart, updateQuantity, getTotalPrice } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-50"
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full sm:w-96 bg-white shadow-xl z-50 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Carrito ({items.length})
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Tu carrito está vacío</p>
              <Link
                to="/productos"
                onClick={onClose}
                className="inline-block mt-4 text-emerald-600 hover:text-emerald-700"
              >
                Ver productos
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 bg-gray-50 p-3 rounded-lg">
                  <div className="w-20 h-20 flex-shrink-0 rounded overflow-hidden">
                    <ImageWithFallback
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm mb-1 truncate">{item.name}</h3>
                    <p className="text-emerald-600 mb-2">${item.price}</p>
                    
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1 bg-white border rounded hover:bg-gray-100"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="text-sm w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1 bg-white border rounded hover:bg-gray-100"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t p-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-lg">Total:</span>
              <span className="text-2xl text-emerald-600">
                ${getTotalPrice().toFixed(2)}
              </span>
            </div>
            
            <Link
              to="/checkout"
              onClick={onClose}
              className="block w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg text-center transition-colors"
            >
              Proceder al Pago
            </Link>
            
            <button
              onClick={onClose}
              className="block w-full bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 rounded-lg text-center transition-colors"
            >
              Continuar Comprando
            </button>
          </div>
        )}
      </div>
    </>
  );
}
