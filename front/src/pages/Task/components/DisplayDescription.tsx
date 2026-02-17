import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

type DisplayDescriptionProps = {
	description: string;
};

export default function DisplayDescription({
	description,
}: DisplayDescriptionProps) {
	return (
		<div className="p-5 border border-gray-200 rounded-2xl">
			<Markdown remarkPlugins={[remarkGfm]}>{description}</Markdown>
		</div>
	);
}
