import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";

import { FaPlus } from "react-icons/fa6";

import lib_axios from "@iunstable0/website-libs/build/axios";

const getServerSideProps = async (context) => {
	// console.log(
	// 	lib_gql.combineQueries(
	// 		lib_gqlSchema.query.getData,
	// 		lib_gqlSchema.query.discordInfo,
	// 	),
	// );

	return lib_axios
		.request({
			method: "GET",
			baseURL: `http://localhost:3000/gallery`,
			headers: {
				"Content-Type": "application/json",
			},
			data: {},
		})
		.then((response) => {
			console.log(response.data.data);
			return {
				props: {
					gallery: response.data.data.gallery,
				},
			};
		})
		.catch((error) => {
			// console.log(error.response.data);
			console.log(lib_axios.parseError(error));

			return;
		});
};

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
			<div className={styles.addButton}>
				<button
					style={{
						all: "unset",
					}}
				>
					<FaPlus
						className={styles.addButtonIco}
						//onClick={() => setContentVisible(true)}
						style={{
							// pointerEvents: "all",
							marginRight: "5px",
						}}
					/>
				</button>
			</div>
		</>
	);
}
