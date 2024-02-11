import Head from "next/head";
import Image from "next/image";
import styles from "@/styles/Home.module.css";
import Toaster from "@/components/toaster";

import crypto from "crypto";

import { toast } from "react-hot-toast";

import { useState, useEffect, useCallback, useRef } from "react";
import { useDropzone } from "react-dropzone";

import LoadingButton from "@mui/lab/LoadingButton";

// import Socket from "@/components/socket";

import lib_file from "@iunstable0/website-libs/build/file";

import { motion, AnimatePresence } from "framer-motion";

import { FaPlus } from "react-icons/fa6";

import Blur from "@/components/blur";

import formStyles from "@/styles/form.module.scss";

import lib_axios from "@iunstable0/server-libs/build/axios";
import lib_toaster from "@iunstable0/website-libs/build/toaster";

import { UilUpload, UilText, UilAlignLeft } from "@iconscout/react-unicons";

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
			baseURL: `http://127.0.0.1:3000/gallery`,
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
	const descInputRef = useRef(null);
	const titleInputRef = useRef(null);

	const toastUploadProcess = {
		loading: "Uploading",
		success: () => {
			// const data = response.data;

			setAcceptedFiles([]);

			setUploadBtnLoading(false);
			setUploadVisible(false);

			return "Uploaded";
		},
		error: (error) => {
			setUploadBtnLoading(false);

			return lib_toaster.multiToast("error", lib_axios.parseError(error));
		},
	};

	const submit = async () => {
		setUploadBtnLoading(true);

		uploadPicture();
	};

	const uploadPicture = () => {
		toast.loading("Preparing to upload", {
			id: "preparingUpload",
		});

		// if (process.env.NEXT_PUBLIC_S3_UPLOAD_TYPE === "2") {
		// 	toast.dismiss("preparingUploadProfilePicture");

		// 	const formData = new FormData();

		// 	formData.append("file", acceptedFiles[0]);
		// 	formData.append("data", JSON.stringify({ cropArea, zoom: zoom, info: acceptedFiles[0] }));

		// 	toast.promise(
		// 		lib_axios.request({
		// 			method: "POST",
		// 			url: "/users/change-profile-picture",
		// 			baseURL: process.env.NEXT_PUBLIC_FASTIFY_PUBLIC_URL,
		// 			data: formData,
		// 			headers: {
		// 				"Content-Type": "multipart/form-data",
		// 				Authorization: `Bearer ${getCookie("token")}`,
		// 			},
		// 		}),
		// 		{
		// 			loading: "Uploading",
		// 			success: (response: any) => {
		// 				const data = response.data;

		// 				return "Uploaded";
		// 			},
		// 			error: (error: any) => {
		// 				return lib_toaster.multiToast("error", lib_axios.parseError(error));
		// 			},
		// 		}
		// 	);
		// } else {

		const fileBlobURL = URL.createObjectURL(acceptedFiles[0]);

		fetch(fileBlobURL)
			.then((response) => response.blob())
			.then(async (fileBlob) => {
				lib_file.getFileBuffer(fileBlob).then((fileBuffer) => {
					const fileMD5 = crypto
						.createHash("md5")
						.update(fileBuffer)
						.digest("base64");

					toast.dismiss("preparingUpload");

					toast.promise(
						lib_axios.request({
							method: "POST",
							baseURL: "http://10.11.21.137:3000/upload",
							headers: {
								// "Content-Type": "multipart/form-data"
							},
							data: {
								file: fileBuffer.toString("base64"),
								fileInfo: {
									hash: fileMD5,
									cropArea,
								},
								title: inputData.title,
								description: inputData.desc,
							},
						}),
						toastUploadProcess
					);
				});
			})
			.catch((error) =>
				toast.error(error.toString(), {
					id: "preparingUploadProfilePicture",
				})
			);
		// }
	};

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

	const [inputData, setInputData] = useState({});

	const saveInput = (input, value) => {
		let data = inputData;

		data[input] = value;

		setInputData(data);
	};

	// Socket({
	// 	channel: `new-images`,
	// 	onUpdate: async (data) => {
	// 		console.log("NEW DAAA", data);
	// 	},
	// });

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
							minHeight: uploadPage1Visible ? "250px" : "500px",
							maxHeight: uploadPage1Visible ? "250px" : "500px",
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
								// className={styles["upload-ctn"]}
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
											image={
												(acceptedFiles.length > 0 &&
													URL.createObjectURL(acceptedFiles[0])) ||
												""
											}
											crop={crop}
											zoom={zoom}
											cropShape="square"
											// aspect={1 / 1}
											aspect={3 / 4}
											onCropChange={setCrop}
											onCropComplete={onCropComplete}
											// onCropAreaChange={onCropComplete}
											onZoomChange={setZoom}
										/>
									</div>

									<br />

									<div className={formStyles["input-field"]}>
										<input
											className={formStyles.input}
											type="text"
											autoComplete="none"
											placeholder="Title"
											required
											onChange={(event) => {
												const title = event.target.value;

												saveInput("title", title);
											}}
											ref={titleInputRef}
										/>

										<UilText className={formStyles["input-icon"]} />
									</div>

									<div className={formStyles["input-field"]}>
										<input
											className={formStyles.input}
											type="text"
											autoComplete="none"
											placeholder="Brief Description"
											required
											onChange={(event) => {
												const desc = event.target.value;

												saveInput("desc", desc);
											}}
											ref={descInputRef}
										/>

										<UilAlignLeft className={formStyles["input-icon"]} />
									</div>

									<LoadingButton
										className={formStyles["submit-button"]}
										loading={uploadBtnLoading}
										variant="contained"
										disabled={!uploadBtnLoading && uploadBtnDisabled}
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
										{!uploadBtnLoading && uploadBtnValue}
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
												disabled={uploadBtnLoading}
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
						className={styles["content"]}
						style={{
							zIndex: 103,
							position: "absolute",
							color: "black",
							backgroundColor: "white",
							textAlign: "center",
							transform: `rotateY(${polaroidFlipped ? 180 : 0}deg)`, // Apply flip if polaroidFlipped is true
							height: "450px",
							width: "320px",
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
							<div
								style={{
									padding: "20px",
									transform: "rotateY(180deg)",
									textAlign: "left",
								}}
							>
								<h1>{gallery[polaroidKey]["title"]}</h1>
								<p>{gallery[polaroidKey]["description"]}</p>
							</div>
						) : (
							<div>
								<img
									alt="Gallery Image"
									className={styles.myImg}
									src={`http://10.11.21.137:3000/${polaroidKey}-polaroid.png`}
									height="400em"
								/>
								<p>
									{(
										new Date(parseInt(polaroidKey)).getUTCMonth() + 1
									).toString() +
										"/" +
										new Date(parseInt(polaroidKey)).getUTCDate().toString() +
										"/" +
										new Date(parseInt(polaroidKey)).getUTCFullYear().toString()}
								</p>
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
					<motion.div
						whileHover={{ scale: 1.05 }} // Adjust the scale factor as needed
						whileTap={{ scale: 1 }} // Adjust the scale factor as needed
						key={i}
						className={styles.content}
						style={{
							rotate:
								gallery[key]["frame_angle"].toString().split(".")[0] + "deg",
							// transform:
							// 	"rotate(" +
							// 	gallery[key]["frame_angle"].toString().split(".")[0] +
							// 	"deg)",
							margin: "5%",
						}}
						onClick={() => {
							setPolaroidDetailsVisible(true);
							setPolaroidFlipped(false);
							setPolaroidKey(key);
						}}
					>
						<img
							alt="Gallery Image"
							className={styles.myImg}
							src={`http://10.11.21.137:3000/${key}-polaroid.png`}
							height="260em"
						/>
						<p>
							{(new Date(parseInt(key)).getUTCMonth() + 1).toString() +
								"/" +
								new Date(parseInt(key)).getUTCDate().toString() +
								"/" +
								new Date(parseInt(key)).getUTCFullYear().toString()}
						</p>
					</motion.div>
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
