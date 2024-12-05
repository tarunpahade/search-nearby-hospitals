"use client";

import {
  Key,
  useEffect,
  useState,
} from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search } from "lucide-react";
import HospitalCard from "@/components/hospitalCard/hospitalcard";
import { MyMapComponent } from "@/components/map/map";
import UserInfo from "@/components/userinfo/userInfo";
import { Button } from "@/components/ui/button";

export default function Component() {
  const [nearbyHospitals, setNearbyHospitals] = useState([]);
  const [currentMarker, setCurrentMarker] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [patientData, setPatientData] = useState<any>();
  const [searchQuery, setSearchQuery] = useState(""); // New state for search query
  const [filteredHospitals, setFilteredHospitals] = useState([]); // New state for filtered hospitals
  const [isOpen, setIsOpen] = useState(false); // New state for UserInfo dialog

  useEffect(() => {
    setIsOpen(true);
  }, []);

  useEffect(() => {
    // Filter hospitals based on search query
    const filtered = nearbyHospitals.filter((hospital: any) =>
      hospital.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredHospitals(filtered);
  }, [searchQuery, nearbyHospitals]);

  return (
    <div className="h-screen w-full bg-background p-6">
      <div className="mb-6 flex w-full items-center justify-between">
        <div className="flex w-full items-center gap-4">
\          <UserInfo patientData={patientData} isOpen={isOpen} setPatientData={setPatientData} />
          <Tabs defaultValue="overview" className="w-full h-full">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="nearby-hospitals">
                Nearby Hospitals
              </TabsTrigger>
              <TabsTrigger value="calendar">Meetings</TabsTrigger>
              <TabsTrigger value="doctors">Doctors</TabsTrigger>
            </TabsList>

            <TabsContent value="overview">
              <div className="grid w-[90%] mx-[5%] grid-cols-[300px_1fr_300px] gap-6">
                {patientData && (
                  <>
                    {/* Import Data Button */}
                    <div className="mb-4">
                      <Button
                        className="px-4 py-2 bg-blue-500 text-white rounded"
                        onClick={() => setIsOpen(true)} // Open UserInfo dialog
                      >
                        Import Data
                      </Button>
                    </div>

                    {/* Existing Patient Information Display */}
                    {patientData.patient && (
                      <div className="p-4 border rounded shadow">
                        <h3 className="font-bold mb-2">Patient Information</h3>
                        <p>
                          <strong>ID:</strong> {patientData.patient.id}
                        </p>
                        <p>
                          <strong>Name:</strong>{" "}
                          {Array.isArray(patientData.patient.name) &&
                          patientData.patient.name.length > 0
                            ? `${patientData.patient.name[0].given.join(" ")} ${
                                patientData.patient.name[0].family
                              }`
                            : "N/A"}
                        </p>
                        <p>
                          <strong>Gender:</strong>{" "}
                          {patientData.patient.gender || "N/A"}
                        </p>
                        <p>
                          <strong>Birth Date:</strong>{" "}
                          {patientData.patient.birthDate || "N/A"}
                        </p>
                      </div>
                    )}

                    {/* Medication Requests */}
                    {patientData.medicationRequests &&
                      patientData.medicationRequests.length > 0 && (
                        <div className="p-4 border rounded shadow">
                          <h3 className="font-bold mb-2">
                            Medication Requests
                          </h3>
                          {patientData.medicationRequests.map(
                            (
                              request:any,
                              index: Key | null | undefined
                            ) => (
                              <div key={index} className="mb-4">
                                <p>
                                  <strong>ID:</strong> {request.resource.id}
                                </p>
                                <p>
                                  <strong>Status:</strong>{" "}
                                  {request.resource.status}
                                </p>
                                <p>
                                  <strong>Medication:</strong>{" "}
                                  {request.resource.medicationCodeableConcept
                                    ?.text || "N/A"}
                                </p>
                                <p>
                                  <strong>Intent:</strong>{" "}
                                  {request.resource.intent || "N/A"}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {/* Observations */}
                    {patientData.observations &&
                      patientData.observations.length > 0 && (
                        <div className="p-4 border rounded shadow">
                          <h3 className="font-bold mb-2">Observations</h3>
                          {patientData.observations.map(
                            (
                              (obs:any,index:number) => (
                              <div key={index} className="mb-4">
                                <p>
                                  <strong>ID:</strong> {obs.id}
                                </p>
                                <p>
                                  <strong>Status:</strong> {obs.status}
                                </p>
                                <p>
                                  <strong>Code Display:</strong>{" "}
                                  {obs.codeDisplay}
                                </p>
                                <p>
                                  <strong>Value:</strong> {obs.value} {obs.unit}
                                </p>
                                <p>
                                  <strong>Subject:</strong> {obs.subject}
                                </p>
                              </div>
                            )
                         ))}
                        </div>
                      )}

                    {/* Encounters */}
                    {patientData.encounters &&
                      patientData.encounters.length > 0 && (
                        <div className="p-4 border rounded shadow">
                          <h3 className="font-bold mb-2">Encounters</h3>
                          {patientData.encounters.map(
                            (encounter: any, index: number) => (
                              <div key={index} className="mb-4">
                                <p>
                                  <strong>ID:</strong> {encounter.resource.id}
                                </p>
                                <p>
                                  <strong>Status:</strong>{" "}
                                  {encounter.resource.status}
                                </p>
                                <p>
                                  <strong>Type:</strong>{" "}
                                  {encounter.resource.type?.[0]?.text || "N/A"}
                                </p>
                                <p>
                                  <strong>Period Start:</strong>{" "}
                                  {encounter.resource.period?.start || "N/A"}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}

                    {/* Conditions */}
                    {patientData.conditions &&
                      patientData.conditions.length > 0 && (
                        <div className="p-4 border rounded shadow">
                          <h3 className="font-bold mb-2">Conditions</h3>
                          {patientData.conditions.map(
                            (condition: any, index: number) => (
                              <div key={index} className="mb-4">
                                <p>
                                  <strong>ID:</strong> {condition.resource.id}
                                </p>
                                <p>
                                  <strong>Clinical Status:</strong>{" "}
                                  {condition.resource.clinicalStatus?.text ||
                                    "N/A"}
                                </p>
                                <p>
                                  <strong>Verification Status:</strong>{" "}
                                  {condition.resource.verificationStatus
                                    ?.text || "N/A"}
                                </p>
                                <p>
                                  <strong>Code:</strong>{" "}
                                  {condition.resource.code?.text || "N/A"}
                                </p>
                              </div>
                            )
                          )}
                        </div>
                      )}
                  </>
                )}
              </div>
            </TabsContent>
            <TabsContent value="nearby-hospitals" className="w-full h-[60vh] ">
              {/* Nearby Hospitals */}
              <div className="grid   h-full lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-semibold text-black">
                      Nearby Hospitals
                    </h2>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Search hospitals..."
                        className="pl-10 pr-4 py-2 border rounded-lg"
                        value={searchQuery} // Bind input value to searchQuery state
                        onChange={(e) => setSearchQuery(e.target.value)} // Update searchQuery on input change
                      />
                      <Search
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                        size={20}
                      />
                    </div>
                  </div>
                  <div className=" rounded-2xl h-[400px] lg:h-auto relative overflow-auto">
                    <div className="max-h-[300px] m-3">
                      {filteredHospitals.map((hospital) => (
                        <HospitalCard
                          setCurrentLocation={setCurrentMarker}
                          key={Math.random()}
                          hospital={hospital}
                        /> // Use HospitalCard component
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-200 rounded-2xl h-[400px] lg:h-auto relative">
                  <MyMapComponent
                    nearbyHospitals={filteredHospitals}
                    setNearbyHospitals={setNearbyHospitals}
                    currentMarker={currentMarker}
                  />
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
