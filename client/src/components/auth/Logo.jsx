import { motion } from "framer-motion";
const Logo = () => {
    return (<motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.6, ease: "easeOut" }} className="flex items-center space-x-2">
      {/* Logo Icon with pulse animation */}
      <div className="relative h-10 w-10 ">
        <motion.div animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 0.2],
        }} transition={{ duration: 3, repeat: Infinity }} className="absolute inset-0 bg-white opacity-20 rounded-lg"></motion.div>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-white">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 16c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z"/>
          <path d="M12 8v4l3 3"/>
        </svg>
      </div>
      
      {/* Logo Text with staggered animation */}
      <div className="flex flex-col ">
        <motion.h1 initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="text-2xl font-bold tracking-tight text-white">
          future find
        </motion.h1>
      </div>
    </motion.div>);
};
export default Logo;
