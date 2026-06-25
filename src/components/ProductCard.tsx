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
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -8, scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="group relative bg-white rounded-3xl border border-purple-100/50 shadow-xl shadow-purple-900/5 overflow-hidden hover:shadow-2xl hover:shadow-purple-900/10 transition-all duration-300 w-full"
        >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50/50 via-white to-violet-50/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <div className="relative p-6 sm:p-8">
                <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-gradient-to-br from-purple-100 to-violet-200 rounded-2xl text-purple-700 shadow-inner">
                            <Shield className="h-6 w-6" />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 tracking-tight">{product.name}</h3>
                    </div>
                </div>

                <p className="text-sm text-slate-600 mb-8 leading-relaxed line-clamp-3">
                    {product.description}
                </p>

                <div className="flex items-end justify-between pt-6 border-t border-slate-100">
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-1">Premium</p>
                        <p className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-violet-600">
                            {product.price}
                        </p>
                    </div>
                    <button className="flex items-center gap-2 text-sm font-bold text-white bg-slate-900 hover:bg-purple-600 px-5 py-3 rounded-xl transition-all shadow-lg hover:shadow-purple-500/30">
                        View Details
                        <ArrowRight className="h-4 w-4" />
                    </button>
                </div>
            </div>
        </motion.div>
    )
}
