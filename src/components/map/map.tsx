import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api'
import HospitalCard from '@/components/hospitalCard/hospitalcard'
import { useEffect, useRef, useState } from 'react'

const containerStyle = {
  width: '100%',
  height: '100%',
}

export function MyMapComponent({nearbyHospitals,setNearbyHospitals}:any) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.GOOGLE_MAPS_API!,
  })
  const mapRef :any= useRef(); // Create a reference to the map container

  const [currentLocation, setCurrentLocation] = useState<{ lat: number; lng: number } | null>(null);

      



  const fetchNearbyHospitals = async (latitude: number, longitude: number) => {
    try {


      console.log(latitude, longitude);
      const pyrmont = { lat: latitude, lng: longitude };

      const map = new google.maps.Map(
        document.getElementById("map") as HTMLElement,
        {
          center: {lat:latitude,lng:longitude},
          zoom: 17,
          mapId: "8d193001f940fde3",
        } as google.maps.MapOptions
      );
    console.log(map);
    
      // Create the places service.
      const service = new google.maps.places.PlacesService(map);
    console.log(service);
    
    

      service.nearbySearch(
        { location: pyrmont, radius: 500, type: "hospital" },
        (
          results: google.maps.places.PlaceResult[] | null,
          status: google.maps.places.PlacesServiceStatus,
          pagination: google.maps.places.PlaceSearchPagination | null
        ) => {
          if (status !== "OK" || !results) return;
    console.log(results);
    setNearbyHospitals(results)
    
//          moreButton.disabled = !pagination || !pagination.hasNextPage;
    
          if (pagination && pagination.hasNextPage) {
            // getNextPage = () => {
            //   // Note: nextPage will call the same handler function as the initial call
            //   pagination.nextPage();
            // };
          }
        }
      );
    
      
      //setNearbyHospitals(hospitalsData);
    } catch (error) {
      console.error('Error fetching nearby hospitals:', error);
    }
  };

  useEffect(() => {
    const getCurrentLocation = async () => {
      try {
        // if (navigator.geolocation) {
          const position = await new Promise<GeolocationPosition>((resolve, reject) => {
            navigator.geolocation.getCurrentPosition(resolve, reject);
          });
          console.log(position);
          
          const { latitude, longitude } = position.coords;
          console.log(latitude, longitude, 'lat and log');
          setCurrentLocation({ lat: latitude, lng: longitude });
          fetchNearbyHospitals(latitude, longitude);
      
      } catch (error) {
        alert("Unable to retrieve your location.");
        console.error(error);
      }
    };

    getCurrentLocation();
  }, []);

  return isLoaded ? (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={currentLocation!}
      zoom={10}
      id='map'
      // onLoad={onLoad}
      // onUnmount={onUnmount}
    >
       {currentLocation && <Marker position={currentLocation} />} 
      <div className='map'></div>
    </GoogleMap>
  ) : (
    <>{`Map is loading`}</>
  )
}
