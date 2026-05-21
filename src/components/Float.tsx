import { motion } from "framer-motion";
import { CSSProperties, ReactNode } from "react";

interface FloatProps {
    children: ReactNode;
    speed?: number;
    floatIntensity?: number;
    rotateIntensity?: number;
    className?: string;
    style?: CSSProperties;
}

export default function Float({
      children,
      speed = 3,
      floatIntensity = 15,
      rotateIntensity = 1,
      className = "",
      style = {},
  }: FloatProps) {
    return (
        <motion.div
            className={className}
            style={style}
            animate={{
                y: [0, -floatIntensity, 0],
                rotate: [-rotateIntensity, rotateIntensity, -rotateIntensity],
            }}
            transition={{
                duration: speed,
                repeat: Infinity,
                ease: "easeInOut",
            }}
        >
            {children}
        </motion.div>
    );
}