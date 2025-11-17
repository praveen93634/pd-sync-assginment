import type { PipedrivePerson } from "./types/pipedrive";
import inputData from "./mappings/inputData.json";
import mappings from "./mappings/mappings.json";
import { savePerson, searchPerson, updatePerson } from "./controller/person.controller";
import { getMappedData } from "./utils/inputMapping";

// Write your code here
const syncPdPerson = async (): Promise<PipedrivePerson | undefined> => {
  try {

    //getting the mapped data
    const personData = getMappedData(inputData, mappings);

    //check if the Input name is present 
    if (!personData.name) {
      console.error("Name is Missing")
    }

    const existingPerson = await searchPerson(personData.name, "name");

    //if the person present already update them
    if (existingPerson) {
      
      //duplicate match handled in searchPerson
      return await updatePerson(existingPerson.id, personData);
    }
  
    return await savePerson(personData);
  } catch (error) {
    // Handle error
    console.error("syncPdPerson",error)
  }
};
const pipedrivePerson = syncPdPerson().then((res:any)=>{
  console.log(res);
});
