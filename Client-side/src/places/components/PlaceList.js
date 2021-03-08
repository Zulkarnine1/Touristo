import React from "react"
import Card from "../../shared/components/UIElements/Card"
import "./PlaceList.css"
import PlaceItem from "./PlaceItem"

const PlaceList = (props) => {

    if(props.items.length === 0){
        return <div className="place-list center" >
            <Card>
                <h2>No places found. Please add a place.</h2>
                <button>Add PlaceList</button>
            </Card>
        </div>
    }
    return <ul className="place-list" >
        {props.items.map((place)=>{return <PlaceItem key={place.id} id={place.id} image={place.image} title={place.title} description={place.description} address={place.address} creatorId={place.creatorId} coordinates={place.location} />})}
    </ul>
}

export default PlaceList