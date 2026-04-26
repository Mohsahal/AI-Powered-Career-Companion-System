import { motion } from "framer-motion";
const SocialButton = ({ icon, ...props }) => {
    return (<motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }} type="button" className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-700 hover:bg-gray-100 transition-colors" {...props}>
      {icon}
    </motion.button>);
};
export default SocialButton;
