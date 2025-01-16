const IconImage = ({size = 'normal', source}) => {
    const wIcon = size === 'normal' ? "w-6" : size === 'small' ? "w-3" : "w-9";
    return (
        <img className={wIcon} alt="icon" src={source} />
    );
}

export default IconImage;