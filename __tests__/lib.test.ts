import {getPartnersWithinDistanceAndSortByName, loadOfficeLocation, loadPartners, setupPartners} from "../lib";
import Partner from "../Partner";
import * as fs from "fs/promises";
import {join} from 'path';

describe('loadPartners', () => {
    test('Should load the partners and return them as instances of Partner', async () => {
        const result = await loadPartners();

        expect(Array.isArray(result)).toBeTruthy();

        // @ts-ignore
        result.forEach(r => {
            expect(r).toBeInstanceOf(Partner)
            expect(r).toHaveProperty('fullAddress')
        });
    });

    test('Should return an error object if the JSON is invalid', async () => {
        const partnersJson = await fs.readFile(join(process.cwd(), 'partners.json'), 'utf-8');

        await fs.writeFile(join(process.cwd(), 'partners.json'), '{ "name": "partner_na', 'utf-8');

        try {
            await loadPartners();
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }

        await fs.writeFile(join(process.cwd(), 'partners.json'), partnersJson, 'utf-8');
    });
});

describe('loadOfficeLocation', () => {
    test('Should load the partners and return them as instances of Partner', async () => {
        const result = await loadOfficeLocation();

        expect(result).toHaveProperty('lat');
        expect(result).toHaveProperty('lon');

    });

    test('Should return an error object if the JSON is invalid', async () => {
        const officeLocationJson = await fs.readFile(join(process.cwd(), 'OfficeLocation.json'), 'utf-8');

        await fs.writeFile(join(process.cwd(), 'OfficeLocation.json'), '{ "lat": 123', 'utf-8');

        try {
            await loadOfficeLocation();
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }

        await fs.writeFile(join(process.cwd(), 'OfficeLocation.json'), officeLocationJson, 'utf-8');
    });
});

describe('setupPartners', () => {
    let partners;

    beforeEach(async () => {
        partners = await loadPartners();
    })

    test('Should call the setup function on each partner', async () => {
        const mock = {
            geocode: jest.fn().mockImplementation(async () => ({
                data: {
                    results: [{
                        geometry: {
                            location: {
                                lat: 12345,
                                lng: 67890,
                            }
                        }
                    }]
                }
            }))
        };

        partners.forEach(p => p.googleClient = mock);

        await setupPartners(partners);

        expect(mock.geocode).toHaveBeenCalledTimes(partners.length);

        partners.forEach(p => {
            expect(p.geoLocation).toHaveProperty('lat', 12345);
            expect(p.geoLocation).toHaveProperty('lon', 67890);
        });
    });
});

describe('getPartnersWithinDistance', () => {
    let partners;

    beforeEach(async () => {
        partners = await loadPartners();
        await setupPartners(partners);
    })

    test('Should throw an error if the office location file can\'t be read', async () => {
        const officeLocationJson = await fs.readFile(join(process.cwd(), 'OfficeLocation.json'), 'utf-8');

        await fs.writeFile(join(process.cwd(), 'OfficeLocation.json'), '{ "lat": 123', 'utf-8');

        try {
            await loadOfficeLocation();
        } catch (e) {
            expect(e).toBeInstanceOf(Error);
        }

        await fs.writeFile(join(process.cwd(), 'OfficeLocation.json'), officeLocationJson, 'utf-8');
    })

    test('Should filter partners within a certain amount of meters', async () => {
        expect(await getPartnersWithinDistanceAndSortByName(partners, 10000)).toMatchSnapshot()
        expect(await getPartnersWithinDistanceAndSortByName(partners, 25000)).toMatchSnapshot()
        expect(await getPartnersWithinDistanceAndSortByName(partners, 50000)).toMatchSnapshot()
        expect(await getPartnersWithinDistanceAndSortByName(partners, 75000)).toMatchSnapshot()
    });

});