import React, {useState, useContext} from "react"
import {AuthContext} from "../../shared/context/auth-context"
import Card from "../../shared/components/UIElements/Card"
import Button from "../../shared/components/FormElements/Button"
import Modal from "../../shared/components/UIElements/Modal"
import Map from "../../shared/components/UIElements/Map"
import "./PlaceItem.css"
import { CSSTransition } from "react-transition-group"
const PlaceItem = (props) => {
  const [showMap,setShowMap] = useState(false)
  const [showConModal,setShowConModal] = useState(false)
  const auth = useContext(AuthContext)

  const openMapHandler = ()=>{setShowMap(true)}
  const closeMapHandler = ()=>{setShowMap(false)}
  const showDeleteWarningHandler = ()=>{
    setShowConModal(true)
  }
  const hideDeleteWarningHandler = ()=>{
    
    setShowConModal(false)
    
  }
  
  const confirmDeleteHandler = ()=>{
    setShowConModal(false)
    console.log("Deleted");
  }
    return (
      <React.Fragment>
        <Modal
          show={showMap}
          onCancel={closeMapHandler}
          header={props.address}
          contentClass="place-item__modal-content"
          footerClass="place-item__modal-actions"
          footer={<Button onClick={closeMapHandler}>Close</Button>}
        >
          <div className="map-container">
            <Map center={props.coordinates} zoom={16} />
          </div>
        </Modal>

        <Modal
          show={showConModal}
          onCancel={hideDeleteWarningHandler}
          header="Are you sure?"
          footerClass="place-item__modal-actions"
          footer={
            <React.Fragment>
              <Button inverse onClick={hideDeleteWarningHandler}>
                Cancel
              </Button>
              <Button danger onClick={confirmDeleteHandler}>
                Delete
              </Button>
            </React.Fragment>
          }
        >
          <p>Do you want to proceed and delete this place? Once deleted it cannot be recovered.</p>
        </Modal>

        <li className="place-item">
          <Card className="place-item__content">
            <div className="place-item__image">
              <img src={props.image} alt={props.title} />
            </div>
            <div className="place-item__info">
              <h2>{props.title}</h2>
              <h3>{props.address}</h3>
              <p>{props.description}</p>
            </div>
            <div className="place-item__actions">
              <Button inverse onClick={openMapHandler}>
                View on Map
              </Button>
              {auth.isLoggedIn && <Button to={`/places/${props.id}`}>Edit</Button>}
              
              {auth.isLoggedIn && <Button danger onClick={showDeleteWarningHandler}>
                Delete
              </Button>}
            </div>
          </Card>
        </li>
      </React.Fragment>
    );
}

export default PlaceItem