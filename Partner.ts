import IPartner from "./Interfaces/IPartner";
import {Client} from "@googlemaps/google-maps-services-js";
import {headingDistanceTo} from 'geolocation-utils';

export default class Partner implements IPartner {

    address: { no: string; street: string; city: string; country: string };
    geoLocation: { lat: number; lon: number } = {lat: 0, lon: 0}; // Welcome to null island!
    name: string;
    distanceToWebbioOffice?: number;
    googleClient: Client;

    constructor(inputJson: IPartner) {
        Object.assign(this, inputJson);
        this.googleClient = new Client({});
    }

    async setup(): Promise<void> {
        let result;
        try {
            result = await this.googleClient.geocode({
                params: {
                    address: this.fullAddress,
                    key: process.env.GOOGLE_API_KEY
                },
            })

            const geometry = result.data.results[0].geometry.location;

            this.geoLocation.lat = geometry.lat;
            this.geoLocation.lon = geometry.lng;
        } catch (e) {
            if (e.isAxiosError) {
                throw {error: e.response.data};
            }
            throw {error: e};
        }
    }

    get fullAddress(): string {
        return `${this.address.street} ${this.address.no}, ${this.address.city}, ${this.address.country}`;
    }

    getDistanceInMeters(lat: number, lon: number): number {
        this.distanceToWebbioOffice = headingDistanceTo(this.geoLocation, {lat, lon}).distance;
        return Math.floor(this.distanceToWebbioOffice)
    }
}