import { motion } from "framer-motion"
import { ArrowRight, Shield } from "lucide-react"

export interface Product {
    id: string
    name: string
    description: string
    price: string
}

interface ProductCardProps {
    product: Product
}

export function ProductCard({ product }: ProductCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow max-w-sm w-full mb-3"
        >
            <div className="p-4">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2">
                        <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
                            <Shield className="h-5 w-5" />
                        </div>
                        <h3 className="font-semibold text-gray-900">{product.name}</h3>
                    </div>
                </div>

                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {product.description}
                </p>

                <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <div>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">Premium / Price</p>
                        <p className="text-lg font-bold text-gray-900">{product.price}</p>
                    </div>
                    <button className="flex items-center gap-1.5 text-sm font-semibold text-purple-600 hover:text-purple-700 bg-purple-50 hover:bg-purple-100 px-3 py-1.5 rounded-lg transition-colors">
                        View Details
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
