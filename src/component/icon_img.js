const IconImage = ({size = 'normal', source, rotate = false }) => {
    const wIcon = size === 'normal' ? "w-[19px]" : size === 'small' ? "w-4" : size === 'smaller' ? "w-2" : "w-8";
    return (
        <img className={`${wIcon} ${rotate ? 'rotate-180' : 'rotate-0'}`} alt="icon" src={source} />
    );
}

export default IconImage;