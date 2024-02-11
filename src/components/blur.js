// Packages

import { usePathname } from "next/navigation";

import { motion, AnimatePresence } from "framer-motion";

// Styles

import styles from "@/styles/Home.module.css";

export default function Component({ modals, visible, preventClose, zIndex }) {
	// : {
	// modals: Array<any>,
	// visible: boolean,
	// preventClose?: boolean,
	// zIndex?: number,
	// }
	const pathname = usePathname();

	return (
		<AnimatePresence>
			{visible && (
				<motion.div
					key={`blur_${pathname}`}
					className={styles.blurBackground}
					style={{
						zIndex: zIndex || 2,
					}}
					initial={{
						opacity: 0,
					}}
					animate={{
						opacity: 1,
					}}
					exit={{
						opacity: 0,
					}}
					transition={{
						duration: 0.15,
					}}
					onClick={() => {
						if (preventClose) {
							return;
						}

						modals.forEach((set) => set(false));
					}}
				/>
			)}
		</AnimatePresence>
	);
}
