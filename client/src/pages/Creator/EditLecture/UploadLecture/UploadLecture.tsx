import { FieldArray, useFormikContext } from "formik";
import { CreatedLectureModel } from "../../../../data/models/createdLecture.model";
import "./UploadLecture.scss";
import SectionDivider from "./components/SectionDivider";
import UploadLectureSection from "./components/UploadLectureSection/UploadLectureSection";

const UploadLecture = () => {
	const { values } = useFormikContext<CreatedLectureModel>();

	return (
		<section className="upload-lecture">
			<h1>Upload Content</h1>
			<FieldArray
				name="content"
				render={(arrayHelpers) => (
					<>
						<SectionDivider
							arrayHelpers={arrayHelpers}
							isContentEmpty={!values.content.length}
						/>
						{values.content.map((content, index) => (
							<UploadLectureSection
								key={index}
								index={index}
								content={content}
								arrayHelpers={arrayHelpers}
							/>
						))}
					</>
				)}
			/>
		</section>
	);
};

export default UploadLecture;
