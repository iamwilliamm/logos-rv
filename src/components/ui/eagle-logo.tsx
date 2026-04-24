"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { cn } from "@/lib/utils"

const sizeConfig = {
  sm: { logo: 24, text: "text-lg", gap: "gap-2", wrapper: "h-7 w-7" },
  md: { logo: 32, text: "text-xl", gap: "gap-2.5", wrapper: "h-9 w-9" },
  lg: { logo: 44, text: "text-3xl", gap: "gap-4", wrapper: "h-12 w-12" },
} as const

interface EagleLogoProps {
  size?: "sm" | "md" | "lg"
  className?: string
  showText?: boolean
}

export function EagleLogo({ size = "md", className, showText = true }: EagleLogoProps) {
  const config = sizeConfig[size]

  return (
    <div className={cn("flex items-center group cursor-pointer", config.gap, className)}>
      <motion.div
        className={cn("relative flex items-center justify-center rounded-xl overflow-visible", config.wrapper)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        {/* Animated Glow Background */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-violet-600/30 rounded-xl blur-[12px]"
          animate={{
            opacity: [0.3, 0.6, 0.3],
            scale: [0.9, 1.1, 0.9]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* The Logo SVG (Cross) */}
        <motion.div
          className="relative z-10"
          initial={{ rotate: -5, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src="/logo.svg"
            alt="Logos.rv"
            width={config.logo}
            height={config.logo}
            className="drop-shadow-2xl filter brightness-110"
            priority
          />
        </motion.div>
      </motion.div>

      {showText && (
        <motion.span
          className={cn("font-black tracking-tight text-slate-900", config.text)}
          initial={{ x: -10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Logos
          </span>
          <span className="text-slate-400">.rv</span>
        </motion.span>
      )}
    </div>
  )
}
