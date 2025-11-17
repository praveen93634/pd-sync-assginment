import dotenv from "dotenv";
dotenv.config();
import axios from "axios";
import { PipedrivePerson } from "../types/pipedrive";

// Get API key and company domain from environment variables
const apikey = process.env.PIPEDRIVE_API_KEY;
const companyDomain = process.env.PIPEDRIVE_COMPANY_DOMAIN;

//Used baseUrl for all person releated Api calls
const baseUrl = `https://${companyDomain}.pipedrive.com/v1`



/***
 * Author:praveen Kumar
 * Date: 18-11-2025
 * Description: This funtion is used to Search a persons Data from the pipedrive
*/

export const searchPerson = async (terms: string, field: string): Promise<PipedrivePerson | undefined> => {
    try {
        const api = `${baseUrl}/persons/search`;
        const res = await axios.get(api, {
            params: {
                term: terms,
                fields: field,
                exact_match: true
            },
            headers: {
                Accept: "application/json",
                "x-api-token": apikey
            }
        })
        const searchResult = res.data?.data?.items || [];

        //check if the searchResult's length is greater then 0 to ensure we have data
        if (searchResult.length > 0) {

            //check if the result contain multiple data in same term and logs warning
            if (searchResult.length > 1) {
                console.warn("Multiple User found with the same", terms)
            }
            //return the first match only 
            // Warning:it will cause issue in production when comes to updated while update we need to ask for id which is unique 
            //as of now i kept it like this to make sure to  achieve given task
            // In production we can return all possible matched when searching 
            return searchResult[0].item as PipedrivePerson
        }
        return undefined;
    }
    catch (err) {
        console.error(err)
        return undefined;
    }
}

/***
 * Author:praveen Kumar
 * Date: 18-11-2025
 * Description: This funtion is used to Save a persons to the pipedrive
*/

export const savePerson = async (personData: Record<string, any>): Promise<PipedrivePerson | undefined> => {
    try {
        const api = `${baseUrl}/persons`;
        const req = await axios.post(api, personData, {
            headers: {
                "x-api-token": apikey,
                Accept: "application/json"
            }
        })
        return req.data?.data as PipedrivePerson;
    }
    catch (err) {
        console.error("save person", err)
        return undefined;
    }
}
/***
 * Author:praveen Kumar
 * Date: 18-11-2025
 * Description: This funtion is used to update a persons to the pipedrive
*/
export const updatePerson = async (id: number, personData: Record<string, any>): Promise<PipedrivePerson | undefined> => {
    try {
        const api = `${baseUrl}/persons/${id}`;
        const req = await axios.put(api, personData, {
            headers: {
                "x-api-token": apikey,
                Accept: "application/json"
            }
        })
        return req.data?.data as PipedrivePerson;
    }
    catch (err) {
        console.error("update person", err)
    }
}