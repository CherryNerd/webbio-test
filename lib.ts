import Partner from "./Partner";
import * as fs from "fs/promises";
import {join} from "path";
import IPartner from "./Interfaces/IPartner";
import IOfficeLocation from "./Interfaces/IOfficeLocation";

export async function loadPartners(): Promise<Partner[] | Error> {
    const dataStr: string = await fs.readFile(join(process.cwd(), 'partners.json'), 'utf-8');
    const json = JSON.parse(dataStr);
    return json.map((partnerJson: IPartner) => new Partner(partnerJson))
}

export async function loadOfficeLocation(): Promise<IOfficeLocation | Error> {
    const dataStr: string = await fs.readFile(join(process.cwd(), 'OfficeLocation.json'), 'utf-8');
    return JSON.parse(dataStr);
}

export async function setupPartners(partners: Partner[]): Promise<Partner[]> {
    await Promise.all(partners.map((partner: Partner) => partner.setup()));
    return partners;
}

export async function getPartnersWithinDistanceAndSortByName(partners: Partner[], meters: number): Promise<Partner[]> {
    const officeLocation: IOfficeLocation | Error = await loadOfficeLocation();
    if(officeLocation instanceof Error) {
        throw new Error(`Error loading office location from json file`);
    }

    const filtered = partners.filter((partner: Partner) => {
        const distance = partner.getDistanceInMeters(officeLocation.lat, officeLocation.lon);
        return distance < meters
    })

    filtered.sort((p1: Partner, p2: Partner) => {
        if (p1.name < p2.name) {
            return -1;
        }
        if (p1.name > p2.name) {
            return 1;
        }
        return 0;

    });
    return filtered;
}
