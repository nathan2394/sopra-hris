import IconImage from "./icon_img";

const Title = ({label, source}) => (
    <div className="flex flex-row items-center">
        <IconImage size="small" source={source} />
        <p className="font-bold text-sm pl-2">{label}</p>
    </div>
)

export default Title;