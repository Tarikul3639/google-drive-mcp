import { motion } from "motion/react"

// Display a brief security attribution below the consent review.
export function ConsentPageFooter() {
  return (
    <motion.p
      initial={{ opacity: 0, y: 3 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="mt-3 text-center text-[11px] text-muted-foreground"
    >
      Secure access powered by Drivebridge
    </motion.p>
  )
}
