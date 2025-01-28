const IconImage = ({size = 'normal', source}) => {
    const wIcon = size === 'normal' ? "w-[18px]" : size === 'small' ? "w-4" : size === 'smaller' ? "w-2" : "w-8";
    return (
        <img className={wIcon} alt="icon" src={source} />
    );
}

export default IconImage;