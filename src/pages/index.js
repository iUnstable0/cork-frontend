import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

export default function Home() {
	return (
		<>
			<Head>
				<title>Cork</title>
			</Head>
			<div className={styles.corkBackground}>
				<Image
					src="/cork.jpg"
					layout="fill"
					objectFit="cover"
					alt="Cork Background"
				/>
			</div>
			<div className={styles.scrollableContent}>
				{[...Array(10).keys()].map((i) => (
					<div key={i} className={styles.content}>
						<div className={styles.dot}></div>
						<input
							type="file"
							accept=".jpg, .png"
							onchange="displayImage(this)"
						/>
						<br />
						<img
							className={styles.myImg}
							src="#"
							alt="Your image"
							height="100%"
							width="100%"
						/>
					</div>
				))}
			</div>
			<button className={styles.addButton}>+</button>
		</>
	);
}
