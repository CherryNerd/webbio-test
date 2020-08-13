import Partner from "../Partner";

const partnerObj = {
    name: 'Wavetech',
    address: {
        no: '185',
        street: 'Hagmolenbeekweg',
        city: 'Enschede',
        country: 'The Netherland'
    }
}

test('Should create a new Partner with given info object', () => {
    const partner = new Partner(partnerObj);

    expect(partner).toHaveProperty('name', partner.name)
    expect(partner.address).toHaveProperty('no', partner.address.no)
    expect(partner.address).toHaveProperty('street', partner.address.street)
    expect(partner.address).toHaveProperty('city', partner.address.city)
    expect(partner.address).toHaveProperty('country', partner.address.country)
})

describe('Partner#setup', () => {

    test('Should call the google client on setup', async () => {
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

        const partner = new Partner(partnerObj);
        // @ts-ignore
        partner.googleClient = mock;

        await partner.setup()

        expect(mock.geocode).toHaveBeenCalledTimes(1);
        expect(mock.geocode).toHaveBeenCalledWith({
            params: {
                address: partner.fullAddress,
                key: process.env.GOOGLE_API_KEY
            }
        });

        expect(partner.geoLocation).toHaveProperty('lat', 12345);
        expect(partner.geoLocation).toHaveProperty('lon', 67890);
    });

    test('Should throw an error if there is a wrong api key for the google client on setup', async () => {
        const partner = new Partner(partnerObj);

        try {
            await partner.setup()
        } catch (e) {
            expect(e.error).toHaveProperty('error_message', 'The provided API key is invalid.');
            expect(e.error).toHaveProperty('status', 'REQUEST_DENIED');
        }
    });
});

describe('Partner#fullAddress', () => {
    test('Should return the full address in correct format', () => {
        const partner = new Partner(partnerObj);

        expect(partner.fullAddress).toEqual(`${partner.address.street} ${partner.address.no}, ${partner.address.city}, ${partner.address.country}`)
    })
})

describe('Partner#getDistanceInMeters', () => {
    test('Should return the distance in meters', () => {
        const partner = new Partner(partnerObj);
        partner.geoLocation.lat = 0.0002;
        partner.geoLocation.lon = 0.0002;

        expect(partner.getDistanceInMeters(0.000001, 0.000001)).toEqual(31)
    });

    test('Should return the distance in full meters', () => {
        const partner = new Partner(partnerObj);
        partner.geoLocation.lat = 0.0002;
        partner.geoLocation.lon = 0.0002;

        expect(partner.getDistanceInMeters(0.000001, 0.000001) % 1).toBe(0)
    })
})