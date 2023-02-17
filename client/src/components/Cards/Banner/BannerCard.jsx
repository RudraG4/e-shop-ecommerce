import { LazyLoadImage } from "react-lazy-load-image-component";

export default function BannerCard(props) {
  const { data, onClick = () => {} } = props;
  return (
    <div
      className={`slider-img-container ${props.className || ""}`}
      onClick={() => onClick()}
    >
      <div>
        <LazyLoadImage
          className="slider-img"
          src={
            "https://d2d22nphq0yz8t.cloudfront.net/88e6cc4b-eaa1-4053-af65-563d88ba8b26/https://media.croma.com/image/upload/v1669527896/Croma%20Assets/CMS/LP%20Page%20Banners/2022/Black%20Friday%20Nov/Cyber%20Monday%20-%2028th%20Nov/HP%20Rotating%20Banners/HP_CyberMonday_25Nov2022_swajkh.jpg/mxw_1366,f_auto"
          }
          effect="blur"
          alt={data.name}
        />
      </div>
    </div>
  );
}
