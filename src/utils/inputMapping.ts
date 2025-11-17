import { MappingRules } from "../types/pipedrive";

//handles nested objects 
export const getValueByPath = (obj: any, path: string): any => {
    return path.split('.').reduce((acc, part) => 
        acc && acc[part], obj );
}

// Perform the mapping from inputData to pipedrive
export const getMappedData = (inputData: any, mappings: MappingRules[]) => {
    const output: Record<string, any> = {};
    for (const rule of mappings) {
        output[rule.pipedriveKey] = getValueByPath(inputData, rule.inputKey);
    }
    return output;
}