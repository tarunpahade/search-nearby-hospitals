import { useState, useEffect, Key } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface PatientData {
  patient: any;
  medicationRequests: any[];
  observations: any[];
  encounters: any[];
  conditions: any[];
}

export default function UserInfo({patientData,setPatientData}:any) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setIsOpen(true);
  }, []);

  const fetchPatientData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Fetch Patient data
      const patientResponse = await axios.get(
        `https://hapi.fhir.org/baseR4/Patient?name=${name}&telecom=${phoneNumber}`
      );
console.log(patientResponse);

      if (patientResponse.data && patientResponse.data.entry) {
        console.log('hii');
        
        const patient = patientResponse.data.entry[0].resource;
        const patientId = patient.id;
console.log(patientId);

        // Fetch additional FHIR resources
        const [medicationRequests, observations, encounters, conditions] = await Promise.all([
          axios.get(`https://hapi.fhir.org/baseR4/MedicationRequest?patient=${patientId}`),
          axios.get(`https://hapi.fhir.org/baseR4/Observation?patient=${patientId}`),
          axios.get(`https://hapi.fhir.org/baseR4/Encounter?patient=${patientId}`),
          axios.get(`https://hapi.fhir.org/baseR4/Condition?patient=${patientId}`),
        ]);
console.log(medicationRequests.data, observations.data, encounters.data, );

  let transformedObservations = [];
  if (observations.data.entry) {
    transformedObservations = observations.data.entry.map((obs: { resource: { id: any; status: any; code: { coding: { display: any; }[]; }; valueQuantity: { value: any; unit: any; }; subject: { display: any; }; }; }) => ({
      id: obs.resource.id,
      status: obs.resource.status,
      codeDisplay: obs.resource.code?.coding?.[0]?.display || 'N/A',
      value: obs.resource.valueQuantity?.value,
      unit: obs.resource.valueQuantity?.unit,
      subject: obs.resource.subject?.display || 'N/A',
    }));
  }
  
  // Build patientData only if there are actual data entries
  const patientData = {
    patient,
    ...(medicationRequests.data.entry && { medicationRequests: medicationRequests.data.entry }),
    ...(observations.data.entry && { observations: transformedObservations }),
    ...(encounters.data.entry && { encounters: encounters.data.entry }),
    ...(conditions.data.entry && { conditions: conditions.data.entry }),
  };
  setPatientData(patientData)
  setIsOpen(false)
      } else {
        setError("No patient data found.");
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("An error occurred while fetching data.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchPatientData();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Welcome</DialogTitle>
          <DialogDescription>
            Enter details to fetch your medical data.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phoneNumber" className="text-right">
                Phone Number
              </Label>
              <Input
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Loading..." : "Submit"}
            </Button>

          </DialogFooter>
        </form>

        {/* Display fetched data or error */}
        {loading && <p>Loading data...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {patientData && (
          <div className="mt-4">
            <h3 className="font-bold">Patient Information</h3>
            {/* <pre>{JSON.stringify(patientData.patient, null, 2)}</pre> */}

            <h3 className="font-bold mt-4">Medication Requests</h3>
            <pre>{JSON.stringify(patientData.medicationRequests, null, 2)}</pre>

            <h3 className="font-bold mt-4">Observations</h3>
            {patientData.observations.map((obs: { id: Key | null | undefined; status: any; codeDisplay: any; value: any; unit: any; subject: any; }) => (
                <li key={obs.id}>
                  {`Status: ${obs.status}, Code: ${obs.codeDisplay}, Value: ${obs.value} ${obs.unit}, Subject: ${obs.subject}`}
                </li>
              ))}

            <h3 className="font-bold mt-4">Encounters</h3>
            <pre>{JSON.stringify(patientData.encounters, null, 2)}</pre>

            <h3 className="font-bold mt-4">Conditions</h3>
            <pre>{JSON.stringify(patientData.conditions, null, 2)}</pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
