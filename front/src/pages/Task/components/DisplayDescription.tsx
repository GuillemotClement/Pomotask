type DisplayDescriptionProps = {
  description: string;
};

export default function DisplayDescription({
  description,
}: DisplayDescriptionProps) {
  return (
    <div className="p-5 border border-gray-200 rounded-2xl h-80">
      {description}
    </div>
  );
}
