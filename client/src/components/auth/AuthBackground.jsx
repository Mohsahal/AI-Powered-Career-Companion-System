import { motion } from "framer-motion";
const AuthBackground = () => {
    return (<>
      {/* Phone Illustration with animation */}
      <div className="hidden md:block absolute bottom-10 right-10 opacity-70">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 0.7, scale: 1 }} transition={{ duration: 0.7, ease: "easeOut" }} className="w-32 h-64 border-2 border-white rounded-3xl relative">
          <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-full"></div>
          <motion.div animate={{
            scale: [1, 1.1, 1],
            opacity: [0.7, 1, 0.7]
        }} transition={{
            duration: 3,
            repeat: Infinity,
            repeatType: "reverse"
        }} className="absolute top-12 left-1/2 transform -translate-x-1/2 w-8 h-8 flex items-center justify-center">
            <div className="w-6 h-6 bg-brand-teal rounded-full border-2 border-white"></div>
          </motion.div>
          <div className="absolute top-24 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white rounded-full"></div>
          <div className="absolute top-28 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-white rounded-full"></div>
          <motion.div animate={{ y: [0, -3, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute bottom-8 left-1/2 transform -translate-x-1/2 w-12 h-8 bg-brand-teal rounded"></motion.div>
        </motion.div>
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.2 }} transition={{ delay: 0.5, duration: 1 }} className="absolute bottom-0 left-10 h-32 w-16 bg-white rounded-full"></motion.div>
      </div>
      
      {/* Subtle background patterns with animations */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-10">
        <motion.div animate={{
            scale: [1, 1.1, 1],
            rotate: [0, 10, 0]
        }} transition={{ duration: 20, repeat: Infinity }} className="absolute top-10 left-10 w-20 h-20 rounded-full border border-white"></motion.div>
        <motion.div animate={{
            scale: [1, 1.15, 1],
            rotate: [0, -15, 0]
        }} transition={{ duration: 25, repeat: Infinity }} className="absolute bottom-40 left-20 w-32 h-32 rounded-full border border-white"></motion.div>
        <motion.div animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 20, 0]
        }} transition={{ duration: 30, repeat: Infinity }} className="absolute top-1/4 right-20 w-24 h-24 rounded-full border border-white"></motion.div>
      </div>
    </>);
};
export default AuthBackground;
