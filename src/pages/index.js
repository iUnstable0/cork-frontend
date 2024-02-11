import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Toaster from "@/components/toaster";

import { toast } from "react-hot-toast";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

import LoadingButton from "@mui/lab/LoadingButton";

import { motion, AnimatePresence } from "framer-motion";

import { FaPlus } from "react-icons/fa6";

import Blur from "@/components/blur";

import formStyles from "@/styles/form.module.scss";

import lib_axios from "@iunstable0/server-libs/build/axios";

import { UilUpload } from "@iconscout/react-unicons";

import Cropper from "react-easy-crop";

export async function getServerSideProps(context) {
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
			return {
				props: {
					gallery: response.data,
				},
			};
		})
		.catch((error) => {
			// console.log(error.response.data);
			console.log(lib_axios.parseError(error));

			return;
		});
}

export default function Home({ gallery }) {
	const [uploadVisible, setUploadVisible] = useState(false);
	const [polaroidDetailsVisible, setPolaroidDetailsVisible] = useState(false);
	const [blurVisible, setBlurVisible] = useState(false);
	const [blurZIndex, setBlurZIndex] = useState(2);
	const [polaroidKey, setPolaroidKey] = useState(null);
	const [uploadBtnDisabled, setUploadBtnDisabled] = useState(false);
	const [polaroidFlipped, setPolaroidFlipped] = useState(false);

	const [uploadBtnValue, setUploadBtnValue] = useState("Confirm"),
		[uploadBtnLoading, setUploadBtnLoading] = useState(false);

	const uploadFileRef = useRef(null);

	const allowedExtensions = [".png", ".jpg", ".jpeg"];

	const [acceptedFiles, setAcceptedFiles] = useState([]),
		[uploadPage, setUploadPage] = useState(1),
		[uploadPage1Visible, setUploadPage1Visible] = useState(true),
		[uploadPage2Visible, setUploadPage2Visible] = useState(false),
		[crop, setCrop] = useState({ x: 0, y: 0 }),
		[cropArea, setCropArea] = useState({ width: 100, height: 100 }),
		[zoom, setZoom] = useState(1);

	const modifyUploadPage = (page) => {
		if (page === 1) {
			setUploadPage1Visible(true);
			setUploadPage2Visible(false);
		} else if (page === 2) {
			setUploadPage1Visible(false);
			setUploadPage2Visible(true);
		}

		setTimeout(() => setUploadPage(page), 300);
	};

	const onCropComplete = useCallback((croppedArea, croppedAreaPixels) => {
		setCropArea(croppedAreaPixels);
	}, []);

	useEffect(() => {
		if (uploadVisible || polaroidDetailsVisible) {
			setBlurVisible(true);
		} else {
			setBlurVisible(false);
		}
	}, [uploadVisible, polaroidDetailsVisible]);

	useEffect(() => {
		if (acceptedFiles.length > 0) {
			if (uploadPage < 2) {
				modifyUploadPage(2);
			}
		} else if (acceptedFiles.length < 1) {
			modifyUploadPage(1);
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [acceptedFiles]);

	const onDrop = useCallback((files) => {
		setUploadBtnDisabled(false);

		setAcceptedFiles([]);

		// Check mimetype
		if (!files[0].type.startsWith("image/")) {
			return toast.error("Invalid file type");
		}

		if (files[0].size > 8 * 1024 * 1024) {
			return toast.error("File size too large");
		}

		if (files.length > 1) {
			return toast.error("Too many files");
		}

		// Check if extension .ong .jpf or .jpeg
		if (!allowedExtensions.includes(`.${files[0].type.split("/")[1]}`)) {
			return toast.error("Invalid file extension");
		}

		setAcceptedFiles(files);

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const { getRootProps, getInputProps, isDragActive } = useDropzone({
		onDrop,
		accept: {
			"image/*": allowedExtensions,
		},
	});

	return (
		<>
			<Head>
				<title>Cork</title>
			</Head>

			<Toaster />

			<Blur
				modals={[setUploadVisible, setPolaroidDetailsVisible, setBlurVisible]}
				visible={blurVisible}
				zIndex={100}
			/>

			{uploadVisible && (
				<motion.div
					style={{
						zIndex: 101,
						position: "fixed",
					}}
					key={`lolamogus`}
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
				>
					<div
						className={formStyles.container}
						style={{
							minHeight: uploadPage1Visible ? "250px" : "400px",
							maxHeight: uploadPage1Visible ? "250px" : "400px",
							minWidth: "305px",
							maxWidth: "305px",
						}}
					>
						<div className={formStyles.title}>Upload</div>

						{uploadPage === 1 && uploadPage1Visible && (
							<motion.div
								className={styles["upload-ctn"]}
								key={`cpf_${uploadPage}`}
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
							>
								<div className={`${styles.upload}`} {...getRootProps()}>
									{isDragActive ? (
										<>
											<UilUpload
												className={styles.uploadIcon}
												style={{
													// ...(userData.account.profilePicture === "" && {
													width: "40px",
													height: "40px",
													// }),
													marginBottom: "10px",
												}}
											/>
											Drop file here (png, jpg, jpeg)
										</>
									) : (
										<>
											<UilUpload
												className={styles.uploadIcon}
												style={{
													width: "40px",
													height: "40px",
													marginBottom: "10px",
												}}
											/>
											Drag file here or click to select file
										</>
									)}
									<input
										className={styles["file-input"]}
										type="file"
										ref={uploadFileRef}
										disabled={uploadBtnDisabled}
										{...getInputProps()}
									/>
								</div>
							</motion.div>
						)}

						{uploadPage === 2 && uploadPage2Visible && (
							<motion.div
								className={styles["upload-ctn"]}
								key={`cpf_${uploadPage}`}
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
							>
								<div className={styles["upload-preview-container"]}>
									{/* Display the image */}
									<div className={styles["upload-preview"]}>
										{/* <Image
											src={URL.createObjectURL(acceptedFiles[0])}
											style={{
												objectFit: "cover",
											}}
											className={sidebarNavStyles["change-profile-image"]}
											alt="Profile Picture"
											fill
											priority={true}
										/> */}
										<Cropper
											image={URL.createObjectURL(acceptedFiles[0])}
											crop={crop}
											zoom={zoom}
											cropShape="round"
											// aspect={1 / 1}
											aspect={1}
											onCropChange={setCrop}
											onCropComplete={onCropComplete}
											// onCropAreaChange={onCropComplete}
											onZoomChange={setZoom}
										/>
									</div>

									<LoadingButton
										className={formStyles["submit-button"]}
										loading={submitButtonLoading}
										variant="contained"
										disabled={!submitButtonLoading && submitButtonDisabled}
										sx={{
											textTransform: "none",
											fontWeight: "normal",
											fontSize: "18px",
											fontFamily: "Ubuntu, sans-serif",
											marginBottom: "16px",
											borderRadius: "10px",
										}}
										onClick={async (event) => {
											event.preventDefault();

											submit();
										}}
									>
										{!submitButtonLoading && submitButtonValue}
									</LoadingButton>

									<motion.div
										key={`2_back`}
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
									>
										<span className={formStyles["bottom-text"]}>
											<button
												className={formStyles.link}
												type="button"
												onClick={() => setAcceptedFiles([])}
												disabled={submitButtonLoading}
											>
												{"<"} Go back
											</button>
										</span>
									</motion.div>
									<br />
								</div>
							</motion.div>
						)}
					</div>
				</motion.div>
			)}
			<AnimatePresence>
				{polaroidDetailsVisible && (
					<motion.div
						style={{
							zIndex: 103,
							position: "absolute",
							color: "black",
							backgroundColor: "white",
							textAlign: "center",
							transform: `rotateY(${polaroidFlipped ? 180 : 0}deg)`, // Apply flip if polaroidFlipped is true
							height: "20rem",
							width: "20rem",
							top: 0,
							left: 0,
							right: 0,
							bottom: 0,
							margin: "auto",
						}}
						key="modal"
						initial={{
							opacity: 0,
						}}
						animate={{
							opacity: 1,
							rotateY: polaroidFlipped ? 180 : 0, // Rotate by 180 degrees if polaroidFlipped is true
						}}
						exit={{
							opacity: 0,
						}}
						transition={{
							duration: 0.15,
						}}
						onClick={() => setPolaroidFlipped(!polaroidFlipped)}
					>
						{polaroidFlipped ? (
							<div style={{ transform: "rotateY(180deg)" }}>
								<p>Hello</p>
							</div>
						) : (
							<div>
								<p>{gallery[polaroidKey]["title"]}</p>
								<p>{gallery[polaroidKey]["description"]}</p>
							</div>
						)}
					</motion.div>
				)}
			</AnimatePresence>

			<div className={styles.corkBackground}>
				<Image
					src="/cork.jpg"
					layout="fill"
					objectFit="cover"
					alt="Cork Background"
				/>
			</div>
			<div className={styles.scrollableContent}>
				{Object.keys(gallery).map((key, i) => (
					<div
						key={i}
						className={styles.content}
						style={{
							transform:
								"rotate(" +
								gallery[key]["frame_angle"].toString().split(".")[0] +
								"deg)",
							margin: "5%",
						}}
						onClick={() => {
							setPolaroidDetailsVisible(true);
							setPolaroidKey(key);
						}}
					>
						<img
							alt="Gallery Image"
							className={styles.myImg}
							src={key + ".png"}
							height=""
							width=""
						/>
						<p>{gallery[key]["title"]}</p>
					</div>
				))}
			</div>
			<div
				className={styles.addButton}
				onClick={() => {
					setUploadVisible(true);
				}}
			>
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
