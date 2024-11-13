import React from 'react';
import { MapPin, Clock, Phone } from 'lucide-react';

interface Hospital {
  name: string;
  vicinity?: string;
  availability?: string; // Optional if not always provided
  phone?: string; // Optional if not always provided
geometry:any
}

const HospitalCard: React.FC<{ hospital: Hospital,setCurrentLocation:any }> = ({ hospital ,setCurrentLocation}) => {

  return (
    <div className="border rounded-xl p-4 hover:border-blue-500" onClick={()=>{
      if (hospital.geometry) {
        const latitude = typeof hospital.geometry.location.lat === 'function' 
        ? hospital.geometry.location.lat() 
        : hospital.geometry.location.lat;
      const longitude = typeof hospital.geometry.location.lng === 'function' 
        ? hospital.geometry.location.lng() 
        : hospital.geometry.location.lng;
        // setCurrentLocation({lat:latitude,lng:longitude})
        const map= new google.maps.Map(
          document.getElementById("map") as HTMLElement,
          {
            center: {lat:latitude,lng:longitude},
            zoom: 17,
            mapId: "8d193001f940fde3",
          } as google.maps.MapOptions
        );
        new google.maps.Marker({
          position: {lat: latitude, lng: longitude},
          map: map,
          title: hospital.name // Optional: Title for the marker
        });
      console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
      }
  
    }}>
      <h3 className="font-medium mb-2">{hospital.name}</h3>
      <div className="text-sm text-gray-600 space-y-1">
        <div className="flex items-center gap-2">
          <MapPin size={16} />
          <span>{hospital.vicinity}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          {/* <span>{hospital.availability}</span> */}
        </div>
        <div className="flex items-center gap-2">
          <Phone size={16} />
          <span>{hospital.phone || '9999999'}</span> {/* Default phone number if not provided */}
        </div>
      </div>
    </div>
  );
};

export default HospitalCard;