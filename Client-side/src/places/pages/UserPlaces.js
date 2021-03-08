import React from "react"
import {useParams} from "react-router-dom"
import PlaceList from "../components/PlaceList"

const DUMMY_PLACES = [
  {
    id: "p1",
    title: "Canton Tower",
    description:
      "The Canton Tower, formally Guangzhou TV Astronomical and Sightseeing Tower, is a 604-meter-tall multipurpose observation tower in the Haizhu District of Guangzhou. The tower was topped out in 2009 and it became operational on 29 September 2010 for the 2010 Asian Games",
    image: "https://www.chinadiscovery.com/assets/images/travel-guide/guangzhou/canton-tower/canton-tower-768-1.jpg",
    address: "Yuejiang W Rd, Haizhu District, Guangzhou, Guangdong Province, China",
    location: {
      lat: 23.10748,
      long: 113.3226476,
    },
    creator: "u1",
  },
  {
    id: "p2",
    title: "Canton Tower",
    description:
      "The Canton Tower, formally Guangzhou TV Astronomical and Sightseeing Tower, is a 604-meter-tall multipurpose observation tower in the Haizhu District of Guangzhou. The tower was topped out in 2009 and it became operational on 29 September 2010 for the 2010 Asian Games",
    image: "https://www.chinadiscovery.com/assets/images/travel-guide/guangzhou/canton-tower/canton-tower-768-1.jpg",
    address: "Yuejiang W Rd, Haizhu District, Guangzhou, Guangdong Province, China",
    location: {
      lat: 23.10748,
      long: 113.3226476,
    },
    creator: "u2",
  },
];

const UserPlaces = (props)=>{
const userId = useParams().userId;
const loadPlaces = DUMMY_PLACES.filter((place)=>{ return place.creator === userId})
return <PlaceList items={loadPlaces} />;
}

export default UserPlaces