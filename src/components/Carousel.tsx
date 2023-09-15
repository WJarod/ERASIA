import { Carousel } from 'react-responsive-carousel';
import "react-responsive-carousel/lib/styles/carousel.min.css";
import User from '../models/User';
import UserInfo from "../components/UserInfo";

interface CarouselProps {
    users: User[];
}

const CarouselCustom: React.FC<CarouselProps> = ({users}) => {
    return (
        <div style={{ width: "100%", height: "100%" }}>
            <Carousel
            autoPlay={true}
            infiniteLoop={true}
            showArrows={false}
            showStatus={false}
            showThumbs={false}
            showIndicators={false}
            transitionTime={1000}
            interval={5000}
            axis='vertical'
        >
            {users.map((user: User) => (
                <UserInfo key={user._id} user={user} />
            ))}
        </Carousel>
        </div>
    )
}

export default CarouselCustom;