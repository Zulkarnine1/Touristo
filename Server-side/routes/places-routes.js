const express = require("express")


const router = express.Router()

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
      lng: 113.3226476,
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
      lng: 113.3226476,
    },
    creator: "u2",
  },
];

router.get("/:pid",(req,res,next)=>{
     
    const placeID = req.params.pid

    const place = DUMMY_PLACES.find((p)=>{
        return p.id === placeID
    })

    console.log("Get req in places like this");
    res.json({ place });

})


router.get("/user/:uid",(req,res,next)=>{

    const uID = req.params.uid;
    const places = DUMMY_PLACES.find((p)=>{return p.creator===uID})
    res.json({places})

})

module.exports = router